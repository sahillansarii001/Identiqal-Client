"use client";

import React from "react";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection.jsx";
import { useSafeReducedMotion } from "@/hooks/useSafeReducedMotion.js";

const comparisonRows = [
  {
    feature: "Editable",
    traditional: "No (requires reprinting)",
    identiqal: "⚡ Instant (edit from dashboard)",
  },
  {
    feature: "Visitor Analytics",
    traditional: "Zero (no trackability)",
    identiqal: "📈 Deep (clicks, geolocation, devices)",
  },
  {
    feature: "Lead Collection",
    traditional: "Manual (collect paper forms)",
    identiqal: "📬 Automated (embedded inquiry forms)",
  },
  {
    feature: "QR Sharing",
    traditional: "None (static printed if any)",
    identiqal: "📲 Dynamic (redirectable QR codes)",
  },
  {
    feature: "AI Support",
    traditional: "None",
    identiqal: "🤖 AI Bio introductions & tips",
  },
  {
    feature: "Always Updated",
    traditional: "Outdated on job change",
    identiqal: "✨ Real-time sync on save",
  },
  {
    feature: "Information Capacity",
    traditional: "Limited card dimensions",
    identiqal: "🌐 Unlimited blocks, portfolios & files",
  },
];

const rowVariants = {
  hidden: { opacity: 0, x: -12, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const tableVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
};

export const ProblemFraming = () => {
  const shouldReduceMotion = useSafeReducedMotion();

  return (
    <section
      id="about"
      className="py-24 bg-brand-bg border-t border-primary/5 scroll-mt-16 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent/10 text-xs font-semibold text-accent tracking-wider uppercase">
            <span>Comparison Table</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-text">
            Why Switch to Identiqal?
          </h2>
          <p className="text-brand-secondary text-base leading-relaxed">
            See how traditional paper business cards compare to our dynamic,
            AI-powered smart digital profiles.
          </p>
        </AnimatedSection>

        {/* Table */}
        <AnimatedSection delay={0.1} className="max-w-5xl mx-auto">
          <div className="rounded-2xl border border-primary/6 shadow-lg bg-white/50 backdrop-blur-md overflow-hidden">
            <div className="hidden sm:grid sm:grid-cols-3 border-b border-primary/6 bg-primary/4 text-primary font-bold text-xs uppercase tracking-wider">
              <div className="p-6">Feature / Ability</div>
              <div className="p-6">Traditional Card</div>
              <div className="p-6 bg-primary/4">Identiqal Profile</div>
            </div>
            
            <div className="flex flex-col divide-y divide-primary/5">
                {comparisonRows.map((row, index) => (
                  <motion.div
                    key={index}
                    variants={
                      shouldReduceMotion
                        ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
                        : rowVariants
                    }
                    whileHover={
                      shouldReduceMotion
                        ? {}
                        : { backgroundColor: "rgba(30, 64, 175, 0.025)" }
                    }
                    className="grid grid-cols-1 sm:grid-cols-3 transition-colors duration-200"
                  >
                    <div className="p-4 sm:p-6 font-bold text-brand-text bg-slate-50/50 sm:bg-transparent border-b border-primary/5 sm:border-b-0 flex items-center">
                      {row.feature}
                    </div>
                    <div className="p-4 sm:p-6 text-brand-secondary font-medium">
                      <div className="text-[10px] uppercase font-bold text-slate-400 mb-2 sm:hidden tracking-wider">Traditional Card</div>
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                          <X size={12} />
                        </span>
                        <span>{row.traditional}</span>
                      </div>
                    </div>
                    <div className="p-4 sm:p-6 text-brand-text font-semibold bg-primary/3">
                      <div className="text-[10px] uppercase font-bold text-primary mb-2 sm:hidden tracking-wider">Identiqal Profile</div>
                      <div className="flex items-center space-x-2">
                        <motion.span
                          whileHover={
                            shouldReduceMotion ? {} : { scale: 1.2, rotate: 10 }
                          }
                          transition={{ type: "spring", stiffness: 400 }}
                          className="w-5 h-5 rounded-full bg-accent/15 flex items-center justify-center text-accent shrink-0"
                        >
                          <Check size={12} strokeWidth={3} />
                        </motion.span>
                        <span>{row.identiqal}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

