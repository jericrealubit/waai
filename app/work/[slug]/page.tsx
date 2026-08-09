import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Github, Lock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground transition-colors hover:text-cyber-cyan-soft focus-ring"
        >
          <ArrowLeft className="h-4 w-4" />
          All work
        </Link>

        <div className="max-w-3xl">
          <Link href={`/services/${service.slug}`} className="section-label">
            {service.name}
          </Link>
          <h1 className="mt-4 text-4xl font-black leading-[1.1] tracking-tight text-foreground md:text-6xl">
            {study.name}
          </h1>
          <p className="mt-3 text-sm font-bold uppercase tracking-wider text-foreground-subtle">
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
              className="inline-flex items-center gap-2 rounded-2xl bg-cyber-cyan px-6 py-3.5 text-sm font-bold text-cyber-dark shadow-neon-cyan transition-all hover:-translate-y-0.5 hover:bg-cyber-cyan-bright hover:shadow-neon-cyan-strong focus-ring"
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

          {study.gated && (
            <p className="mt-6 inline-flex items-start gap-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 px-4 py-3 text-sm text-amber-200">
              <Lock className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                This is an internal tool — the live link lands on a login screen.
                The repository is public.
              </span>
            </p>
          )}

          {study.secondaryLink && (
            <div className="mt-8 border-t border-border pt-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-foreground-subtle">
                {study.secondaryLink.label}
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={study.secondaryLink.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl bg-cyber-cyan px-6 py-3.5 text-sm font-bold text-cyber-dark shadow-neon-cyan transition-all hover:-translate-y-0.5 hover:bg-cyber-cyan-bright hover:shadow-neon-cyan-strong focus-ring"
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
                <p className="mt-4 inline-flex items-start gap-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 px-4 py-3 text-sm text-amber-200">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    The {study.secondaryLink.label.toLowerCase()} is an internal
                    tool — the live link lands on a login screen. The repository
                    is public.
                  </span>
                </p>
              )}
            </div>
          )}
        </div>
      </Section>

      {study.screenshot && (
        <Section className="py-8">
          <figure>
            <div className="glass-card relative aspect-video w-full overflow-hidden">
              <Image
                src={study.screenshot.src}
                alt={study.screenshot.alt}
                fill
                sizes="(min-width: 1280px) 1280px, 100vw"
                className="object-cover object-top"
                priority
              />
            </div>
            <figcaption className="mt-4 text-center text-sm text-muted-foreground">
              {study.screenshot.caption}
            </figcaption>
          </figure>
        </Section>
      )}

      <Section className="py-12">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-2xl font-black tracking-tight text-foreground">
              The problem
            </h2>
            <p className="mb-12 leading-relaxed text-muted-foreground">{study.problem}</p>

            <h2 className="mb-6 text-2xl font-black tracking-tight text-foreground">
              What we built
            </h2>
            <ol className="mb-12 space-y-5">
              {study.approach.map((item, index) => (
                <li key={item} className="flex gap-4">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyber-cyan/10 text-xs font-black text-cyber-cyan-soft">
                    {index + 1}
                  </span>
                  <p className="leading-relaxed text-muted-foreground">{item}</p>
                </li>
              ))}
            </ol>

            <h2 className="mb-6 text-2xl font-black tracking-tight text-foreground">
              Details worth calling out
            </h2>
            <ul className="space-y-4">
              {study.highlights.map((item) => (
                <li
                  key={item}
                  className="border-l-2 border-border pl-5 leading-relaxed text-muted-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <aside className="lg:col-span-1">
            <div className="glass-card sticky top-28 p-8">
              <h2 className="mb-5 text-sm font-black uppercase tracking-wider text-foreground">
                Built with
              </h2>
              <div className="mb-8 flex flex-wrap gap-1.5">
                {study.stack.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="bg-cyber-cyan/10 text-cyber-cyan-soft"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>

              <dl className="space-y-4 border-t border-border pt-6 text-sm">
                <div>
                  <dt className="font-bold text-foreground">Client</dt>
                  <dd className="mt-0.5 text-muted-foreground">{study.client}</dd>
                </div>
                <div>
                  <dt className="font-bold text-foreground">Service line</dt>
                  <dd className="mt-0.5">
                    <Link
                      href={`/services/${service.slug}`}
                      className="text-cyber-cyan-soft underline-offset-4 hover:underline"
                    >
                      {service.name}
                    </Link>
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
