"use client";

import React from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection.jsx";
import { useSafeReducedMotion } from "@/hooks/useSafeReducedMotion.js";

const reviews = [
  {
    name: "Sarah Connor",
    role: "CEO, Skynet Logistics",
    quote:
      "Identiqal completely changed how our sales team presents itself. Sharing our credentials and calendar scheduler is now down to one tap.",
    initials: "SC",
  },
  {
    name: "Marcus Wright",
    role: "Founder, Project Apex",
    quote:
      "The AI Smart Introduction drafted a bio better than what I spent days writing myself. Absolute game changer for early-stage startup pitching.",
    initials: "MW",
  },
  {
    name: "Elena Rostova",
    role: "Creative Director, NeoDesign",
    quote:
      "The Luxury Gold theme fits our high-end agency branding rules flawlessly. The real-time visitor analytics are deeply insightful.",
    initials: "ER",
  },
  {
    name: "David Vance",
    role: "VP Marketing, CloudCore",
    quote:
      "We print dynamic QR codes on our corporate booths. Collecting leads directly into our dashboard csv is seamless.",
    initials: "DV",
  },
  {
    name: "Maya Lin",
    role: "Independent Architect",
    quote:
      "I love the minimalist aesthetic. It feels elegant, loads instantly, and holds all my portfolio link folders without looking cluttered.",
    initials: "ML",
  },
];

// Keep original list — we render it twice for a seamless -50% loop

export const Testimonials = () => {
  const shouldReduceMotion = useSafeReducedMotion();

  return (
    <section className="py-24 bg-brand-bg border-t border-primary/5 overflow-hidden relative">
      <AnimatedSection className="max-w-7xl mx-auto px-6 mb-16 text-center space-y-4">
        <motion.div
          animate={shouldReduceMotion ? {} : { scale: [1, 1.025, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent/10 text-xs font-semibold text-accent tracking-wider uppercase"
        >
          <span>Social Proof</span>
        </motion.div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-text">
          Loved by Industry Professionals
        </h2>
        <p className="text-brand-secondary text-base max-w-2xl mx-auto">
          Hear from founders, designers, and sales leaders who replaced paper
          cards with Identiqal smart digital profiles.
        </p>
      </AnimatedSection>

      {/* Marquee — two identical halves; translateX(-50%) lands perfectly at seam */}
      <div className="relative w-full overflow-hidden flex items-stretch select-none mask-fade group h-[260px]">
        <div
          className={`flex items-stretch w-max py-2 ${shouldReduceMotion ? "" : "animate-marquee group-hover:[animation-play-state:paused]"}`}
        >
          {/* First copy */}
          {reviews.map((review, index) => (
            <motion.div
              key={`a-${index}`}
              whileHover={
                shouldReduceMotion
                  ? {}
                  : {
                      scale: 1.02,
                      boxShadow: "0 20px 40px -12px rgba(30, 64, 175, 0.12)",
                    }
              }
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className="group/card bg-white/55 border border-primary/6 backdrop-blur-md p-6 rounded-2xl mx-3 w-[220px] sm:w-[280px] md:w-[320px] shrink-0 h-full flex flex-col justify-between cursor-default relative overflow-hidden"
            >
              {/* Border glow on hover */}
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{ boxShadow: "inset 0 0 0 1px rgba(184,138,68,0.2)" }}
              />

              <div className="space-y-3">
                <div className="flex space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: 0.02 * i,
                        type: "spring",
                        stiffness: 600,
                        damping: 14,
                      }}
                    >
                      <Star size={13} fill="#2563EB" className="text-accent" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-brand-secondary text-sm leading-relaxed line-clamp-4">
                  {review.quote}
                </p>
              </div>

              <div className="flex items-center space-x-3 mt-4">
                <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {review.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-text">{review.name}</p>
                  <p className="text-xs text-brand-secondary">{review.title}</p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Second copy — aria-hidden for screen readers */}
          {reviews.map((review, index) => (
            <motion.div
              key={`b-${index}`}
              aria-hidden="true"
              whileHover={
                shouldReduceMotion
                  ? {}
                  : {
                      scale: 1.02,
                      boxShadow: "0 20px 40px -12px rgba(30, 64, 175, 0.12)",
                    }
              }
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className="group/card bg-white/55 border border-primary/6 backdrop-blur-md p-6 rounded-2xl mx-3 w-[220px] sm:w-[280px] md:w-[320px] shrink-0 h-full flex flex-col justify-between cursor-default relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{ boxShadow: "inset 0 0 0 1px rgba(184,138,68,0.2)" }}
              />

              <div className="space-y-3">
                <div className="flex space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} fill="#2563EB" className="text-accent" />
                  ))}
                </div>
                <p className="text-brand-secondary text-sm leading-relaxed line-clamp-4">
                  {review.quote}
                </p>
              </div>

              <div className="flex items-center space-x-3 mt-4">
                <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {review.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-text">{review.name}</p>
                  <p className="text-xs text-brand-secondary">{review.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
