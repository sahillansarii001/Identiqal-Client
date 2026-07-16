'use client';

import React from 'react';
import { Layers, Sparkles, QrCode, LineChart, Inbox, Palette } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import AnimatedSection from '@/components/ui/AnimatedSection.jsx';

const features = [
  {
    icon: Layers,
    iconColor: '#4A2C3A',
    title: 'Drag & Drop Builder',
    description: 'Design and organize your digital card blocks in real-time. Pick links, forms, socials, and portfolio carousels instantly.',
  },
  {
    icon: Sparkles,
    iconColor: '#B88A44',
    title: 'AI Smart Introduction',
    description: 'Let our integrated AI assistant scan your achievements and draft a compelling elevator pitch customized to your audience.',
  },
  {
    icon: QrCode,
    iconColor: '#4A2C3A',
    title: 'Smart QR Modes',
    description: 'Dynamic QR codes redirectable on the fly. Switch from sharing your full contact profile to a direct LinkedIn page instantly.',
  },
  {
    icon: LineChart,
    iconColor: '#B88A44',
    title: 'Profile Replay Analytics',
    description: 'Detailed analytics tracking who, where, and when visitors view your page, click your buttons, or download your vCard.',
  },
  {
    icon: Inbox,
    iconColor: '#4A2C3A',
    title: 'Lead Collection',
    description: 'Seamless custom contact forms built directly into your card. Notifications deliver inquiries straight to your inbox.',
  },
  {
    icon: Palette,
    iconColor: '#B88A44',
    title: 'Multiple Themes',
    description: 'Switch between minimal, bold, luxury, and dark themes. Adapt color palettes to match your company logo branding rules.',
  },
];

const gridVariants = {
  hidden:   {},
  visible:  { transition: { staggerChildren: 0.09 } },
};

const cardVariants = {
  hidden:   { opacity: 0, y: 28, filter: 'blur(6px)' },
  visible:  {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.62, ease: [0.16, 1, 0.3, 1] },
  },
};

export const SectionShowcase = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="features" className="py-24 bg-[#FAFAF8] border-t border-[#4A2C3A]/5 scroll-mt-16 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="blob-1 absolute top-1/3 left-1/4 w-[350px] h-[350px] rounded-full bg-[#B88A44]/5 blur-[90px]" />
        <div className="blob-2 absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#4A2C3A]/4 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#B88A44]/10 text-xs font-semibold text-[#B88A44] tracking-wider uppercase">
            <span>Features Overview</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] tracking-tight">
            Designed for the Future of Networking
          </h2>
          <p className="text-[#6B6B6B] text-base leading-relaxed">
            A comprehensive suite of premium tools built to capture leads, share credentials instantly, and analyze interactions in real time.
          </p>
        </AnimatedSection>

        {/* Feature Grid */}
        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={shouldReduceMotion ? {} : cardVariants}
                initial={shouldReduceMotion ? { opacity: 0 } : undefined}
                whileInView={shouldReduceMotion ? { opacity: 1 } : undefined}
                viewport={{ once: true }}
                whileHover={shouldReduceMotion ? {} : {
                  y: -8,
                  scale: 1.02,
                  rotate: 1,
                  boxShadow: '0 24px 52px -12px rgba(74, 44, 58, 0.14)',
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                className="group relative overflow-hidden bg-white/55 backdrop-blur-md border border-[#4A2C3A]/6 rounded-2xl p-8 cursor-pointer"
                style={{ transformOrigin: 'bottom center' }}
              >
                {/* Gradient glow on hover */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-br from-[#B88A44]/5 via-transparent to-[#4A2C3A]/3 pointer-events-none rounded-2xl"
                />

                {/* Border glow ring */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{ boxShadow: 'inset 0 0 0 1px rgba(184, 138, 68, 0.25)' }}
                />

                {/* Icon container */}
                <motion.div
                  whileHover={shouldReduceMotion ? {} : { scale: 1.1, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="w-12 h-12 rounded-xl bg-[#FAFAF8] border border-[#4A2C3A]/6 flex items-center justify-center mb-6 shadow-sm relative z-10"
                >
                  <div className="absolute inset-0 rounded-xl bg-[#B88A44]/6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Icon size={22} color={feature.iconColor} className="relative z-10" />
                </motion.div>

                <h3 className="text-lg font-bold text-[#1A1A1A] mb-3 relative z-10 font-sans">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#6B6B6B] leading-relaxed relative z-10 font-sans">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
