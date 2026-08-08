"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Github, Lock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { CaseStudy } from "@/lib/content/case-studies";

interface CaseStudyCardProps {
  study: CaseStudy;
  index: number;
  /** Caps the stack badges shown, so the grid stays even. */
  maxBadges?: number;
}

/**
 * High-density evidence card: screenshot, outcome, stack badges and two
 * distinct outbound links.
 *
 * Deliberately NOT wrapped in a single Link — "Live site" and "GitHub" have to
 * remain separately clickable, and nesting anchors inside a card-wide anchor is
 * invalid HTML and unusable with a keyboard. The card title carries the link to
 * the detail page instead, with a ::after overlay giving it a large hit area
 * that the two outbound links sit above via z-index.
 */
export function CaseStudyCard({ study, index, maxBadges = 4 }: CaseStudyCardProps) {
  const badges = study.stack.slice(0, maxBadges);
  const remaining = study.stack.length - badges.length;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group glass-card relative isolate flex h-full flex-col overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_48px_80px_-20px_rgba(14,165,233,0.15)]"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        {study.screenshot ? (
          <Image
            src={study.screenshot.src}
            alt={study.screenshot.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-100 to-sky-50 px-6 text-center">
            <Lock className="h-7 w-7 text-slate-400" />
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Login-protected admin
            </p>
            <p className="max-w-[15rem] text-xs leading-relaxed text-slate-400">
              No screenshot — the public URL only ever shows a sign-in button.
            </p>
          </div>
        )}
        {study.gated && study.screenshot && (
          <span className="absolute right-3 top-3 z-20 inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
            <Lock className="h-3 w-3" />
            Internal tool
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-8">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {study.sector}
        </p>

        <h3 className="mb-3 text-xl font-black tracking-tight text-slate-900">
          <Link
            href={`/work/${study.slug}`}
            className="after:absolute after:inset-0 after:z-0 after:content-[''] hover:text-sky-600 focus-visible:ring-3 focus-visible:ring-sky-500/50 focus-visible:outline-none"
          >
            {study.name}
          </Link>
        </h3>

        <p className="mb-6 text-sm leading-relaxed text-slate-600">{study.outcome}</p>

        <div className="mb-6 flex flex-wrap gap-1.5">
          {badges.map((tech) => (
            <Badge key={tech} variant="secondary" className="bg-sky-50 text-sky-700">
              {tech}
            </Badge>
          ))}
          {remaining > 0 && (
            <Badge variant="outline" className="text-slate-500">
              +{remaining}
            </Badge>
          )}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-100 pt-5">
          <a
            href={study.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 inline-flex items-center gap-1.5 text-sm font-bold text-sky-600 hover:text-sky-700 focus-visible:ring-3 focus-visible:ring-sky-500/50 focus-visible:outline-none"
          >
            <ExternalLink className="h-4 w-4" />
            Live site
            <span className="sr-only"> — {study.liveLabel}</span>
          </a>
          <a
            href={study.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 inline-flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-slate-900 focus-visible:ring-3 focus-visible:ring-sky-500/50 focus-visible:outline-none"
          >
            <Github className="h-4 w-4" />
            GitHub
            <span className="sr-only"> repository for {study.name}</span>
          </a>
          <span className="ml-auto inline-flex items-center gap-1 text-sm font-bold text-slate-400 transition-colors group-hover:text-sky-600">
            Case study
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>

        {study.secondaryLink && (
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-slate-100 pt-3">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {study.secondaryLink.gated && <Lock className="h-3 w-3" />}
              {study.secondaryLink.label}
            </span>
            <a
              href={study.secondaryLink.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 focus-visible:ring-3 focus-visible:ring-sky-500/50 focus-visible:outline-none"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Live site
              <span className="sr-only"> — {study.secondaryLink.liveLabel}</span>
            </a>
            <a
              href={study.secondaryLink.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 focus-visible:ring-3 focus-visible:ring-sky-500/50 focus-visible:outline-none"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
              <span className="sr-only"> repository for {study.secondaryLink.label}</span>
            </a>
          </div>
        )}
      </div>
    </motion.article>
  );
}
