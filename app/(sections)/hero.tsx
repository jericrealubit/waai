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

        <h2 className="mb-4 text-2xl font-extrabold tracking-wider text-cyber-cyan text-shadow-glow-cyan sm:text-3xl">
          WA AI Digital
        </h2>

        <Badge
          variant="outline"
          className="mb-6 h-auto border-cyber-cyan/50 bg-cyber-cyan/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cyber-cyan shadow-neon-cyan"
        >
          Based in Western Australia
        </Badge>

        <h1 className="mb-6 text-3xl font-black leading-tight tracking-tight text-white text-shadow-glow-white sm:text-5xl">
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
            className="h-auto w-full rounded-xl border border-cyber-cyan/40 bg-gradient-to-r from-slate-800 to-slate-900 py-4 font-semibold text-cyber-cyan shadow-neon-cyan transition duration-200 hover:border-cyber-cyan hover:bg-slate-800"
          >
            <Link href="/#contact">Start Your Project</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-auto w-full rounded-xl border-white/20 bg-transparent py-4 font-semibold text-slate-200 transition duration-200 hover:bg-white/5 hover:text-white"
          >
            <Link href="/work">See the work</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
