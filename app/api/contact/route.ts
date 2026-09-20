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
  /** Optional, but the fastest way to reply to a trade enquiry. */
  phone: string;
  /** Optional. Drives whether the job is inside the service radius. */
  suburb: string;
  interestedIn: string;
  /** Optional self-selected budget band — blank means "prefer not to say". */
  budget: string;
  projectDetails: string;
  /**
   * Honeypot. Rendered hidden and off the tab order in the contact section, so
   * a real person never sees it and never fills it. Anything non-empty here is
   * automated.
   */
  companyWebsite: string;
  /** Milliseconds between first interaction with the form and submission. */
  elapsedMs: number | null;
  /** Campaign / referrer captured on the visitor's first page view. */
  attribution: Record<string, string> | null;
}

/**
 * Longest project description we will accept. Generous for a real enquiry —
 * several hundred words — and a hard stop on a payload designed to blow out
 * the notification email.
 */
const MAX_DETAILS_LENGTH = 5000;

/**
 * A human cannot read the form, decide, type a name, an email and a paragraph
 * of project detail in under this. Scripted submissions routinely arrive in
 * tens of milliseconds.
 */
const MIN_ELAPSED_MS = 3000;

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Flattens the attribution the browser captured into one readable line for the
 * notification email, so the inbox shows where a lead came from without
 * anyone opening Analytics.
 *
 * Values originate in the visitor's own URL and referrer, so they are
 * untrusted: each one is length-capped here and HTML-escaped at the call site.
 */
function describeSource(attribution: unknown): string {
  if (!attribution || typeof attribution !== "object") {
    return "Direct or unknown";
  }

  const entries = Object.entries(attribution as Record<string, unknown>)
    .filter(([, value]) => typeof value === "string" && value.length > 0)
    .slice(0, 8)
    .map(([key, value]) => `${key}: ${String(value).slice(0, 200)}`);

  return entries.length > 0 ? entries.join(" · ") : "Direct or unknown";
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

  /*
   * Spam gate, before any validation or any outbound call.
   *
   * This matters more than it looks. Resend's free tier is 100 emails a day,
   * 3,000 a month, and it is SHARED with the owner's real mail (see
   * docs/EMAIL.md) — so a scripted run against this endpoint is not inbox
   * noise, it is a denial of service on the business's ability to send mail at
   * all. The endpoint is unauthenticated by necessity.
   *
   * All three checks answer 200 {ok:true}, never an error. A bot that learns
   * which submissions were rejected learns how to get past the check; one that
   * is told everything worked has no signal to tune against.
   */
  const honeypot = body.companyWebsite?.trim() ?? "";
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  const elapsedMs = typeof body.elapsedMs === "number" ? body.elapsedMs : null;
  if (elapsedMs !== null && elapsedMs < MIN_ELAPSED_MS) {
    return NextResponse.json({ ok: true });
  }

  /*
   * Same-origin check. The form is the only legitimate caller, and a browser
   * sets Origin on every cross-site POST it cannot be talked out of. Skipped
   * outside production so `npm run dev` on localhost still works.
   */
  if (process.env.NODE_ENV === "production") {
    const origin = request.headers.get("origin");
    if (origin && new URL(origin).hostname !== "waai.au") {
      return NextResponse.json({ ok: true });
    }
  }

  const name = body.name?.trim() ?? "";
  const businessName = body.businessName?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const suburb = body.suburb?.trim() ?? "";
  const interestedIn = body.interestedIn?.trim() || "Not specified";
  const budget = body.budget?.trim() || "Not specified";
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

  if (projectDetails.length > MAX_DETAILS_LENGTH) {
    return NextResponse.json(
      { ok: false, error: "That message is too long to send." },
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
    <p><strong>Phone:</strong> ${escapeHtml(phone || "—")}</p>
    <p><strong>Suburb:</strong> ${escapeHtml(suburb || "—")}</p>
    <p><strong>Interested in:</strong> ${escapeHtml(interestedIn)}</p>
    <p><strong>Budget:</strong> ${escapeHtml(budget)}</p>
    <p><strong>Project details:</strong></p>
    <p>${escapeHtml(projectDetails).replace(/\n/g, "<br />")}</p>
    <hr />
    <p style="color:#5e5b51;font-size:12px">
      <strong>Came from:</strong> ${escapeHtml(describeSource(body.attribution))}
    </p>
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
