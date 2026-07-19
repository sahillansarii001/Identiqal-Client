"use client";

import React from "react";
import { Sparkles, Bot, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection.jsx";
import { useSafeReducedMotion } from "@/hooks/useSafeReducedMotion.js";

const cardVariants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export const AIFeatures = () => {
  const shouldReduceMotion = useSafeReducedMotion();

  return (
    <section className="py-24 bg-brand-bg border-t border-primary/5 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="blob-2 absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full bg-accent/6 blur-[120px]" />
        <div className="blob-3 absolute -bottom-10 left-10 w-[400px] h-[400px] rounded-full bg-primary/4 blur-[110px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <motion.div
            animate={shouldReduceMotion ? {} : { scale: [1, 1.03, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent/10 text-xs font-semibold text-accent tracking-wider uppercase"
          >
            <Sparkles size={12} className="text-accent" />
            <span>AI Intelligence</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-text">
            AI-Powered Digital Networking
          </h2>
          <p className="text-brand-secondary text-base leading-relaxed">
            Let machine learning write your bio, analyze profiles, and suggest
            instant changes to boost your professional engagement.
          </p>
        </AnimatedSection>

        {/* Cards Grid */}
        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid lg:grid-cols-3 gap-10 items-stretch"
        >
          {/* Card 1: AI Smart Introduction */}
          <motion.div
            variants={shouldReduceMotion ? {} : cardVariants}
            whileHover={
              shouldReduceMotion
                ? {}
                : {
                    y: -8,
                    scale: 1.02,
                    boxShadow: "0 24px 52px -12px rgba(74, 44, 58, 0.14)",
                  }
            }
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="group bg-white/65 border border-primary/6 rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden cursor-pointer"
          >
            <motion.div className="absolute inset-0 bg-linear-to-br from-accent/4 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ boxShadow: "inset 0 0 0 1px rgba(184,138,68,0.22)" }}
            />

            <div className="space-y-6">
              <div className="h-44 bg-brand-bg border border-primary/6 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
                <motion.div
                  animate={
                    shouldReduceMotion ? {} : { opacity: [0.15, 0.35, 0.15] }
                  }
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute top-2 right-2 text-accent"
                >
                  <Sparkles size={40} />
                </motion.div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-1.5 text-[9px] text-accent font-bold uppercase tracking-wider">
                    <motion.div
                      whileHover={
                        shouldReduceMotion ? {} : { rotate: 12, scale: 1.15 }
                      }
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Bot size={10} />
                    </motion.div>
                    <span>AI Assistant Writing...</span>
                  </div>
                  <div className="p-2.5 bg-white border border-primary/5 rounded-lg text-[10px] text-brand-secondary font-mono leading-relaxed relative">
                    "I am a tech leader with a passion for building premium SaaS
                    experiences..."
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="w-1.5 h-3 bg-accent inline-block ml-1 align-middle"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-brand-text">
                  AI Smart Introduction
                </h3>
                <p className="text-xs text-brand-secondary leading-relaxed">
                  Generate professional summaries tailored to specific roles or
                  networking events. Switch between elegant, technical, or
                  conversational tones instantly.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Health Score */}
          <motion.div
            variants={shouldReduceMotion ? {} : cardVariants}
            whileHover={
              shouldReduceMotion
                ? {}
                : {
                    y: -8,
                    scale: 1.02,
                    boxShadow: "0 24px 52px -12px rgba(74, 44, 58, 0.14)",
                  }
            }
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="group bg-white/65 border border-primary/6 rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden cursor-pointer"
          >
            <motion.div className="absolute inset-0 bg-linear-to-br from-accent/4 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ boxShadow: "inset 0 0 0 1px rgba(184,138,68,0.22)" }}
            />

            <div className="space-y-6">
              <div className="h-44 bg-brand-bg border border-primary/6 rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="text-center space-y-2 relative z-10">
                  <motion.div
                    animate={
                      shouldReduceMotion
                        ? {}
                        : {
                            scale: [1, 1.04, 1],
                            boxShadow: [
                              "0 0 0 0 rgba(184,138,68,0)",
                              "0 0 0 8px rgba(184,138,68,0.1)",
                              "0 0 0 0 rgba(184,138,68,0)",
                            ],
                          }
                    }
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-20 h-20 rounded-full border-4 border-accent flex items-center justify-center shadow-md bg-white"
                  >
                    <div className="text-center">
                      <span className="text-base font-black text-primary">
                        94%
                      </span>
                      <p className="text-[7px] text-brand-secondary font-bold uppercase tracking-wider">
                        Health
                      </p>
                    </div>
                  </motion.div>
                  <p className="text-[10px] text-brand-text font-bold">
                    Excellent Profile Score
                  </p>
                </div>
                <div className="absolute top-4 left-6 w-12 h-12 rounded-full bg-accent/5 blur-sm" />
                <div className="absolute bottom-4 right-6 w-16 h-16 rounded-full bg-primary/4 blur-md" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-brand-text">
                  AI Profile Health Score
                </h3>
                <p className="text-xs text-brand-secondary leading-relaxed">
                  Get structural suggestions about your landing page profile
                  completeness. Ensure contact cards, downloadable vCards, and
                  key links are active and functional.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Card 3: AI Suggestions */}
          <motion.div
            variants={shouldReduceMotion ? {} : cardVariants}
            whileHover={
              shouldReduceMotion
                ? {}
                : {
                    y: -8,
                    scale: 1.02,
                    boxShadow: "0 24px 52px -12px rgba(74, 44, 58, 0.14)",
                  }
            }
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="group bg-white/65 border border-primary/6 rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden cursor-pointer"
          >
            <motion.div className="absolute inset-0 bg-linear-to-br from-accent/4 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ boxShadow: "inset 0 0 0 1px rgba(184,138,68,0.22)" }}
            />

            <div className="space-y-6">
              <div className="h-44 bg-brand-bg border border-primary/6 rounded-xl p-4 flex flex-col justify-center space-y-2 relative overflow-hidden">
                {[
                  {
                    text: "Add Calendly scheduler block",
                    done: false,
                    offset: 0,
                  },
                  { text: "Upload dynamic vCard file", done: false, offset: 3 },
                  { text: "Add Twitter profile handle", done: true, offset: 0 },
                ].map(({ text, done, offset }, i) => (
                  <motion.div
                    key={text}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.3 + i * 0.15,
                      duration: 0.4,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`flex items-center space-x-2 p-2 bg-white border border-primary/5 rounded-lg shadow-sm ${offset ? `translate-x-${offset}` : ""}`}
                    style={{
                      transform: offset
                        ? `translateX(${offset * 4}px)`
                        : "none",
                    }}
                  >
                    <motion.div
                      whileHover={
                        shouldReduceMotion ? {} : { scale: 1.2, rotate: 10 }
                      }
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <CheckCircle2
                        size={13}
                        className={done ? "text-green-500" : "text-accent"}
                      />
                    </motion.div>
                    <span
                      className={`text-[10px] font-semibold ${done ? "text-brand-secondary line-through" : "text-brand-text"}`}
                    >
                      {text}
                    </span>
                  </motion.div>
                ))}
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-brand-text">
                  AI Suggestions
                </h3>
                <p className="text-xs text-brand-secondary leading-relaxed">
                  Receive personalized, smart insights that automatically
                  optimize your cards for maximum leads, profile click-throughs,
                  and reader engagement.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
