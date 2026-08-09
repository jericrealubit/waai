import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    // No `min-h-screen` here: app/layout.tsx already pads `main` with
    // `pt-24 md:pt-32` to clear the fixed header, so a full-viewport hero would
    // overflow and push Services off the first screen.
    <section className="flex flex-col items-center px-4 py-12 sm:px-8 md:py-20">
      <div className="glass-card relative w-full max-w-2xl overflow-hidden p-8 text-center sm:p-12">
        {/* Emblem — gradient ring around the swan mark */}
        <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-gradient-to-br from-cyber-cyan via-indigo-500 to-cyber-purple p-1 shadow-neon-cyan">
          <div className="relative h-full w-full overflow-hidden rounded-full">
            <Image
              src="/logo-swan.png"
              alt="WA AI Digital emblem"
              fill
              sizes="96px"
              className="object-cover"
              priority
            />
          </div>
        </div>

        <h2 className="mb-4 text-2xl font-extrabold tracking-wider text-cyber-cyan-soft text-shadow-glow-cyan sm:text-3xl">
          WA AI Digital
        </h2>

        <Badge
          variant="outline"
          className="mb-6 h-auto border-border-brand bg-cyber-cyan/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cyber-cyan-soft"
        >
          Based in Western Australia
        </Badge>

        {/* `text-shadow-glow-white` is deliberately gone. A 12px white blur
            behind white glyphs on a near-black panel is halation by
            construction — it is the exact optical artifact that makes dark
            interfaces tiring, and it lands on the largest, most-read words on
            the site. `text-foreground` rather than `text-white` for the same
            reason: pure white here was 18.7:1, past the point where more
            contrast stops helping and starts blooming. */}
        <h1 className="mb-6 text-3xl font-black leading-tight tracking-tight text-foreground sm:text-5xl">
          Sites and systems that already work somewhere.
        </h1>

        <p className="mx-auto mb-8 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
          Trade websites, restaurant ordering, factory-floor logging and
          ecommerce — for WA businesses. Every service on this site is backed by
          a project you can open in a browser and read on GitHub.
        </p>

        <div className="mx-auto flex w-full max-w-md flex-col gap-3">
          <Button
            asChild
            className="h-auto w-full rounded-xl border border-border-brand bg-gradient-to-r from-[#1a2133] to-[#111725] py-4 font-semibold text-cyber-cyan-soft shadow-neon-cyan transition duration-200 hover:border-cyber-cyan hover:bg-[#232c42]"
          >
            <Link href="/#contact">Start Your Project</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-auto w-full rounded-xl border-border-strong bg-transparent py-4 font-semibold text-foreground transition duration-200 hover:bg-white/5 hover:text-white"
          >
            <Link href="/work">See the work</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
