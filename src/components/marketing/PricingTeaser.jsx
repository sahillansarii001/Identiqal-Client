'use client';

import React from 'react';
import Link from 'next/link';
import { Check, Star } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export const PricingTeaser = () => {
  const shouldReduceMotion = useReducedMotion();

  const plans = [
    {
      name: 'Free Starter',
      price: '$0',
      description: 'Ideal for individual networking starters.',
      features: [
        '1 Active Digital Business Card',
        'Standard Layout Section Blocks',
        'Basic Colors and Layout Settings',
        'Standard Performance Analytics',
      ],
      buttonText: 'Sign Up Free',
      href: '/signup',
      featured: false,
    },
    {
      name: 'Professional Pro',
      price: '$9',
      period: '/mo',
      description: 'Elevate your professional brand visibility.',
      features: [
        'Unlimited Active Digital Cards',
        'AI Smart Intro Writer Assistant',
        'AI suggestions & completeness review',
        'Deep Analytics Dashboards (clicks, location)',
        'Export captured inquiry leads to CSV',
        'Download high-res dynamic vector QRs',
      ],
      buttonText: 'Get Started Pro',
      href: '/signup?tier=pro',
      featured: true,
    },
    {
      name: 'Enterprise Business',
      price: '$29',
      period: '/mo',
      description: 'Empower your teams and organization workspaces.',
      features: [
        'Includes 10 Admin Member Seats',
        'Corporate Theme Style Locking controls',
        'Aggregated Corporate Team Analytics',
        'Workspace Member Invitation invitation access',
        'Dedicated SLA Premium support agent',
      ],
      buttonText: 'Start Business Plan',
      href: '/signup?tier=business',
      featured: false,
    },
  ];

  const gridVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
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
    <section id="pricing" className="py-24 bg-[#FAFAF8] border-t border-[#4A2C3A]/5 scroll-mt-16 relative">
      {/* Background radial effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-[#B88A44]/3 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20 space-y-4"
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#B88A44]/10 text-xs font-semibold text-[#B88A44] tracking-wider uppercase">
            <span>Plans & Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A]">
            Simple, Transparent Pricing
          </h2>
          <p className="text-[#6B6B6B] text-base leading-relaxed">
            Choose the subscription plan that fits your personal requirements or company workspace.
          </p>
        </motion.div>

        {/* Pricing Cards Grid */}
        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto"
        >
          {plans.map((plan, index) => {
            const isPro = plan.featured;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                animate={
                  isPro && !shouldReduceMotion
                    ? { y: [0, -4, 0] }
                    : {}
                }
                transition={
                  isPro && !shouldReduceMotion
                    ? { repeat: Infinity, duration: 6, ease: 'easeInOut' }
                    : {}
                }
                whileHover={
                  shouldReduceMotion
                    ? {}
                    : {
                        y: isPro ? -8 : -6,
                        scale: 1.02,
                        borderColor: 'rgba(184, 138, 68, 0.3)',
                        boxShadow: '0 25px 50px -12px rgba(74, 44, 58, 0.1)',
                      }
                }
                className={`flex flex-col border rounded-[28px] p-8 relative transition-all duration-300 bg-white/60 backdrop-blur-md cursor-pointer ${
                  isPro
                    ? 'border-[#B88A44] border-2 shadow-[0_20px_50px_-10px_rgba(184,138,68,0.15)] z-10'
                    : 'border-[#4A2C3A]/5'
                }`}
              >
                {isPro && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-[#B88A44] rounded-full text-[9px] font-bold text-[#FAFAF8] uppercase tracking-wider shadow-md shadow-[#B88A44]/20 flex items-center space-x-1">
                    <Star size={8} fill="currentColor" />
                    <span>Most Popular</span>
                  </span>
                )}

                <div className="mb-6 text-left">
                  <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">{plan.name}</h3>
                  <div className="flex items-baseline space-x-1 mb-3">
                    <span className="text-4xl font-black text-[#1A1A1A]">{plan.price}</span>
                    {plan.period && <span className="text-xs text-[#6B6B6B] font-semibold">{plan.period}</span>}
                  </div>
                  <p className="text-xs text-[#6B6B6B] leading-relaxed">{plan.description}</p>
                </div>

                <div className="flex-1 space-y-3.5 mb-8 border-t border-[#4A2C3A]/5 pt-6 text-left">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start space-x-2.5 text-xs text-[#6B6B6B]">
                      <Check size={14} className="text-[#B88A44] shrink-0 mt-0.5" strokeWidth={3} />
                      <span className="leading-normal">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link href={plan.href} className="w-full mt-auto">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold transition-all duration-300 border ${
                      isPro
                        ? 'bg-[#4A2C3A] text-white border-[#4A2C3A] hover:bg-[#3d2430] shadow-md shadow-[#4A2C3A]/10'
                        : 'bg-white text-[#4A2C3A] border-[#4A2C3A]/10 hover:border-[#4A2C3A]/30 hover:bg-[#FAFAF8]'
                    }`}
                  >
                    {plan.buttonText}
                  </motion.button>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
