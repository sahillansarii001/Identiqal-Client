'use client';

import React from 'react';
import { Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/ui/AnimatedSection.jsx';
import { useSafeReducedMotion } from '@/hooks/useSafeReducedMotion.js';

const comparisonRows = [
  { feature: 'Editable',             traditional: 'No (requires reprinting)',        identiqal: '⚡ Instant (edit from dashboard)' },
  { feature: 'Visitor Analytics',    traditional: 'Zero (no trackability)',           identiqal: '📈 Deep (clicks, geolocation, devices)' },
  { feature: 'Lead Collection',      traditional: 'Manual (collect paper forms)',     identiqal: '📬 Automated (embedded inquiry forms)' },
  { feature: 'QR Sharing',           traditional: 'None (static printed if any)',     identiqal: '📲 Dynamic (redirectable QR codes)' },
  { feature: 'AI Support',           traditional: 'None',                             identiqal: '🤖 AI Bio introductions & tips' },
  { feature: 'Always Updated',       traditional: 'Outdated on job change',           identiqal: '✨ Real-time sync on save' },
  { feature: 'Information Capacity', traditional: 'Limited card dimensions',          identiqal: '🌐 Unlimited blocks, portfolios & files' },
];

const rowVariants = {
  hidden:   { opacity: 0, x: -12, filter: 'blur(4px)' },
  visible:  { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const tableVariants = {
  hidden:   {},
  visible:  { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
};

export const ProblemFraming = () => {
  const shouldReduceMotion = useSafeReducedMotion();

  return (
    <section id="about" className="py-24 bg-[#FAFAF8] border-t border-[#4A2C3A]/5 scroll-mt-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#B88A44]/10 text-xs font-semibold text-[#B88A44] tracking-wider uppercase">
            <span>Comparison Table</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A]">
            Why Switch to Identiqal?
          </h2>
          <p className="text-[#6B6B6B] text-base leading-relaxed">
            See how traditional paper business cards compare to our dynamic, AI-powered smart digital profiles.
          </p>
        </AnimatedSection>

        {/* Table */}
        <AnimatedSection delay={0.1}>
          <div className="overflow-x-auto rounded-2xl border border-[#4A2C3A]/6 shadow-lg bg-white/50 backdrop-blur-md">
            <table className="w-full border-collapse text-left text-sm font-sans">
              <thead>
                <tr className="border-b border-[#4A2C3A]/6 bg-[#4A2C3A]/4 text-[#4A2C3A] font-bold text-xs uppercase tracking-wider">
                  <th className="p-6">Feature / Ability</th>
                  <th className="p-6">Traditional Card</th>
                  <th className="p-6 bg-[#4A2C3A]/4">Identiqal Profile</th>
                </tr>
              </thead>
              <motion.tbody
                variants={tableVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                className="divide-y divide-[#4A2C3A]/5"
              >
                {comparisonRows.map((row, index) => (
                  <motion.tr
                    key={index}
                    variants={shouldReduceMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : rowVariants}
                    whileHover={shouldReduceMotion ? {} : { backgroundColor: 'rgba(74, 44, 58, 0.025)' }}
                    className="transition-colors duration-200"
                  >
                    <td className="p-6 font-bold text-[#1A1A1A]">{row.feature}</td>
                    <td className="p-6 text-[#6B6B6B] font-medium">
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                          <X size={12} />
                        </span>
                        <span>{row.traditional}</span>
                      </div>
                    </td>
                    <td className="p-6 text-[#1A1A1A] font-semibold bg-[#4A2C3A]/3">
                      <div className="flex items-center space-x-2">
                        <motion.span
                          whileHover={shouldReduceMotion ? {} : { scale: 1.2, rotate: 10 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                          className="w-5 h-5 rounded-full bg-[#B88A44]/15 flex items-center justify-center text-[#B88A44] shrink-0"
                        >
                          <Check size={12} strokeWidth={3} />
                        </motion.span>
                        <span>{row.identiqal}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
