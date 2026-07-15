'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/ui/AnimatedSection.jsx';
import { useSafeReducedMotion } from '@/hooks/useSafeReducedMotion.js';

export const FinalCTA = () => {
  const shouldReduceMotion = useSafeReducedMotion();

  return (
    <section className="py-20 bg-[#FAFAF8] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <AnimatedSection>
          <div className="relative rounded-[36px] bg-[#4A2C3A] border border-[#B88A44]/25 px-8 py-16 sm:px-16 sm:py-24 text-center overflow-hidden shadow-[0_30px_70px_rgba(74,44,58,0.28)]">

            {/* Animated radial glow */}
            <motion.div
              animate={shouldReduceMotion ? {} : {
                opacity: [0.5, 0.9, 0.5],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#B88A44]/18 to-transparent blur-[110px] pointer-events-none"
            />

            {/* Subtle grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

            {/* Decorative corner blobs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#B88A44]/5 rounded-full blur-[60px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#B88A44]/5 rounded-full blur-[50px] pointer-events-none" />

            {/* Badge */}
            <motion.div
              animate={shouldReduceMotion ? {} : { scale: [1, 1.03, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10 inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/6 border border-white/10 text-xs font-semibold text-[#FAFAF8] mb-6"
            >
              <Sparkles size={11} className="text-[#B88A44]" />
              <span>Claim your unique handle name slug today</span>
            </motion.div>

            {/* Heading */}
            <h2 className="relative z-10 text-3xl sm:text-5xl font-extrabold text-[#FAFAF8] tracking-tight leading-tight max-w-3xl mx-auto font-sans">
              Make Every First{' '}
              <motion.span
                animate={shouldReduceMotion ? {} : {
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  background: 'linear-gradient(135deg, #B88A44 0%, #E2B96B 40%, #C89B5B 70%, #B88A44 100%)',
                  backgroundSize: '200% 200%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Impression
              </motion.span>{' '}
              Count.
            </h2>

            {/* Subtitle */}
            <p className="relative z-10 text-sm sm:text-base text-zinc-300 max-w-xl mx-auto mt-6 leading-relaxed">
              Upgrade your digital card setup today. Create your smart portfolio identity, collect client inquiries,
              and monitor analytic views in minutes.
            </p>

            {/* CTA Buttons */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-10">
              <Link href="/signup" className="w-full sm:w-auto">
                <motion.button
                  whileHover={shouldReduceMotion ? {} : {
                    scale: 1.05,
                    y: -3,
                    boxShadow: '0 16px 40px rgba(184, 138, 68, 0.4)',
                  }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                  className="group w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#B88A44] hover:bg-[#a37938] text-[#FAFAF8] font-bold px-8 py-4 rounded-xl shadow-lg shadow-[#B88A44]/25 transition-colors duration-300 border border-[#B88A44]"
                >
                  <span>Get Started Free</span>
                  <motion.div
                    animate={shouldReduceMotion ? {} : { x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <ArrowRight size={14} />
                  </motion.div>
                </motion.button>
              </Link>

              <motion.button
                whileHover={shouldReduceMotion ? {} : {
                  scale: 1.04,
                  y: -2,
                  boxShadow: '0 8px 24px rgba(255,255,255,0.08)',
                }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold backdrop-blur-sm transition-colors duration-300"
              >
                <span>Book a Demo</span>
              </motion.button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
