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
      className="group relative p-8 bg-white/60 backdrop-blur-xl border border-white/40 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] hover:shadow-[0_48px_80px_-20px_rgba(14,165,233,0.15)] transition-all duration-500 hover:-translate-y-2 overflow-hidden"
    >
      {/* Decorative inner glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Icon Container: Uses a soft sky-blue tint */}
      <div className="relative w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600 mb-8 group-hover:scale-110 group-hover:bg-sky-100 transition-all duration-300">
        {icon}
      </div>

      <div className="relative">
        <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">
          {title}
        </h3>
        <p className="text-slate-600 leading-relaxed text-sm font-medium">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
