'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export const FinalCTA = () => {
  return (
    <section className="py-20 bg-[#FAFAF8] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Banner Block */}
        <div className="relative rounded-[36px] bg-[#4A2C3A] border border-[#B88A44]/30 px-8 py-16 sm:px-16 sm:py-24 text-center overflow-hidden shadow-[0_30px_70px_rgba(74,44,58,0.25)]">
          {/* Background Radial Light Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#B88A44]/20 to-transparent blur-[110px] pointer-events-none" />
          
          {/* Subtle Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

          {/* Sparkles pill decoration */}
          <div className="relative z-10 inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#FAFAF8] mb-6">
            <Sparkles size={11} className="text-[#B88A44]" />
            <span>Claim your unique handle name slug today</span>
          </div>

          {/* Heading */}
          <h2 className="relative z-10 text-3xl sm:text-5xl font-extrabold text-[#FAFAF8] tracking-tight leading-tight max-w-3xl mx-auto font-sans">
            Make Every First <br className="sm:hidden" />
            <span className="text-[#B88A44]">Impression</span> Count.
          </h2>

          {/* Subtitle */}
          <p className="relative z-10 text-sm sm:text-base text-zinc-300 max-w-xl mx-auto mt-6 leading-relaxed">
            Upgrade your digital card setup today. Create your smart portfolio identity, collect client inquiries, and monitor analytic views in minutes.
          </p>

          {/* CTA Buttons */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-10">
            <Link href="/signup" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#B88A44] hover:bg-[#a37938] text-[#FAFAF8] font-bold px-8 py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group border border-[#B88A44]">
                <span>Get Started Free</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <button className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
              <span>Book a Demo</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
