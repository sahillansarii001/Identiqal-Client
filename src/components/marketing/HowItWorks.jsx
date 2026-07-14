import React from 'react';
import { Layers, Palette, QrCode, TrendingUp } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      icon: <Layers className="text-blue-400" size={24} />,
      title: '1. Build & Compose',
      description: 'Drag, drop, and configure sections (About, Links, Gallery, Custom Forms, Testimonials) to build your customized layout.',
    },
    {
      icon: <Palette className="text-indigo-400" size={24} />,
      title: '2. Brand & Theme',
      description: 'Select layouts (minimal, bold, creative), pick premium color palettes, or apply organization-wide brand locks.',
    },
    {
      icon: <QrCode className="text-purple-400" size={24} />,
      title: '3. Publish & Share',
      description: 'Activate your public slug page instantly, print physical QR code cards, or add it directly to your social profile bios.',
    },
    {
      icon: <TrendingUp className="text-pink-400" size={24} />,
      title: '4. Capture & Monitor',
      description: 'Let users send message inquiries directly via your card, save details into their contacts, and review dashboard analytics.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-zinc-50 border-t border-slate-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            How Identiqal Works
          </h2>
          <p className="text-slate-600">
            Go from clean slate to a published smart business card in less than five minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white border border-slate-200 hover:border-slate-350 rounded-2xl p-6 transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="w-12 h-12 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-center mb-6">
                {step.icon}
              </div>
              <h3 className="text-base font-bold text-slate-850 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
