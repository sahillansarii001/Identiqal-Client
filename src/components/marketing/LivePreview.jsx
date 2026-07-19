"use client";

import React, { useRef, useCallback } from "react";
import { Mail, Phone, MapPin, Globe, Sparkles, Check } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection.jsx";
import { useSafeReducedMotion } from "@/hooks/useSafeReducedMotion.js";

// ─── Theme definitions ─────────────────────────────────────────────────────────
const themes = [
  {
    id: "light",
    label: "Light Clean",
    sub: "Corporate • Elegant",
    colors: ["#FFFFFF", "#6B3A4A", "#E9E2DC", "#6B6B6B"],
    borderClass: "border-l-4 border-l-[#6B3A4A]",
  },
  {
    id: "minimal",
    label: "Minimalist",
    sub: "Apple • Clean",
    colors: ["#FFFFFF", "#18181B", "#E4E4E7", "#71717A"],
    borderClass: "border-l-4 border-l-[#18181B]",
  },
  {
    id: "luxury",
    label: "Luxury Gold",
    sub: "Premium • Luxury",
    colors: ["#FDFBF7", "#C89B5B", "#6B3A4A", "#3F3F46"],
    borderClass: "border-l-4 border-l-[#C89B5B]",
  },
  {
    id: "midnight",
    label: "Midnight",
    sub: "Dark • Modern",
    colors: ["#000000", "#18181B", "#A855F7", "#FAFAF8"],
    borderClass: "border-l-4 border-l-[#A855F7]",
  },
  {
    id: "glass",
    label: "Glass",
    sub: "VisionOS • Glass",
    colors: [
      "rgba(255,255,255,0.15)",
      "rgba(255,255,255,0.25)",
      "#E2E8F0",
      "#FFFFFF",
    ],
    borderClass: "border-l-4 border-l-zinc-300",
  },
  {
    id: "gradient",
    label: "Gradient",
    sub: "Vibrant • Startup",
    colors: ["#A855F7", "#EC4899", "#3B82F6", "#FFFFFF"],
    borderClass: "border-l-4 border-l-pink-500",
  },
];

// ─── Profile mock data ─────────────────────────────────────────────────────────
const profile = {
  name: "Alexander Mercer",
  title: "Principal Designer & Partner",
  company: "Mercer Capital Group",
  bio: "Crafting luxury visual languages and digital products. Ex-Apple Creative Director, advisor to next-gen AI startups.",
  email: "alex@mercer.design",
  phone: "+1 (555) 019-2834",
  location: "New York, NY",
};

// ─── Theme mockup content ──────────────────────────────────────────────────────
function ThemeMockup({ themeId }) {
  switch (themeId) {
    case "minimal":
      return (
        <div className="bg-white min-h-[500px] p-6 flex flex-col justify-between font-sans text-left select-none">
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-full border border-black flex items-center justify-center text-black font-semibold text-base">
                AM
              </div>
              <div className="text-[8px] font-bold uppercase tracking-widest text-black border border-black/10 px-2.5 py-0.5 rounded-none bg-white">
                PRO MEMBER
              </div>
            </div>
            <div className="space-y-1.5">
              <h4 className="font-light text-xl text-black tracking-tight">
                {profile.name}
              </h4>
              <p className="text-xs font-normal text-zinc-800 tracking-tight">
                {profile.title}
              </p>
              <p className="text-[10px] text-zinc-500 font-light tracking-wide uppercase">
                {profile.company}
              </p>
            </div>
            <p className="text-[11px] font-light leading-relaxed text-zinc-600 pt-3 border-t border-zinc-100">
              {profile.bio}
            </p>
          </div>
          <div className="space-y-2 my-6">
            <button className="w-full py-2.5 bg-black text-white text-xs font-semibold rounded-none tracking-wide">
              Save Contact Card
            </button>
            <button className="w-full py-2.5 bg-white border border-zinc-200 text-black text-xs font-semibold rounded-none tracking-wide">
              Connect Online
            </button>
          </div>
          <div className="space-y-2">
            <h5 className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
              Contact info
            </h5>
            <div className="p-4 border border-zinc-100 space-y-2">
              {[profile.email, profile.phone, profile.location].map((v) => (
                <div
                  key={v}
                  className="flex items-center space-x-2 text-[10px] text-zinc-700"
                >
                  <span className="w-1 h-1 bg-black rounded-full" />
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "luxury":
      return (
        <div className="bg-[#FDFBF7] min-h-[500px] p-6 flex flex-col justify-between font-serif text-left select-none relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#C89B5B]/5 rounded-full blur-xl pointer-events-none" />
          <div className="space-y-6 pt-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-full border-2 border-[#C89B5B] bg-white flex items-center justify-center text-[#6B3A4A] font-bold text-lg shadow-sm">
                AM
              </div>
              <div className="text-[9px] font-semibold tracking-widest text-[#C89B5B] bg-[#C89B5B]/5 border border-[#C89B5B]/30 px-3 py-1 rounded-full uppercase">
                ★ Pro Member
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-extrabold text-primary tracking-tight">
                {profile.name}
              </h4>
              <p className="text-xs font-medium text-[#C89B5B] italic">
                {profile.title}
              </p>
              <p className="text-[10px] text-zinc-500 font-sans tracking-wide uppercase font-semibold">
                {profile.company}
              </p>
            </div>
            <p className="text-[11px] leading-relaxed text-brand-secondary border-t border-accent/20 pt-4 font-serif">
              {profile.bio}
            </p>
          </div>
          <div className="space-y-2.5 my-6 relative z-10">
            <button className="w-full py-2.5 bg-linear-to-r from-[#C89B5B] to-[#b0874c] text-white text-xs font-bold rounded-full shadow-md font-sans">
              Save Contact Card
            </button>
            <button className="w-full py-2.5 bg-transparent border border-[#C89B5B] text-[#C89B5B] text-xs font-bold rounded-full font-sans">
              Connect Online
            </button>
          </div>
          <div className="space-y-2 relative z-10">
            <h5 className="text-[9px] font-bold uppercase tracking-widest text-[#C89B5B] font-sans">
              Contact info
            </h5>
            <div className="p-3 bg-white border border-accent/10 rounded-xl space-y-2 shadow-sm">
              {[
                [Mail, profile.email],
                [Phone, profile.phone],
                [MapPin, profile.location],
              ].map(([I, v]) => (
                <div
                  key={v}
                  className="flex items-center space-x-2 text-[10px] text-primary font-sans font-medium"
                >
                  <I size={10} className="text-[#C89B5B]" />
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "midnight":
      return (
        <div className="bg-black min-h-[500px] p-6 flex flex-col justify-between font-sans text-left select-none relative overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#A855F7]/10 rounded-full blur-[45px] pointer-events-none" />
          <div className="space-y-5 pt-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-full border-2 border-[#A855F7] bg-zinc-950 flex items-center justify-center text-white font-black text-lg shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                AM
              </div>
              <div className="text-[8px] font-black tracking-widest text-[#A855F7] bg-[#A855F7]/10 border border-[#A855F7]/30 px-3 py-1 rounded-full uppercase">
                PRO MEMBER
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-black text-white tracking-tight">
                {profile.name}
              </h4>
              <p className="text-xs font-semibold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-500">
                {profile.title}
              </p>
              <p className="text-[10px] text-zinc-500 tracking-wide uppercase font-bold">
                {profile.company}
              </p>
            </div>
            <p className="text-[11px] leading-relaxed text-zinc-400 border-t border-zinc-900 pt-3">
              {profile.bio}
            </p>
          </div>
          <div className="space-y-2 my-6 relative z-10">
            <button className="w-full py-2.5 bg-white text-black text-xs font-black rounded-xl">
              Save Contact Card
            </button>
            <button className="w-full py-2.5 bg-zinc-900 border border-zinc-800 text-white text-xs font-semibold rounded-xl">
              Connect Online
            </button>
          </div>
          <div className="space-y-2 relative z-10">
            <h5 className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">
              Contact info
            </h5>
            <div className="p-3 bg-zinc-950/80 border border-zinc-900 rounded-2xl space-y-2">
              {[
                [Mail, profile.email],
                [Phone, profile.phone],
                [MapPin, profile.location],
              ].map(([I, v]) => (
                <div
                  key={v}
                  className="flex items-center space-x-2.5 text-[10px] text-zinc-300"
                >
                  <I size={10} className="text-[#A855F7]" />
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "glass":
      return (
        <div className="bg-linear-to-tr from-[#1E293B] to-[#0F172A] min-h-[500px] p-6 flex flex-col justify-between font-sans text-left select-none relative overflow-hidden">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-10 left-10 w-28 h-28 rounded-full bg-blue-500/20 blur-xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-pink-500/20 blur-xl animate-pulse" />
          </div>
          <div className="space-y-5 pt-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white font-bold text-lg">
                AM
              </div>
              <div className="text-[8px] font-extrabold tracking-widest text-white/90 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full uppercase">
                PRO MEMBER
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-extrabold text-white tracking-tight">
                {profile.name}
              </h4>
              <p className="text-xs font-semibold text-white/80">
                {profile.title}
              </p>
              <p className="text-[10px] text-white/40 tracking-wide uppercase font-bold">
                {profile.company}
              </p>
            </div>
            <p className="text-[11px] leading-relaxed text-white/70 border-t border-white/10 pt-3">
              {profile.bio}
            </p>
          </div>
          <div className="space-y-2.5 my-6 relative z-10">
            <button className="w-full py-2.5 bg-white/25 border border-white/20 backdrop-blur-md text-white text-xs font-bold rounded-2xl">
              Save Contact Card
            </button>
            <button className="w-full py-2.5 bg-transparent border border-white/10 text-white/90 text-xs font-semibold rounded-2xl">
              Connect Online
            </button>
          </div>
          <div className="space-y-2 relative z-10">
            <h5 className="text-[9px] font-bold uppercase tracking-widest text-white/40">
              Contact info
            </h5>
            <div className="p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl space-y-2">
              {[
                [Mail, profile.email],
                [Phone, profile.phone],
                [MapPin, profile.location],
              ].map(([I, v]) => (
                <div
                  key={v}
                  className="flex items-center space-x-2 text-[10px] text-white/90"
                >
                  <I size={10} className="text-white/60" />
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "gradient":
      return (
        <div className="min-h-[500px] p-6 flex flex-col justify-between font-sans text-left select-none relative overflow-hidden">
          <motion.div
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 10, ease: "linear", repeat: Infinity }}
            className="absolute inset-0 z-0 bg-linear-to-br from-[#A855F7] via-[#EC4899] to-[#3B82F6] bg-size-[200%_200%]"
          />
          <div className="space-y-5 pt-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/45 flex items-center justify-center text-white font-black text-lg">
                AM
              </div>
              <div className="text-[8px] font-black tracking-widest text-white bg-pink-500 border border-white/25 px-3 py-1 rounded-full uppercase">
                PRO MEMBER
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-black text-white tracking-tight">
                {profile.name}
              </h4>
              <p className="text-xs font-bold text-white/90">{profile.title}</p>
              <p className="text-[10px] text-white/60 tracking-wide uppercase font-black">
                {profile.company}
              </p>
            </div>
            <p className="text-[11px] leading-relaxed text-white/80 border-t border-white/10 pt-3">
              {profile.bio}
            </p>
          </div>
          <div className="space-y-2.5 my-6 relative z-10">
            <button className="w-full py-2.5 bg-white text-[#A855F7] text-xs font-black rounded-2xl">
              Save Contact Card
            </button>
            <button className="w-full py-2.5 bg-black/25 border border-white/15 text-white text-xs font-bold rounded-2xl">
              Connect Online
            </button>
          </div>
          <div className="space-y-2 relative z-10">
            <h5 className="text-[9px] font-bold uppercase tracking-widest text-white/60">
              Contact info
            </h5>
            <div className="p-3 bg-black/15 border border-white/10 rounded-2xl space-y-2">
              {[
                [Mail, profile.email],
                [Phone, profile.phone],
                [MapPin, profile.location],
              ].map(([I, v]) => (
                <div
                  key={v}
                  className="flex items-center space-x-2 text-[10px] text-white"
                >
                  <I size={10} className="text-white" />
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "light":
    default:
      return (
        <div className="bg-white min-h-[500px] p-6 flex flex-col justify-between font-sans text-left select-none">
          <div className="space-y-5 pt-4">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-full bg-linear-to-tr from-[#6B3A4A] to-[#C89B5B] flex items-center justify-center text-white font-bold text-lg shadow-sm border border-white">
                AM
              </div>
              <div className="text-[8px] font-extrabold tracking-widest text-[#6B3A4A] bg-[#6B3A4A]/5 border border-[#6B3A4A]/10 px-2.5 py-1 rounded-full uppercase">
                ★ Pro Member
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-lg tracking-tight text-[#1F1F1F]">
                {profile.name}
              </h4>
              <p className="text-xs font-semibold text-[#6B3A4A]">
                {profile.title}
              </p>
              <p className="text-[10px] text-brand-secondary font-medium">
                {profile.company}
              </p>
            </div>
            <p className="text-[11px] leading-relaxed text-brand-secondary border-t border-[#E9E2DC]/50 pt-3">
              {profile.bio}
            </p>
          </div>
          <div className="space-y-2 my-5">
            <button className="w-full py-2.5 bg-[#6B3A4A] text-white text-xs font-bold rounded-xl shadow-md">
              Save Contact Card
            </button>
            <button className="w-full py-2.5 bg-white border border-[#E9E2DC] text-brand-secondary text-xs font-semibold rounded-xl">
              Connect Online
            </button>
          </div>
          <div className="space-y-2">
            <h5 className="text-[9px] font-bold uppercase tracking-wider text-[#6B3A4A]">
              Contact info
            </h5>
            <div className="p-3 bg-white border border-[#E9E2DC] rounded-xl space-y-2 shadow-sm">
              {[
                [Mail, profile.email],
                [Phone, profile.phone],
                [MapPin, profile.location],
              ].map(([I, v]) => (
                <div
                  key={v}
                  className="flex items-center space-x-2 text-[10px] text-[#1F1F1F] font-medium"
                >
                  <I size={10} className="text-[#C89B5B]" />
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
  }
}

// ─── Main Component ────────────────────────────────────────────────────────────
export const LivePreview = () => {
  const [activeTheme, setActiveTheme] = React.useState("light");
  const shouldReduceMotion = useSafeReducedMotion();
  const phoneRef = useRef(null);

  // Auto-cycle themes
  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveTheme((prev) => {
        const idx = themes.findIndex((t) => t.id === prev);
        return themes[(idx + 1) % themes.length].id;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Mouse tilt for phone
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), {
    stiffness: 140,
    damping: 28,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), {
    stiffness: 140,
    damping: 28,
  });

  const handleMouseMove = useCallback(
    (e) => {
      if (shouldReduceMotion) return;
      const rect = phoneRef.current?.getBoundingClientRect();
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

  return (
    <section
      id="templates"
      className="py-24 bg-brand-bg border-t border-[#E9E2DC]/80 scroll-mt-16 relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="blob-1 absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-[#C89B5B]/6 blur-[120px]" />
        <div className="blob-2 absolute bottom-1/3 right-1/4 w-[350px] h-[350px] rounded-full bg-[#6B3A4A]/4 blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#C89B5B_1px,transparent_1px)] bg-size-[24px_24px] opacity-[0.06] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left: Explainer & theme selection */}
        <div className="lg:col-span-5 space-y-8 text-left">
          <AnimatedSection className="space-y-4">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#6B3A4A]/6 border border-[#6B3A4A]/10 text-xs font-semibold text-[#6B3A4A] tracking-wider uppercase">
              <span>Interactive Sandbox</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F1F1F] tracking-tight leading-tight font-sans">
              Live Real-Time <br />
              Theme Preview
            </h2>
            <p className="text-brand-secondary text-sm sm:text-base leading-relaxed max-w-xl font-medium">
              Experience the luxury feeling of smart layouts. Instantly
              transform your entire profile design aesthetic, fonts, border
              accents, and layouts in one click.
            </p>
          </AnimatedSection>

          {/* Theme selection */}
          <AnimatedSection
            delay={0.1}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {themes.map((theme) => {
              const isActive = activeTheme === theme.id;
              return (
                <motion.button
                  key={theme.id}
                  onClick={() => setActiveTheme(theme.id)}
                  whileHover={shouldReduceMotion ? {} : { y: -3, scale: 1.02 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  className={`flex flex-col text-left p-4 rounded-2xl border text-sm transition-all duration-300 relative overflow-hidden cursor-pointer ${
                    isActive
                      ? `bg-white ${theme.borderClass} border-zinc-200 shadow-md shadow-[#6B3A4A]/6 scale-[1.01]`
                      : "bg-white/60 border-[#E9E2DC]/80 hover:bg-white hover:border-[#C89B5B]/30"
                  }`}
                >
                  <div className="flex justify-between items-center w-full mb-1.5">
                    <span className="font-extrabold text-sm text-[#1F1F1F] font-sans">
                      {theme.label}
                    </span>
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 22,
                          }}
                        >
                          <Check size={12} className="text-[#C89B5B]" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="flex space-x-1 mb-2">
                    {theme.colors.map((color, i) => (
                      <span
                        key={i}
                        className="w-3.5 h-3.5 rounded-full border border-zinc-200/50 shadow-sm transition-transform duration-200"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-[#8A8A8A]">
                    {theme.sub}
                  </span>
                </motion.button>
              );
            })}
          </AnimatedSection>
        </div>

        {/* Right: Phone mockup */}
        <div className="lg:col-span-7 flex justify-center items-center">
          <motion.div
            ref={phoneRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={shouldReduceMotion ? {} : { y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="relative"
            style={shouldReduceMotion ? {} : { perspective: 1000 }}
          >
            {/* Animated glow behind phone */}
            <motion.div
              animate={
                shouldReduceMotion
                  ? {}
                  : { opacity: [0.4, 0.7, 0.4], scale: [1, 1.05, 1] }
              }
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -inset-8 rounded-[60px] pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(184,138,68,0.15) 0%, transparent 70%)",
                filter: "blur(20px)",
              }}
            />

            {/* Phone bezel with tilt */}
            <motion.div
              style={shouldReduceMotion ? {} : { rotateX, rotateY }}
              className="w-[300px] sm:w-[320px] rounded-[42px] bg-brand-text border-8 border-brand-text overflow-hidden relative"
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      boxShadow: [
                        "0 30px 70px -10px rgba(74,44,58,0.22)",
                        "0 48px 90px -6px rgba(74,44,58,0.30)",
                        "0 30px 70px -10px rgba(74,44,58,0.22)",
                      ],
                    }
              }
              transition={
                shouldReduceMotion
                  ? {}
                  : { repeat: Infinity, duration: 6, ease: "easeInOut" }
              }
            >
              {/* Notch */}
              <div className="absolute top-0 inset-x-0 h-5 bg-brand-text flex justify-center items-center z-40">
                <div className="w-16 h-3 bg-black rounded-full" />
              </div>

              {/* Theme content with AnimatePresence smooth swap */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTheme}
                  initial={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.96, filter: "blur(6px)" }
                  }
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.96, filter: "blur(6px)" }
                  }
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ThemeMockup themeId={activeTheme} />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
