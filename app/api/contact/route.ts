import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Contact form submission handler.
 *
 * Sends the enquiry via Resend's HTTP API — the only viable option on
 * Cloudflare Workers, which has no raw TCP sockets and so can't do SMTP.
 * Requires RESEND_API_KEY:
 *   - Local dev: set it in .dev.vars (see .dev.vars.example)
 *   - Production: `wrangler secret put RESEND_API_KEY`
 *
 * IMPORTANT: on the OpenNext Cloudflare adapter, `.dev.vars`/Worker secrets
 * are NOT bridged onto `process.env` — they only show up on the Workers-style
 * `env` object via `getCloudflareContext().env`. Reading `process.env.X` here
 * would silently be undefined even with a correctly-set `.dev.vars`/secret.
 * See https://opennext.js.org/cloudflare/bindings.
 *
 * Both addresses are read from the same env object (CONTACT_FROM/CONTACT_TO)
 * so the mail setup can change without touching this file. The defaults send
 * FROM hello@waai.au — the domain is DKIM/SPF-verified in Resend, so this
 * authenticates properly — but deliver TO the owner's inbox directly, NOT to
 * hello@waai.au. That asymmetry is deliberate: hello@waai.au is forwarded to
 * that same inbox by Cloudflare Email Routing, so addressing the notification
 * to it would mean sending mail from an address to itself and back through a
 * forwarder — a routing-loop risk and a common spam signal.
 *
 * To file enquiries under the business address instead, override BOTH so the
 * two stay distinct (e.g. forms@waai.au → hello@waai.au). See docs/EMAIL.md.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";
/** Public-facing sender. Must be on a Resend-verified domain. */
const DEFAULT_SENDER = "WAAI <hello@waai.au>";
/** Destination inbox — deliberately not the sender address (see above). */
const DEFAULT_RECIPIENT = "jericrealubit@gmail.com";

interface ContactPayload {
  name: string;
  businessName: string;
  email: string;
  interestedIn: string;
  projectDetails: string;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  let body: Partial<ContactPayload>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const name = body.name?.trim() ?? "";
  const businessName = body.businessName?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const interestedIn = body.interestedIn?.trim() || "Not specified";
  const projectDetails = body.projectDetails?.trim() ?? "";

  if (!name || !email || !projectDetails) {
    return NextResponse.json(
      { ok: false, error: "Name, email and project details are required." },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "That email address doesn't look right." },
      { status: 400 },
    );
  }

  const { env } = getCloudflareContext();
  const vars = env as Record<string, string | undefined>;

  const apiKey = vars.RESEND_API_KEY ?? process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return NextResponse.json(
      { ok: false, error: "Email is not configured on the server." },
      { status: 500 },
    );
  }

  const sender = vars.CONTACT_FROM?.trim() || DEFAULT_SENDER;
  const recipient = vars.CONTACT_TO?.trim() || DEFAULT_RECIPIENT;

  const html = `
    <h2>New enquiry from waai.au</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Business:</strong> ${escapeHtml(businessName || "—")}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Interested in:</strong> ${escapeHtml(interestedIn)}</p>
    <p><strong>Project details:</strong></p>
    <p>${escapeHtml(projectDetails).replace(/\n/g, "<br />")}</p>
  `;

  try {
    const resendResponse = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        reply_to: email,
        subject: `New enquiry from ${name}${businessName ? ` (${businessName})` : ""}`,
        html,
      }),
    });

    if (!resendResponse.ok) {
      const errorBody = await resendResponse.text();
      console.error("Resend API error:", resendResponse.status, errorBody);
      return NextResponse.json(
        { ok: false, error: "Failed to send the message. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form send failed:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to send the message. Please try again." },
      { status: 500 },
    );
  }
}
