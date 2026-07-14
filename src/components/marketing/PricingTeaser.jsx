import React from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { Button } from '../ui/Button.jsx';

export const PricingTeaser = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for individual networking starters.',
      features: [
        '1 Active Digital Business Card',
        'Standard Layout Section Blocks',
        'Basic Colors and Style Layouts',
        'Standard Performance Analytics',
      ],
      buttonText: 'Sign Up Free',
      href: '/signup',
      featured: false,
    },
    {
      name: 'Pro',
      price: '$9',
      period: '/mo',
      description: 'Accelerate your professional brand.',
      features: [
        'Unlimited Digital Cards',
        'Custom Design Theme Controls',
        'Advanced Analytics Dashboards',
        'Export Captured Leads to CSV',
        'Generate and Download QR Code',
      ],
      buttonText: 'Get Started Pro',
      href: '/signup?tier=pro',
      featured: true,
    },
    {
      name: 'Business',
      price: '$29',
      period: '/mo',
      description: 'Empower your teams and organization workspaces.',
      features: [
        'Includes 10 User Member Seats',
        'Organization Theme Locking',
        'Aggregated Team Analytics',
        'Workspace Member Invitation Controls',
        'Priority Premium Delivery Support',
      ],
      buttonText: 'Start Business Plan',
      href: '/signup?tier=business',
      featured: false,
    },
  ];

  return (
    <section className="py-20 bg-zinc-50 border-t border-slate-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            Simple, flexible pricing tiers
          </h2>
          <p className="text-slate-600">
            Choose the plan that suits your personal networking or organization needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`flex flex-col border rounded-3xl p-8 relative transition-all duration-300 bg-white ${
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
    </section>
  );
};
