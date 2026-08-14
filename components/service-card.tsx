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
        className="group glass-card glass-card-interactive relative flex h-full flex-col p-8 focus-ring"
      >
        <div className="mb-8 flex h-14 w-14 items-center justify-center bg-hivis/10 text-hivis transition-transform duration-300 group-hover:scale-110">
          <Icon className="h-6 w-6" />
        </div>

        <div className="flex flex-1 flex-col">
          <h3 className="mb-4 font-display text-2xl font-extrabold uppercase tracking-tight text-foreground">
            {service.name}
          </h3>
          <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
            {service.valueProp}
          </p>

          <div className="mt-auto flex items-center justify-between">
            <span className="font-mono text-sm font-bold tabular-nums text-foreground">
              {formatFromPrice(service)}
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-wide text-source transition-colors group-hover:text-hivis-text">
              Explore
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
