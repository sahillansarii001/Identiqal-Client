"use client";

import React from "react";
import { Check, Star } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection.jsx";
import { useSafeReducedMotion } from "@/hooks/useSafeReducedMotion.js";

const plans = [
  {
    name: "Free Starter",
    price: "$0",
    description: "Ideal for individual networking starters.",
    features: [
      "1 Active Digital Business Card",
      "Standard Layout Section Blocks",
      "Basic Colors and Layout Settings",
      "Standard Performance Analytics",
    ],
    buttonText: "Sign Up Free",
    href: "/signup",
    featured: false,
  },
  {
    name: "Professional Pro",
    price: "$9",
    period: "/mo",
    description: "Elevate your professional brand visibility.",
    features: [
      "Unlimited Active Digital Cards",
      "AI Smart Intro Writer Assistant",
      "AI suggestions & completeness review",
      "Deep Analytics Dashboards (clicks, location)",
      "Export captured inquiry leads to CSV",
      "Download high-res dynamic vector QRs",
    ],
    buttonText: "Get Started Pro",
    href: "/signup?tier=pro",
    featured: true,
  },
  {
    name: "Enterprise Business",
    price: "$29",
    period: "/mo",
    description: "Empower your teams and organization workspaces.",
    features: [
      "Includes 10 Admin Member Seats",
      "Corporate Theme Style Locking controls",
      "Aggregated Corporate Team Analytics",
      "Workspace Member Invitation access",
      "Dedicated SLA Premium support agent",
    ],
    buttonText: "Start Business Plan",
    href: "/signup?tier=business",
    featured: false,
  },
];

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

export const PricingTeaser = () => {
  const shouldReduceMotion = useSafeReducedMotion();

  return (
    <section
      id="pricing"
      className="py-24 bg-brand-bg border-t border-primary/5 scroll-mt-16 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="blob-1 absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-accent/4 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent/10 text-xs font-semibold text-accent tracking-wider uppercase">
            <span>Plans & Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-text">
            Simple, Transparent Pricing
          </h2>
          <p className="text-brand-secondary text-base leading-relaxed">
            Choose the subscription plan that fits your personal requirements or
            company workspace.
          </p>
        </AnimatedSection>

        {/* Cards */}
        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto"
        >
          {plans.map((plan, index) => {
            const isPro = plan.featured;
            return (
              <motion.div
                key={index}
                variants={
                  shouldReduceMotion
                    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
                    : cardVariants
                }
                animate={isPro && !shouldReduceMotion ? { y: [0, -5, 0] } : {}}
                transition={
                  isPro && !shouldReduceMotion
                    ? { repeat: Infinity, duration: 6, ease: "easeInOut" }
                    : {}
                }
                whileHover={
                  shouldReduceMotion
                    ? {}
                    : {
                        y: isPro ? -10 : -7,
                        scale: 1.02,
                        boxShadow: isPro
                          ? "0 28px 60px -12px rgba(184, 138, 68, 0.22)"
                          : "0 24px 52px -12px rgba(74, 44, 58, 0.12)",
                      }
                }
                className={`flex flex-col border rounded-[28px] p-8 relative transition-colors duration-300 bg-white/65 backdrop-blur-md cursor-pointer ${
                  isPro
                    ? "border-accent border-2 shadow-[0_20px_50px_-10px_rgba(184,138,68,0.18)] z-10"
                    : "border-primary/6"
                }`}
              >
                {/* Gradient glow on hover */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`absolute inset-0 rounded-[28px] pointer-events-none ${
                    isPro
                      ? "bg-linear-to-br from-accent/6 to-transparent"
                      : "bg-linear-to-br from-primary/3 to-transparent"
                  }`}
                />

                {/* Popular badge */}
                {isPro && (
                  <motion.span
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 22,
                      delay: 0.3,
                    }}
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-accent rounded-full text-[9px] font-bold text-brand-bg uppercase tracking-wider shadow-md shadow-accent/25 flex items-center space-x-1"
                  >
                    <Star size={8} fill="currentColor" />
                    <span>Most Popular</span>
                  </motion.span>
                )}

                <div className="mb-6 text-left relative z-10">
                  <h3 className="text-lg font-bold text-brand-text mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline space-x-1 mb-3">
                    <span className="text-4xl font-black text-brand-text">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-xs text-brand-secondary font-semibold">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-brand-secondary leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                <div className="flex-1 space-y-3.5 mb-8 border-t border-primary/5 pt-6 text-left relative z-10">
                  {plan.features.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: 0.2 + i * 0.05,
                        duration: 0.4,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="flex items-start space-x-2.5 text-xs text-brand-secondary"
                    >
                      <Check
                        size={14}
                        className="text-accent shrink-0 mt-0.5"
                        strokeWidth={3}
                      />
                      <span className="leading-normal">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                <Link href={plan.href} className="w-full mt-auto relative z-10">
                  <motion.button
                    whileHover={
                      shouldReduceMotion
                        ? {}
                        : {
                            scale: 1.03,
                            y: -2,
                            boxShadow: isPro
                              ? "0 8px 24px rgba(74, 44, 58, 0.24)"
                              : "0 6px 16px rgba(74, 44, 58, 0.10)",
                          }
                    }
                    whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold transition-colors duration-300 border ${
                      isPro
                        ? "bg-primary text-white border-primary hover:bg-[#3d2430] shadow-md shadow-primary/12"
                        : "bg-white text-primary border-primary/10 hover:border-primary/30 hover:bg-brand-bg"
                    }`}
                  >
                    {plan.buttonText}
                  </motion.button>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
