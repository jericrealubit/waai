import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  EyeOff,
  Github,
  Lock,
} from "lucide-react";

import { JsonLd } from "@/components/json-ld";
import { TestimonialCard } from "@/components/testimonial";
import { Section } from "@/components/ui/section";
import { SpecStrip } from "@/components/ui/spec-cell";
import { breadcrumbLd, caseStudyLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
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

  const base = pageMetadata({
    title: `${study.name} | Case study`,
    description: study.outcome,
    path: `/work/${study.slug}`,
    type: "article",
  });

  // A case study keeps its own screenshot as the share image rather than the
  // generic card — the picture of the actual shipped build is the whole
  // argument the page is making.
  if (!study.screenshot) return base;

  // Every capture in public/work is a 1600×900 WebP (see commit ae4505a).
  const images = [{ url: study.screenshot.src, width: 1600, height: 900 }];

  return {
    ...base,
    openGraph: { ...base.openGraph, images },
    twitter: { ...base.twitter, images },
  };
}

/**
 * "This build lands on a login wall" — shown for gated URLs. A client build's
 * gate is an internal tool whose repo is still public; a product's gate is a
 * sign-up screen anyone can get past.
 */
function GatedNote({ label, product }: { label?: string; product?: boolean }) {
  return (
    <p className="mt-6 inline-flex items-start gap-2 border-2 border-line-strong bg-cement/40 px-4 py-3 font-mono text-xs leading-relaxed text-muted-foreground">
      <Lock className="mt-0.5 h-4 w-4 shrink-0 text-hivis" />
      <span>
        {product
          ? "The live link opens on a sign-in screen — anyone can create an account to try it."
          : `${label ? `The ${label.toLowerCase()} is an internal tool` : "This is an internal tool"} — the live link lands on a login screen. The repository is public.`}
      </span>
    </p>
  );
}

/** Shown in place of the repository button on a closed-source product. */
function ClosedSourceNote() {
  return (
    <p className="mt-3 inline-flex items-start gap-2 border-2 border-dashed border-steel bg-cement/40 px-4 py-3 font-mono text-xs leading-relaxed text-muted-foreground first:mt-6">
      <EyeOff className="mt-0.5 h-4 w-4 shrink-0 text-foreground-subtle" aria-hidden="true" />
      <span>
        Closed source — this is our own product, so its repository is
        private. Every client build on this site links its public repository.
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

  // Products sit outside the service lines, so they have no service to link.
  const service =
    study.kind === "client" ? SERVICES_BY_SLUG[study.service] : null;

  return (
    <>
      <JsonLd data={caseStudyLd(study)} />
      <JsonLd
        data={breadcrumbLd([
          { name: "Our work", path: "/work" },
          { name: study.name, path: `/work/${study.slug}` },
        ])}
      />

      <Section className="pb-8">
        <Link
          href="/work"
          className="focus-ring mb-8 inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide text-foreground-subtle transition-colors hover:text-hivis-text"
        >
          <ArrowLeft className="h-4 w-4" />
          All work
        </Link>

        <div className="max-w-3xl">
          {service ? (
            <Link href={`/services/${service.slug}`} className="section-label">
              {service.name}
            </Link>
          ) : (
            <Link href="/work#products" className="section-label">
              Our products
            </Link>
          )}
          <h1 className="mt-3 font-display text-display-1 font-extrabold uppercase text-foreground">
            {study.name}
          </h1>
          <p className="mt-3 font-mono text-xs font-bold uppercase tracking-widest text-foreground-subtle">
            {study.sector}
          </p>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {study.summary}
          </p>

          {/* Countable facts, above the CTAs. A skim-reader who never reaches
              the approach section still leaves with three checkable numbers —
              and every one of them can be verified by opening the live link
              directly below. */}
          <SpecStrip metrics={study.metrics} className="mt-8" />

          {/* Renders nothing until this client has approved a quote — see the
              consent rule on the field in lib/content/case-studies.ts. */}
          <TestimonialCard testimonial={study.testimonial} className="mt-8" />

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
            {study.repoUrl && (
              <a
                href={study.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glass focus-ring"
              >
                <Github className="h-4 w-4" />
                View the repository
              </a>
            )}
          </div>

          {/* A column, so a gated product's two notes stack rather than
              sitting side by side as inline boxes. */}
          <div className="flex flex-col items-start">
            {study.gated && <GatedNote product={study.kind === "product"} />}
            {!study.repoUrl && <ClosedSourceNote />}
          </div>

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
            <h2 className="mb-4 flex items-baseline gap-3 font-display text-display-3 font-extrabold uppercase text-foreground">
              <span className="font-mono text-xs font-bold text-hivis-text">01</span>
              The problem
            </h2>
            <p className="mb-12 leading-relaxed text-muted-foreground">{study.problem}</p>

            <h2 className="mb-6 flex items-baseline gap-3 font-display text-display-3 font-extrabold uppercase text-foreground">
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

            <h2 className="mb-6 flex items-baseline gap-3 font-display text-display-3 font-extrabold uppercase text-foreground">
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
                    {service ? "Client" : "Built and run by"}
                  </dt>
                  <dd className="mt-1 font-semibold text-foreground">{study.client}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] font-bold uppercase tracking-widest text-foreground-subtle">
                    {service ? "Service line" : "Group"}
                  </dt>
                  <dd className="mt-1">
                    <Link
                      href={service ? `/services/${service.slug}` : "/work#products"}
                      className="font-semibold text-source underline-offset-4 hover:underline"
                    >
                      {service ? service.name : "Our products"}
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
                  aria-label={
                    study.repoUrl
                      ? "Field verified: live and source open"
                      : "Field verified: live, closed source"
                  }
                >
                  <span className="block text-sm font-bold tracking-widest">
                    ◱ Field-Verified
                  </span>
                  <span className="mt-0.5 block text-[9px] tracking-[0.2em]">
                    {study.repoUrl ? "Live + Source" : "Live · Closed source"}
                  </span>
                </span>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      {/* A CTA tied to THIS story rather than a generic one. A reader who has
          just worked through a build in their own trade is the most qualified
          visitor the site gets, and the next step should name what they
          just read. */}
      <Section size="tight">
        {service ? (
          <div className="glass-card px-7 py-10 text-left md:px-14 md:py-12 md:text-center">
            <h2 className="font-display text-display-3 font-extrabold uppercase text-foreground">
              Want one like this?
            </h2>
            <p className="mt-4 max-w-[54ch] text-base leading-[1.65] text-muted-foreground md:mx-auto">
              Price a {service.shortName.toLowerCase()} build yourself — four
              questions, the fixed price on screen before you give us anything.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 md:justify-center">
              <Link href="/quote" className="btn-primary focus-ring w-full sm:w-auto">
                Get a price
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`/services/${service.slug}`}
                className="btn-glass focus-ring w-full sm:w-auto"
              >
                What&apos;s included
              </Link>
            </div>
          </div>
        ) : (
          // A product isn't a service line, so there's no tier to price —
          // the honest next step is a conversation, not the quote docket.
          <div className="glass-card px-7 py-10 text-left md:px-14 md:py-12 md:text-center">
            <h2 className="font-display text-display-3 font-extrabold uppercase text-foreground">
              Want something built like this?
            </h2>
            <p className="mt-4 max-w-[54ch] text-base leading-[1.65] text-muted-foreground md:mx-auto">
              {study.name} is our own product, not a client build — but it&apos;s
              the same hands and the same standard you&apos;d get on yours. Tell
              us what you&apos;re trying to fix and you&apos;ll get a written
              plan and a fixed price.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 md:justify-center">
              <Link href="/#contact" className="btn-primary focus-ring w-full sm:w-auto">
                Start a project
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/work" className="btn-glass focus-ring w-full sm:w-auto">
                See client work
              </Link>
            </div>
          </div>
        )}
      </Section>
    </>
  );
}
