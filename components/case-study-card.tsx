"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Github, Lock } from "lucide-react";

import type { CaseStudy } from "@/lib/content/case-studies";

interface CaseStudyCardProps {
  study: CaseStudy;
  index: number;
}

/** The four corner registration ticks that frame a technical plate. */
function PlateTicks() {
  const base =
    "pointer-events-none absolute h-3 w-3 border-concrete drop-shadow-[0_0_2px_rgba(0,0,0,0.55)]";
  return (
    <>
      <span className={`${base} left-1.5 top-1.5 border-l-2 border-t-2`} />
      <span className={`${base} right-1.5 top-1.5 border-r-2 border-t-2`} />
      <span className={`${base} bottom-1.5 left-1.5 border-b-2 border-l-2`} />
      <span className={`${base} bottom-1.5 right-1.5 border-b-2 border-r-2`} />
    </>
  );
}

/**
 * Spec card: a plate-framed live capture over a datasheet body — sector, name,
 * outcome, a `Live` tag (the running product) and a `Source` tag (the open
 * repo), and the stack as a mono line.
 *
 * Deliberately NOT wrapped in a single Link — the two outbound links must stay
 * separately clickable, and nesting anchors is invalid HTML and unusable with a
 * keyboard. The card title carries the link to the detail page via a ::after
 * overlay that gives it a large hit area; the outbound tags sit above it by
 * z-index.
 */
export function CaseStudyCard({ study, index }: CaseStudyCardProps) {
  const plateNo = String(index + 1).padStart(2, "0");

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group glass-card glass-card-interactive relative isolate flex h-full flex-col overflow-hidden"
    >
      <div className="relative aspect-video w-full overflow-hidden border-b-2 border-bitumen bg-cement">
        {study.screenshot ? (
          <>
            <Image
              src={study.screenshot.src}
              alt={study.screenshot.alt}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
            <PlateTicks />
            <span className="absolute bottom-2.5 right-3 z-10 bg-bitumen/80 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-concrete">
              Plate {plateNo} · Live capture
            </span>
          </>
        ) : (
          // No honest screenshot — the public URL only ever renders a sign-in
          // wall, so we show a labelled schematic plate rather than invent one.
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center">
            <PlateTicks />
            <Lock className="h-7 w-7 text-foreground-subtle" />
            <p className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Login-protected admin
            </p>
            <p className="max-w-[15rem] text-xs leading-relaxed text-foreground-subtle">
              No screenshot — the public URL only ever shows a sign-in button.
            </p>
            <span className="absolute bottom-2.5 right-3 font-mono text-[10px] font-bold uppercase tracking-wider text-foreground-subtle">
              Plate {plateNo} · Schematic
            </span>
          </div>
        )}
        {study.gated && study.screenshot && (
          <span className="absolute right-3 top-3 z-20 inline-flex items-center gap-1 border border-bitumen bg-bitumen/85 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-concrete">
            <Lock className="h-3 w-3" />
            Internal tool
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-7">
        <p className="mb-2 font-mono text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
          {study.sector}
        </p>

        <h3 className="mb-3 font-display text-2xl font-extrabold uppercase tracking-tight text-foreground">
          <Link
            href={`/work/${study.slug}`}
            className="after:absolute after:inset-0 after:z-0 after:content-[''] hover:text-hivis-text focus-ring"
          >
            {study.name}
          </Link>
        </h3>

        <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
          {study.outcome}
        </p>

        <div className="mb-5 flex flex-wrap gap-2">
          <a
            href={study.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="tag-live relative z-10 focus-ring"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Live
            <span className="sr-only"> — {study.liveLabel}</span>
          </a>
          <a
            href={study.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="tag-src relative z-10 focus-ring"
          >
            <Github className="h-3.5 w-3.5" />
            Source
            <span className="sr-only"> repository for {study.name}</span>
          </a>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-4">
          <p className="font-mono text-[11px] leading-relaxed text-foreground-subtle">
            <span className="font-bold text-foreground">Stack</span>{" "}
            — {study.stack.join(" · ")}
          </p>
          <span className="ml-auto inline-flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-wide text-foreground-subtle transition-colors group-hover:text-hivis-text">
            Case study
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>

        {study.secondaryLink && (
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
            <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
              {study.secondaryLink.gated && <Lock className="h-3 w-3" />}
              {study.secondaryLink.label}
            </span>
            <a
              href={study.secondaryLink.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="tag-live relative z-10 focus-ring"
            >
              <ExternalLink className="h-3 w-3" />
              Live
              <span className="sr-only"> — {study.secondaryLink.liveLabel}</span>
            </a>
            <a
              href={study.secondaryLink.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="tag-src relative z-10 focus-ring"
            >
              <Github className="h-3 w-3" />
              Source
              <span className="sr-only">
                {" "}
                repository for {study.secondaryLink.label}
              </span>
            </a>
          </div>
        )}
      </div>
    </motion.article>
  );
}
