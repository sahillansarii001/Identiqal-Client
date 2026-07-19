"use client";

import React from "react";
import {
  ShieldCheck,
  Command,
  Compass,
  Cpu,
  Layers,
  Disc,
  Database,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection.jsx";
import { useSafeReducedMotion } from "@/hooks/useSafeReducedMotion.js";

const brandLogos = [
  { name: "Linear", icon: Command },
  { name: "Vercel", icon: Layers },
  { name: "Stripe", icon: Compass },
  { name: "Framer", icon: Cpu },
  { name: "Notion", icon: Database },
  { name: "Retool", icon: Disc },
  { name: "Sentry", icon: Award },
  { name: "Supabase", icon: ShieldCheck },
];

const scrollList = [...brandLogos, ...brandLogos, ...brandLogos, ...brandLogos];

export const LogoStrip = () => {
  const shouldReduceMotion = useSafeReducedMotion();

  return (
    <AnimatedSection>
      <div className="py-12 bg-brand-bg border-y border-primary/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-6 text-center">
          <p className="text-xs font-semibold text-brand-secondary tracking-wider uppercase">
            Trusted by professionals, creators and businesses worldwide
          </p>
        </div>

        {/* Scrolling strip */}
        <div className="relative w-full overflow-hidden flex items-center select-none mask-fade group">
          <div
            className={`flex space-x-16 min-w-full ${shouldReduceMotion ? "" : "animate-marquee group-hover:[animation-play-state:paused]"}`}
          >
            {scrollList.map((logo, index) => {
              const Icon = logo.icon;
              const isGold = index % 3 === 1;
              return (
                <motion.div
                  key={index}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.08, y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className="flex items-center space-x-2 text-primary/60 hover:text-primary transition-colors duration-200 cursor-default"
                >
                  <Icon size={18} color={isGold ? "#2563EB" : "#1E40AF"} />
                  <span className="font-sans font-bold text-sm tracking-tight text-brand-text">
                    {logo.name}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

