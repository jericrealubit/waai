# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev     # dev server on http://localhost:3000
npm run build   # production build
npm start       # serve the production build
npm run lint    # eslint (flat config, eslint-config-next core-web-vitals + typescript)
```

There is no test suite in this repo.

## What this is

Marketing site for WA AI Digital (Perth/Waikiki, Western Australia) — a single-page
scrolling landing page plus one extra route. Next.js 16 App Router, React 19,
TypeScript strict, Tailwind CSS v4, framer-motion, shadcn/ui (`radix-nova` style).
`@/*` resolves to the repo root.

## Architecture

**`app/(sections)/` is not a route group in the usual sense.** The parenthesized
folder holds the landing-page *sections* (hero, services, growth, portfolio,
pricing, contact); none of them are pages. `app/page.tsx` imports and stacks them
in order, and `components/header.tsx` navigates between them with `#anchor` links
(`#services`, `#growth`, `#portfolio`, `#pricing`, `#contact`) — so a section's
`id` attribute is the contract with the header nav. Adding a section means adding
a file here, rendering it in `app/page.tsx`, and adding the nav link.

`app/(sections)/preview.tsx` exists but is not rendered anywhere.

**`app/chat/page.tsx`** is the only other route. It is a full-viewport `<iframe>`
onto an externally hosted Chainlit RAG chatbot
(`jericrealubit-ragchatbot.hf.space`), deliberately positioned `fixed` at
`z-index: 99999` with inline styles so it covers the root layout's header, footer
and padding. There is no chat backend in this repo.

**`app/layout.tsx`** owns the persistent visual chrome: three fixed, blurred
gradient "glow" blobs behind everything (`-z-10`), the floating `Header`, `main`
with `pt-24 md:pt-32` to clear the fixed header, `ScrollToTop`, and `Footer`.
Anything added to layout must respect that stacking (`-z-10` background,
`z-50` header).

## Styling conventions

The visual language is **dark "brushed metal + neon cyan"**. The site is
dark-only: `:root` in `app/globals.css` holds the dark palette directly and
`<html>` carries a permanent `dark` class, so there is no light mode and no
theme toggle. Surfaces are dark metal panels — `linear-gradient(145deg,#181d28,#0e121a)`
with a lit `border-cyber-cyan/25` edge — over the layout's PCB background, using
large custom radii (`rounded-[2rem]`, `rounded-[2.5rem]`).

Reach for the tokens rather than raw colours:

- `bg-cyber-dark`, `text-cyber-cyan`, `bg-cyber-purple` (from the `@theme` block)
- `shadow-neon-cyan`, `text-shadow-glow-cyan`, `text-shadow-glow-white`
- `.glass-card` / `.glass-card-interactive` / `.section-label` for shared surfaces
- semantic tokens (`text-foreground`, `text-muted-foreground`, `border-border`,
  `bg-card`) so the shadcn primitives stay consistent

**Cyan is a light colour.** Anything on a `bg-cyber-cyan` fill needs
`text-cyber-dark`, never `text-white` — white on `#00f2ff` is ~1.4:1 and fails
contrast badly.

Entrance animations use framer-motion `initial` / `whileInView` with
`viewport={{ once: true }}` and a `delay: index * 0.1` stagger (see
`components/ui/feature-card.tsx`). `"use client"` is applied only to the files
that need state or motion; sections without interaction stay server components.

**Tailwind v4 is CSS-first** (currently 4.2.1). All theme tokens live in
`app/globals.css` — a plain `@theme` block for the literal cyber values, a
`@theme inline` block for the indirections onto `:root`, alongside
`@import "shadcn/tailwind.css"`. There is **no `tailwind.config.{js,ts}`**, and
adding one would do nothing: v4 only reads a config via an `@config` directive,
which `globals.css` deliberately does not have. Add new tokens to `@theme`, not
to a config file.

Note `--radius` (0.75rem) drives the whole `--radius-sm…4xl` scale through
`calc()`, so changing it rescales every radius on the site.
