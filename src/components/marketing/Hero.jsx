"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CheckCircle2, Play } from "lucide-react";
import { useSafeReducedMotion } from "@/hooks/useSafeReducedMotion.js";
import Image from "next/image";

export const Hero = () => {
  const shouldReduceMotion = useSafeReducedMotion();
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-dvh pt-32 pb-20 overflow-hidden bg-slate-50 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8"
    >
      {/* Background Mesh/Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_80%_60%_at_50%_40%,#000_20%,transparent_100%)] opacity-60" />
        <div className="absolute top-1/4 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-400/20 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 max-w-4xl mx-auto space-y-8 flex flex-col items-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span>Presenting Identiqal 2.0</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900"
        >
          Your Identity. <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500">
            Smarter Than a Business Card.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="max-w-2xl text-lg md:text-xl text-slate-600 leading-relaxed"
        >
          Create beautiful digital profiles, share them instantly, collect leads, 
          analyze visitors, and let AI help you make the perfect first impression.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4"
        >
          <Link href="/signup">
            <button className="flex items-center space-x-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              <span>Create Your Card</span>
              <ArrowRight size={18} />
            </button>
          </Link>
          
          <button className="flex items-center space-x-2 px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-full font-semibold transition-all hover:-translate-y-0.5 shadow-sm">
            <Play size={18} className="text-blue-600" />
            <span>Watch Demo</span>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="pt-8 flex items-center justify-center space-x-6 sm:space-x-8 text-sm font-medium text-slate-500"
        >
          <div className="flex items-center space-x-2">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span>Free Forever</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span>No Coding</span>
          </div>
          <div className="flex items-center space-x-2 sm:flex">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span>QR Sharing</span>
          </div>
        </motion.div>
      </motion.div>


    </section>
  );
};
