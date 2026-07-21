"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, QrCode, BarChart3, Check, ChevronDown, User, Layers, MessageSquare, Shield, Zap, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { useSafeReducedMotion } from "@/hooks/useSafeReducedMotion.js";

export const FinalCTA = () => {
  const shouldReduceMotion = useSafeReducedMotion();
  const containerRef = useRef(null);



  // Faster, hardware-accelerated continuous floating animations (completely lag-free)
  const floatMotion = (delay = 0, yDelta = 6, duration = 3) => {
    if (shouldReduceMotion) return {};
    return {
      animate: { y: [-yDelta, yDelta, -yDelta] },
      transition: { duration, repeat: Infinity, ease: "easeInOut", delay }
    };
  };

  return (
    <section 
      ref={containerRef}
      className="py-20 lg:py-24 bg-gradient-to-br from-[#F7FAFF] via-[#EEF5FF] md:via-[#DCEAFF] to-[#CFE4FF] relative overflow-hidden flex items-center justify-center border-t border-blue-100"
      style={{ minHeight: "85vh" }}
    >
      {/* ── BACKGROUND COMPOSITION (Bright, Airy, Premium) ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Soft radial blue glow centered around phone area */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: `
              radial-gradient(circle at 75% 50%, rgba(59, 130, 246, 0.18) 0%, transparent 60%),
              radial-gradient(circle at 20% 80%, rgba(96, 165, 250, 0.12) 0%, transparent 50%)
            `
          }}
        />

        {/* Low-opacity glassmorphism circles / blurred blobs */}
        <div className="absolute top-[15%] left-[5%] w-72 h-72 rounded-full bg-blue-400/5 blur-3xl" />
        <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] rounded-full bg-indigo-300/5 blur-3xl" />

        {/* Subtle light mesh lines */}
        <div 
          className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #1E3A8A 1px, transparent 0)`,
            backgroundSize: "32px 32px"
          }}
        />
      </div>

      {/* ── CONTENT CONTAINER ── */}
      <div className="max-w-[1400px] w-full mx-auto px-8 sm:px-12 lg:px-16 relative z-20 flex flex-col xl:flex-row items-center gap-16 xl:gap-24">
        
        {/* Left Column: Copywriting & CTAs */}
        <div className="flex-1 text-center xl:text-left flex flex-col items-center xl:items-start space-y-8 max-w-2xl">
          
          {/* Glass pill badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/70 border border-blue-200/50 shadow-[0_2px_10px_rgba(37,99,235,0.03)] text-[10px] font-bold uppercase tracking-widest text-blue-600 pointer-events-auto"
          >
            <Sparkles size={11} className="text-blue-500" />
            <span>Smart Identity Card Builder</span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05] text-slate-900 font-sans">
            Make Every First <br className="hidden sm:inline" />
            <motion.span
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }
              }
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                background: "linear-gradient(135deg, #2563EB 0%, #60A5FA 40%, #1D4ED8 70%, #2563EB 100%)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
              className="relative inline-block"
            >
              Impression
              <span className="absolute bottom-1 left-0 w-full h-[2.5px] bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0 rounded-full" />
            </motion.span>{" "}
            Count.
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-600 font-medium max-w-[580px] leading-[1.8]">
            Upgrade your digital card setup today. Create your smart portfolio
            identity, collect client inquiries, and monitor analytic views in
            minutes.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center xl:justify-start gap-5 w-full sm:w-auto pt-2">
            <Link href="/signup" className="w-full sm:w-auto">
              <motion.button
                whileHover={shouldReduceMotion ? {} : {
                  scale: 1.02,
                  y: -1.5,
                  boxShadow: "0 15px 30px rgba(37, 99, 235, 0.15)"
                }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                transition={{ type: "spring", stiffness: 450, damping: 25 }}
                className="group relative w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition-all duration-300 border border-blue-400/20 overflow-hidden"
              >
                <span>Get Started Free</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1 duration-300" />
              </motion.button>
            </Link>

            <Link href="/support" className="w-full sm:w-auto">
              <motion.button
                whileHover={shouldReduceMotion ? {} : {
                  scale: 1.01,
                  y: -1,
                  backgroundColor: "rgba(255, 255, 255, 0.95)"
                }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl border border-slate-200 bg-white/80 text-slate-700 font-bold shadow-xs hover:shadow-md transition-all duration-300"
              >
                <span>Book a Demo</span>
              </motion.button>
            </Link>
          </div>

          {/* Trust Badges / Pills */}
          <div className="flex flex-wrap justify-center xl:justify-start gap-2.5 pt-8 border-t border-blue-200/40 w-full">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 border border-blue-100/50 shadow-[0_1px_5px_rgba(0,0,0,0.01)] text-[11px] font-bold text-slate-700">
              <Check size={12} className="text-blue-500" /> 50K+ Professionals
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 border border-blue-100/50 shadow-[0_1px_5px_rgba(0,0,0,0.01)] text-[11px] font-bold text-slate-700">
              <Check size={12} className="text-blue-500" /> QR Ready
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 border border-blue-100/50 shadow-[0_1px_5px_rgba(0,0,0,0.01)] text-[11px] font-bold text-slate-700">
              <Check size={12} className="text-blue-500" /> AI Powered
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 border border-blue-100/50 shadow-[0_1px_5px_rgba(0,0,0,0.01)] text-[11px] font-bold text-slate-700">
              <Check size={12} className="text-blue-500" /> Analytics Included
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 border border-blue-100/50 shadow-[0_1px_5px_rgba(0,0,0,0.01)] text-[11px] font-bold text-slate-700">
              <Check size={12} className="text-blue-500" /> Instant Sharing
            </span>
          </div>

        </div>

        {/* Right Column: Phone Mockup & Parallax floating visuals */}
        <div className="flex-1 w-full relative flex items-center justify-center py-6">
          
          {/* Phone Mockup Container (Slightly smaller, rounder, high-end shadow) */}
          <motion.div
            {...floatMotion(0, 8, 3.2)}
            className="relative w-[260px] sm:w-[280px] aspect-[9/17.5] bg-[#0c1017] rounded-[38px] border-[6px] border-slate-900 shadow-[0_20px_50px_rgba(15,23,42,0.18),0_0_30px_rgba(59,130,246,0.05)] overflow-hidden z-20 pointer-events-none"
          >
            {/* Phone screen simulation */}
            <div className="w-full h-full bg-[#0a0d14] flex flex-col pt-10 items-center overflow-hidden relative">
              {/* Notch */}
              <div className="absolute top-2.5 w-24 h-4 bg-slate-900 rounded-full z-30" />
              
              {/* Cover Header */}
              <div className="w-full h-[120px] bg-gradient-to-tr from-blue-600 to-indigo-500 relative flex items-center justify-center shrink-0">
                {svgCurve()}
              </div>

              {/* Avatar overlay */}
              <div className="w-18 h-18 rounded-full border-4 border-[#0a0d14] bg-slate-800 -mt-9 overflow-hidden relative z-10 shadow-md shrink-0">
                <div className="w-full h-full bg-gradient-to-tr from-blue-500/30 to-indigo-500/30 flex items-center justify-center text-white">
                  <User size={28} />
                </div>
              </div>

              {/* Title info */}
              <div className="text-center mt-2.5 px-5 space-y-0.5 shrink-0">
                <div className="text-sm font-extrabold text-white">Sahil Ansari</div>
                <div className="text-[10px] text-zinc-500 font-bold">Principal Architect, Identiqal</div>
              </div>

              {/* Action grid */}
              <div className="grid grid-cols-2 gap-2.5 w-full px-5 mt-4 shrink-0">
                <div className="h-8.5 rounded-lg bg-white/[0.04] border border-white/5 flex items-center justify-center text-[9px] font-black text-white uppercase tracking-wider">Save Card</div>
                <div className="h-8.5 rounded-lg bg-blue-600 flex items-center justify-center text-[9px] font-black text-white uppercase tracking-wider">Connect</div>
              </div>

              {/* List Cards */}
              <div className="w-full px-5 mt-4 space-y-2.5 overflow-hidden">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400"><Layers size={12} /></div>
                    <div className="text-[10px] font-bold text-white">Portfolio Showcase</div>
                  </div>
                  <span className="text-[10px] text-zinc-600">→</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400"><MessageSquare size={12} /></div>
                    <div className="text-[10px] font-bold text-white">Client Reviews</div>
                  </div>
                  <span className="text-[10px] text-zinc-600">→</span>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Floating Glass Widget 1: QR Card (Slightly smaller, rounded, cleaner shadow) */}
          <motion.div
            {...floatMotion(0.4, 10, 3.5)}
            className="hidden sm:flex absolute sm:-left-3 top-[20%] w-[130px] p-3.5 rounded-2xl border border-white/80 bg-white/90 shadow-[0_12px_24px_rgba(30,41,59,0.06)] flex-col items-center space-y-2.5 z-30 pointer-events-none"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
              <QrCode size={15} />
            </div>
            <div className="text-center space-y-0.5">
              <div className="text-[9px] font-black text-slate-800 uppercase tracking-wider">Instant QR</div>
              <div className="text-[8px] text-slate-400 font-bold">Scan to Connect</div>
            </div>
            {/* Pixel-perfect Premium SVG QR Illustration */}
            <div className="w-12 h-12 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-lg p-1 shrink-0">
              <svg className="w-10 h-10 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="6" height="6" rx="1" />
                <rect x="16" y="2" width="6" height="6" rx="1" />
                <rect x="2" y="16" width="6" height="6" rx="1" />
                <rect x="4" y="4" width="2" height="2" fill="currentColor" className="fill-slate-800 stroke-none" />
                <rect x="18" y="4" width="2" height="2" fill="currentColor" className="fill-slate-800 stroke-none" />
                <rect x="4" y="18" width="2" height="2" fill="currentColor" className="fill-slate-800 stroke-none" />
                <path d="M12 2h2v4h-2zm4 0h2v2h-2zm-4 8h2v2h-2zm4 2h2v4h-2zm-6 2h2v2h-2zm6 2h4v2h-4zm-2 2h2v2h-2z" fill="currentColor" className="fill-slate-800 stroke-none" />
              </svg>
            </div>
          </motion.div>

          {/* Floating Glass Widget 2: Analytics (Smaller, lighter glass theme) */}
          <motion.div
            {...floatMotion(0.8, 8, 3.8)}
            className="hidden sm:block absolute sm:-right-2 bottom-[15%] w-[150px] p-3.5 rounded-2xl border border-white/80 bg-white/90 shadow-[0_12px_24px_rgba(30,41,59,0.06)] space-y-2 z-30 pointer-events-none"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <BarChart3 size={14} />
              </div>
              <div>
                <div className="text-[9px] font-black text-slate-800 uppercase tracking-wider">Scans</div>
                <div className="text-xs font-black text-slate-900">25.8k</div>
              </div>
            </div>
            {/* Mock Graph */}
            <div className="h-6 w-full flex items-end gap-1.5 pt-1">
              {[30, 45, 35, 60, 50, 75, 90].map((h, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-gradient-to-t from-blue-500 to-indigo-500 rounded-t-xs"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </motion.div>

        </div>

      </div>

      {/* ── SCROLL INDICATOR ── */}
      <motion.div 
        animate={shouldReduceMotion ? {} : { y: [0, 5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-1 opacity-45 z-20 pointer-events-none"
      >
        <ChevronDown size={14} className="text-blue-500" />
      </motion.div>

    </section>
  );
};

// Helper SVG path curve for the mockup
const svgCurve = () => (
  <svg className="absolute bottom-0 w-full text-[#0a0d14] fill-current" viewBox="0 0 1440 120" preserveAspectRatio="none">
    <path d="M0,32L120,42.7C240,53,480,75,720,74.7C960,75,1200,53,1320,42.7L1440,32L1440,120L1320,120C1200,120,960,120,720,120C480,120,240,120,120,120L0,120Z"></path>
  </svg>
);
