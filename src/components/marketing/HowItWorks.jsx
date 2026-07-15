'use client';

import React from 'react';
import { UserCheck, Sliders, Globe, Share2, BarChart2 } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export const HowItWorks = () => {
  const shouldReduceMotion = useReducedMotion();

  const steps = [
    {
      step: '01',
      icon: <UserCheck className="text-[#FAFAF8]" size={22} />,
      title: 'Create Profile',
      description: 'Sign up in seconds and claim your custom, unique profile username handle. Standard setup takes less than a minute.',
    },
    {
      step: '02',
      icon: <Sliders className="text-[#FAFAF8]" size={22} />,
      title: 'Customize Sections',
      description: 'Add layout blocks: about descriptions, links, contact inquiries, galleries, and portfolio showcases.',
    },
    {
      step: '03',
      icon: <Globe className="text-[#FAFAF8]" size={22} />,
      title: 'Publish',
      description: 'Publish your card instantly. Your profile is optimized for standard page loading speeds and SEO index compliance.',
    },
    {
      step: '04',
      icon: <Share2 className="text-[#FAFAF8]" size={22} />,
      title: 'Share QR or Link',
      description: 'Share your card in one tap using NFC cards, your personal custom QR code, email signatures, or bio links.',
    },
    {
      step: '05',
      icon: <BarChart2 className="text-[#FAFAF8]" size={22} />,
      title: 'Track Insights',
      description: 'Monitor page clicks, lead message inquiries, and view rates. Review metrics directly inside your dashboard.',
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const stepVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section id="how-it-works" className="py-24 bg-[#FAFAF8] border-t border-[#4A2C3A]/5 scroll-mt-16 relative">
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-24 space-y-4"
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#4A2C3A]/5 text-xs font-semibold text-[#4A2C3A] tracking-wider uppercase">
            <span>Process Flow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A]">
            How Identiqal Works
          </h2>
          <p className="text-[#6B6B6B] text-base leading-relaxed">
            Go from a blank profile to a premium, published smart digital card in five simple steps.
          </p>
        </motion.div>

        {/* Timeline container */}
        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: 'easeInOut', delay: 0.2 }}
            className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-[#4A2C3A]/20 via-[#B88A44]/30 to-[#4A2C3A]/20 -translate-y-12 hidden lg:block z-0"
          />

          {/* Steps Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid lg:grid-cols-5 gap-12 lg:gap-8 relative z-10"
          >
            {steps.map((item, index) => (
              <motion.div
                key={index}
                variants={stepVariants}
                className="flex flex-col items-center text-center group cursor-default"
              >
                {/* Step Node Icon */}
                <motion.div
                  whileHover={shouldReduceMotion ? {} : { scale: 1.08 }}
                  className="relative w-20 h-20 rounded-full bg-[#4A2C3A] border-4 border-[#FAFAF8] shadow-[0_8px_30px_rgba(74,44,58,0.15)] flex items-center justify-center mb-6 transition-all duration-300 relative z-10"
                >
                  {/* Subtle outer glow element */}
                  <div className="absolute inset-0 rounded-full border border-[#B88A44] scale-95 opacity-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-300" />
                  
                  {item.icon}
                  
                  {/* Small step label */}
                  <span className="absolute -bottom-2 right-[-8px] text-[10px] font-black bg-[#B88A44] text-[#FAFAF8] px-1.5 py-0.5 rounded-full shadow-sm">
                    {item.step}
                  </span>
                </motion.div>

                {/* Text Content */}
                <h3 className="text-base font-bold text-[#1A1A1A] mb-2 font-sans">
                  {item.title}
                </h3>
                <p className="text-xs text-[#6B6B6B] leading-relaxed max-w-xs font-sans">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
