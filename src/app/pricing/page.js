'use client';

import React from 'react';
import { Navbar } from '@/components/marketing/Navbar.jsx';
import { Footer } from '@/components/marketing/Footer.jsx';
import { Button } from '@/components/ui/Button.jsx';
import { Check, HelpCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
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
      price: '$9',
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
      price: '$29',
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
    <div className="flex flex-col min-h-screen bg-zinc-50">
      <Navbar />
      
      <main className="flex-1 py-16">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Simple, honest pricing.
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Choose the plan that suits your personal branding or organizational requirements. No hidden setup fees.
          </p>
        </div>

        {/* Pricing Matrix */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`flex flex-col border rounded-3xl p-8 bg-white relative transition-all duration-300 ${
                  plan.featured
                    ? 'border-indigo-500 shadow-xl shadow-indigo-600/5 md:scale-105 z-10'
                    : 'border-slate-200 hover:border-slate-350 hover:shadow-md'
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-650 rounded-full text-[10px] font-bold text-white uppercase tracking-wider shadow-md shadow-indigo-600/10">
                    Most Popular
                  </span>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline space-x-1 mb-2">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900">{plan.price}</span>
                    {plan.period && <span className="text-xs text-slate-500">{plan.period}</span>}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{plan.description}</p>
                </div>

                <div className="flex-1 space-y-3 mb-8 border-t border-slate-100 pt-6">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start space-x-2 text-xs text-slate-650">
                      <Check size={14} className="text-indigo-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Link href={plan.href} className="w-full mt-auto">
                  <Button
                    variant={plan.featured ? 'primary' : 'secondary'}
                    className="w-full justify-center"
                  >
                    {plan.buttonText}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Area */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200 pt-20 mb-12">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-12 flex items-center justify-center space-x-2">
            <HelpCircle className="text-indigo-600" size={24} />
            <span>Pricing FAQs</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-8">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm space-y-2">
                <h3 className="font-bold text-slate-900 text-sm">{faq.q}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
