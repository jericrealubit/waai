"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Factory, HardHat, ShoppingBag, Utensils } from "lucide-react";

import { formatFromPrice, type Service, type ServiceIcon } from "@/lib/content/services";

/** Keeps lucide components out of the data file so it stays a plain .ts module. */
const ICONS: Record<ServiceIcon, React.ComponentType<{ className?: string }>> = {
  hardhat: HardHat,
  utensils: Utensils,
  factory: Factory,
  "shopping-bag": ShoppingBag,
};

interface ServiceCardProps {
  service: Service;
  /** Drives the stagger delay, matching components/ui/feature-card.tsx. */
  index: number;
}

/**
 * Low-density card for the services grid: the offering is conceptual, so this
 * card carries an icon, a one-line value prop and a price — no imagery.
 * Case studies use components/case-study-card.tsx instead, which is much denser.
 */
export function ServiceCard({ service, index }: ServiceCardProps) {
  const Icon = ICONS[service.icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        href={`/services/${service.slug}`}
        className="group glass-card glass-card-interactive relative flex h-full flex-col overflow-hidden p-8 focus-visible:ring-3 focus-visible:ring-sky-500/50 focus-visible:outline-none"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-400/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="relative mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-sky-100">
          <Icon className="h-6 w-6" />
        </div>

        <div className="relative flex flex-1 flex-col">
          <h3 className="mb-4 text-xl font-black tracking-tight text-slate-900">
            {service.name}
          </h3>
          <p className="mb-8 text-sm font-medium leading-relaxed text-slate-600">
            {service.valueProp}
          </p>

          <div className="mt-auto flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900">
              {formatFromPrice(service)}
            </span>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-sky-600">
              Explore
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
