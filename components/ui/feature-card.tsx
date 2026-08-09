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
      // Styling: Glass effect with white/60 opacity and heavy blur.
      // Hover: Shifts up slightly and adds a subtle horizon-sky glow.
      className="group relative p-8 bg-[linear-gradient(145deg,#1a2133,#111725)] border border-border rounded-[2.5rem] shadow-e1 hover:shadow-e2 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
    >
      {/* Decorative inner glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Icon Container: Uses a soft sky-blue tint */}
      <div className="relative w-14 h-14 bg-cyber-cyan/10 rounded-2xl flex items-center justify-center text-cyber-cyan-soft mb-8 group-hover:scale-110 group-hover:bg-cyber-cyan/20 transition-all duration-300">
        {icon}
      </div>

      <div className="relative">
        <h3 className="text-xl font-black text-foreground mb-4 tracking-tight">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed text-sm font-medium">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
