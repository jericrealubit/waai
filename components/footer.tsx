import Link from "next/link";
import { Flame, Linkedin } from "lucide-react";

import { CASE_STUDIES } from "@/lib/content/case-studies";
import { SERVICES } from "@/lib/content/services";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border px-6 py-16 md:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="text-xl font-black tracking-tighter text-foreground">
              WA AI <span className="text-cyber-cyan-soft">Digital</span>
            </span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Custom websites, ordering systems and internal tools for Western
              Australian businesses.
            </p>
          </div>

          <nav aria-label="Services">
            <h2 className="mb-4 text-xs font-black uppercase tracking-wider text-foreground">
              Services
            </h2>
            <ul className="space-y-2.5">
              {SERVICES.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-cyber-cyan-soft"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Case studies">
            <h2 className="mb-4 text-xs font-black uppercase tracking-wider text-foreground">
              Work
            </h2>
            <ul className="space-y-2.5">
              {CASE_STUDIES.map((study) => (
                <li key={study.slug}>
                  <Link
                    href={`/work/${study.slug}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-cyber-cyan-soft"
                  >
                    {study.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="mb-4 text-xs font-black uppercase tracking-wider text-foreground">
              Contact
            </h2>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <a
                  href="tel:+61491098073"
                  className="transition-colors hover:text-cyber-cyan-soft"
                >
                  +61 491 098 073
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@waai.au"
                  className="transition-colors hover:text-cyber-cyan-soft"
                >
                  hello@waai.au
                </a>
              </li>
              <li>Beeliar, WA 6164</li>
              <li>
                <a
                  href="https://abr.business.gov.au/ABN/View?id=85436177620"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-cyber-cyan-soft"
                >
                  ABN 85 436 177 620
                  <span className="sr-only">
                    {" "}
                    — view on the Australian Business Register
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} WA AI Digital — Perth, Western
            Australia
          </p>

          {/* Build credit. The flame and smoke are decorative, so they are
              aria-hidden. They animate unconditionally by explicit choice —
              deliberately NOT behind `motion-safe:`, so they keep blinking even
              for visitors whose OS asks for reduced motion. */}
          <div className="flex items-center gap-2 rounded-full border border-border bg-black/40 px-3.5 py-1.5 font-mono text-xs text-muted-foreground">
            {/* `overflow-visible` matters: the smoke travels ~40px upward, well
                past the badge's own box, and would otherwise be clipped. The
                puffs sit at `bottom-3` — the flame's tip — so they rise clear of
                it rather than being hidden behind the icon body. */}
            <span
              aria-hidden="true"
              className="relative flex h-4 w-4 shrink-0 items-end justify-center overflow-visible"
            >
              <span className="pointer-events-none absolute bottom-3 h-2 w-2 rounded-full bg-cyber-cyan/70 blur-[2px] animate-smoke-1" />
              <span className="pointer-events-none absolute bottom-3 left-0 h-2.5 w-2.5 rounded-full bg-cyber-purple/60 blur-[3px] animate-smoke-2" />
              <span className="pointer-events-none absolute bottom-3 right-0 h-1.5 w-1.5 rounded-full bg-cyber-cyan/60 blur-[2px] animate-smoke-3" />
              <Flame className="h-4 w-4 text-cyber-cyan-soft animate-cyber-fire" />
            </span>

            <span className="text-foreground">Smoked &amp; Coded by:</span>

            <a
              href="https://www.linkedin.com/in/jericrealubit"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1 font-semibold text-cyber-cyan-soft transition duration-200 hover:text-cyber-cyan-bright hover:text-shadow-glow-cyan"
            >
              jeric
              <Linkedin className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
              <span className="sr-only"> — LinkedIn profile</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
