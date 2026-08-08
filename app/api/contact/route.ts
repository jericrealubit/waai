import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Contact form submission handler.
 *
 * Sends the enquiry to the RECIPIENT inbox via Resend's HTTP API — the
 * only viable option on Cloudflare Workers, which has no raw TCP sockets and
 * so can't do SMTP. Requires RESEND_API_KEY:
 *   - Local dev: set it in .dev.vars (see .dev.vars.example)
 *   - Production: `wrangler secret put RESEND_API_KEY`
 *
 * IMPORTANT: on the OpenNext Cloudflare adapter, `.dev.vars`/Worker secrets
 * are NOT bridged onto `process.env` — they only show up on the Workers-style
 * `env` object via `getCloudflareContext().env`. Reading `process.env.X` here
 * would silently be undefined even with a correctly-set `.dev.vars`/secret.
 * See https://opennext.js.org/cloudflare/bindings.
 *
 * Sends FROM hello@waai.au (the domain is DKIM/SPF-verified in Resend, so
 * this authenticates properly) but delivers TO the Gmail address directly,
 * NOT to hello@waai.au. That asymmetry is deliberate: hello@waai.au is
 * forwarded to the same Gmail inbox via Cloudflare Email Routing, so
 * addressing the notification to it would mean sending mail from an address
 * to itself and back through a forwarder — which risks a routing loop and is
 * a common spam signal. Sending straight to the real inbox avoids both.
 */

/** Public-facing sender. Requires waai.au to stay verified in Resend. */
const SENDER = "WAAI <hello@waai.au>";
/** Real destination inbox — deliberately not hello@waai.au (see above). */
const RECIPIENT = "jericrealubit@gmail.com";
const RESEND_ENDPOINT = "https://api.resend.com/emails";

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
const apiKey = (env as Record<string, string | undefined>).RESEND_API_KEY ?? process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return NextResponse.json(
      { ok: false, error: "Email is not configured on the server." },
      { status: 500 },
    );
  }

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
        from: SENDER,
        to: [RECIPIENT],
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
