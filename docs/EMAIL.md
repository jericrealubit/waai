# Email

How `hello@waai.au` works — what Cloudflare handles, what it can't, and how to
**send** from the address as well as receive on it.

## The short version

An email address needs three separate things. Cloudflare only provides one.

| Job | What it means | Who does it here |
| --- | --- | --- |
| **Receiving** | Accepting mail addressed to `hello@waai.au` | Cloudflare Email Routing (free) |
| **Storage** | A mailbox that holds the messages | Gmail (mail is forwarded into it) |
| **Sending** | Putting `hello@waai.au` in the `From:` of outgoing mail | Resend SMTP relay |

> [!IMPORTANT]
> **Cloudflare does not offer mailboxes.** Email Routing is a *forwarder*: it
> receives mail at your domain and relays it to an address somewhere else. It
> stores nothing, exposes no IMAP or webmail, and cannot send. There is no
> Cloudflare plan that changes this — it is what the product is.
>
> Cloudflare's separate **Email Sending** beta is an API for transactional
> application mail (receipts, password resets). It is not a mailbox and is not
> intended for person-to-person correspondence.

## Why not just use Gmail's "Send mail as"

This used to be the standard free trick: forward the domain address into Gmail,
then add it under *Settings → Accounts → Send mail as* and reply from the Gmail
web UI. **That route is closing.**

Google is removing "Send as" for third-party addresses — including custom
domains not hosted on Google Workspace — in **January 2027**, along with
Gmailify and web POP fetch. New "Send as" configurations for third-party
addresses are already being blocked ahead of the cutoff, so this may not even be
addable today.

What is *not* affected: Gmail-to-Gmail aliases, and **Google Workspace** send-as
(a paid Workspace mailbox on your own domain is exempt). Also unaffected:
standard SMTP from a normal mail client — which is the basis of the setup below.

## Current setup

### Receiving — Cloudflare Email Routing

Already working. In the Cloudflare dashboard under **Email → Email Routing**,
`hello@waai.au` has a rule forwarding to the personal Gmail inbox. Nothing here
needs to change.

Worth adding while you're there: a **catch-all** rule, so a typo'd address on a
business card still reaches you.

### Sending — Resend as an SMTP relay

`waai.au` is already DKIM/SPF-verified in Resend for the contact form, so the
same account can relay outgoing mail from `hello@waai.au` with proper
authentication. Use the API key that is already provisioned, or make a second
one so it can be revoked independently of the website.

| Setting | Value |
| --- | --- |
| Server | `smtp.resend.com` |
| Port | `465` (SSL) — or `587` for STARTTLS |
| Username | `resend` (the literal word, always) |
| Password | your Resend API key, `re_…` prefix included |

### Mail client

Because sending and receiving are handled by two different services, this has to
be configured as **one account with mismatched incoming and outgoing servers** —
not as an "identity" or "alias" on your existing Gmail account. Thunderbird for
Android in particular allows only one SMTP server per account, so an identity
would fall back to Gmail's SMTP and defeat the whole exercise.

| Field | Value |
| --- | --- |
| Your name | `WA AI Digital` |
| Email address | `hello@waai.au` |
| Incoming | IMAP, `imap.gmail.com`, port `993`, SSL/TLS |
| Incoming username | your Gmail address |
| Incoming password | a Gmail **app password** (requires 2FA on the account) |
| Outgoing | SMTP, `smtp.resend.com`, port `465`, SSL/TLS |
| Outgoing username | `resend` |
| Outgoing password | your Resend API key |

Free clients that handle this: **Thunderbird** on desktop (Windows/macOS/Linux),
**Thunderbird for Android**, and **Apple Mail** on iOS/macOS — add the account
manually rather than letting it autodetect, so it doesn't overwrite the outgoing
server with Gmail's.

Then point the account's **Sent** folder at Gmail's `[Gmail]/Sent Mail` so
replies sent as `hello@waai.au` are stored server-side alongside everything else,
rather than only living on one device.

The result: mail to `hello@waai.au` arrives, replies leave as `hello@waai.au`,
and both halves are visible from any device — at no cost.

## DNS

Nothing new to add; this is what should already be in the `waai.au` zone. Verify
rather than recreate.

- **MX** on `waai.au` → `route1/2/3.mx.cloudflare.net` (Email Routing). Adding a
  mailbox host later means *replacing* these — a domain has one set of MX
  records, so Email Routing and a real mailbox host cannot both receive.
- **TXT** SPF on `waai.au` including `_spf.mx.cloudflare.net`.
- **MX + TXT** on `send.waai.au` and a **TXT** at `resend._domainkey.waai.au` —
  Resend's verification records. Outgoing mail carries a return-path on
  `send.waai.au`, so the root SPF record does *not* need Resend added to it;
  DMARC alignment comes from the DKIM signature on `waai.au`.
- Optionally **TXT** at `_dmarc.waai.au`, e.g.
  `v=DMARC1; p=none; rua=mailto:hello@waai.au`. Start at `p=none` and only
  tighten once the reports look clean.

## Limits, and when to outgrow this

- **Resend's free tier is 100 emails/day and 3,000/month**, and the daily cap is
  the one that bites (UTC calendar day). The contact form draws on the same
  quota.
- Resend is a *transactional* email provider. A handful of business replies a day
  is unremarkable, but it isn't built as a personal correspondence relay — if
  volume grows, move to a mailbox host rather than a bigger relay plan. (Brevo's
  free tier allows 300/day if you only need more headroom.)
- There is **no real `hello@` mailbox**. The account lives inside your personal
  Gmail. You can't hand access to someone else, and the address is only as
  durable as that Gmail account.
- Gmail's own web and mobile apps still won't send as `hello@waai.au` — that's
  what the mail client is for.

### Upgrade paths

When a genuine mailbox is worth paying for:

| Option | Cost | Trade-off |
| --- | --- | --- |
| **Zoho Mail** (Mail Lite) | ~US$12/user/yr | Cheapest real mailbox. The free tier also exists but has no IMAP/POP — webmail and Zoho's own app only. |
| **Migadu** (Micro) | ~US$19/yr | Unlimited addresses on the domain, standard IMAP/SMTP, good fit for a solo shop. |
| **Google Workspace** (Business Starter) | ~A$11–13/user/mo | Native Gmail interface, 30GB, and send-as/aliases that are exempt from the 2027 cutoff. Most expensive, least friction. |

All three require **replacing the Cloudflare MX records** with the provider's and
turning Email Routing off. Sending then goes through that provider too, and the
Resend relay is no longer needed for correspondence — only for the contact form.

## How the contact form fits

`app/api/contact/route.ts` posts enquiries through Resend's HTTP API (Workers has
no raw TCP sockets, so the route can't use SMTP even though the relay above
does). Both addresses it uses are configurable, so this file does not need
editing when the mail setup changes:

| Var | Default | Meaning |
| --- | --- | --- |
| `CONTACT_FROM` | `WAAI <hello@waai.au>` | Envelope sender. Must be on a Resend-verified domain. |
| `CONTACT_TO` | the owner's Gmail | Where enquiries are delivered. |

Set either as a Worker secret, or in `.dev.vars` locally:

```bash
npx wrangler secret put CONTACT_TO
```

> [!NOTE]
> The default deliberately sends **from** `hello@waai.au` but **to** the Gmail
> address directly, rather than back to `hello@waai.au` — which forwards to that
> same inbox. Addressing a message from an address to itself, through a
> forwarder, is a well-known spam signal.
>
> Once `hello@waai.au` is a real mailbox (or if you simply want enquiries filed
> under the business address), switch **both**, so the sender and recipient stay
> distinct:
>
> ```bash
> npx wrangler secret put CONTACT_FROM   # WA AI Digital <forms@waai.au>
> npx wrangler secret put CONTACT_TO     # hello@waai.au
> ```
>
> `forms@waai.au` is send-only and needs no routing rule — just a verified
> domain in Resend. `reply_to` is always the enquirer, so replying still reaches
> the customer either way.
