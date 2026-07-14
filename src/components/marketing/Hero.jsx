import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button.jsx';
import { ArrowRight, Sparkles, Shield, BarChart3, Users } from 'lucide-react';

export const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-zinc-50 pt-24 pb-16 sm:pt-32">
      {/* Decorative background glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Banner badge */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-600 mb-8 animate-pulse">
          <Sparkles size={12} />
          <span>Introducing Identiqal Phase 1</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
          Your Presence, <br />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Perfectly Connected
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-lg text-slate-600 mb-10">
          Build fully customizable, interactive digital business cards. Compose independent layout sections, brand it to your organization's style, capture potential leads, and monitor exact analytics.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16">
          <Link href="/signup">
            <Button size="lg" className="w-full sm:w-auto shadow-indigo-600/10 shadow-xl group">
              Get Started Free 
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              View Pricing Tiers
            </Button>
          </Link>
        </div>

        {/* Visual mock card previews */}
        <div className="relative mx-auto max-w-4xl border border-slate-200 bg-white/70 rounded-2xl p-4 backdrop-blur-md shadow-2xl">
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          
          <div className="bg-zinc-50 border border-slate-100 rounded-xl overflow-hidden aspect-video flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-6 shadow-xl text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl" />
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-indigo-650 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-md">
                  JD
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Jane Doe</h4>
                  <p className="text-xs text-indigo-600">Head of Operations, Acme Inc.</p>
                </div>
              </div>

              {/* Sections list mock */}
              <div className="space-y-3">
                <div className="p-2.5 bg-zinc-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-750">
                  <span>💼 Works at Acme Corp</span>
                </div>
                <div className="p-2.5 bg-zinc-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-750">
                  <span>🔗 Portfolio Website</span>
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-semibold">View</span>
                </div>
                <div className="p-2.5 bg-zinc-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-750">
                  <span>📬 Inquire / Contact Form</span>
                  <span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-semibold">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
