import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Github, Lock } from "lucide-react";

import { Section } from "@/components/ui/section";
import { CASE_STUDIES, getCaseStudy } from "@/lib/content/case-studies";
import { SERVICES_BY_SLUG } from "@/lib/content/services";

export function generateStaticParams() {
  return CASE_STUDIES.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  if (!study) return { title: "Not found | WA AI Digital" };

  const title = `${study.name} | Case study | WA AI Digital`;

  return {
    title,
    description: study.outcome,
    openGraph: {
      title,
      description: study.outcome,
      url: `https://waai.au/work/${study.slug}`,
      siteName: "WA AI Digital",
      locale: "en_AU",
      type: "article",
      ...(study.screenshot && {
        images: [{ url: study.screenshot.src, width: 1440, height: 810 }],
      }),
    },
  };
}

/** "This build lands on a login wall; the repo is public" — shown for gated URLs. */
function GatedNote({ label }: { label?: string }) {
  return (
    <p className="mt-6 inline-flex items-start gap-2 border-2 border-line-strong bg-cement/40 px-4 py-3 font-mono text-xs leading-relaxed text-muted-foreground">
      <Lock className="mt-0.5 h-4 w-4 shrink-0 text-hivis" />
      <span>
        {label ? `The ${label.toLowerCase()} is an internal tool` : "This is an internal tool"}{" "}
        — the live link lands on a login screen. The repository is public.
      </span>
    </p>
  );
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  if (!study) notFound();

  const service = SERVICES_BY_SLUG[study.service];

  return (
    <>
      <Section className="pb-8">
        <Link
          href="/work"
          className="focus-ring mb-8 inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide text-foreground-subtle transition-colors hover:text-hivis-text"
        >
          <ArrowLeft className="h-4 w-4" />
          All work
        </Link>

        <div className="max-w-3xl">
          <Link href={`/services/${service.slug}`} className="section-label">
            {service.name}
          </Link>
          <h1 className="mt-3 font-display text-5xl font-extrabold uppercase leading-[0.92] tracking-tight text-foreground md:text-7xl">
            {study.name}
          </h1>
          <p className="mt-3 font-mono text-xs font-bold uppercase tracking-widest text-foreground-subtle">
            {study.sector}
          </p>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {study.summary}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={study.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary focus-ring"
            >
              <ExternalLink className="h-4 w-4" />
              Visit {study.liveLabel}
            </a>
            <a
              href={study.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glass focus-ring"
            >
              <Github className="h-4 w-4" />
              View the repository
            </a>
          </div>

          {study.gated && <GatedNote />}

          {study.secondaryLink && (
            <div className="mt-8 border-t-2 border-line pt-6">
              <p className="mb-3 font-mono text-[11px] font-bold uppercase tracking-widest text-foreground-subtle">
                {study.secondaryLink.label}
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={study.secondaryLink.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary focus-ring"
                >
                  <ExternalLink className="h-4 w-4" />
                  Visit {study.secondaryLink.liveLabel}
                </a>
                <a
                  href={study.secondaryLink.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glass focus-ring"
                >
                  <Github className="h-4 w-4" />
                  View the repository
                </a>
              </div>
              {study.secondaryLink.gated && (
                <GatedNote label={study.secondaryLink.label} />
              )}
            </div>
          )}
        </div>
      </Section>

      {study.screenshot && (
        <Section className="py-8">
          <figure>
            <div className="relative aspect-video w-full overflow-hidden border-2 border-bitumen shadow-e2">
              <Image
                src={study.screenshot.src}
                alt={study.screenshot.alt}
                fill
                sizes="(min-width: 1280px) 1280px, 100vw"
                className="object-cover object-top"
                priority
              />
              <span className="absolute bottom-3 right-4 bg-bitumen/80 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-concrete">
                Plate 01 · Live capture
              </span>
            </div>
            <figcaption className="mt-4 font-mono text-xs uppercase tracking-wide text-foreground-subtle md:text-center">
              {study.screenshot.caption}
            </figcaption>
          </figure>
        </Section>
      )}

      <Section className="py-12">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-4 flex items-baseline gap-3 font-display text-3xl font-extrabold uppercase tracking-tight text-foreground">
              <span className="font-mono text-xs font-bold text-hivis-text">01</span>
              The problem
            </h2>
            <p className="mb-12 leading-relaxed text-muted-foreground">{study.problem}</p>

            <h2 className="mb-6 flex items-baseline gap-3 font-display text-3xl font-extrabold uppercase tracking-tight text-foreground">
              <span className="font-mono text-xs font-bold text-hivis-text">02</span>
              The build
            </h2>
            <ol className="mb-12 divide-y divide-line border-y border-line">
              {study.approach.map((item, index) => (
                <li key={item} className="flex gap-4 py-4">
                  <span className="mt-0.5 flex h-7 w-8 shrink-0 items-center justify-center border-2 border-line-strong font-mono text-xs font-bold tabular-nums text-hivis-text">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="leading-relaxed text-muted-foreground">{item}</p>
                </li>
              ))}
            </ol>

            <h2 className="mb-6 flex items-baseline gap-3 font-display text-3xl font-extrabold uppercase tracking-tight text-foreground">
              <span className="font-mono text-xs font-bold text-hivis-text">03</span>
              Worth calling out
            </h2>
            <ul className="space-y-4">
              {study.highlights.map((item) => (
                <li
                  key={item}
                  className="border-l-2 border-hivis pl-5 leading-relaxed text-muted-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <aside className="lg:col-span-1">
            <div className="glass-card sticky top-28 p-7">
              <h2 className="mb-4 font-mono text-[11px] font-bold uppercase tracking-widest text-foreground">
                ◱ Datasheet
              </h2>

              <dl className="space-y-4 border-b border-line pb-5 text-sm">
                <div>
                  <dt className="font-mono text-[10px] font-bold uppercase tracking-widest text-foreground-subtle">
                    Client
                  </dt>
                  <dd className="mt-1 font-semibold text-foreground">{study.client}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] font-bold uppercase tracking-widest text-foreground-subtle">
                    Service line
                  </dt>
                  <dd className="mt-1">
                    <Link
                      href={`/services/${service.slug}`}
                      className="font-semibold text-source underline-offset-4 hover:underline"
                    >
                      {service.name}
                    </Link>
                  </dd>
                </div>
              </dl>

              <h3 className="mb-3 mt-5 font-mono text-[10px] font-bold uppercase tracking-widest text-foreground-subtle">
                Stack
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {study.stack.map((tech) => (
                  <span
                    key={tech}
                    className="border border-line-strong px-2 py-1 font-mono text-[11px] text-foreground-subtle"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-7 flex justify-center">
                <span
                  className="stamp"
                  role="img"
                  aria-label="Field verified: live and source open"
                >
                  <span className="block text-sm font-bold tracking-widest">
                    ◱ Field-Verified
                  </span>
                  <span className="mt-0.5 block text-[9px] tracking-[0.2em]">
                    Live + Source
                  </span>
                </span>
              </div>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
