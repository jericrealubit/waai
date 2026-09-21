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
const TURNSTILE_VERIFY_ENDPOINT =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Rate limits, per IP, enforced through the LEADS KV namespace.
 *
 * Deliberately generous for a human — nobody sends six genuine enquiries in an
 * hour — and tight enough that a scripted run can't burn the Resend free tier,
 * which is 100 emails a day SHARED with the owner's real mail (docs/EMAIL.md).
 * Exhausting it doesn't just fill an inbox, it stops the business sending mail.
 */
const RATE_LIMIT_HOURLY = 5;
const RATE_LIMIT_DAILY = 20;

/** How long a stored lead is retained: ~13 months. */
const LEAD_TTL_SECONDS = 60 * 60 * 24 * 400;

/**
 * Shape of the Worker bindings this route uses. All optional: the route has to
 * keep working before the KV namespace and Turnstile keys exist, or the
 * contact form breaks the moment this ships and stays broken until the
 * dashboard is configured.
 */
interface ContactEnv {
  RESEND_API_KEY?: string;
  CONTACT_FROM?: string;
  CONTACT_TO?: string;
  TURNSTILE_SECRET_KEY?: string;
  LEADS?: LeadStore;
}

/**
 * Just the slice of Workers KV this route touches.
 *
 * Declared structurally rather than importing `KVNamespace` from the generated
 * worker types: `npm run cf-typegen` output isn't committed, so depending on it
 * would make the build fail on a fresh clone until someone remembers to run it.
 */
interface LeadStore {
  get(key: string): Promise<string | null>;
  put(
    key: string,
    value: string,
    options?: { expirationTtl?: number },
  ): Promise<void>;
}

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
  /** Cloudflare Turnstile token, when the widget is configured. */
  turnstileToken?: string;
  /** "docket" when submitted from the quote configurator at /quote. */
  kind?: "enquiry" | "docket";
  /** The configured job, when `kind` is "docket". */
  docket?: {
    service: string;
    tier: string;
    addOns: string[];
    payment: "outright" | "monthly";
    oneOff: number | null;
    monthly: number | null;
  };
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

/**
 * Per-IP rate limit, counted in KV.
 *
 * Two windows so a burst and a slow drip are both covered. Returns true when
 * the request is over a limit.
 *
 * Fails OPEN — if KV is unbound or throws, the enquiry goes through. A rate
 * limiter that blocks real customers when the store has a bad minute is worse
 * than the spam it prevents; the honeypot, timing and origin checks are still
 * in front of it either way.
 */
async function isRateLimited(
  store: LeadStore | undefined,
  ip: string,
): Promise<boolean> {
  if (!store || !ip) return false;

  try {
    const hourKey = `rl:h:${ip}`;
    const dayKey = `rl:d:${ip}`;

    const [hourRaw, dayRaw] = await Promise.all([
      store.get(hourKey),
      store.get(dayKey),
    ]);

    const hourCount = Number(hourRaw ?? 0);
    const dayCount = Number(dayRaw ?? 0);

    if (hourCount >= RATE_LIMIT_HOURLY || dayCount >= RATE_LIMIT_DAILY) {
      return true;
    }

    // Not atomic — two simultaneous requests can both read the same count.
    // That's acceptable here: the failure mode is allowing one extra enquiry,
    // and a durable object to close a one-request gap is not a trade worth
    // making for a contact form.
    await Promise.all([
      store.put(hourKey, String(hourCount + 1), { expirationTtl: 60 * 60 }),
      store.put(dayKey, String(dayCount + 1), { expirationTtl: 60 * 60 * 24 }),
    ]);

    return false;
  } catch (error) {
    console.error("Rate limit check failed, allowing request:", error);
    return false;
  }
}

/**
 * Verifies a Cloudflare Turnstile token.
 *
 * Returns true when there is no secret configured — the check is opt-in, so
 * the form keeps working before the keys are set up rather than rejecting
 * every enquiry with an error nobody can diagnose from the outside.
 */
async function passesTurnstile(
  secret: string | undefined,
  token: string | undefined,
  ip: string,
): Promise<boolean> {
  if (!secret) return true;
  if (!token) return false;

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.set("remoteip", ip);

    const response = await fetch(TURNSTILE_VERIFY_ENDPOINT, {
      method: "POST",
      body,
    });

    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch (error) {
    // Fail CLOSED here, unlike the rate limiter: a Turnstile outage is rare,
    // and letting unverified traffic through defeats the point of the check.
    console.error("Turnstile verification failed:", error);
    return false;
  }
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

  const isDocket = body.kind === "docket" && Boolean(body.docket);

  /*
   * A docket submission carries the configured job itself, so free-text
   * details are optional there — the scope is already stated more precisely
   * than a paragraph would state it. A plain enquiry still needs them.
   */
  if (!name || !email || (!isDocket && !projectDetails)) {
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
  const vars = env as unknown as ContactEnv;

  /* Cloudflare sets this on every request that reaches the Worker, and a
     client cannot forge it the way it can forge X-Forwarded-For. */
  const ip = request.headers.get("cf-connecting-ip") ?? "";

  if (!(await passesTurnstile(vars.TURNSTILE_SECRET_KEY, body.turnstileToken, ip))) {
    return NextResponse.json(
      { ok: false, error: "Could not verify that request. Please try again." },
      { status: 403 },
    );
  }

  if (await isRateLimited(vars.LEADS, ip)) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "That's a few enquiries in a short time. Give it an hour, or call 0491 098 073.",
      },
      { status: 429 },
    );
  }

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

  /* The configured job, when the enquiry came from the quote docket. Rendered
     as a works order so the inbox shows exactly what the visitor was looking
     at when they hit send — including the figure they were quoted. */
  const docketHtml = isDocket && body.docket
    ? `
    <h3 style="margin-bottom:4px">Docket — configured at /quote</h3>
    <table cellpadding="6" style="border-collapse:collapse;font-size:14px">
      <tr><td><strong>Service</strong></td><td>${escapeHtml(body.docket.service)}</td></tr>
      <tr><td><strong>Tier</strong></td><td>${escapeHtml(body.docket.tier)}</td></tr>
      <tr><td><strong>Extras</strong></td><td>${escapeHtml(
        body.docket.addOns.length > 0 ? body.docket.addOns.join(", ") : "None",
      )}</td></tr>
      <tr><td><strong>Terms</strong></td><td>${escapeHtml(body.docket.payment)}</td></tr>
      <tr><td><strong>Estimate shown</strong></td><td>${
        body.docket.oneOff === null
          ? "Quoted per project"
          : `$${body.docket.oneOff.toLocaleString("en-AU")}${
              body.docket.monthly !== null
                ? ` (or $${body.docket.monthly}/mo)`
                : ""
            }`
      }</td></tr>
    </table>
    <hr />`
    : "";

  const html = `
    <h2>New ${isDocket ? "quote docket" : "enquiry"} from waai.au</h2>
    ${docketHtml}
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

  /*
   * Persist BEFORE sending.
   *
   * This is the most valuable line in the route. Until now a Resend failure —
   * an outage, a revoked key, or simply hitting the 100/day free cap — meant
   * the enquiry was gone with no record of it anywhere: the visitor saw a
   * generic error and the business never learned a customer had tried. Writing
   * the lead first means the worst case is a delayed reply rather than a lost
   * one.
   *
   * Never throws: a storage failure must not cost us the send that follows.
   */
  if (vars.LEADS) {
    try {
      const id = `lead:${new Date().toISOString()}:${crypto.randomUUID()}`;
      await vars.LEADS.put(
        id,
        JSON.stringify({
          receivedAt: new Date().toISOString(),
          kind: isDocket ? "docket" : "enquiry",
          name,
          businessName,
          email,
          phone,
          suburb,
          interestedIn,
          budget,
          projectDetails,
          docket: body.docket ?? null,
          attribution: body.attribution ?? null,
          ip,
        }),
        { expirationTtl: LEAD_TTL_SECONDS },
      );
    } catch (error) {
      console.error("Failed to persist lead (continuing to send):", error);
    }
  }

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
        subject: `New ${isDocket ? "quote docket" : "enquiry"} from ${name}${businessName ? ` (${businessName})` : ""}`,
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
