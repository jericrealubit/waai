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
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 transition-colors hover:text-sky-600 focus-visible:ring-3 focus-visible:ring-sky-500/50 focus-visible:outline-none"
        >
          <ArrowLeft className="h-4 w-4" />
          All work
        </Link>

        <div className="max-w-3xl">
          <Link href={`/services/${service.slug}`} className="section-label">
            {service.name}
          </Link>
          <h1 className="mt-4 text-4xl font-black leading-[1.1] tracking-tight text-slate-900 md:text-6xl">
            {study.name}
          </h1>
          <p className="mt-3 text-sm font-bold uppercase tracking-wider text-slate-400">
            {study.sector}
          </p>
          <p className="mt-6 text-lg leading-relaxed text-slate-600">
            {study.summary}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={study.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-200 transition-all hover:-translate-y-0.5 hover:bg-sky-600 hover:shadow-sky-100 focus-visible:ring-3 focus-visible:ring-sky-500/50 focus-visible:outline-none"
            >
              <ExternalLink className="h-4 w-4" />
              Visit {study.liveLabel}
            </a>
            <a
              href={study.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-6 py-3.5 text-sm font-bold text-slate-900 transition-all hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 focus-visible:ring-3 focus-visible:ring-sky-500/50 focus-visible:outline-none"
            >
              <Github className="h-4 w-4" />
              View the repository
            </a>
          </div>

          {study.gated && (
            <p className="mt-6 inline-flex items-start gap-2 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <Lock className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                This is an internal tool — the live link lands on a login screen.
                The repository is public.
              </span>
            </p>
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
            <figcaption className="mt-4 text-center text-sm text-slate-500">
              {study.screenshot.caption}
            </figcaption>
          </figure>
        </Section>
      )}

      <Section className="py-12">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-2xl font-black tracking-tight text-slate-900">
              The problem
            </h2>
            <p className="mb-12 leading-relaxed text-slate-600">{study.problem}</p>

            <h2 className="mb-6 text-2xl font-black tracking-tight text-slate-900">
              What we built
            </h2>
            <ol className="mb-12 space-y-5">
              {study.approach.map((item, index) => (
                <li key={item} className="flex gap-4">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-50 text-xs font-black text-sky-600">
                    {index + 1}
                  </span>
                  <p className="leading-relaxed text-slate-600">{item}</p>
                </li>
              ))}
            </ol>

            <h2 className="mb-6 text-2xl font-black tracking-tight text-slate-900">
              Details worth calling out
            </h2>
            <ul className="space-y-4">
              {study.highlights.map((item) => (
                <li
                  key={item}
                  className="border-l-2 border-sky-100 pl-5 leading-relaxed text-slate-600"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <aside className="lg:col-span-1">
            <div className="glass-card sticky top-28 p-8">
              <h2 className="mb-5 text-sm font-black uppercase tracking-wider text-slate-900">
                Built with
              </h2>
              <div className="mb-8 flex flex-wrap gap-1.5">
                {study.stack.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="bg-sky-50 text-sky-700"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>

              <dl className="space-y-4 border-t border-slate-100 pt-6 text-sm">
                <div>
                  <dt className="font-bold text-slate-900">Client</dt>
                  <dd className="mt-0.5 text-slate-600">{study.client}</dd>
                </div>
                <div>
                  <dt className="font-bold text-slate-900">Service line</dt>
                  <dd className="mt-0.5">
                    <Link
                      href={`/services/${service.slug}`}
                      className="text-sky-600 underline-offset-4 hover:underline"
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
