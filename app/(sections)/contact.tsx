"use client";

import { useRef, useState, type FormEvent } from "react";

import { readAttribution, track } from "@/lib/analytics";
import { SERVICES } from "@/lib/content/services";

/**
 * Derived from SERVICES so a renamed service line can't leave a stale option
 * behind. The list used to be hand-maintained — six options against four
 * service lines, defaulting to "Restaurant Menu Website", so every enquirer
 * who ignored the field was silently filed as a restaurant lead.
 */
const INTEREST_OPTIONS = [
  ...SERVICES.map((service) => service.name),
  "Something else",
];

/**
 * Budget bands spanning the rate card, so a prospect self-selects into a tier
 * before the first call. Qualifying on budget up front is the difference
 * between writing a quote and losing an hour.
 */
const BUDGET_OPTIONS = [
  "Under $1,000",
  "$1,000 – $2,000",
  "$2,000 – $5,000",
  "Over $5,000",
  "I'd rather pay monthly",
  "Not sure yet",
];

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
  phone: "",
  suburb: "",
  interestedIn: "",
  budget: "",
  projectDetails: "",
  /* Honeypot — rendered hidden, must stay empty. Named for what a bot expects
     to see rather than anything that hints at its purpose. */
  companyWebsite: "",
};

type Status = "idle" | "submitting" | "success" | "error";

export default function Contact() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  /* Fires `form_start` once per mount. A ref, not state, because nothing
     renders differently — re-rendering the whole form on first keystroke to
     flip a boolean nobody reads would be a real cost for no benefit. */
  const startedRef = useRef(false);
  /* Time of first interaction. A submit that arrives implausibly fast after
     the form was first touched is a bot; the server uses this to decide. */
  const startedAtRef = useRef<number | null>(null);

  function handleFirstInteraction() {
    if (startedRef.current) return;
    startedRef.current = true;
    startedAtRef.current = Date.now();
    track("form_start", { form_id: "contact" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          // Where this visitor came from, captured on their first page view.
          attribution: readAttribution(),
          elapsedMs: startedAtRef.current
            ? Date.now() - startedAtRef.current
            : null,
        }),
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
        track("form_error", {
          form_id: "contact",
          reason: data?.error ?? `http_${response.status}`,
        });
        return;
      }

      setStatus("success");
      // The conversion. Only the qualifying fields go to GA — never the name,
      // email, phone or the project description, which are personal
      // information and have no business in an analytics property.
      track("generate_lead", {
        form_id: "contact",
        service: form.interestedIn || "Not specified",
        budget: form.budget || "Not specified",
        suburb_given: form.suburb.trim().length > 0,
      });
      setForm(INITIAL_FORM);
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong sending that. Please try again.");
      track("form_error", { form_id: "contact", reason: "network" });
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
              job sheets piling up. Tell us the business and we&apos;ll send
              back a written plan — which tier fits, what it would include, and
              the fixed price — within one business day. No charge, no
              obligation, and no call required to get it.
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
              /* The form is replaced wholesale on success, so without a live
                 region a screen-reader user hears nothing at all — the focused
                 submit button simply vanishes. */
              <div
                role="status"
                aria-live="polite"
                className="flex flex-col items-center justify-center py-12 text-center"
              >
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
                  Thanks — we&apos;ve got your details. Your written plan and
                  fixed price will land within one business day.
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
              <form
                className="space-y-6"
                onSubmit={handleSubmit}
                /* Capture-phase so it fires for the first keystroke in any
                   field without every input needing its own handler. */
                onChangeCapture={handleFirstInteraction}
              >
                {/* Honeypot. Hidden from sight and from assistive tech, and
                    skipped by keyboard tabbing — a human will never fill it,
                    so anything that does is automated and the server drops it
                    silently. `hidden` rather than display:none via CSS, which
                    a scripted filler is more likely to notice and respect. */}
                <div hidden aria-hidden="true">
                  <label htmlFor="contact-company-website">
                    Company website — leave this empty
                  </label>
                  <input
                    id="contact-company-website"
                    name="company_website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.companyWebsite}
                    onChange={(e) =>
                      setForm({ ...form, companyWebsite: e.target.value })
                    }
                  />
                </div>

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

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="contact-phone"
                      className="ml-0.5 font-mono text-xs font-bold uppercase tracking-wide text-foreground"
                    >
                      Phone
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="0400 000 000"
                      value={form.phone}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, phone: e.target.value }))
                      }
                      className="field-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="contact-suburb"
                      className="ml-0.5 font-mono text-xs font-bold uppercase tracking-wide text-foreground"
                    >
                      Suburb
                    </label>
                    <input
                      id="contact-suburb"
                      type="text"
                      placeholder="e.g. Rockingham"
                      value={form.suburb}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, suburb: e.target.value }))
                      }
                      className="field-input"
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
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
                        required
                        value={form.interestedIn}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            interestedIn: e.target.value,
                          }))
                        }
                        className="field-input cursor-pointer appearance-none"
                      >
                        <option value="" disabled>
                          Select one
                        </option>
                        {INTEREST_OPTIONS.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
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
                      htmlFor="contact-budget"
                      className="ml-0.5 font-mono text-xs font-bold uppercase tracking-wide text-foreground"
                    >
                      Budget
                    </label>
                    <div className="relative">
                      <select
                        id="contact-budget"
                        value={form.budget}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, budget: e.target.value }))
                        }
                        className="field-input cursor-pointer appearance-none"
                      >
                        <option value="">Prefer not to say</option>
                        {BUDGET_OPTIONS.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
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
                  /* role="alert" so a screen reader announces the failure —
                     without it, a blind visitor gets no signal at all that the
                     submission didn't go through. Colours come from the
                     --destructive token rather than raw red-* utilities. */
                  <p
                    role="alert"
                    className="border-2 border-destructive/50 bg-destructive/10 px-5 py-3 font-mono text-sm font-semibold text-destructive"
                  >
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
