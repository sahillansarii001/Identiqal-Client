'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Globe, Sparkles, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export const LivePreview = () => {
  const [activeTheme, setActiveTheme] = useState('luxury');
  const shouldReduceMotion = useReducedMotion();

  const themes = [
    { id: 'dark', label: 'Dark Mode' },
    { id: 'light', label: 'Light Clean' },
    { id: 'minimal', label: 'Minimalist' },
    { id: 'luxury', label: 'Luxury Gold' },
  ];

  // Data for the preview card
  const profile = {
    name: 'Alexander Mercer',
    title: 'Principal Designer & Partner',
    company: 'Mercer Capital Group',
    bio: 'Crafting luxury visual languages and digital products. Ex-Apple Creative Director, advisor to next-gen AI startups.',
    email: 'alex@mercer.design',
    phone: '+1 (555) 019-2834',
    location: 'New York, NY',
    links: [
      { name: 'Portfolio Website', url: '#' },
      { name: 'Investment Fund', url: '#' },
    ],
  };

  // Dynamic Theme Styles
  const getThemeStyles = () => {
    switch (activeTheme) {
      case 'dark':
        return {
          bg: 'bg-[#121212]',
          text: 'text-[#FAFAF8]',
          subtext: 'text-zinc-400',
          card: 'bg-zinc-900/60 border border-zinc-800 backdrop-blur-md shadow-xl',
          primaryBtn: 'bg-zinc-100 hover:bg-white text-zinc-900 border border-zinc-200',
          secondaryBtn: 'bg-zinc-800/60 hover:bg-zinc-800 text-zinc-100 border border-zinc-700',
          badge: 'bg-zinc-800 text-zinc-300 border border-zinc-700',
          iconColor: 'text-[#B88A44]',
          accentText: 'text-[#B88A44]',
        };
      case 'light':
        return {
          bg: 'bg-[#FAFAF8]',
          text: 'text-[#1A1A1A]',
          subtext: 'text-[#6B6B6B]',
          card: 'bg-white border border-[#4A2C3A]/5 shadow-md',
          primaryBtn: 'bg-[#4A2C3A] hover:bg-[#4A2C3A]/90 text-white border border-[#4A2C3A]',
          secondaryBtn: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200',
          badge: 'bg-[#4A2C3A]/5 text-[#4A2C3A] border border-[#4A2C3A]/10',
          iconColor: 'text-[#4A2C3A]',
          accentText: 'text-[#4A2C3A]',
        };
      case 'minimal':
        return {
          bg: 'bg-white',
          text: 'text-black',
          subtext: 'text-zinc-500',
          card: 'bg-white border border-zinc-200 shadow-sm',
          primaryBtn: 'bg-black hover:bg-zinc-900 text-white',
          secondaryBtn: 'bg-white hover:bg-zinc-50 text-black border border-zinc-200',
          badge: 'bg-zinc-100 text-zinc-800 border border-zinc-200',
          iconColor: 'text-black',
          accentText: 'text-zinc-700',
        };
      case 'luxury':
      default:
        return {
          bg: 'bg-[#F6F4ED]',
          text: 'text-[#4A2C3A]',
          subtext: 'text-[#6B6B6B]',
          card: 'bg-white/80 border border-[#B88A44]/20 backdrop-blur-md shadow-xl',
          primaryBtn: 'bg-[#4A2C3A] hover:bg-[#3d2430] text-[#FAFAF8] border border-[#4A2C3A] shadow-md shadow-[#4A2C3A]/10',
          secondaryBtn: 'bg-[#FAFAF8] hover:bg-[#FAFAF8]/90 text-[#4A2C3A] border border-[#B88A44]/20',
          badge: 'bg-[#B88A44]/10 text-[#B88A44] border border-[#B88A44]/20',
          iconColor: 'text-[#B88A44]',
          accentText: 'text-[#B88A44]',
        };
    }
  };

  const s = getThemeStyles();

  return (
    <section id="templates" className="py-24 bg-[#FAFAF8] border-t border-[#4A2C3A]/5 scroll-mt-16 relative">
      {/* Glow Backdrops */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-[#B88A44]/3 blur-[110px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] rounded-full bg-[#4A2C3A]/4 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Col: Explainer & Selection */}
        <div className="lg:col-span-5 space-y-8 text-left">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#4A2C3A]/5 text-xs font-semibold text-[#4A2C3A] tracking-wider uppercase">
              <span>Interactive Sandbox</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] tracking-tight font-sans">
              Live Real-Time Theme Preview
            </h2>
            <p className="text-[#6B6B6B] text-base leading-relaxed">
              Experience the luxury feeling of smart layouts. Instantly transform your entire profile design aesthetic, fonts, border accents, and layouts in one click.
            </p>
          </motion.div>

          {/* Theme selection buttons */}
          <div className="flex flex-col space-y-2 relative">
            {themes.map((theme) => {
              const isActive = activeTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => setActiveTheme(theme.id)}
                  className={`flex items-center justify-between px-6 py-4 rounded-xl border text-left text-sm font-semibold transition-all duration-300 relative overflow-hidden z-10 ${
                    isActive
                      ? 'bg-[#4A2C3A] border-[#4A2C3A] text-[#FAFAF8] shadow-md shadow-[#4A2C3A]/10 translate-x-1.5'
                      : 'bg-white border-[#4A2C3A]/5 text-[#6B6B6B] hover:bg-[#FAFAF8] hover:text-[#1A1A1A]'
                  }`}
                >
                  <span className="relative z-10">{theme.label}</span>
                  {isActive && <Check size={14} className="text-[#B88A44] relative z-10" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Col: Interactive Phone Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="lg:col-span-7 flex justify-center items-center"
        >
          {/* Phone Bezel */}
          <div className="w-[320px] rounded-[42px] bg-[#1A1A1A] border-[8px] border-[#1A1A1A] shadow-[0_30px_70px_-10px_rgba(74,44,58,0.25)] overflow-hidden relative">
            {/* Notch */}
            <div className="absolute top-0 inset-x-0 h-5 bg-[#1A1A1A] flex justify-center items-center z-40">
              <div className="w-16 h-3 bg-black rounded-full" />
            </div>

            {/* Screen Container (Reactive Theme) */}
            <motion.div
              layout
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className={`pt-8 pb-6 px-4 ${s.bg} min-h-[500px] flex flex-col justify-between font-sans`}
            >
              {/* Header profile area */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-tr from-[#4A2C3A] to-[#B88A44] flex items-center justify-center text-white font-bold text-lg shadow-sm border transition-all duration-300 ${activeTheme === 'dark' ? 'border-zinc-800' : 'border-white'}`}>
                    AM
                  </div>
                  <div className={`px-2.5 py-1 text-[9px] font-bold rounded-full border uppercase transition-colors duration-500 ${s.badge}`}>
                    ★ Pro Member
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className={`font-extrabold text-base tracking-tight ${s.text} transition-colors duration-500`}>
                    {profile.name}
                  </h4>
                  <p className={`text-xs font-semibold ${s.accentText} transition-colors duration-500`}>
                    {profile.title}
                  </p>
                  <p className={`text-[10px] ${s.subtext} font-medium transition-colors duration-500`}>
                    {profile.company}
                  </p>
                </div>

                <p className={`text-[11px] leading-relaxed ${s.subtext} border-t border-[#4A2C3A]/5 pt-3 transition-colors duration-500`}>
                  {profile.bio}
                </p>
              </div>

              {/* Dynamic Action Buttons */}
              <div className="space-y-2 my-5">
                <button className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all duration-300 flex items-center justify-center ${s.primaryBtn}`}>
                  Save Contact Card
                </button>
                <button className={`w-full py-2.5 rounded-lg text-xs font-semibold transition-all duration-300 flex items-center justify-center ${s.secondaryBtn}`}>
                  Connect Online
                </button>
              </div>

              {/* Details and Links list */}
              <div className="space-y-2">
                <h5 className={`text-[9px] font-bold uppercase tracking-wider ${s.accentText} transition-colors duration-500`}>Contact info</h5>
                <div className={`p-2 rounded-lg space-y-1.5 ${s.card} transition-colors duration-500`}>
                  <div className="flex items-center space-x-2 text-[10px]">
                    <Mail size={10} className={s.iconColor} />
                    <span className={s.text}>{profile.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[10px]">
                    <Phone size={10} className={s.iconColor} />
                    <span className={s.text}>{profile.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[10px]">
                    <MapPin size={10} className={s.iconColor} />
                    <span className={s.text}>{profile.location}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
