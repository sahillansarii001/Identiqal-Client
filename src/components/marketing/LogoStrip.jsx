'use client';

import React from 'react';
import { ShieldCheck, Command, Compass, Cpu, Layers, Disc, Database, Award } from 'lucide-react';

export const LogoStrip = () => {
  const brandLogos = [
    { name: 'Linear', icon: <Command size={18} className="text-[#4A2C3A]" /> },
    { name: 'Vercel', icon: <Layers size={18} className="text-[#4A2C3A]" /> },
    { name: 'Stripe', icon: <Compass size={18} className="text-[#4A2C3A]" /> },
    { name: 'Framer', icon: <Cpu size={18} className="text-[#B88A44]" /> },
    { name: 'Notion', icon: <Database size={18} className="text-[#4A2C3A]" /> },
    { name: 'Retool', icon: <Disc size={18} className="text-[#B88A44]" /> },
    { name: 'Sentry', icon: <Award size={18} className="text-[#4A2C3A]" /> },
    { name: 'Supabase', icon: <ShieldCheck size={18} className="text-[#B88A44]" /> },
  ];

  // Double the array to make seamless scrolling
  const scrollList = [...brandLogos, ...brandLogos, ...brandLogos, ...brandLogos];

  return (
    <div className="py-12 bg-[#FAFAF8] border-y border-[#4A2C3A]/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-6 text-center">
        <p className="text-xs font-semibold text-[#6B6B6B] tracking-wider uppercase">
          Trusted by professionals, creators and businesses worldwide
        </p>
      </div>

      {/* Scrolling Container */}
      <div className="relative w-full overflow-hidden flex items-center select-none mask-fade">
        <style jsx>{`
          .mask-fade {
            mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
          }
        `}</style>
        
        <div className="flex space-x-16 animate-marquee min-w-full">
          {scrollList.map((logo, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 text-[#4A2C3A]/70 hover:text-[#4A2C3A] transition-colors duration-200"
            >
              {logo.icon}
              <span className="font-sans font-bold text-sm tracking-tight text-[#1A1A1A]">
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
