# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # dev server on http://localhost:3000
npm run build     # production build
npm start         # serve the production build
npm run lint      # eslint (flat config, eslint-config-next core-web-vitals + typescript)

npm run preview   # opennextjs-cloudflare build + local Workers runtime
npm run deploy    # opennextjs-cloudflare build + deploy to Cloudflare Workers
npm run cf-typegen # regenerate cloudflare-env.d.ts from wrangler.jsonc
```

There is no test suite in this repo.

## What this is

Marketing site for WA AI Digital (Perth/Waikiki, Western Australia) — a scrolling
landing page, two content-driven route trees (`/services/*`, `/work/*`), a chatbot
embed, and one API route. Next.js 16 App Router, React 19, TypeScript strict,
Tailwind CSS v4, framer-motion, shadcn/ui (`radix-nova` style). `@/*` resolves to
the repo root. Live at https://waai.au.

Deploy target is **Cloudflare Workers** via `@opennextjs/cloudflare` — a real
server build, not a static export (see `next.config.ts` for why: the contact
route needs a live POST handler). `wrangler.jsonc` points at
`.open-next/worker.js` with `nodejs_compat`.

## Architecture

**`app/(sections)/` is not a route group in the usual sense.** The parenthesized
folder holds the landing-page *sections* (hero, services, featured-work, process,
pricing, growth, contact); none of them are pages. `app/page.tsx` imports and
stacks them in that order, and `components/header.tsx` links to them with
root-relative anchors (`/#process`, `/#pricing`, `/#contact` — root-relative so
they also resolve from `/services/*` and `/work/*`) — so a section's `id`
attribute is the contract with the header nav. Adding a section means adding a
file here, rendering it in `app/page.tsx`, and adding the nav link.

Note the ids do not all match their filenames: `featured-work.tsx` renders
`id="work"`. The header's other two nav items, Services and Our Work, are real
routes rather than anchors.

**Services and case studies are data, not markup.** `lib/content/services.ts`
(`SERVICES`, `SERVICES_BY_SLUG`, `getService`, `formatFromPrice`) and
`lib/content/case-studies.ts` (`CASE_STUDIES`, `getCaseStudy`,
`getCaseStudiesForService`) are the single source. `/services`, `/services/[slug]`,
`/work` and `/work/[slug]` all read from them — the `[slug]` routes build their
`generateStaticParams` and `generateMetadata` off the arrays and `notFound()` on
a miss — and the landing page's cards use the same data. To add or change a
service or case study, edit the array; never hand-write a page.

`lib/content/case-studies.ts` opens with a block of ACCURACY RULES: verified
facts about each shipped project that contradict what its README or the obvious
assumption would suggest. Copy anywhere on the site must keep matching them.
Read that comment before touching case-study copy.

**`app/api/contact/route.ts`** is the only API route: it validates the contact
payload and POSTs to Resend's HTTP API (Workers has no raw TCP sockets, so no
SMTP). Its header comment documents the from/to asymmetry and the routing-loop
reason behind it. The one thing that bites: on the OpenNext Cloudflare adapter,
`.dev.vars` and Worker secrets are **not** bridged onto `process.env` — read
them from `getCloudflareContext().env`. Local dev needs `.dev.vars` (copy
`.dev.vars.example`); production needs `wrangler secret put RESEND_API_KEY`.

Sender and recipient are read off the same `env` object (`CONTACT_FROM` /
`CONTACT_TO`, each falling back to a constant), so changing where enquiries land
is a secret, not a code edit — but they must be overridden **as a pair**, since
the whole point of the asymmetry is that the two addresses differ.
**`docs/EMAIL.md`** is the operational runbook for `hello@waai.au`: Cloudflare
Email Routing forwards and does not store (there is no Cloudflare mailbox, on
any plan), Gmail's third-party "Send mail as" is being retired in January 2027,
and sending therefore goes through Resend's SMTP relay from a normal mail
client. Read it before changing anything about how mail is addressed.

**`app/chat/page.tsx`** is a full-viewport `<iframe>` onto an externally hosted
Chainlit RAG chatbot
(`jericrealubit-ragchatbot.hf.space`), deliberately positioned `fixed` at
`z-index: 99999` with inline styles so it covers the root layout's header, footer
and padding. There is no chat backend in this repo.

**`app/layout.tsx`** owns the persistent visual chrome: the concrete ground and
its faint blueprint grid (`.bg-worksite` — a top-masked fixed `::before` on the
body), the fixed `Header` bar, `main` with `pt-24 md:pt-32` to clear it,
`ScrollToTop`, and `Footer`. The site follows the visitor's OS theme — `<html>`
carries **no `dark` class**; the light and dark palettes both live in
`globals.css`, so there is no flash-of-wrong-theme to guard against. Anything
added to layout must respect the stacking (`z-50` header). It also loads the
three next/font faces onto `<html>` (`--font-geist-sans`, `--font-geist-mono`,
`--font-saira`).

It also owns **the site's only analytics tag** — `<GoogleAnalytics>` from
`@next/third-parties/google`, rendered as a sibling of `<body>`. The root layout
is the single correct home for it: every route renders through here, so one
placement covers the whole site and keeps exactly one tag per page. Never add a
second `GoogleAnalytics` (or a raw gtag `<script>`) to an individual page. It's
gated on `process.env.NODE_ENV === "production"`, which excludes `npm run dev`
but *not* `npm run preview` — preview is a real production build.

## Styling conventions

The visual language is **"Site Notice" — a Western Australian worksite
spec-sheet**: warm concrete + ink, one hi-vis signal and one cobalt signal,
engineering title-blocks, plate-framed captures, and a field-verification stamp.
The identity is grounded in the clients' world (tradies, a smokehouse, a rubber
press floor), deliberately *not* the old dark-cyber look.

**Themes: light default, dark toggle, OS fallback.** The active theme is a
`data-theme` attribute on `<html>`. A pre-paint script in `app/layout.tsx` sets
it before first paint (stored choice, else OS) so there's no flash, and
`components/theme-toggle.tsx` (in the header) flips + persists it to
`localStorage`; with no stored choice it keeps following the OS live.

In `app/globals.css` there is **one palette block**. Every colour token is
declared once in `:root` as a **`light-dark(light, dark)` pair**, and
`color-scheme` is the only thing that flips per theme — set by
`@media (prefers-color-scheme: dark) :root:not([data-theme])` for the OS/no-JS
path, and by `:root[data-theme="dark"]` / `:root[data-theme="light"]` for an
explicit choice (the attribute rules have higher specificity, so the toggle wins
in both directions). **To add a colour, add one `light-dark()` line.**

This replaced three blocks — a light `:root` plus two verbatim dark copies of 58
declarations each, kept in step by a comment. That arrangement lost
`--destructive` (defined light, missing from both dark blocks) and made the
`prefers-contrast` override key off the OS rather than the resolved theme, so a
dark-OS visitor who toggled to light got the dark high-contrast ramp on a light
ground. Both are fixed by the collapse.

**The one exception is `--elev-1..3`**, which are still written per theme: they
are structurally different shadows (offset ink vs. inset lit edge + contact
shadow), and `light-dark()` is a `<color>` function that cannot express them. Six
declarations, and they live in the same three `color-scheme` rules.

Every brand colour is an *indirection* (`--color-hivis: var(--hivis)` in `@theme
inline`) so the whole palette flips together. The shadcn `dark:` variant keys off
the attribute
(`@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *))`),
which tracks the resolved theme because the script always stamps `data-theme`.
Never a bare hex in a component.

Note Lightning CSS downlevels `light-dark()` into its own
`--lightningcss-light`/`--lightningcss-dark` toggle pair in the built CSS. That
is expected; the three `color-scheme` rules are what drive it.

Reach for the tokens, never a raw `slate-*`/`gray-*`/`white`/`black`. The text
ramp — **body copy is near-ink; `steel` (`text-foreground-subtle`) is metadata
only** (raw steel as body is APCA-borderline, the inverse of the old `#94a3b8`
trap):

| token                    | light / dark      | use                              |
| ------------------------ | ----------------- | -------------------------------- |
| `text-foreground`        | `#1a1813` / `#ece6d8` | headings, emphasis (`--bitumen`) |
| `text-muted-foreground`  | `#3a362e` / `#c9c2b2` | body copy — the default          |
| `text-foreground-subtle` | `#5e5b51` / `#a39d8e` | metadata, captions, placeholders (`--steel`) |

Two signals, each with a **role** and a **meaning** — hi-vis = the live product /
the primary action; cobalt = the open source:

- `bg-hivis` `#e8420a` / `#ff5a1e` — fills, primary CTAs, the flame. **Never
  small text on light** (~3:1) — use `text-hivis-text` for that.
- `text-hivis-text` `#b8330a` / `#ff824f` — hi-vis as small text, and the hover
  state for links.
- `text-source` `#1e3aa8` / `#6e86ff` — links, "Source" tags. Prose links inside
  `<p>` also carry a source underline (a `@layer base` rule).
- Text on a `bg-hivis` fill is `text-hivis-ink` (dark), never white.

Surfaces are **flat concrete stock in strong ink frames**, hard-cornered
(`--radius` is `0.2rem`; chips opt back into `rounded-full`). Reuse the component
classes rather than re-typing them:

- `.glass-card` / `.glass-card-interactive` — the spec panel (paper face,
  `border-2 border-bitumen`, offset shadow, hover lift). Name kept for history;
  material changed.
- `.glass-nav` / `.glass-panel` — the header bar (solid concrete under a strong
  ruled edge) and the mobile menu. Not floating glass any more.
- `.btn-primary` (hi-vis fill) / `.btn-glass` (ghost: ink edge, hi-vis on hover).
- `.tag-live` (hi-vis fill) / `.tag-src` (cobalt outline) — the live+source pair
  on a spec card. `.chip-link` / `.chip-count` — the `/work` jump chips.
- `.stamp` — the field-verification signature. `.hazard-rule` — the diagonal
  stripe; **use exactly once** (the hero baseline).
- `.field-input` (form controls, 3:1 border + source focus ring), `.focus-ring`
  (source ring), `.section-label` (the mono eyebrow).

**Type is three faces.** `font-display` = **Saira Condensed** (worksite signage —
headings, labels, the wordmark; always `uppercase`, heavy weight). `font-sans` =
Geist (body). `font-mono` = Geist Mono — the *datasheet voice*: URLs, stacks,
prices, plate labels, eyebrows, counts. Use mono for data, not prose.

**Elevation is `shadow-e1` / `e2` / `e3`, never a hand-written `shadow-[…]`.** It
is theme-aware: an offset hard ink shadow down-right on the light ground (a card
lifted off a drawing sheet), and a lit top edge + soft contact shadow on the dark
ground (where an offset ink shadow is invisible).

**Contrast — WCAG *and* APCA, both themes.** Targets: body `|Lc| ≥ 75`,
large/secondary `≥ 60`, UI boundaries `≥ 3:1`. Two that bite here:

1. _Hi-vis is a mid colour._ It is safe as a **fill** with dark ink on it, and as
   **large** display text, but never as small body text on the light ground. That
   is what `text-hivis-text` (a darkened orange, 4.8:1 on concrete) is for.
2. _Form-control borders (WCAG 1.4.11)._ `--input` must clear 3:1 against **both**
   the field fill and the surface behind it, in both themes. `.field-input`
   already does; reuse it.

Entrance animations use framer-motion with the variants and springs in
`lib/motion.ts` — `REVEAL_VARIANTS` via `<Reveal>` for scroll-triggered
sections, `STAMP_IN_VARIANTS` + `SPRING_STAMP_*` for things that *land*. The
stagger is `staggerDelay()`: 70ms, **capped at five steps** — never
`index * 0.1`, which left the sixth card in a grid invisible for half a second
and read as the page still loading. `"use client"` is applied only to files that
need state or motion; sections without interaction stay server components, with
motion pushed into small client leaves (`components/hero/*`,
`components/docket/*`).

**Reduced motion has three tiers and they do not overlap.** Getting this wrong
is silent — the animation simply keeps running for someone who asked it not to:

1. **CSS animations and transitions** — covered by the `prefers-reduced-motion`
   catch-all in `@layer base` (`animate-pulse`, the accordion, `.glass-card`'s
   hover). `.motion-always` carves out the footer badge; don't remove it.
2. **framer-motion component animations** — covered by `<MotionProvider>`'s
   `reducedMotion="user"`. The CSS catch-all can *never* reach these: framer
   writes inline `transform`/`opacity` from JS, which is neither a CSS animation
   nor a CSS transition.
3. **Raw motion values** — a bare `animate()` driving text
   (`components/docket/estimate.tsx`, `components/hero/count-up.tsx`) or a
   `useScroll` value bound to `style` (`components/hero/title-block.tsx`).
   Neither is an *animation* framer's config can filter, so each needs its own
   explicit `useReducedMotion()` guard.

Scroll-linked motion uses framer's `useScroll`/`useTransform`, **not** CSS
`animation-timeline: view()/scroll()`: that feature is ~84% global but Firefox
stable still lacks it, and framer is already in the bundle on every route.
Never declare `will-change` in CSS — framer sets and clears it per animation,
and a permanently promoted layer costs more than it saves.

The landing page's `<h1>` is its LCP element and nothing on `/` carries
`priority`, so **the hero's left column stays free of client JS and entrance
motion**. Only the title-block aside animates.

**The footer signature — "Smoked & Coded by: jeric".** A flame + three smoke
puffs in `components/footer.tsx`, driven by the `flame-flicker` / `smoke-rise`
keyframes and `--animate-flame` / `--animate-smoke-{1,2,3}` in `globals.css`. Its
timing is meticulously tuned (one 1.8s beat; an ~80ms lag so the flame reads as
*blowing* the smoke; puff flight of exactly three beats) — **recolour it, never
retime it.** The flame is hi-vis and its glow is hardcoded orange/amber in the
keyframe (works on both grounds); the puff *fills* are `bg-smoke` (theme-aware)
plus one `bg-hivis` ember, set on the elements. It runs even under reduced
motion via **`.motion-always`**, which the catch-all excludes with
`*:not(.motion-always)` — put `.motion-always` on the animated element itself,
not an ancestor, since animation properties don't inherit.

**Tailwind v4 is CSS-first** (currently 4.2.1). All theme tokens live in
`app/globals.css` — a plain `@theme` block for literal values (the flame/smoke
animations + keyframes), a `@theme inline` block for the indirections onto
`:root`, alongside `@import "shadcn/tailwind.css"`. There is **no
`tailwind.config.{js,ts}`**, and adding one would do nothing: v4 only reads a
config via an `@config` directive, which `globals.css` deliberately does not
have. Add new tokens to `@theme` (literal) or `@theme inline` + `:root` (themed).

Note `--radius` (0.2rem, squared) drives the whole `--radius-sm…4xl` scale
through `calc()`, so changing it rescales every radius on the site.
