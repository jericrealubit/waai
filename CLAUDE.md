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

The visual language is glassmorphism over the layout's glow background — semi
transparent white surfaces (`bg-white/60`, `bg-white/70`), `backdrop-blur-xl`,
`border-white/40`, large custom radii (`rounded-[2rem]`, `rounded-[2.5rem]`) and
soft custom shadows. Sky/amber/slate are the accent families. Match this rather
than introducing solid cards or default shadows.

Entrance animations use framer-motion `initial` / `whileInView` with
`viewport={{ once: true }}` and a `delay: index * 0.1` stagger (see
`components/ui/feature-card.tsx`). `"use client"` is applied only to the files
that need state or motion; sections without interaction stay server components.

**Tailwind v4 is CSS-first.** Theme tokens live in `app/globals.css`
(`@theme inline`, `:root`, `.dark`) alongside `@import "shadcn/tailwind.css"`.
The legacy `tailwind.config.js` at the root defines a `horizon` palette but is
**not loaded** — v4 only reads a config file via an `@config` directive, and
`globals.css` has none. The `horizon-*` utilities it declares are unused in
markup; don't reach for them, and don't assume edits to that file take effect.
