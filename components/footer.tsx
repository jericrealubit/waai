import Link from "next/link";

import { CASE_STUDIES } from "@/lib/content/case-studies";
import { SERVICES } from "@/lib/content/services";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200/70 px-6 py-16 md:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="text-xl font-black tracking-tighter text-slate-900">
              WA AI <span className="text-sky-600">Digital</span>
            </span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-600">
              Custom websites, ordering systems and internal tools for Western
              Australian businesses.
            </p>
          </div>

          <nav aria-label="Services">
            <h2 className="mb-4 text-xs font-black uppercase tracking-wider text-slate-900">
              Services
            </h2>
            <ul className="space-y-2.5">
              {SERVICES.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-sm text-slate-600 transition-colors hover:text-sky-600"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Case studies">
            <h2 className="mb-4 text-xs font-black uppercase tracking-wider text-slate-900">
              Work
            </h2>
            <ul className="space-y-2.5">
              {CASE_STUDIES.map((study) => (
                <li key={study.slug}>
                  <Link
                    href={`/work/${study.slug}`}
                    className="text-sm text-slate-600 transition-colors hover:text-sky-600"
                  >
                    {study.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="mb-4 text-xs font-black uppercase tracking-wider text-slate-900">
              Contact
            </h2>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <a
                  href="tel:+61491098073"
                  className="transition-colors hover:text-sky-600"
                >
                  +61 491 098 073
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@waai.au"
                  className="transition-colors hover:text-sky-600"
                >
                  hello@waai.au
                </a>
              </li>
              <li>Waikiki, WA 6169</li>
            </ul>
          </div>
        </div>

        <p className="mt-14 border-t border-slate-200/70 pt-8 text-sm text-slate-500">
          © {new Date().getFullYear()} WA AI Digital — Perth, Western Australia
        </p>
      </div>
    </footer>
  );
}
