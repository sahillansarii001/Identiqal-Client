'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/marketing/Navbar.jsx';
import { Footer } from '@/components/marketing/Footer.jsx';
import { Button } from '@/components/ui/Button.jsx';
import { Check, HelpCircle, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import FaqAccordion from '@/components/ui/FaqAccordion.jsx';

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState('monthly'); // 'monthly' | 'yearly'

  const plans = [
    {
      name: 'Free Draft',
      price: '$0',
      description: 'Ideal for testing features and creating a personal draft card.',
      features: [
        '1 Active Digital Business Card',
        'Standard Layout Sections',
        'Basic Custom Backgrounds',
        'Direct Link / URL Slug',
      ],
      buttonText: 'Get Started Free',
      href: '/signup',
      featured: false,
    },
    {
      name: 'Pro Networker',
      price: billingPeriod === 'monthly' ? '$9' : '$7',
      period: '/month',
      description: 'For professionals wanting advanced capture forms and full custom themes.',
      features: [
        'Unlimited Active Cards',
        'Access to Form Inquiry Blocks',
        'Access to Testimonials Block',
        'Custom Branding Hex Colors',
        'Interactive QR Code Sharing',
        'Performance Analytics logs',
      ],
      buttonText: 'Upgrade to Pro',
      href: '/signup',
      featured: true,
    },
    {
      name: 'Business Team',
      price: billingPeriod === 'monthly' ? '$29' : '$24',
      period: '/month',
      description: 'For corporate teams and organizations requiring shared templates and seats.',
      features: [
        'Everything in Pro Plan',
        'Centralized Theme Locks',
        'Up to 10 Member Seats',
        'Shared Brand Templates',
        'Priority Customer Support',
        'CSV Logs Export download',
      ],
      buttonText: 'Contact Teams',
      href: '/signup',
      featured: false,
    },
  ];

  const faqs = [
    {
      q: 'Can I change my plan tier later?',
      a: 'Yes, you can upgrade, downgrade, or cancel your active subscription anytime directly from your dashboard billing settings panel.',
    },
    {
      q: 'Do you charge transaction fees on leads?',
      a: 'No! We do not charge any transaction fees or commission. All leads captured belong entirely to you.',
    },
    {
      q: 'Is there a limit on card views?',
      a: 'Absolutely not. All plan tiers include unlimited scan and page view bandwidth for published digital cards.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F6] text-[#1F1F1F]">
      <Navbar />
      
      <main className="flex-1 py-24">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#B88A44]/10 text-xs font-semibold text-[#B88A44] tracking-wider uppercase mb-4">
            <span>Pricing Options</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#1F1F1F] tracking-tight mb-4 font-sans">
            Simple, honest pricing.
          </h1>
          <p className="text-[#6B6B6B] text-base max-w-2xl mx-auto font-medium">
            Choose the plan that suits your personal branding or organizational requirements. No hidden setup fees.
          </p>

          {/* Toggle */}
          <div className="mt-8 flex justify-center">
            <div className="relative border border-[#E9E2DC] rounded-xl p-1 bg-white flex space-x-1 shadow-sm">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  billingPeriod === 'monthly' ? 'bg-[#5A3342] text-white' : 'text-[#6B6B6B] hover:text-[#1F1F1F]'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  billingPeriod === 'yearly' ? 'bg-[#5A3342] text-white' : 'text-[#6B6B6B] hover:text-[#1F1F1F]'
                }`}
              >
                Yearly Billing (Save 20%)
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Matrix */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-24">
          <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`flex flex-col border rounded-[28px] p-8 bg-white relative transition-all duration-300 ${
                  plan.featured
                    ? 'border-[#C89B5B] border-2 shadow-[0_20px_50px_-10px_rgba(90,51,66,0.12)] md:scale-[1.03] z-10'
                    : 'border-[#E9E2DC] hover:border-[#5A3342]/30 hover:scale-[1.01]'
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-[#C89B5B] rounded-full text-[9px] font-bold text-white uppercase tracking-wider shadow-md shadow-[#C89B5B]/25 flex items-center space-x-1">
                    <Star size={8} fill="currentColor" />
                    <span>Most Popular</span>
                  </span>
                )}

                <div className="mb-6 text-left">
                  <h3 className="text-lg font-bold text-[#1F1F1F] mb-2">{plan.name}</h3>
                  <div className="flex items-baseline space-x-1 mb-2">
                    <span className="text-3xl sm:text-4xl font-black text-[#1F1F1F]">{plan.price}</span>
                    {plan.period && <span className="text-xs text-[#6B6B6B] font-semibold">{plan.period}</span>}
                  </div>
                  <p className="text-xs text-[#6B6B6B] leading-relaxed">{plan.description}</p>
                </div>

                <div className="flex-1 space-y-3.5 mb-8 border-t border-[#E9E2DC] pt-6 text-left">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start space-x-2 text-xs text-[#6B6B6B]">
                      <Check size={14} className="text-[#C89B5B] shrink-0 mt-0.5" strokeWidth={3} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Link href={plan.href} className="w-full mt-auto">
                  <button
                    className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold transition-all duration-300 border ${
                      plan.featured
                        ? 'bg-[#5A3342] text-white border-[#5A3342] hover:bg-[#6A3B4B] shadow-md shadow-[#5A3342]/10'
                        : 'bg-white text-[#5A3342] border-[#E9E2DC] hover:border-[#5A3342]/30 hover:bg-[#FAF8F6]'
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Comparison Table */}
        <section className="max-w-4xl mx-auto px-6 mb-24 text-left">
          <h2 className="text-2xl font-bold text-[#1F1F1F] text-center mb-12">Detailed Feature Comparison</h2>
          <div className="overflow-x-auto rounded-2xl border border-[#E9E2DC] shadow-sm shadow-[#5A3342]/3 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E9E2DC] bg-[#FAF8F6] font-bold text-xs uppercase tracking-wider text-[#5A3342]">
                  <th className="p-4">Feature</th>
                  <th className="p-4">Free Draft</th>
                  <th className="p-4">Pro Networker</th>
                  <th className="p-4">Business Team</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E2DC] text-xs font-semibold">
                <tr className="hover:bg-[#FAF8F6]/50">
                  <td className="p-4 font-bold text-[#1F1F1F]">Active Cards</td>
                  <td className="p-4 text-[#6B6B6B]">1 Card</td>
                  <td className="p-4 text-[#1F1F1F]">Unlimited</td>
                  <td className="p-4 text-[#1F1F1F]">Unlimited</td>
                </tr>
                <tr className="hover:bg-[#FAF8F6]/50">
                  <td className="p-4 font-bold text-[#1F1F1F]">Inquiry Forms</td>
                  <td className="p-4 text-[#6B6B6B]">Standard</td>
                  <td className="p-4 text-[#1F1F1F]">Custom Form Blocks</td>
                  <td className="p-4 text-[#1F1F1F]">Workspace Control</td>
                </tr>
                <tr className="hover:bg-[#FAF8F6]/50">
                  <td className="p-4 font-bold text-[#1F1F1F]">Design customization</td>
                  <td className="p-4 text-[#6B6B6B]">Default Templates</td>
                  <td className="p-4 text-[#1F1F1F]">Full Hex Custom Theme</td>
                  <td className="p-4 text-[#1F1F1F]">Admin Theme Locks</td>
                </tr>
                <tr className="hover:bg-[#FAF8F6]/50">
                  <td className="p-4 font-bold text-[#1F1F1F]">Member Seats</td>
                  <td className="p-4 text-[#6B6B6B]">1 Seat</td>
                  <td className="p-4 text-[#6B6B6B]">1 Seat</td>
                  <td className="p-4 text-[#1F1F1F]">Up to 10 Seats</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ Area */}
        <div className="max-w-4xl mx-auto px-6 border-t border-[#E9E2DC] pt-20">
          <h2 className="text-2xl font-bold text-[#1F1F1F] text-center mb-12 flex items-center justify-center space-x-2">
            <HelpCircle className="text-[#C89B5B]" size={24} />
            <span>Pricing FAQs</span>
          </h2>
          <div className="max-w-2xl mx-auto">
            <FaqAccordion items={faqs} />
          </div>
        </div>

        {/* Final CTA Banner */}
        <section className="max-w-7xl mx-auto px-6 pt-24 text-center">
          <div className="bg-[#5A3342] border border-[#E9E2DC] rounded-3xl p-12 sm:p-16 relative overflow-hidden shadow-xl shadow-[#5A3342]/10 text-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#C89B5B]/10 blur-[80px] pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-black text-white">Choose the smart solution today.</h3>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-lg mx-auto font-medium">
                Try the Draft tier for free, no credit card required. Instantly deploy your business card in 60 seconds.
              </p>
              <div className="flex items-center justify-center gap-4 pt-2">
                <Link href="/signup">
                  <button className="bg-[#C89B5B] hover:bg-[#b0874c] text-white font-bold text-xs px-6 py-3 rounded-lg shadow-md transition-all">
                    Create Your Card Free
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-xs px-6 py-3 rounded-lg backdrop-blur-sm transition-all">
                    Sign Up Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
