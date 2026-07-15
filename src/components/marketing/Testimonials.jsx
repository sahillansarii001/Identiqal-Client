'use client';

import React from 'react';
import { Star } from 'lucide-react';

export const Testimonials = () => {
  const reviews = [
    {
      name: 'Sarah Connor',
      role: 'CEO, Skynet Logistics',
      quote: 'Identiqal completely changed how our sales team presents itself. Sharing our credentials and calendar scheduler is now down to one tap.',
      initials: 'SC',
    },
    {
      name: 'Marcus Wright',
      role: 'Founder, Project Apex',
      quote: 'The AI Smart Introduction drafted a bio better than what I spent days writing myself. Absolute game changer for early-stage startup pitching.',
      initials: 'MW',
    },
    {
      name: 'Elena Rostova',
      role: 'Creative Director, NeoDesign',
      quote: 'The Luxury Gold theme fits our high-end agency branding rules flawlessly. The real-time visitor analytics are deeply insightful.',
      initials: 'ER',
    },
    {
      name: 'David Vance',
      role: 'VP Marketing, CloudCore',
      quote: 'We print dynamic QR codes on our corporate booths. Collecting leads directly into our dashboard csv is seamless.',
      initials: 'DV',
    },
    {
      name: 'Maya Lin',
      role: 'Independent Architect',
      quote: 'I love the minimalist aesthetic. It feels elegant, loads instantly, and holds all my portfolio link folders without looking cluttered.',
      initials: 'ML',
    },
  ];

  // Double list to enable smooth infinite loop scroll
  const scrollList = [...reviews, ...reviews, ...reviews];

  return (
    <section className="py-24 bg-[#FAFAF8] border-t border-[#4A2C3A]/5 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#B88A44]/10 text-xs font-semibold text-[#B88A44] tracking-wider uppercase">
          <span>Social Proof</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A]">
          Loved by Industry Professionals
        </h2>
        <p className="text-[#6B6B6B] text-base max-w-2xl mx-auto">
          Hear from founders, designers, and sales leaders who replaced paper cards with Identiqal smart digital profiles.
        </p>
      </div>

      {/* Auto scrolling ticker container */}
      <div className="relative w-full overflow-hidden flex items-center select-none mask-fade">
        <style jsx>{`
          .mask-fade {
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          }
          .animate-marquee-slow {
            animation: marquee 45s linear infinite;
          }
        `}</style>

        <div className="flex space-x-8 animate-marquee-slow min-w-full py-4">
          {scrollList.map((review, index) => (
            <div
              key={index}
              className="bg-white/50 border border-[#4A2C3A]/5 backdrop-blur-md p-6 rounded-2xl w-[320px] shrink-0 hover:border-[#B88A44]/30 hover:-translate-y-1 transition-all duration-300 hover:shadow-md flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Stars */}
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} fill="#B88A44" className="text-[#B88A44]" />
                  ))}
                </div>
                {/* Quote */}
                <p className="text-xs text-[#6B6B6B] leading-relaxed italic">
                  "{review.quote}"
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center space-x-3 mt-6 pt-4 border-t border-[#4A2C3A]/5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#4A2C3A] to-[#B88A44] flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
                  {review.initials}
                </div>
                <div>
                  <h4 className="font-bold text-[#1A1A1A] text-xs font-sans">{review.name}</h4>
                  <p className="text-[10px] text-[#6B6B6B] font-sans">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
