"use client";

import { useState, type FormEvent } from "react";

const CONTACT_ITEMS = [
  {
    label: "Phone",
    value: "+61 491 098 073",
    href: "tel:+61491098073",
    icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
  },
  {
    label: "Email",
    value: "hello@waai.au",
    href: "mailto:hello@waai.au",
    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
  {
    label: "Location",
    value: "Beeliar, WA 6164",
    href: "#",
    icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
  },
];

const INITIAL_FORM = {
  name: "",
  businessName: "",
  email: "",
  interestedIn: "Restaurant Menu Website",
  projectDetails: "",
};

type Status = "idle" | "submitting" | "success" | "error";

export default function Contact() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;

      if (!response.ok || !data?.ok) {
        setStatus("error");
        setErrorMessage(
          data?.error ?? "Something went wrong sending that. Please try again.",
        );
        return;
      }

      setStatus("success");
      setForm(INITIAL_FORM);
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong sending that. Please try again.");
    }
  }

  return (
    <section id="contact" className="px-6 py-20 md:px-20 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="lg:pr-10">
            <span className="section-label mb-5">
              Site office — open for briefs
            </span>
            <h2 className="mb-5 font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-foreground md:text-6xl">
              Tell us what needs building.
            </h2>
            <p className="mb-10 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
              Quotes going unanswered, phone orders eating your evenings, paper
              job sheets piling up. Tell us the business and we&apos;ll tell you
              what it takes — and what it costs — before you commit to anything.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {CONTACT_ITEMS.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  className="focus-ring group flex items-center gap-4 border-2 border-line-strong bg-paper p-4 transition-colors hover:border-hivis"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-hivis/10 text-hivis">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={item.icon}
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest text-foreground-subtle">
                      {item.label}
                    </h4>
                    <span className="font-mono text-base font-bold text-foreground transition-colors group-hover:text-hivis-text">
                      {item.value}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="glass-card p-7 md:p-10">
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center bg-hivis/10 text-hivis">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="mb-3 font-display text-2xl font-extrabold uppercase tracking-tight text-foreground">
                  Message sent
                </h3>
                <p className="mb-8 max-w-xs text-muted-foreground">
                  Thanks — we&apos;ve got your details and will be in touch
                  shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="font-mono text-sm font-bold uppercase tracking-wide text-source transition-colors hover:text-hivis-text"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="contact-name"
                      className="ml-0.5 font-mono text-xs font-bold uppercase tracking-wide text-foreground"
                    >
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      className="field-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="contact-business"
                      className="ml-0.5 font-mono text-xs font-bold uppercase tracking-wide text-foreground"
                    >
                      Business Name
                    </label>
                    <input
                      id="contact-business"
                      type="text"
                      placeholder="e.g. Perth Cafe"
                      value={form.businessName}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          businessName: e.target.value,
                        }))
                      }
                      className="field-input"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="contact-email"
                    className="ml-0.5 font-mono text-xs font-bold uppercase tracking-wide text-foreground"
                  >
                    Work Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="john@business.com.au"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    className="field-input"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="contact-interest"
                    className="ml-0.5 font-mono text-xs font-bold uppercase tracking-wide text-foreground"
                  >
                    Interested In
                  </label>
                  <div className="relative">
                    <select
                      id="contact-interest"
                      value={form.interestedIn}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          interestedIn: e.target.value,
                        }))
                      }
                      className="field-input cursor-pointer appearance-none"
                    >
                      <option>Restaurant Menu Website</option>
                      <option>Menu + Ordering System</option>
                      <option>Tradie Website</option>
                      <option>Manufacturing Log Automation</option>
                      <option>E-commerce Store</option>
                      <option>Custom Digital Solution</option>
                    </select>
                    <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-foreground-subtle">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="contact-details"
                    className="ml-0.5 font-mono text-xs font-bold uppercase tracking-wide text-foreground"
                  >
                    Project Details
                  </label>
                  <textarea
                    id="contact-details"
                    rows={4}
                    required
                    placeholder="Briefly describe your vision..."
                    value={form.projectDetails}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        projectDetails: e.target.value,
                      }))
                    }
                    className="field-input resize-none"
                  />
                </div>

                {status === "error" && (
                  <p className="border-2 border-red-500/50 bg-red-500/10 px-5 py-3 font-mono text-sm font-semibold text-red-700 dark:text-red-300">
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="btn-primary focus-ring w-full py-4 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "submitting" ? "Sending..." : "Get My Free Plan"}
                  {status !== "submitting" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
