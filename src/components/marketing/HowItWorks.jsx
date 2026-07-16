'use client';

import React from 'react';
import { UserCheck, Sliders, Globe, Share2, BarChart2 } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import AnimatedSection from '@/components/ui/AnimatedSection.jsx';

const steps = [
  {
    step: '01',
    icon: UserCheck,
    title: 'Create Profile',
    description: 'Sign up in seconds and claim your custom, unique profile username handle. Standard setup takes less than a minute.',
  },
  {
    step: '02',
    icon: Sliders,
    title: 'Customize Sections',
    description: 'Add layout blocks: about descriptions, links, contact inquiries, galleries, and portfolio showcases.',
  },
  {
    step: '03',
    icon: Globe,
    title: 'Publish',
    description: 'Publish your card instantly. Your profile is optimized for standard page loading speeds and SEO index compliance.',
  },
  {
    step: '04',
    icon: Share2,
    title: 'Share QR or Link',
    description: 'Share your card in one tap using NFC cards, your personal custom QR code, email signatures, or bio links.',
  },
  {
    step: '05',
    icon: BarChart2,
    title: 'Track Insights',
    description: 'Monitor page clicks, lead message inquiries, and view rates. Review metrics directly inside your dashboard.',
  },
];

const containerVariants = {
  hidden:   {},
  visible:  { transition: { staggerChildren: 0.14 } },
};

const stepVariants = {
  hidden:   { opacity: 0, y: 32, filter: 'blur(6px)' },
  visible:  { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export const HowItWorks = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="how-it-works" className="py-24 bg-[#FAFAF8] border-t border-[#4A2C3A]/5 scroll-mt-16 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-24 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#4A2C3A]/5 text-xs font-semibold text-[#4A2C3A] tracking-wider uppercase">
            <span>Process Flow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A]">
            How Identiqal Works
          </h2>
          <p className="text-[#6B6B6B] text-base leading-relaxed">
            Go from a blank profile to a premium, published smart digital card in five simple steps.
          </p>
        </AnimatedSection>

        <div className="relative">
          {/* Connecting line */}
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="absolute top-[38px] left-0 right-0 h-[2px] bg-gradient-to-r from-[#4A2C3A]/15 via-[#B88A44]/35 to-[#4A2C3A]/15 hidden lg:block z-0"
          />

          {/* Steps */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid lg:grid-cols-5 gap-12 lg:gap-8 relative z-10"
          >
            {steps.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  variants={shouldReduceMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : stepVariants}
                  className="flex flex-col items-center text-center group cursor-default"
                >
                  {/* Step node */}
                  <motion.div
                    whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                    className="relative w-20 h-20 rounded-full bg-[#4A2C3A] border-4 border-[#FAFAF8] shadow-[0_8px_30px_rgba(74,44,58,0.18)] flex items-center justify-center mb-6 z-10"
                  >
                    {/* Outer glow ring on hover */}
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      whileHover={shouldReduceMotion ? {} : { scale: 1.15, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                      className="absolute inset-0 rounded-full border border-[#B88A44]/60"
                    />

                    {/* Glow pulse */}
                    <motion.div
                      animate={shouldReduceMotion ? {} : {
                        boxShadow: [
                          '0 0 0 0 rgba(74,44,58,0)',
                          '0 0 0 10px rgba(74,44,58,0.08)',
                          '0 0 0 0 rgba(74,44,58,0)',
                        ],
                      }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.4 }}
                      className="absolute inset-0 rounded-full"
                    />

                    <motion.div
                      whileHover={shouldReduceMotion ? {} : { rotate: 12, scale: 1.1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                    >
                      <Icon className="text-[#FAFAF8]" size={22} />
                    </motion.div>

                    {/* Step label badge */}
                    <span className="absolute -bottom-2 right-[-8px] text-[10px] font-black bg-[#B88A44] text-[#FAFAF8] px-1.5 py-0.5 rounded-full shadow-sm">
                      {item.step}
                    </span>
                  </motion.div>

                  <h3 className="text-base font-bold text-[#1A1A1A] mb-2 font-sans">{item.title}</h3>
                  <p className="text-xs text-[#6B6B6B] leading-relaxed max-w-xs font-sans">{item.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
