"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  index: number;
}

export function FeatureCard({
  title,
  description,
  icon,
  index,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      // Site Notice spec panel — concrete stock in an ink frame, hi-vis icon.
      className="group glass-card glass-card-interactive p-8"
    >
      <div className="mb-8 flex h-14 w-14 items-center justify-center bg-hivis/10 text-hivis transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>

      <div>
        <h3 className="mb-4 font-display text-2xl font-extrabold uppercase tracking-tight text-foreground">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
