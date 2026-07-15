'use client';

import React from 'react';
import { Layers, Sparkles, QrCode, LineChart, Inbox, Palette } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export const SectionShowcase = () => {
  const shouldReduceMotion = useReducedMotion();

  const features = [
    {
      icon: <Layers size={22} className="text-[#4A2C3A]" />,
      title: 'Drag & Drop Builder',
      description: 'Design and organize your digital card blocks in real-time. Pick links, forms, socials, and portfolio carousels instantly.',
    },
    {
      icon: <Sparkles size={22} className="text-[#B88A44]" />,
      title: 'AI Smart Introduction',
      description: 'Let our integrated AI assistant scan your achievements and draft a compelling elevator pitch customized to your audience.',
    },
    {
      icon: <QrCode size={22} className="text-[#4A2C3A]" />,
      title: 'Smart QR Modes',
      description: 'Dynamic QR codes redirectable on the fly. Switch from sharing your full contact profile to a direct LinkedIn page instantly.',
    },
    {
      icon: <LineChart size={22} className="text-[#B88A44]" />,
      title: 'Profile Replay Analytics',
      description: 'Detailed analytics tracking who, where, and when visitors view your page, click your buttons, or download your vCard.',
    },
    {
      icon: <Inbox size={22} className="text-[#4A2C3A]" />,
      title: 'Lead Collection',
      description: 'Seamless custom contact forms built directly into your card. Notifications deliver inquiries straight to your inbox.',
    },
    {
      icon: <Palette size={22} className="text-[#B88A44]" />,
      title: 'Multiple Themes',
      description: 'Switch between minimal, bold, luxury, and dark themes. Adapt color palettes to match your company logo branding rules.',
    },
  ];

  const gridVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section id="features" className="py-24 bg-[#FAFAF8] border-t border-[#4A2C3A]/5 scroll-mt-16 relative">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] rounded-full bg-[#B88A44]/3 blur-[90px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#4A2C3A]/3 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20 space-y-4"
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#B88A44]/10 text-xs font-semibold text-[#B88A44] tracking-wider uppercase">
            <span>Features Overview</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] tracking-tight">
            Designed for the Future of Networking
          </h2>
          <p className="text-[#6B6B6B] text-base leading-relaxed">
            A comprehensive suite of premium tools built to capture leads, share credentials instantly, and analyze interactions in real time.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={
                shouldReduceMotion
                  ? {}
                  : {
                      y: -8,
                      scale: 1.02,
                      borderColor: 'rgba(184, 138, 68, 0.3)',
                      boxShadow: '0 20px 40px -15px rgba(74, 44, 58, 0.08)',
                    }
              }
              className="group relative overflow-hidden bg-white/50 backdrop-blur-md border border-[#4A2C3A]/5 rounded-2xl p-8 transition-all duration-300 cursor-pointer"
            >
              {/* Subtle hover gradient glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#B88A44]/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Icon Frame */}
              <div className="w-12 h-12 rounded-xl bg-[#FAFAF8] border border-[#4A2C3A]/5 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300 shadow-sm relative z-10">
                <div className="absolute inset-0 bg-[#B88A44]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-3 relative z-10 font-sans">
                {feature.title}
              </h3>
              <p className="text-sm text-[#6B6B6B] leading-relaxed relative z-10 font-sans">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
