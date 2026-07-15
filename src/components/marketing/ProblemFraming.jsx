'use client';

import React from 'react';
import { Check, X, ShieldAlert } from 'lucide-react';

export const ProblemFraming = () => {
  const comparisonRows = [
    {
      feature: 'Editable',
      traditional: '❌ No (requires reprinting)',
      traditionalCheck: false,
      identiqal: '⚡ Instant (edit from dashboard)',
      identiqalCheck: true,
    },
    {
      feature: 'Visitor Analytics',
      traditional: '❌ Zero (no trackability)',
      traditionalCheck: false,
      identiqal: '📈 Deep (clicks, geolocation, devices)',
      identiqalCheck: true,
    },
    {
      feature: 'Lead Collection',
      traditional: '❌ Manual (collect paper forms)',
      traditionalCheck: false,
      identiqal: '📬 Automated (embedded inquiry forms)',
      identiqalCheck: true,
    },
    {
      feature: 'QR Sharing',
      traditional: '❌ None (static printed if any)',
      traditionalCheck: false,
      identiqal: '📲 Dynamic (redirectable QR codes)',
      identiqalCheck: true,
    },
    {
      feature: 'AI Support',
      traditional: '❌ None',
      traditionalCheck: false,
      identiqal: '🤖 AI Bio introductions & tips',
      identiqalCheck: true,
    },
    {
      feature: 'Always Updated',
      traditional: '❌ Outdated on job change',
      traditionalCheck: false,
      identiqal: '✨ Real-time sync on save',
      identiqalCheck: true,
    },
    {
      feature: 'Information Capacity',
      traditional: '❌ Limited card dimensions',
      traditionalCheck: false,
      identiqal: '🌐 Unlimited blocks, portfolios & files',
      identiqalCheck: true,
    },
  ];

  return (
    <section id="about" className="py-24 bg-[#FAFAF8] border-t border-[#4A2C3A]/5 scroll-mt-16 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#B88A44]/10 text-xs font-semibold text-[#B88A44] tracking-wider uppercase">
            <span>Comparison Table</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A]">
            Why Switch to Identiqal?
          </h2>
          <p className="text-[#6B6B6B] text-base leading-relaxed">
            See how traditional paper business cards compare to our dynamic, AI-powered smart digital profiles.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#4A2C3A]/5 shadow-lg bg-white/40 backdrop-blur-md">
          <table className="w-full border-collapse text-left text-sm font-sans">
            <thead>
              <tr className="border-b border-[#4A2C3A]/5 bg-[#4A2C3A]/5 text-[#4A2C3A] font-bold text-xs uppercase tracking-wider">
                <th className="p-6">Feature / Ability</th>
                <th className="p-6">Traditional Card</th>
                <th className="p-6 bg-[#4A2C3A]/5">Identiqal Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4A2C3A]/5">
              {comparisonRows.map((row, index) => (
                <tr key={index} className="hover:bg-[#4A2C3A]/3 transition-colors duration-200">
                  <td className="p-6 font-bold text-[#1A1A1A]">{row.feature}</td>
                  <td className="p-6 text-[#6B6B6B] font-medium flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                      <X size={12} />
                    </span>
                    <span>{row.traditional}</span>
                  </td>
                  <td className="p-6 text-[#1A1A1A] font-semibold bg-[#4A2C3A]/3">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-[#B88A44]/15 flex items-center justify-center text-[#B88A44] shrink-0">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      <span>{row.identiqal}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
