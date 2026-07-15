'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import AnimatedSection from '@/components/ui/AnimatedSection.jsx';

const reviews = [
  {
    name: 'Sarah Connor',
    role: 'CEO, Skynet Logistics',
    quote: 'Identiqal completely changed how our sales team presents itself. Sharing our credentials and calendar scheduler is now down to one tap.',
    initials: 'SC',
  },
  {
    name: 'Marcus Wright',
    role: 'Founder, Project Apex',
    quote: 'The AI Smart Introduction drafted a bio better than what I spent days writing myself. Absolute game changer for early-stage startup pitching.',
    initials: 'MW',
  },
  {
    name: 'Elena Rostova',
    role: 'Creative Director, NeoDesign',
    quote: 'The Luxury Gold theme fits our high-end agency branding rules flawlessly. The real-time visitor analytics are deeply insightful.',
    initials: 'ER',
  },
  {
    name: 'David Vance',
    role: 'VP Marketing, CloudCore',
    quote: 'We print dynamic QR codes on our corporate booths. Collecting leads directly into our dashboard csv is seamless.',
    initials: 'DV',
  },
  {
    name: 'Maya Lin',
    role: 'Independent Architect',
    quote: 'I love the minimalist aesthetic. It feels elegant, loads instantly, and holds all my portfolio link folders without looking cluttered.',
    initials: 'ML',
  },
];

// Triple the list for seamless infinite loop
const scrollList = [...reviews, ...reviews, ...reviews];

export const Testimonials = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-24 bg-[#FAFAF8] border-t border-[#4A2C3A]/5 overflow-hidden relative">
      <AnimatedSection className="max-w-7xl mx-auto px-6 mb-16 text-center space-y-4">
        <motion.div
          animate={shouldReduceMotion ? {} : { scale: [1, 1.025, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#B88A44]/10 text-xs font-semibold text-[#B88A44] tracking-wider uppercase"
        >
          <span>Social Proof</span>
        </motion.div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A]">
          Loved by Industry Professionals
        </h2>
        <p className="text-[#6B6B6B] text-base max-w-2xl mx-auto">
          Hear from founders, designers, and sales leaders who replaced paper cards with Identiqal smart digital profiles.
        </p>
      </AnimatedSection>

      {/* Marquee container — pauses on hover */}
      <div className="relative w-full overflow-hidden flex items-center select-none mask-fade group">
        <div className={`flex space-x-6 min-w-full py-4 ${shouldReduceMotion ? '' : 'animate-marquee-slow group-hover:[animation-play-state:paused]'}`}>
          {scrollList.map((review, index) => (
            <motion.div
              key={index}
              whileHover={shouldReduceMotion ? {} : {
                y: -6,
                scale: 1.02,
                boxShadow: '0 20px 40px -12px rgba(74, 44, 58, 0.12)',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              className="group/card bg-white/55 border border-[#4A2C3A]/6 backdrop-blur-md p-6 rounded-2xl w-[320px] shrink-0 flex flex-col justify-between cursor-default relative overflow-hidden"
            >
              {/* Border glow on hover */}
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{ boxShadow: 'inset 0 0 0 1px rgba(184,138,68,0.2)' }}
              />

              <div className="space-y-4">
                {/* Stars */}
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.05 * i, type: 'spring', stiffness: 400, damping: 18 }}
                    >
                      <Star size={13} fill="#B88A44" className="text-[#B88A44]" />
                    </motion.div>
                  ))}
                </div>

                <p className="text-xs text-[#6B6B6B] leading-relaxed italic">
                  "{review.quote}"
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center space-x-3 mt-6 pt-4 border-t border-[#4A2C3A]/5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#4A2C3A] to-[#B88A44] flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
                  {review.initials}
                </div>
                <div>
                  <h4 className="font-bold text-[#1A1A1A] text-xs font-sans">{review.name}</h4>
                  <p className="text-[10px] text-[#6B6B6B] font-sans">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
