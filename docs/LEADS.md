# Enquiries: storage, spam protection and rate limiting

How `POST /api/contact` is protected, and the two Cloudflare resources it can
use but does not require.

Everything here **degrades gracefully**. With no KV namespace and no Turnstile
keys the form still works exactly as before — it just loses persistence and the
rate limit. That is deliberate: shipping a route that 500s until someone
remembers to run a dashboard wizard is how a contact form quietly stays broken.

## What protects the form today, with no setup at all

| Check | Where | Behaviour |
| --- | --- | --- |
| Honeypot | A hidden `company_website` field, off the tab order and `aria-hidden` | Non-empty → `200 {ok:true}`, nothing sent |
| Time-to-submit | `elapsedMs` from first interaction | Under 3s → `200 {ok:true}`, nothing sent |
| Origin | `Origin` header, production only | Not `waai.au` → `200 {ok:true}`, nothing sent |
| Length cap | `projectDetails` | Over 5,000 chars → `400` |

All three drops answer **200, not an error**. A bot that learns which
submissions were rejected learns how to get past the check; one told everything
worked has nothing to tune against.

## Why this matters more than it looks

Resend's free tier is **100 emails/day, 3,000/month**, and it is shared with the
owner's real mail (see `EMAIL.md`). A scripted run against this endpoint is not
inbox noise — it exhausts the quota and stops the business sending mail at all.

## Optional: lead storage + rate limiting (Workers KV)

Adds two things:

1. **Every lead is written to KV before Resend is called.** Today a Resend
   outage, a revoked key or a hit quota means the enquiry is gone with no record
   anywhere — the visitor sees an error and the business never learns someone
   tried. With KV the worst case is a delayed reply rather than a lost customer.
2. **Per-IP rate limiting** — 5/hour and 20/day, counted in the same namespace.

### Status: done

Both namespaces exist and the binding is wired in `wrangler.jsonc`. Verified
end to end under the real Workers runtime: with a deliberately invalid
`RESEND_API_KEY`, a submitted enquiry returned 502 **and** the complete lead was
still in KV — which is the entire point of the feature. The rate limiter cut in
on the 6th submission within the hour, and the blocked attempts wrote no leads.

### Setup (for reference, or a second environment)

```bash
# 1. Create the namespace (and a preview one for local dev)
npx wrangler kv namespace create LEADS
npx wrangler kv namespace create LEADS --preview
```

Wrangler prints the binding block but does not write it to the config — paste
the ids into `wrangler.jsonc` yourself, then run `npm run cf-typegen`.

Add the returned ids to `wrangler.jsonc`:

```jsonc
"kv_namespaces": [
  {
    "binding": "LEADS",
    "id": "<id from the first command>",
    "preview_id": "<id from the --preview command>"
  }
]
```

Then regenerate the types and deploy:

```bash
npm run cf-typegen
npm run deploy
```

### Reading the leads back

Because the binding carries **both** an `id` and a `preview_id`, every `kv key`
command needs to say which one it means — otherwise wrangler refuses with
*"The binding LEADS has both an id and a preview_id configured."*

```bash
# Real enquiries from the deployed site:
npx wrangler kv key list --binding LEADS --preview false --remote | grep '"lead:'
npx wrangler kv key get  --binding LEADS --preview false --remote "lead:<ISO>:<uuid>"

# What `wrangler dev` wrote locally — note this is the PREVIEW namespace, and
# `--local` keeps you in miniflare rather than touching the real one:
npx wrangler kv key list --binding LEADS --preview --local
```

The `--preview` distinction is the easy mistake: `wrangler dev` binds `env.LEADS`
to the **preview** namespace, so a local test then listed without `--preview`
reads the empty production namespace and looks like the write silently failed.

Keys are `lead:<ISO timestamp>:<uuid>`, so they list in chronological order.
Each holds the whole submission including the docket configuration and the
campaign attribution. Retention is **400 days**, set by `expirationTtl`.

Rate-limit counters share the namespace under `rl:h:<ip>` and `rl:d:<ip>` and
expire on their own.

### Failure behaviour

The rate limiter **fails open** — if KV is unbound or throws, the enquiry goes
through. A limiter that blocks real customers during a storage blip is worse
than the spam it prevents, and the honeypot, timing and origin checks still sit
in front of it.

Lead persistence never throws either: a storage failure is logged and the send
continues.

## Optional: Cloudflare Turnstile

Invisible CAPTCHA, free, and Cloudflare-native.

```bash
# Dashboard → Turnstile → Add site → waai.au (Managed or Invisible)
npx wrangler secret put TURNSTILE_SECRET_KEY
```

Add the **site** key (public, safe to commit) to the environment as
`NEXT_PUBLIC_TURNSTILE_SITE_KEY`, render the widget in the form, and pass the
token as `turnstileToken` in the POST body — the route already verifies it.

**Until the secret is set, the check is skipped entirely** (`passesTurnstile`
returns true when there is no secret), so nothing breaks in the meantime.

Unlike the rate limiter, Turnstile **fails closed**: if verification errors, the
request is rejected. A Turnstile outage is rare, and letting unverified traffic
through would defeat the point.

## Local development

`.dev.vars` carries the secrets for `npm run dev` (see `.dev.vars.example`).
Remember that on the OpenNext Cloudflare adapter, `.dev.vars` and Worker secrets
are **not** bridged onto `process.env` — the route reads them from
`getCloudflareContext().env`. That is why `npm start` (the plain Node server)
returns 500 from this route: there is no Workers context at all.
