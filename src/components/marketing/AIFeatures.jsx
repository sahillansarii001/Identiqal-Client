'use client';

import React from 'react';
import { Sparkles, Bot, Heart, Compass, CheckCircle2, TrendingUp } from 'lucide-react';

export const AIFeatures = () => {
  return (
    <section className="py-24 bg-[#FAFAF8] border-t border-[#4A2C3A]/5 relative overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full bg-[#B88A44]/5 blur-[120px]" />
        <div className="absolute -bottom-10 left-10 w-[400px] h-[400px] rounded-full bg-[#4A2C3A]/3 blur-[110px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#B88A44]/10 text-xs font-semibold text-[#B88A44] tracking-wider uppercase">
            <Sparkles size={12} className="text-[#B88A44]" />
            <span>AI intelligence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A]">
            AI-Powered Digital Networking
          </h2>
          <p className="text-[#6B6B6B] text-base leading-relaxed">
            Let machine learning write your bio, analyze profiles, and suggest instant changes to boost your professional engagement.
          </p>
        </div>

        {/* AI Features Grid */}
        <div className="grid lg:grid-cols-3 gap-10 items-stretch">
          {/* Card 1: AI Smart Introduction */}
          <div className="group bg-white/65 border border-[#4A2C3A]/5 hover:border-[#B88A44]/30 rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden">
            <div className="space-y-6">
              {/* Illustration box */}
              <div className="h-44 bg-[#FAFAF8] border border-[#4A2C3A]/5 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-2 right-2 text-[#B88A44]/20 animate-pulse">
                  <Sparkles size={40} />
                </div>
                
                {/* Typing animation block */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-1.5 text-[9px] text-[#B88A44] font-bold uppercase tracking-wider">
                    <Bot size={10} />
                    <span>AI Assistant Writing...</span>
                  </div>
                  <div className="p-2.5 bg-white border border-[#4A2C3A]/5 rounded-lg text-[10px] text-[#6B6B6B] font-mono leading-relaxed relative">
                    "I am a tech leader with a passion for building premium SaaS experiences. Over the past 10 years, I've led..."
                    <span className="w-1.5 h-3 bg-[#B88A44] inline-block animate-pulse ml-1" />
                  </div>
                </div>
              </div>

              {/* Text */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#1A1A1A]">AI Smart Introduction</h3>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">
                  Generate professional summaries tailored to specific roles or networking events. Switch between elegant, technical, or conversational tones instantly.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: AI Profile Health Score */}
          <div className="group bg-white/65 border border-[#4A2C3A]/5 hover:border-[#B88A44]/30 rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden">
            <div className="space-y-6">
              {/* Illustration box */}
              <div className="h-44 bg-[#FAFAF8] border border-[#4A2C3A]/5 rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="text-center space-y-2 relative z-10">
                  <div className="w-20 h-20 rounded-full border-4 border-[#B88A44] flex items-center justify-center shadow-md bg-white">
                    <div className="text-center">
                      <span className="text-base font-black text-[#4A2C3A]">94%</span>
                      <p className="text-[7px] text-[#6B6B6B] font-bold uppercase tracking-wider">Health</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-[#1A1A1A] font-bold">Excellent Profile Score</p>
                </div>
                {/* Floating bubbles */}
                <div className="absolute top-4 left-6 w-12 h-12 rounded-full bg-[#B88A44]/5 blur-sm" />
                <div className="absolute bottom-4 right-6 w-16 h-16 rounded-full bg-[#4A2C3A]/3 blur-md" />
              </div>

              {/* Text */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#1A1A1A]">AI Profile Health Score</h3>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">
                  Get structural suggestions about your landing page profile completeness. Ensure contact cards, downloadable vCards, and key links are active and functional.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: AI Suggestions */}
          <div className="group bg-white/65 border border-[#4A2C3A]/5 hover:border-[#B88A44]/30 rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden">
            <div className="space-y-6">
              {/* Illustration box */}
              <div className="h-44 bg-[#FAFAF8] border border-[#4A2C3A]/5 rounded-xl p-4 flex flex-col justify-center space-y-2 relative overflow-hidden">
                <div className="flex items-center space-x-2 p-2 bg-white border border-[#4A2C3A]/5 rounded-lg shadow-sm">
                  <CheckCircle2 size={13} className="text-[#B88A44]" />
                  <span className="text-[10px] font-semibold text-[#1A1A1A]">Add Calendly scheduler block</span>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-white border border-[#4A2C3A]/5 rounded-lg shadow-sm translate-x-3">
                  <CheckCircle2 size={13} className="text-[#B88A44]" />
                  <span className="text-[10px] font-semibold text-[#1A1A1A]">Upload dynamic vCard file</span>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-white border border-[#4A2C3A]/5 rounded-lg shadow-sm">
                  <CheckCircle2 size={13} className="text-green-500" />
                  <span className="text-[10px] font-semibold text-[#6B6B6B] line-through">Add Twitter profile handle</span>
                </div>
              </div>

              {/* Text */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#1A1A1A]">AI Suggestions</h3>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">
                  Receive personalized, smart insights that automatically optimize your cards for maximum leads, profile click-throughs, and reader engagement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
