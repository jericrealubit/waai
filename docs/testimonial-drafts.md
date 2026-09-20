# Testimonial drafts — awaiting client approval

**Nothing in this file is published.** These are *suggested wordings* to send to
each client. A quote only goes live once that client has read it and agreed to
it, at which point it moves into `lib/content/case-studies.ts` under the
`testimonial` field with `consent: true`.

That `consent: true` literal is the whole safety mechanism: the type cannot be
satisfied without it, so a draft can't be published by accident. See the
ACCURACY RULES at the top of `lib/content/case-studies.ts`.

## How to use this

1. Send the client their draft (there's a ready-to-paste message below each one).
2. Make it genuinely easy for them to change it — the wording matters less than
   it being *theirs*. A client who rewrites it entirely is the best outcome.
3. Get the approval **in writing** (email or SMS is fine) and keep it.
4. Move the approved wording into the case study. Don't tidy it up afterwards:
   once they've approved a sentence, that sentence is what ships.

## Rules these drafts follow

Each draft sticks to what the build actually does, because a testimonial that
claims something untrue is worse than no testimonial. In particular, per the
ACCURACY RULES:

- **No lead or enquiry claims for Jun's Maintenance or JRM Top Build.** Both
  quote forms validate and then only `console.log` — there is no email backend,
  so neither client can truthfully say the site sends them enquiries.
- **No online-payment or delivery claims for BBQ Heaven.** It is pickup-only
  with no online payment.
- **Nothing about HVT's gallery** — it's unpopulated placeholder tiles.
- **Rubbergem's "replaced paper" stays hedged** — that it replicates physical
  grid checklists is documented; that it replaced them is an inference.
- **No revenue, traffic or conversion figures anywhere.** We have no access to
  any client's analytics or books.

---

## 1. Jun's Maintenance — Jun (Bricklaying & landscaping, Caversham WA)

> "I wanted every job we do to have its own page, and that's exactly what I got
> — thirteen of them, each one written properly instead of lumped together. The
> site looks the part and I can send someone straight to the page for the work
> they're asking about. Jeric handed over the whole thing when it was done, so
> it's mine."

**Message to send:**

> Hi Jun — I'm putting a few client comments on my website and would like to
> include Jun's Maintenance if you're happy with that. Here's a draft — please
> change anything that doesn't sound like you, or write your own version, and
> let me know either way. Nothing goes up until you say yes.

---

## 2. HVT Prestige Panel & Paint — (Panel beating & restoration, Bayswater WA)

> "Jeric actually listened when I said we didn't want a contact form. Our
> customers ring up with a photo of the damage — that's how the job starts. So
> the site puts the phone number everywhere and gets out of the way. It's quick,
> it says what we do, and it doesn't cost me anything to keep online."

**Message to send:**

> Hi — I'd like to include HVT on my site as an example of my work, with a short
> comment from you. Here's a draft to react to; change whatever you like or tell
> me to word it differently. It won't go live unless you're happy.

---

## 3. JRM Top Build — (Renovations & building, Hornby, Christchurch NZ)

> "Five different trades, five proper pages — that was the brief and it got
> done. The service area section with the suburbs on it saves me explaining
> where we travel. It's set up so the details are easy to change later, which I
> wasn't expecting."

**Message to send:**

> Hi — I'm adding a few client comments to my website and would like to include
> JRM Top Build. Draft below — edit it however you want, or send me your own
> wording. Nothing published without your okay.

---

## 4. BBQ Heaven — (Smokehouse, Rockingham WA)

> "The ordering platforms were taking a cut of every single order. Now the order
> comes straight through to the screen in the kitchen the second someone places
> it, and we keep the lot. The menu's easy to keep up to date too — the
> gluten-free filter alone saves us answering the same question all night."

**Message to send:**

> Hi — I'd like to use BBQ Heaven as an example on my site, with a short comment
> from you about the ordering system. Here's a draft; change anything that's not
> right (or not how you'd say it) and send it back. Nothing goes up till you're
> happy with it.

---

## 5. Rubbergem — (Rubber press manufacturing)

> "The lads pick it up straight away because it looks like the sheet they were
> already filling in — that was the main thing. Two taps to time a cycle, and
> the totals and the audit sheet come out at the end without anyone adding
> anything up. The print goes on one page, which is what we needed."

**Message to send:**

> Hi — I'm putting a few client comments on my website and would like to include
> the press logging system. Here's a draft — please change anything that isn't
> accurate or doesn't sound like you. Nothing is published without your
> approval.

---

## 6. Ecommerce storefront & admin

No draft. This build is presented as a combined storefront + admin panel and the
admin side is gated; there's no named client on the site to attribute a quote
to. Leave it without a testimonial rather than manufacture one.

---

## When a client approves

Add to their entry in `lib/content/case-studies.ts`:

```ts
testimonial: {
  quote: "…their approved words, verbatim…",
  author: "Jun",
  role: "Owner",
  business: "Jun's Maintenance Service",
  suburb: "Caversham WA",
  consent: true, // they approved THIS wording for publication
},
```

It renders automatically on `/work/<slug>` — no other change needed.
