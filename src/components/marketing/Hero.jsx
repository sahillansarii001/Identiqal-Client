"use client";

import React, { useRef, useCallback } from "react";
import Link from "next/link";
import {
  Sparkles,
  Play,
  Check,
  QrCode,
  TrendingUp,
  Sparkle,
  MessageSquare,
  UserCheck,
  ShieldCheck,
} from "lucide-react";
import { useSafeReducedMotion } from "@/hooks/useSafeReducedMotion.js";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// ─── Word-by-word split helper ─────────────────────────────────────────────────
function WordReveal({ text, className, staggerDelay = 0 }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: {
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
                delay: staggerDelay + i * 0.04,
              },
            },
          }}
          className="inline-block mr-[0.28em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

// ─── Floating gradient blob ────────────────────────────────────────────────────
function GradientBlob({ className }) {
  return (
    <div
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{ filter: "blur(80px)", willChange: "transform" }}
    />
  );
}

// ─── Floating widget card ──────────────────────────────────────────────────────
function FloatingWidget({ children, animate, transition, className }) {
  return (
    <motion.div
      animate={animate}
      transition={{
        ...transition,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      }}
      className={`absolute bg-white/95 backdrop-blur-md border border-primary/8 shadow-xl rounded-xl z-30 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export const Hero = () => {
  const shouldReduceMotion = useSafeReducedMotion();
  const containerRef = useRef(null);

  // ─── Mouse-tracking 3D tilt ──────────────────────────────────────────────────
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), {
    stiffness: 150,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), {
    stiffness: 150,
    damping: 30,
  });

  const handleMouseMove = useCallback(
    (e) => {
      if (shouldReduceMotion) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
      mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [shouldReduceMotion, mouseX, mouseY],
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  // ─── Stagger container ───────────────────────────────────────────────────────
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: shouldReduceMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 20, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative min-h-screen pt-28 pb-20 overflow-hidden bg-brand-bg flex items-center">
      {/* ── Animated gradient blobs ──────────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <GradientBlob className="blob-1 -top-40 -left-32 w-[640px] h-[640px] bg-primary/6 opacity-70" />
        <GradientBlob className="blob-2 top-1/4 -right-24 w-[520px] h-[520px] bg-accent/8 opacity-60" />
        <GradientBlob className="blob-3 -bottom-20 left-1/3 w-[480px] h-[480px] bg-primary/4 opacity-50" />

        {/* Fine grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4a2c3a04_1px,transparent_1px),linear-gradient(to_bottom,#4a2c3a04_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* ── LEFT: Copy & CTA ─────────────────────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-6 text-left space-y-8"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-primary/6 border border-primary/12 text-xs font-semibold text-primary"
          >
            <motion.div
              animate={shouldReduceMotion ? {} : { scale: [1, 1.18, 1] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Sparkles size={13} className="text-accent" />
            </motion.div>
            <span>Presenting the Future of Networking</span>
          </motion.div>

          {/* Heading — word-by-word reveal */}
          <motion.h1
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-text leading-[1.1] font-sans"
          >
            <WordReveal text="Your Identity." staggerDelay={0.1} />
            <br />
            <span className="animated-gradient-text block mt-1">
              <WordReveal
                text="Smarter Than a Business Card."
                staggerDelay={0.28}
              />
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-brand-secondary leading-relaxed max-w-xl"
          >
            Create beautiful digital profiles, share them instantly, collect
            leads, analyze visitors, and let AI help you make the perfect first
            impression.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4"
          >
            <Link href="/signup" className="w-full sm:w-auto">
              <motion.button
                whileHover={
                  shouldReduceMotion
                    ? {}
                    : {
                        scale: 1.04,
                        y: -3,
                        boxShadow: "0 16px 40px rgba(74, 44, 58, 0.28)",
                      }
                }
                whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="relative group overflow-hidden bg-primary text-brand-bg font-semibold px-8 py-4 rounded-xl border border-primary text-center w-full"
              >
                <span className="absolute inset-0 bg-linear-to-r from-accent to-[#C89B5B] translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-xl" />
                <span className="relative z-10">Create Your Card</span>
              </motion.button>
            </Link>

            <motion.button
              whileHover={
                shouldReduceMotion
                  ? {}
                  : {
                      scale: 1.04,
                      y: -3,
                      boxShadow: "0 8px 32px rgba(74, 44, 58, 0.10)",
                    }
              }
              whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-xl border border-primary/12 bg-white/60 backdrop-blur-sm text-primary font-semibold hover:bg-white hover:border-primary/22 transition-colors duration-300 group w-full sm:w-auto"
            >
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.2, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Play
                  size={15}
                  fill="currentColor"
                  className="text-accent"
                />
              </motion.div>
              <span>Watch Demo</span>
            </motion.button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            variants={itemVariants}
            className="pt-4 border-t border-primary/6 flex flex-wrap gap-x-8 gap-y-3"
          >
            {["Free Forever", "No Coding Required", "QR Sharing"].map(
              (badge, i) => (
                <motion.div
                  key={badge}
                  whileHover={shouldReduceMotion ? {} : { x: 2 }}
                  className="flex items-center space-x-2 text-xs font-semibold text-brand-secondary"
                >
                  <motion.div
                    animate={shouldReduceMotion ? {} : { scale: [1, 1.12, 1] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.6,
                      ease: "easeInOut",
                    }}
                    className="w-5 h-5 rounded-full bg-accent/15 flex items-center justify-center text-accent"
                  >
                    <Check size={11} strokeWidth={3} />
                  </motion.div>
                  <span>{badge}</span>
                </motion.div>
              ),
            )}
          </motion.div>
        </motion.div>

        {/* ── RIGHT: Dashboard mockup with 3D tilt ──────────────── */}
        <motion.div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          initial={{ opacity: 0, scale: 0.94, filter: "blur(8px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
          className="lg:col-span-6 relative mt-12 lg:mt-0 flex justify-center lg:justify-end items-center"
          style={{ perspective: 1000 }}
        >
          <div className="relative w-full max-w-[480px]">
            {/* Main dashboard card with float + tilt */}
            <motion.div
              style={shouldReduceMotion ? {} : { rotateX, rotateY }}
              animate={shouldReduceMotion ? {} : { y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="relative w-full bg-white rounded-2xl shadow-[0_32px_72px_-16px_rgba(74,44,58,0.18)] border border-primary/6 overflow-hidden z-10"
            >
              {/* Animated shadow behind the card */}
              <motion.div
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        boxShadow: [
                          "0 30px 60px -10px rgba(74,44,58,0.12)",
                          "0 48px 80px -8px rgba(74,44,58,0.20)",
                          "0 30px 60px -10px rgba(74,44,58,0.12)",
                        ],
                      }
                }
                transition={{
                  repeat: Infinity,
                  duration: 5,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-2xl pointer-events-none"
              />

              {/* Browser chrome bar */}
              <div className="bg-brand-bg border-b border-primary/6 px-4 py-3 flex items-center space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/40 border border-red-400/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/40 border border-yellow-400/60" />
                <div className="w-3 h-3 rounded-full bg-green-400/40 border border-green-400/60" />
                <div className="flex-1 mx-4 h-5 bg-primary/5 rounded-md flex items-center justify-center">
                  <span className="text-[9px] text-brand-secondary font-mono">
                    identiqal.com/jane-doe
                  </span>
                </div>
              </div>

              {/* Screen content */}
              <div className="p-5 bg-white space-y-4">
                <div className="flex items-center space-x-3.5 pb-4 border-b border-primary/5">
                  <div className="w-12 h-12 rounded-full bg-linear-to-tr from-primary to-accent flex items-center justify-center text-brand-bg font-bold text-base shadow-sm shrink-0">
                    JD
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-text text-sm">
                      Jane Doe
                    </h4>
                    <p className="text-xs text-accent font-medium">
                      Creative Director at Acme
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  {[
                    { emoji: "💼", label: "Work Portfolio" },
                    { emoji: "📬", label: "Book Consultation" },
                    { emoji: "📷", label: "Design Gallery" },
                    { emoji: "📝", label: "Latest Insights" },
                  ].map(({ emoji, label }, i) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.5 + i * 0.07,
                        duration: 0.4,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="p-2 bg-brand-bg border border-primary/5 rounded-lg flex items-center space-x-2"
                    >
                      <span>{emoji}</span>
                      <span className="font-medium text-brand-text">
                        {label}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Analytics mini bar */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-primary/5">
                  {[
                    { label: "Views", value: "1.2K", color: "#4A2C3A" },
                    { label: "Clicks", value: "384", color: "#B88A44" },
                    { label: "Leads", value: "47", color: "#854558" },
                  ].map(({ label, value, color }, i) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: 0.7 + i * 0.08,
                        duration: 0.4,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="text-center"
                    >
                      <div className="text-sm font-black" style={{ color }}>
                        {value}
                      </div>
                      <div className="text-[9px] text-brand-secondary font-medium">
                        {label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ── Floating Widget Cards ─────────────────────────── */}

            {/* QR Code widget — top right */}
            <FloatingWidget
              animate={
                shouldReduceMotion ? {} : { y: [0, -14, 0], x: [0, 6, 0] }
              }
              transition={{ duration: 3.2 }}
              className="-top-5 -right-16 p-2.5 flex items-center space-x-2.5 sm:flex"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/6 flex items-center justify-center text-primary">
                <QrCode size={16} />
              </div>
              <div>
                <p className="text-[9px] text-brand-secondary font-medium">
                  QR Profile Code
                </p>
                <p className="text-[10px] text-brand-text font-bold">
                  Instant Sharing
                </p>
              </div>
            </FloatingWidget>

            {/* Analytics widget — center right */}
            <FloatingWidget
              animate={
                shouldReduceMotion ? {} : { y: [0, -18, 0], x: [0, -6, 0] }
              }
              transition={{ duration: 3.8 }}
              className="top-1/2 -right-20 -translate-y-1/2 p-3 flex flex-col space-y-1 sm:flex"
            >
              <div className="flex items-center justify-between space-x-4">
                <p className="text-[9px] text-brand-secondary font-medium">
                  Visitor Analytics
                </p>
                <TrendingUp size={12} className="text-green-500" />
              </div>
              <div className="flex items-baseline space-x-1">
                <span className="text-sm font-bold text-brand-text">+384</span>
                <span className="text-[8px] text-green-500 font-bold">
                  +12%
                </span>
              </div>
            </FloatingWidget>

            {/* AI Suggestion — top left */}
            <FloatingWidget
              animate={shouldReduceMotion ? {} : { y: [0, -12, 0] }}
              transition={{ duration: 3 }}
              className="-top-14 left-8 p-3 flex items-center space-x-2.5 sm:flex"
            >
              <motion.div
                animate={shouldReduceMotion ? {} : { scale: [1, 1.2, 1] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-6 h-6 rounded-full bg-accent/12 flex items-center justify-center text-accent"
              >
                <Sparkle size={12} fill="currentColor" />
              </motion.div>
              <div>
                <p className="text-[9px] text-brand-secondary font-medium">
                  AI Profile Suggestion
                </p>
                <p className="text-[10px] text-brand-text font-bold">
                  Add "React 19" to bio
                </p>
              </div>
            </FloatingWidget>

            {/* Lead notification — bottom left */}
            <FloatingWidget
              animate={
                shouldReduceMotion ? {} : { y: [0, -16, 0], x: [0, 5, 0] }
              }
              transition={{ duration: 4 }}
              className="-bottom-20 left-4 px-3 py-2.5 flex items-center space-x-2 sm:flex"
            >
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-brand-bg shrink-0">
                <MessageSquare size={10} />
              </div>
              <div>
                <p className="text-[9px] text-brand-secondary font-medium">
                  New Inquiry Lead
                </p>
                <p className="text-[10px] text-brand-text font-semibold">
                  Sarah: "Let's collaborate!"
                </p>
              </div>
            </FloatingWidget>

            {/* Contact saved pill — bottom right */}
            <FloatingWidget
              animate={shouldReduceMotion ? {} : { y: [0, -10, 0] }}
              transition={{ duration: 2.6 }}
              className="-bottom-8 right-10 px-3 py-2 flex items-center space-x-1.5 rounded-full sm:flex"
            >
              <UserCheck size={11} className="text-accent" />
              <span className="text-[9px] text-brand-text font-bold">
                Contact Saved
              </span>
            </FloatingWidget>

            {/* Soft glow beneath the dashboard */}
            <div
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-20 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(74,44,58,0.12) 0%, transparent 70%)",
                filter: "blur(16px)",
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
