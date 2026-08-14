"use client";

import { motion } from "framer-motion";

import { Section } from "@/components/ui/section";

const STEPS = [
  {
    step: "01",
    title: "Work out what actually converts",
    body: "A panel beater and a bricklayer need opposite things — one needs the phone number everywhere, the other needs a quote form that captures the suburb. We decide that before designing anything.",
  },
  {
    step: "02",
    title: "Build the content model first",
    body: "Services, menu items, products and log entries go into typed content files or a database — never hardcoded into a page. That's what makes the site cheap to change later.",
  },
  {
    step: "03",
    title: "Ship it somewhere fast and cheap",
    body: "Static export or edge hosting on Cloudflare, Netlify or Vercel, with deploys running from a push to main. No server to babysit unless the project genuinely needs one.",
  },
  {
    step: "04",
    title: "Hand over something you can run",
    body: "You get the repository, the deploy pipeline and a content model you or your staff can edit. If you'd rather we kept looking after it, that's the retainer.",
  },
];

export default function Process() {
  return (
    <Section
      id="process"
      label="How we work"
      heading="The build sequence"
      description="The same four steps on a four-page brochure site and on a factory-floor logging system."
    >
      <div className="grid grid-cols-1 border-2 border-bitumen bg-paper md:grid-cols-2">
        {STEPS.map((item, index) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="border-b border-line px-6 py-7 last:border-b-0 md:odd:border-r md:odd:border-line md:[&:nth-child(3)]:border-b-0 md:[&:nth-child(4)]:border-b-0"
          >
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-hivis-text">
              Step {item.step}
            </span>
            <h3 className="mb-2.5 mt-2 font-display text-2xl font-extrabold uppercase leading-none tracking-tight text-foreground">
              {item.title}
            </h3>
            <p className="max-w-[46ch] text-sm leading-relaxed text-muted-foreground">
              {item.body}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
