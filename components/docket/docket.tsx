"use client";

import { useMemo, useRef, useState, type FormEvent } from "react";
import { Printer } from "lucide-react";

import { DocketRow } from "@/components/docket/docket-row";
import { Estimate } from "@/components/docket/estimate";
import { StampPress } from "@/components/docket/stamp-press";
import { readAttribution, track } from "@/lib/analytics";
import { SERVICES, TERM_MONTHS, type Service } from "@/lib/content/services";
import { estimateBand, formatAUD, quoteTotal } from "@/lib/pricing";

/**
 * The job docket — a works order the visitor fills in, which prices itself.
 *
 * Built as a real <form> with a <fieldset>/<legend> per step and real radio and
 * checkbox inputs, then skinned to look like a docket. That ordering matters:
 * arrow-key navigation within a group, the "3 of 4 selected" announcements and
 * the label/description wiring all come from the platform rather than being
 * reimplemented with divs and click handlers.
 *
 * The estimate is shown BEFORE any contact details are asked for. A visitor who
 * has already been given the number has a reason to hand over an email; one who
 * is asked first has only a reason to leave.
 *
 * Every figure comes from lib/pricing.ts, which is also what the published rate
 * card is checked against — the docket is never allowed its own arithmetic.
 */

type PaymentMode = "outright" | "monthly";

const INITIAL_CONTACT = {
  name: "",
  businessName: "",
  email: "",
  phone: "",
  suburb: "",
  projectDetails: "",
  /** Honeypot — hidden, must stay empty. */
  companyWebsite: "",
};

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Wall-clock helpers, at module scope.
 *
 * `Date.now()` is impure, and React's lint rules flag an impure call written
 * inside a component body even when it can only run from an event handler —
 * the analyser can't prove the call site. Keeping the clock out here states
 * the intent plainly and keeps the component body free of it.
 */
function nowMs(): number {
  return Date.now();
}

function elapsedSince(start: number | null): number | null {
  return start === null ? null : nowMs() - start;
}

export function Docket() {
  const [service, setService] = useState<Service | null>(null);
  const [tierName, setTierName] = useState<string | null>(null);
  const [addOnIds, setAddOnIds] = useState<string[]>([]);
  const [payment, setPayment] = useState<PaymentMode | null>(null);

  const [contact, setContact] = useState(INITIAL_CONTACT);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const startedRef = useRef(false);
  const startedAtRef = useRef<number | null>(null);
  /** Fired once per configuration, not on every keystroke. */
  const configuredRef = useRef<string | null>(null);

  const tier = useMemo(
    () => service?.tiers.find((t) => t.name === tierName) ?? null,
    [service, tierName],
  );

  const addOns = service?.addOns ?? [];
  /** A service with no add-ons has no add-on step — three rows, not four. */
  const hasAddOnStep = addOns.length > 0;

  const totals = useMemo(() => {
    if (!service || !tier) return null;
    return quoteTotal({ service, tier, addOnIds });
  }, [service, tier, addOnIds]);

  const locked = Boolean(service && tier && payment);

  function markStarted() {
    if (startedRef.current) return;
    startedRef.current = true;
    startedAtRef.current = nowMs();
    track("form_start", { form_id: "quote" });
  }

  /** Changing the service invalidates the tier and add-ons chosen under it. */
  function chooseService(next: Service) {
    markStarted();
    setService(next);
    setTierName(null);
    setAddOnIds([]);
  }

  function toggleAddOn(id: string) {
    markStarted();
    setAddOnIds((current) =>
      current.includes(id)
        ? current.filter((existing) => existing !== id)
        : [...current, id],
    );
  }

  function choosePayment(mode: PaymentMode) {
    markStarted();
    setPayment(mode);

    // The configuration is complete at this point — report it once, and only
    // when the shape actually changes, so revising an answer doesn't inflate
    // the count.
    if (service && tier) {
      // Copy before sorting — `sort` is in-place, and this array is state.
      const signature = `${service.slug}|${tier.name}|${[...addOnIds].sort().join(",")}|${mode}`;
      if (configuredRef.current !== signature) {
        configuredRef.current = signature;
        const computed = quoteTotal({ service, tier, addOnIds });
        track("quote_configured", {
          service: service.slug,
          tier: tier.name,
          addons: addOnIds.length,
          payment: mode,
          // A band, not the exact dollar value — keeps the GA dimension from
          // exploding into one value per configuration.
          estimate_band: estimateBand(computed.oneOff),
        });
      }
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!service || !tier || !payment || !totals) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...contact,
          // The enquiry fields the API already understands, so a docket lead
          // lands in the same inbox format as a plain enquiry.
          interestedIn: service.name,
          budget:
            totals.oneOff === null
              ? "Quoted per project"
              : payment === "monthly"
                ? `${formatAUD(totals.oneOff)} (prefers monthly)`
                : formatAUD(totals.oneOff),
          kind: "docket",
          docket: {
            service: service.name,
            tier: tier.name,
            addOns: addOns
              .filter((addOn) => addOnIds.includes(addOn.id))
              .map((addOn) => addOn.label),
            payment,
            oneOff: totals.oneOff,
            monthly: totals.monthly,
          },
          attribution: readAttribution(),
          elapsedMs: elapsedSince(startedAtRef.current),
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
          form_id: "quote",
          reason: data?.error ?? `http_${response.status}`,
        });
        return;
      }

      setStatus("success");
      track("generate_lead", {
        form_id: "quote",
        service: service.slug,
        tier: tier.name,
        payment,
        estimate_band: estimateBand(totals.oneOff),
      });
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong sending that. Please try again.");
      track("form_error", { form_id: "quote", reason: "network" });
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-start">
      {/* ── The questions ─────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <Step
          number="01"
          legend="What kind of business is it?"
          hint="Pick the closest — we'll tell you if a different line suits better."
        >
          <div className="grid gap-2 sm:grid-cols-2">
            {SERVICES.map((option) => (
              <Choice
                key={option.slug}
                name="docket-service"
                value={option.slug}
                checked={service?.slug === option.slug}
                onChange={() => chooseService(option)}
                title={option.shortName}
                note={option.valueProp}
              />
            ))}
          </div>
        </Step>

        {service && (
          <Step
            number="02"
            legend="How big is the job?"
            hint="Every tier is a fixed price for the scope beside it."
          >
            <div className="grid gap-2">
              {service.tiers.map((option) => (
                <Choice
                  key={option.name}
                  name="docket-tier"
                  value={option.name}
                  checked={tierName === option.name}
                  onChange={() => {
                    markStarted();
                    setTierName(option.name);
                  }}
                  title={option.name}
                  note={option.summary}
                  price={
                    option.price === null
                      ? "Quoted"
                      : formatAUD(option.price)
                  }
                />
              ))}
            </div>
          </Step>
        )}

        {service && tier && hasAddOnStep && (
          <Step
            number="03"
            legend="Anything else?"
            hint="Optional. Add or leave them — the estimate updates either way."
          >
            <div className="grid gap-2">
              {addOns.map((addOn) => (
                <Choice
                  key={addOn.id}
                  type="checkbox"
                  name="docket-addons"
                  value={addOn.id}
                  checked={addOnIds.includes(addOn.id)}
                  onChange={() => toggleAddOn(addOn.id)}
                  title={addOn.label}
                  note={addOn.note}
                  price={`+ ${formatAUD(addOn.price)}`}
                />
              ))}
            </div>
          </Step>
        )}

        {service && tier && (
          <Step
            number={hasAddOnStep ? "04" : "03"}
            legend="How would you rather pay?"
            hint="Both include the same build. You own it either way."
          >
            <div className="grid gap-2 sm:grid-cols-2">
              <Choice
                name="docket-payment"
                value="outright"
                checked={payment === "outright"}
                onChange={() => choosePayment("outright")}
                title="Outright"
                note="Half to start, half on launch."
              />
              <Choice
                name="docket-payment"
                value="monthly"
                checked={payment === "monthly"}
                onChange={() => choosePayment("monthly")}
                title="Monthly"
                note={`Nothing upfront, ${TERM_MONTHS} months minimum, care plan included.`}
              />
            </div>
          </Step>
        )}

        {/* Contact details appear only once the price is on screen. */}
        {locked && status !== "success" && (
          <Step
            number={hasAddOnStep ? "05" : "04"}
            legend="Where do we send the written quote?"
            hint="A written plan and fixed price within one business day. No charge, no obligation, no call unless you want one."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                id="docket-name"
                label="Your name"
                required
                autoComplete="name"
                value={contact.name}
                onChange={(value) => setContact({ ...contact, name: value })}
              />
              <Field
                id="docket-business"
                label="Business name"
                autoComplete="organization"
                value={contact.businessName}
                onChange={(value) =>
                  setContact({ ...contact, businessName: value })
                }
              />
              <Field
                id="docket-email"
                label="Email"
                type="email"
                required
                autoComplete="email"
                value={contact.email}
                onChange={(value) => setContact({ ...contact, email: value })}
              />
              <Field
                id="docket-phone"
                label="Phone"
                type="tel"
                autoComplete="tel"
                value={contact.phone}
                onChange={(value) => setContact({ ...contact, phone: value })}
              />
              <Field
                id="docket-suburb"
                label="Suburb"
                autoComplete="address-level2"
                value={contact.suburb}
                onChange={(value) => setContact({ ...contact, suburb: value })}
              />
            </div>

            <div className="mt-4 space-y-2">
              <label
                htmlFor="docket-details"
                className="ml-0.5 font-mono text-xs font-bold uppercase tracking-wide text-foreground"
              >
                Anything we should know?
              </label>
              <textarea
                id="docket-details"
                rows={4}
                value={contact.projectDetails}
                onChange={(e) =>
                  setContact({ ...contact, projectDetails: e.target.value })
                }
                className="field-input resize-none"
                placeholder="Deadlines, an existing site, whatever matters."
              />
            </div>

            {/* Honeypot — hidden from sight, assistive tech and the tab order. */}
            <div hidden aria-hidden="true">
              <label htmlFor="docket-company-website">
                Company website — leave this empty
              </label>
              <input
                id="docket-company-website"
                name="company_website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={contact.companyWebsite}
                onChange={(e) =>
                  setContact({ ...contact, companyWebsite: e.target.value })
                }
              />
            </div>

            {status === "error" && (
              <p
                role="alert"
                className="mt-4 border-2 border-destructive/50 bg-destructive/10 px-5 py-3 font-mono text-sm font-semibold text-destructive"
              >
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="btn-primary focus-ring mt-6 w-full justify-center disabled:opacity-60 sm:w-auto"
            >
              {status === "submitting" ? "Sending..." : "Issue this docket"}
            </button>
          </Step>
        )}
      </form>

      {/* ── The docket ────────────────────────────────────────────────────── */}
      <div className="lg:sticky lg:top-28">
        <div className="docket-sheet border-2 border-bitumen bg-paper shadow-e2">
          <div className="flex items-center justify-between gap-3 border-b-2 border-bitumen px-4 py-2.5 md:px-6">
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-foreground">
              Works Order · WAAI-Q
            </span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-foreground-subtle">
              Rev. A
            </span>
          </div>

          <DocketRow label="Business" value={service?.shortName} />
          <DocketRow
            label="Scope"
            value={tier?.name}
            amount={
              tier
                ? tier.price === null
                  ? "Quoted"
                  : formatAUD(tier.price)
                : undefined
            }
          />
          {hasAddOnStep && (
            <DocketRow
              label="Extras"
              value={
                addOnIds.length > 0
                  ? `${addOnIds.length} selected`
                  : service && tier
                    ? "None"
                    : undefined
              }
              amount={
                addOnIds.length > 0
                  ? `+ ${formatAUD(
                      addOns
                        .filter((a) => addOnIds.includes(a.id))
                        .reduce((sum, a) => sum + a.price, 0),
                    )}`
                  : undefined
              }
            />
          )}
          <DocketRow
            label="Terms"
            value={
              payment === "outright"
                ? "Outright"
                : payment === "monthly"
                  ? `Monthly · ${TERM_MONTHS} mo`
                  : undefined
            }
          />

          {/* The total sits on a hi-vis fill — the one place on the docket the
              signal colour is used, because it is the one number that matters. */}
          <div className="border-t-2 border-bitumen bg-hivis">
            <Estimate
              total={totals ? totals.oneOff : undefined}
              monthly={totals ? totals.monthly : undefined}
            />
          </div>

          <div className="flex min-h-[7rem] flex-col items-center justify-center gap-3 px-4 py-6">
            {locked ? (
              <StampPress>
                <span className="block text-sm font-bold tracking-widest">
                  Price Locked
                </span>
                <span className="mt-0.5 block text-[9px] tracking-[0.2em]">
                  Fixed · No surprises
                </span>
              </StampPress>
            ) : (
              <p className="max-w-[24ch] text-center font-mono text-[11px] uppercase leading-relaxed tracking-wider text-foreground-subtle">
                Answer the questions and the price fills itself in
              </p>
            )}
          </div>

          {locked && (
            <div className="border-t border-line px-4 py-3 text-center md:px-6">
              <button
                type="button"
                onClick={() => window.print()}
                className="focus-ring inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-source transition-colors hover:text-hivis-text"
              >
                <Printer className="h-3.5 w-3.5" />
                Print this docket
              </button>
            </div>
          )}
        </div>

        {status === "success" && (
          <div
            role="status"
            aria-live="polite"
            className="glass-card mt-6 p-6 text-center"
          >
            <h2 className="font-display text-display-3 font-extrabold uppercase text-foreground">
              Docket issued
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              We&apos;ve got it. Your written plan and fixed price will land
              within one business day.
            </p>
          </div>
        )}

        <p className="mt-4 font-mono text-[11px] leading-relaxed text-foreground-subtle">
          This is an estimate from the published rate card, not an invoice. The
          written quote confirms scope before anything starts.
        </p>
      </div>
    </div>
  );
}

/** One numbered step of the works order. */
function Step({
  number,
  legend,
  hint,
  children,
}: {
  number: string;
  legend: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border-2 border-bitumen bg-paper p-5 md:p-6">
      <legend className="ml-[-0.25rem] bg-hivis px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-hivis-ink">
        Step {number}
      </legend>
      <p className="font-display text-display-3 font-extrabold uppercase text-foreground">
        {legend}
      </p>
      <p className="mb-4 mt-1.5 text-sm leading-relaxed text-muted-foreground">
        {hint}
      </p>
      {children}
    </fieldset>
  );
}

/**
 * A radio or checkbox styled as a docket line.
 *
 * The input is visually hidden but still focusable and still in the tab and
 * arrow-key order — `peer` drives the visible row's state. Replacing it with a
 * button would mean rebuilding group semantics by hand.
 */
function Choice({
  type = "radio",
  name,
  value,
  checked,
  onChange,
  title,
  note,
  price,
}: {
  type?: "radio" | "checkbox";
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  title: string;
  note: string;
  price?: string;
}) {
  const id = `${name}-${value}`;

  return (
    <div className="relative">
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <label
        htmlFor={id}
        className="flex cursor-pointer items-start gap-3 border-2 border-line-strong bg-input-bg px-4 py-3 transition-colors hover:border-hivis peer-checked:border-hivis peer-checked:bg-hivis/10 peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-source peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background"
      >
        <span
          aria-hidden="true"
          className={`mt-1 h-3 w-3 shrink-0 border-2 border-bitumen ${
            type === "checkbox" ? "" : "rounded-full"
          } ${checked ? "bg-hivis" : "bg-transparent"}`}
        />
        <span className="min-w-0 flex-1">
          <span className="block font-display text-base font-extrabold uppercase leading-tight tracking-tight text-foreground">
            {title}
          </span>
          <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
            {note}
          </span>
        </span>
        {price && (
          <span className="shrink-0 font-mono text-sm font-bold tabular-nums text-foreground">
            {price}
          </span>
        )}
      </label>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  required,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="ml-0.5 font-mono text-xs font-bold uppercase tracking-wide text-foreground"
      >
        {label}
        {!required && (
          <span className="ml-1 font-normal text-foreground-subtle">
            (optional)
          </span>
        )}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field-input"
      />
    </div>
  );
}
