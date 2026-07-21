"use client";

import React, { useEffect, useRef, useState } from "react";
import { Check, Star, Zap } from "lucide-react";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection.jsx";
import { useSafeReducedMotion } from "@/hooks/useSafeReducedMotion.js";

const plans = [
  {
    name: "Free Starter",
    price: 0,
    priceLabel: "$0",
    period: "",
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
    price: 9,
    priceLabel: "$9",
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
    price: 29,
    priceLabel: "$29",
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

/* ── Animated price counter ─────────────────────────────────── */
function AnimatedPrice({ target, label, period, inView, reduced }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || reduced || target === 0) {
      setDisplay(target);
      return;
    }
    let start = null;
    const duration = 700;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, reduced]);

  return (
    <div className="flex items-baseline space-x-1 mb-3">
      <span className="text-4xl font-black text-brand-text">
        {target === 0 ? label : `$${display}`}
      </span>
      {period && (
        <span className="text-xs text-brand-secondary font-semibold">{period}</span>
      )}
    </div>
  );
}

/* ── Spotlight glow that tracks mouse inside card ───────────── */
function SpotlightCard({ children, className, isPro }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative ${className}`}
      style={{ overflow: "hidden" }}
    >
      {/* Spotlight */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[28px] transition-opacity duration-300"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(260px circle at ${pos.x}px ${pos.y}px, ${
            isPro ? "rgba(184,138,68,0.10)" : "rgba(37,99,235,0.07)"
          }, transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
}

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export const PricingTeaser = () => {
  const shouldReduceMotion = useSafeReducedMotion();
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="py-24 bg-brand-bg border-t border-primary/5 scroll-mt-16 relative overflow-hidden"
    >
      {/* Background blob */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          className="blob-1 absolute top-1/3 left-1/3 w-[500px] h-[500px] rounded-full bg-accent/4 blur-[110px]"
          animate={shouldReduceMotion ? {} : { scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <motion.div
            animate={shouldReduceMotion ? {} : { scale: [1, 1.025, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent/10 text-xs font-semibold text-accent tracking-wider uppercase"
          >
            <Zap size={11} className="fill-accent" />
            <span>Plans &amp; Pricing</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-text">
            Simple, Transparent Pricing
          </h2>
          <p className="text-brand-secondary text-base leading-relaxed">
            Choose the subscription plan that fits your personal requirements or
            company workspace.
          </p>
        </AnimatedSection>

        {/* Cards grid */}
        <motion.div
          variants={gridVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto"
        >
          {plans.map((plan, index) => {
            const isPro = plan.featured;
            return (
              <motion.div
                key={index}
                variants={shouldReduceMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : cardVariants}
                animate={isPro && !shouldReduceMotion ? { y: [0, -5, 0] } : {}}
                transition={isPro && !shouldReduceMotion ? { repeat: Infinity, duration: 6, ease: "easeInOut" } : {}}
                whileHover={shouldReduceMotion ? {} : {
                  y: isPro ? -10 : -7,
                  scale: 1.02,
                  boxShadow: isPro
                    ? "0 32px 64px -12px rgba(184,138,68,0.24)"
                    : "0 28px 56px -12px rgba(30,64,175,0.13)",
                }}
                className={`flex flex-col border rounded-[28px] relative transition-colors duration-300 bg-white/65 backdrop-blur-md cursor-pointer ${
                  isPro
                    ? "border-accent border-2 shadow-[0_20px_50px_-10px_rgba(184,138,68,0.18)] z-10"
                    : "border-primary/6"
                }`}
              >
                <SpotlightCard className="flex flex-col h-full p-8" isPro={isPro}>

                  {/* Popular badge with shimmer */}
                  {isPro && (
                    <motion.span
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.4 }}
                      className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-accent rounded-full text-[9px] font-bold text-brand-bg uppercase tracking-wider shadow-md shadow-accent/25 flex items-center space-x-1 overflow-hidden"
                    >
                      {/* Shimmer sweep */}
                      <motion.span
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                        animate={{ x: ["-150%", "200%"] }}
                        transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
                      />
                      <Star size={8} fill="currentColor" />
                      <span>Most Popular</span>
                    </motion.span>
                  )}

                  {/* Plan header */}
                  <div className="mb-6 text-left relative z-10">
                    <h3 className="text-lg font-bold text-brand-text mb-2">{plan.name}</h3>
                    <AnimatedPrice
                      target={plan.price}
                      label={plan.priceLabel}
                      period={plan.period}
                      inView={inView}
                      reduced={shouldReduceMotion}
                    />
                    <p className="text-xs text-brand-secondary leading-relaxed">{plan.description}</p>
                  </div>

                  {/* Animated divider */}
                  <motion.div
                    className="h-px bg-primary/5 mb-6"
                    initial={{ scaleX: 0 }}
                    animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ delay: 0.3 + index * 0.13, duration: 0.5, ease: "easeOut" }}
                    style={{ originX: 0 }}
                  />

                  {/* Features with stagger */}
                  <div className="flex-1 space-y-3.5 mb-8 text-left relative z-10">
                    {plan.features.map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -14 }}
                        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -14 }}
                        transition={{
                          delay: 0.4 + index * 0.13 + i * 0.06,
                          type: "spring",
                          stiffness: 280,
                          damping: 22,
                        }}
                        className="flex items-start space-x-2.5 text-xs text-brand-secondary"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={inView ? { scale: 1 } : { scale: 0 }}
                          transition={{
                            delay: 0.45 + index * 0.13 + i * 0.06,
                            type: "spring",
                            stiffness: 400,
                            damping: 18,
                          }}
                        >
                          <Check size={14} className="text-accent shrink-0 mt-0.5" strokeWidth={3} />
                        </motion.div>
                        <span className="leading-normal">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA button */}
                  <Link href={plan.href} className="w-full mt-auto relative z-10">
                    <motion.button
                      whileHover={shouldReduceMotion ? {} : {
                        scale: 1.04,
                        y: -2,
                        boxShadow: isPro
                          ? "0 10px 28px rgba(30,64,175,0.28)"
                          : "0 8px 20px rgba(30,64,175,0.12)",
                      }}
                      whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 420, damping: 22 }}
                      className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold transition-colors duration-300 border ${
                        isPro
                          ? "bg-primary text-white border-primary hover:bg-[#3d2430] shadow-md shadow-primary/12"
                          : "bg-white text-primary border-primary/10 hover:border-primary/30 hover:bg-brand-bg"
                      }`}
                    >
                      {plan.buttonText}
                    </motion.button>
                  </Link>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
