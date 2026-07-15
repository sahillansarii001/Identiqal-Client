'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Play, Check, QrCode, TrendingUp, Sparkle, MessageSquare, UserCheck, ShieldCheck } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export const Hero = () => {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: 'easeOut' },
    },
  };

  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden bg-[#FAFAF8] flex items-center">
      {/* Background gradients and glowing effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Glow Top Left */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#4A2C3A]/5 blur-[120px]" />
        {/* Glow Right Center */}
        <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] rounded-full bg-[#B88A44]/10 blur-[130px]" />
        {/* Glow Bottom Center */}
        <div className="absolute -bottom-20 left-1/3 w-[450px] h-[450px] rounded-full bg-[#4A2C3A]/3 blur-[110px]" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4a2c3a03_1px,transparent_1px),linear-gradient(to_bottom,#4a2c3a03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* LEFT SIDE: Copy & CTA */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-6 text-left space-y-8"
        >
          {/* Sparkles pill */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#4A2C3A]/5 border border-[#4A2C3A]/10 text-xs font-semibold text-[#4A2C3A]"
          >
            <Sparkles size={13} className="text-[#B88A44]" />
            <span>Presenting the Future of Networking</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1A1A1A] leading-[1.1] font-sans"
          >
            Your Identity. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4A2C3A] via-[#854558] to-[#B88A44]">
              Smarter Than a Business Card.
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-[#6B6B6B] leading-relaxed max-w-xl"
          >
            Create beautiful digital profiles, share them instantly, collect leads, analyze visitors, and let AI help you make the perfect first impression.
          </motion.p>

          {/* Buttons CTA */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4"
          >
            <Link href="/signup" className="w-full sm:w-auto">
              <motion.button
                whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -2 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                className="relative group overflow-hidden bg-[#4A2C3A] text-[#FAFAF8] font-semibold px-8 py-4 rounded-xl shadow-lg shadow-[#4A2C3A]/10 border border-[#4A2C3A] text-center w-full"
              >
                <div className="absolute inset-0 bg-[#B88A44] translate-y-full group-hover:translate-y-0 transition-transform duration-300 -z-10" />
                <span className="relative z-10">Create Your Card</span>
              </motion.button>
            </Link>
            <motion.button
              whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -2 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              className="inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-xl border border-[#4A2C3A]/10 bg-white/50 backdrop-blur-sm text-[#4A2C3A] font-semibold hover:bg-white hover:border-[#4A2C3A]/20 transition-all duration-300 group w-full sm:w-auto"
            >
              <Play size={15} fill="currentColor" className="text-[#B88A44] group-hover:scale-110 transition-transform" />
              <span>Watch Demo</span>
            </motion.button>
          </motion.div>

          {/* Small Trust Badges */}
          <motion.div
            variants={itemVariants}
            className="pt-4 border-t border-[#4A2C3A]/5 flex flex-wrap gap-x-8 gap-y-3"
          >
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#6B6B6B]">
              <div className="w-5 h-5 rounded-full bg-[#B88A44]/15 flex items-center justify-center text-[#B88A44]">
                <Check size={11} strokeWidth={3} />
              </div>
              <span>Free Forever</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#6B6B6B]">
              <div className="w-5 h-5 rounded-full bg-[#B88A44]/15 flex items-center justify-center text-[#B88A44]">
                <Check size={11} strokeWidth={3} />
              </div>
              <span>No Coding Required</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#6B6B6B]">
              <div className="w-5 h-5 rounded-full bg-[#B88A44]/15 flex items-center justify-center text-[#B88A44]">
                <Check size={11} strokeWidth={3} />
              </div>
              <span>QR Sharing</span>
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT SIDE: CSS-Based Laptop & Mobile mockups with floating widgets */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut', delay: 0.15 }}
          className="lg:col-span-6 relative mt-12 lg:mt-0 flex justify-center lg:justify-end items-center h-[500px]"
        >
          {/* Relative wrapper anchor to tie widgets tightly to the laptop mockup */}
          <div className="relative w-full max-w-[480px]">
            {/* Laptop Mockup */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="relative w-full max-w-[480px] bg-white rounded-2xl shadow-[0_25px_60px_-15px_rgba(74,44,58,0.15)] border border-[#4A2C3A]/5 overflow-hidden z-10"
            >
              {/* Screen Top Bar */}
              <div className="bg-[#FAFAF8] border-b border-[#4A2C3A]/5 px-4 py-3 flex items-center space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/20 border border-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/20 border border-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400/20 border border-green-400" />
                <div className="w-2/3 h-4 bg-[#4A2C3A]/5 rounded-md mx-auto text-[9px] text-[#6B6B6B] flex items-center justify-center font-mono">
                  identiqal.com/jane-doe
                </div>
              </div>

              {/* Laptop Screen Content - Active Profile */}
              <div className="p-5 bg-white space-y-4">
                <div className="flex items-center space-x-3.5 pb-4 border-b border-[#4A2C3A]/5">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#4A2C3A] to-[#B88A44] flex items-center justify-center text-[#FAFAF8] font-bold text-base shadow-sm">
                    JD
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1A1A1A] text-sm">Jane Doe</h4>
                    <p className="text-xs text-[#B88A44] font-medium">Creative Director at Acme</p>
                  </div>
                </div>

                {/* Grid content mock */}
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="p-2 bg-[#FAFAF8] border border-[#4A2C3A]/5 rounded-lg flex items-center space-x-2">
                    <span className="text-[#4A2C3A]">💼</span>
                    <span className="font-medium text-[#1A1A1A]">Work Portfolio</span>
                  </div>
                  <div className="p-2 bg-[#FAFAF8] border border-[#4A2C3A]/5 rounded-lg flex items-center space-x-2">
                    <span className="text-[#4A2C3A]">📬</span>
                    <span className="font-medium text-[#1A1A1A]">Book Consultation</span>
                  </div>
                  <div className="p-2 bg-[#FAFAF8] border border-[#4A2C3A]/5 rounded-lg flex items-center space-x-2">
                    <span className="text-[#4A2C3A]">📷</span>
                    <span className="font-medium text-[#1A1A1A]">Design Gallery</span>
                  </div>
                  <div className="p-2 bg-[#FAFAF8] border border-[#4A2C3A]/5 rounded-lg flex items-center space-x-2">
                    <span className="text-[#4A2C3A]">📝</span>
                    <span className="font-medium text-[#1A1A1A]">Latest Insights</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Overlapping Mobile Mockup */}
            <motion.div
              animate={{ y: [0, -18, 0] }}
              transition={{ repeat: Infinity, duration: 3.6, ease: 'easeInOut' }}
              className="absolute -bottom-28 -left-36 w-[190px] bg-white rounded-[26px] shadow-[0_20px_50px_rgba(74,44,58,0.2)] border-[5px] border-[#4A2C3A] overflow-hidden hidden sm:block z-20 hover:scale-105 transition-all duration-300"
            >
              {/* Speaker & Camera notch */}
              <div className="absolute top-0 inset-x-0 h-4 bg-[#4A2C3A] flex justify-center items-center">
                <div className="w-12 h-1.5 bg-[#FAFAF8]/20 rounded-full" />
              </div>

              {/* Mobile Content */}
              <div className="pt-6 pb-4 px-3 bg-[#FAFAF8] space-y-3">
                <div className="text-center space-y-1">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#4A2C3A] to-[#B88A44] mx-auto flex items-center justify-center text-white font-bold text-xs">
                    JD
                  </div>
                  <h5 className="font-bold text-[#1A1A1A] text-[10px]">Jane Doe</h5>
                  <p className="text-[8px] text-[#6B6B6B]">Acme Inc.</p>
                </div>

                {/* Mobile Quick Contacts */}
                <div className="space-y-1.5">
                  <div className="w-full py-1.5 bg-[#4A2C3A] text-white text-[8px] font-bold rounded-md flex items-center justify-center shadow-sm">
                    Save Contact
                  </div>
                  <div className="w-full py-1.5 bg-white border border-[#4A2C3A]/10 text-[#4A2C3A] text-[8px] font-medium rounded-md flex items-center justify-center">
                    Get in Touch
                  </div>
                </div>
              </div>
            </motion.div>

            {/* FLOATING UI CARDS */}
            {/* 1. QR Code Card */}
            <motion.div
              animate={{ y: [0, -18, 0], x: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="absolute -top-4 -right-20 bg-white/95 backdrop-blur-sm p-2.5 rounded-xl border border-[#4A2C3A]/5 shadow-lg flex items-center space-x-2.5 z-35"
            >
              <div className="w-8 h-8 rounded-lg bg-[#4A2C3A]/5 flex items-center justify-center text-[#4A2C3A]">
                <QrCode size={16} />
              </div>
              <div>
                <p className="text-[9px] text-[#6B6B6B] font-medium">QR Profile Code</p>
                <p className="text-[10px] text-[#1A1A1A] font-bold">Instant Sharing</p>
              </div>
            </motion.div>

            {/* 2. Analytics Card */}
            <motion.div
              animate={{ y: [0, -22, 0], x: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3.4, ease: 'easeInOut' }}
              className="absolute top-1/2 -right-24 -translate-y-1/2 bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-[#4A2C3A]/5 shadow-lg flex flex-col space-y-1 z-35"
            >
              <div className="flex items-center justify-between space-x-4">
                <p className="text-[9px] text-[#6B6B6B] font-medium">Visitor Analytics</p>
                <TrendingUp size={12} className="text-green-500" />
              </div>
              <div className="flex items-baseline space-x-1">
                <span className="text-sm font-bold text-[#1A1A1A]">+384</span>
                <span className="text-[8px] text-green-500 font-bold">+12%</span>
              </div>
            </motion.div>

            {/* 3. AI Suggestions */}
            <motion.div
              animate={{ y: [0, -16, 0] }}
              transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
              className="absolute -top-16 left-12 bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-[#4A2C3A]/5 shadow-lg flex items-center space-x-2.5 z-35"
            >
              <div className="w-6 h-6 rounded-full bg-[#B88A44]/10 flex items-center justify-center text-[#B88A44]">
                <Sparkle size={12} fill="currentColor" />
              </div>
              <div className="text-left">
                <p className="text-[9px] text-[#6B6B6B] font-medium">AI Profile Suggestion</p>
                <p className="text-[10px] text-[#1A1A1A] font-bold">Add "React 19" to bio</p>
              </div>
            </motion.div>

            {/* 4. Lead Notification */}
            <motion.div
              animate={{ y: [0, -20, 0], x: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 3.6, ease: 'easeInOut' }}
              className="absolute -bottom-28 left-4 bg-white/95 backdrop-blur-sm px-3 py-2.5 rounded-xl border border-[#4A2C3A]/5 shadow-lg flex items-center space-x-2 z-35"
            >
              <div className="w-5 h-5 rounded-full bg-[#4A2C3A] flex items-center justify-center text-[#FAFAF8]">
                <MessageSquare size={10} />
              </div>
              <div>
                <p className="text-[9px] text-[#6B6B6B] font-medium">New Inquiry Lead</p>
                <p className="text-[10px] text-[#1A1A1A] font-semibold">Sarah: "Let's collaborate!"</p>
              </div>
            </motion.div>

            {/* 5. Contact Saved */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
              className="absolute -bottom-12 right-12 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full border border-[#4A2C3A]/5 shadow-md flex items-center space-x-1.5 z-35"
            >
              <UserCheck size={11} className="text-[#B88A44]" />
              <span className="text-[9px] text-[#1A1A1A] font-bold">Contact Saved</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
