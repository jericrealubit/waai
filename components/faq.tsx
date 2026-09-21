"use client";

import { Accordion } from "radix-ui";
import { Plus } from "lucide-react";

import type { Faq } from "@/lib/content/faqs";

/**
 * The FAQ disclosure list.
 *
 * Built on Radix's Accordion, which was already a dependency — `radix-ui` is
 * installed and only `Slot` was ever imported from it, so every primitive in
 * the package was sitting there unused. Using it here costs nothing new and
 * brings correct keyboard handling, `aria-expanded`/`aria-controls` wiring and
 * focus management, all of which are easy to get subtly wrong by hand.
 *
 * `type="multiple"` on purpose: someone comparing "do I own it" against "what
 * if I pay monthly" should be able to have both open at once.
 *
 * Styled as rows on a spec sheet rather than cards — hard rules, mono question
 * numbers, the plus rotating to a minus.
 */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <Accordion.Root
      type="multiple"
      className="border-2 border-bitumen bg-paper"
    >
      {faqs.map((faq, index) => (
        <Accordion.Item
          key={faq.question}
          value={faq.question}
          className="border-b border-line last:border-b-0"
        >
          <Accordion.Header>
            <Accordion.Trigger className="focus-ring group flex w-full items-start gap-4 px-5 py-5 text-left transition-colors hover:bg-hivis/5 md:px-7">
              <span className="mt-0.5 font-mono text-[11px] font-bold tabular-nums text-foreground-subtle">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 font-display text-lg font-extrabold uppercase leading-tight tracking-tight text-foreground group-hover:text-hivis-text">
                {faq.question}
              </span>
              <Plus
                aria-hidden="true"
                className="mt-0.5 h-5 w-5 shrink-0 text-hivis transition-transform duration-200 group-data-[state=open]:rotate-45"
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="accordion-panel overflow-hidden">
            <p className="px-5 pb-6 pl-[3.6rem] text-sm leading-[1.7] text-muted-foreground md:px-7 md:pl-[4.4rem]">
              {faq.answer}
            </p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
