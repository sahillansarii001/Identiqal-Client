'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Globe, Sparkles, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export const LivePreview = () => {
  const [activeTheme, setActiveTheme] = useState('light');
  const [cycleTrigger, setCycleTrigger] = useState(0);
  const [animateState, setAnimateState] = useState('active');
  const shouldReduceMotion = useReducedMotion();

  const themes = [
    {
      id: 'light',
      label: 'Light Clean',
      sub: 'Corporate • Elegant',
      colors: ['#FFFFFF', '#6B3A4A', '#E9E2DC', '#6B6B6B'],
      borderClass: 'border-l-4 border-l-[#6B3A4A]',
    },
    {
      id: 'minimal',
      label: 'Minimalist',
      sub: 'Apple • Clean',
      colors: ['#FFFFFF', '#18181B', '#E4E4E7', '#71717A'],
      borderClass: 'border-l-4 border-l-[#18181B]',
    },
    {
      id: 'luxury',
      label: 'Luxury Gold',
      sub: 'Premium • Luxury',
      colors: ['#FDFBF7', '#C89B5B', '#6B3A4A', '#3F3F46'],
      borderClass: 'border-l-4 border-l-[#C89B5B]',
    },
    {
      id: 'midnight',
      label: 'Midnight',
      sub: 'Dark • Modern',
      colors: ['#000000', '#18181B', '#A855F7', '#FAFAF8'],
      borderClass: 'border-l-4 border-l-[#A855F7]',
    },
    {
      id: 'glass',
      label: 'Glass',
      sub: 'VisionOS • Glass',
      colors: ['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.25)', '#E2E8F0', '#FFFFFF'],
      borderClass: 'border-l-4 border-l-zinc-300',
    },
    {
      id: 'gradient',
      label: 'Gradient',
      sub: 'Vibrant • Startup',
      colors: ['#A855F7', '#EC4899', '#3B82F6', '#FFFFFF'],
      borderClass: 'border-l-4 border-l-pink-500',
    },
  ];

  // Auto-cycle themes every 3.8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTheme((prevTheme) => {
        const currentIndex = themes.findIndex((t) => t.id === prevTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        return themes[nextIndex].id;
      });
    }, 3800);

    return () => clearInterval(interval);
  }, [cycleTrigger]);

  // Morph phone container scale down/up on theme update
  useEffect(() => {
    setAnimateState('morphing');
    const timer = setTimeout(() => {
      setAnimateState('active');
    }, 450);
    return () => clearTimeout(timer);
  }, [activeTheme]);

  // Profile data mock
  const profile = {
    name: 'Alexander Mercer',
    title: 'Principal Designer & Partner',
    company: 'Mercer Capital Group',
    bio: 'Crafting luxury visual languages and digital products. Ex-Apple Creative Director, advisor to next-gen AI startups.',
    email: 'alex@mercer.design',
    phone: '+1 (555) 019-2834',
    location: 'New York, NY',
  };

  // Framer Motion Variants
  const morphVariants = {
    morphing: {
      scale: shouldReduceMotion ? 1 : 0.96,
      opacity: 0.25,
      transition: { duration: 0.15, ease: 'easeIn' },
    },
    active: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  // Render Theme Specific Content
  const renderThemeMockup = () => {
    switch (activeTheme) {
      case 'minimal':
        return (
          <div className="bg-white min-h-[500px] p-6 flex flex-col justify-between font-sans text-left select-none">
            {/* Header profile area */}
            <div className="space-y-6 pt-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-full border border-black flex items-center justify-center text-black font-semibold text-base">
                  AM
                </div>
                <div className="text-[8px] font-bold uppercase tracking-widest text-black border border-black/10 px-2.5 py-0.5 rounded-none bg-white">
                  PRO MEMBER
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-light text-xl text-black tracking-tight">
                  {profile.name}
                </h4>
                <p className="text-xs font-normal text-zinc-800 tracking-tight">
                  {profile.title}
                </p>
                <p className="text-[10px] text-zinc-500 font-light tracking-wide uppercase">
                  {profile.company}
                </p>
              </div>

              <p className="text-[11px] font-light leading-relaxed text-zinc-600 pt-3 border-t border-zinc-150">
                {profile.bio}
              </p>
            </div>

            {/* Dynamic Action Buttons */}
            <div className="space-y-2 my-6">
              <button className="w-full py-2.5 bg-black hover:bg-zinc-950 text-white text-xs font-semibold rounded-none tracking-wide transition-colors">
                Save Contact Card
              </button>
              <button className="w-full py-2.5 bg-white border border-zinc-200 hover:bg-zinc-50 text-black text-xs font-semibold rounded-none tracking-wide transition-colors">
                Connect Online
              </button>
            </div>

            {/* Details list */}
            <div className="space-y-2">
              <h5 className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Contact info</h5>
              <div className="p-4 border border-zinc-100 rounded-none space-y-2">
                <div className="flex items-center space-x-2 text-[10px] text-zinc-700">
                  <span className="w-1 h-1 bg-black rounded-full" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] text-zinc-700">
                  <span className="w-1 h-1 bg-black rounded-full" />
                  <span>{profile.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] text-zinc-700">
                  <span className="w-1 h-1 bg-black rounded-full" />
                  <span>{profile.location}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'luxury':
        return (
          <div className="bg-[#FDFBF7] min-h-[500px] p-6 flex flex-col justify-between font-serif text-left select-none relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#C89B5B]/5 rounded-full blur-xl pointer-events-none" />
            
            {/* Header profile area */}
            <div className="space-y-6 pt-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-full border-2 border-[#C89B5B] bg-white flex items-center justify-center text-[#6B3A4A] font-bold text-lg shadow-sm">
                  AM
                </div>
                <div className="text-[9px] font-semibold tracking-widest text-[#C89B5B] bg-[#C89B5B]/5 border border-[#C89B5B]/30 px-3 py-1 rounded-full uppercase">
                  ★ Pro Member
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-xl font-extrabold text-[#4A2C3A] tracking-tight leading-tight">
                  {profile.name}
                </h4>
                <p className="text-xs font-medium text-[#C89B5B] italic font-serif">
                  {profile.title}
                </p>
                <p className="text-[10px] text-zinc-500 font-sans tracking-wide uppercase font-semibold">
                  {profile.company}
                </p>
              </div>

              <p className="text-[11px] leading-relaxed text-[#6B6B6B] border-t border-[#B88A44]/20 pt-4 font-serif">
                {profile.bio}
              </p>
            </div>

            {/* Dynamic Action Buttons */}
            <div className="space-y-2.5 my-6 relative z-10">
              <button className="w-full py-2.5 bg-gradient-to-r from-[#C89B5B] to-[#b0874c] hover:to-[#9b733b] text-white text-xs font-bold rounded-full shadow-md shadow-[#C89B5B]/20 transition-all font-sans">
                Save Contact Card
              </button>
              <button className="w-full py-2.5 bg-transparent border border-[#C89B5B] hover:bg-[#C89B5B]/5 text-[#C89B5B] text-xs font-bold rounded-full transition-all font-sans">
                Connect Online
              </button>
            </div>

            {/* Details list */}
            <div className="space-y-2 relative z-10">
              <h5 className="text-[9px] font-bold uppercase tracking-widest text-[#C89B5B] font-sans">Contact info</h5>
              <div className="p-3 bg-white border border-[#B88A44]/10 rounded-xl space-y-2 shadow-sm">
                <div className="flex items-center space-x-2 text-[10px] text-[#4A2C3A] font-sans font-medium">
                  <Mail size={10} className="text-[#C89B5B]" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] text-[#4A2C3A] font-sans font-medium">
                  <Phone size={10} className="text-[#C89B5B]" />
                  <span>{profile.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] text-[#4A2C3A] font-sans font-medium">
                  <MapPin size={10} className="text-[#C89B5B]" />
                  <span>{profile.location}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'midnight':
        return (
          <div className="bg-black min-h-[500px] p-6 flex flex-col justify-between font-sans text-left select-none relative overflow-hidden">
            {/* Cyberpunk ambient back glow */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#A855F7]/10 rounded-full blur-[45px] pointer-events-none" />
            
            {/* Header profile area */}
            <div className="space-y-5 pt-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-full border-2 border-[#A855F7] bg-zinc-950 flex items-center justify-center text-white font-black text-lg shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                  AM
                </div>
                <div className="text-[8px] font-black tracking-widest text-[#A855F7] bg-[#A855F7]/10 border border-[#A855F7]/30 px-3 py-1 rounded-full uppercase">
                  PRO MEMBER
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-black text-white tracking-tight leading-tight">
                  {profile.name}
                </h4>
                <p className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                  {profile.title}
                </p>
                <p className="text-[10px] text-zinc-500 tracking-wide uppercase font-bold">
                  {profile.company}
                </p>
              </div>

              <p className="text-[11px] leading-relaxed text-zinc-400 border-t border-zinc-900 pt-3">
                {profile.bio}
              </p>
            </div>

            {/* Dynamic Action Buttons */}
            <div className="space-y-2 my-6 relative z-10">
              <button className="w-full py-2.5 bg-white hover:bg-zinc-150 text-black text-xs font-black rounded-xl shadow-[0_4px_12px_rgba(255,255,255,0.15)] transition-all">
                Save Contact Card
              </button>
              <button className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white text-xs font-semibold rounded-xl transition-all">
                Connect Online
              </button>
            </div>

            {/* Details list */}
            <div className="space-y-2 relative z-10">
              <h5 className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Contact info</h5>
              <div className="p-3 bg-zinc-950/80 border border-zinc-900 rounded-2xl space-y-2 shadow-lg shadow-black/50">
                <div className="flex items-center space-x-2.5 text-[10px] text-zinc-300">
                  <Mail size={10} className="text-[#A855F7]" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center space-x-2.5 text-[10px] text-zinc-300">
                  <Phone size={10} className="text-[#A855F7]" />
                  <span>{profile.phone}</span>
                </div>
                <div className="flex items-center space-x-2.5 text-[10px] text-zinc-300">
                  <MapPin size={10} className="text-[#A855F7]" />
                  <span>{profile.location}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'glass':
        return (
          <div className="bg-gradient-to-tr from-[#1E293B] to-[#0F172A] min-h-[500px] p-6 flex flex-col justify-between font-sans text-left select-none relative overflow-hidden">
            {/* Visual glow overlay specifically to highlight glass blur */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute top-10 left-10 w-28 h-28 rounded-full bg-blue-500/20 blur-xl animate-pulse" />
              <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-pink-500/20 blur-xl animate-pulse" />
            </div>

            {/* Header profile area */}
            <div className="space-y-5 pt-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                  AM
                </div>
                <div className="text-[8px] font-extrabold tracking-widest text-white/90 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full uppercase">
                  PRO MEMBER
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-extrabold text-white tracking-tight leading-tight">
                  {profile.name}
                </h4>
                <p className="text-xs font-semibold text-white/80">
                  {profile.title}
                </p>
                <p className="text-[10px] text-white/40 tracking-wide uppercase font-bold">
                  {profile.company}
                </p>
              </div>

              <p className="text-[11px] leading-relaxed text-white/70 border-t border-white/10 pt-3">
                {profile.bio}
              </p>
            </div>

            {/* Dynamic Action Buttons */}
            <div className="space-y-2.5 my-6 relative z-10">
              <button className="w-full py-2.5 bg-white/25 hover:bg-white/30 border border-white/20 backdrop-blur-md text-white text-xs font-bold rounded-2xl shadow-lg transition-all">
                Save Contact Card
              </button>
              <button className="w-full py-2.5 bg-transparent border border-white/10 hover:bg-white/5 text-white/90 text-xs font-semibold rounded-2xl transition-all">
                Connect Online
              </button>
            </div>

            {/* Details list */}
            <div className="space-y-2 relative z-10">
              <h5 className="text-[9px] font-bold uppercase tracking-widest text-white/40">Contact info</h5>
              <div className="p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl space-y-2 shadow-inner">
                <div className="flex items-center space-x-2 text-[10px] text-white/90">
                  <Mail size={10} className="text-white/60" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] text-white/90">
                  <Phone size={10} className="text-white/60" />
                  <span>{profile.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] text-white/90">
                  <MapPin size={10} className="text-white/60" />
                  <span>{profile.location}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'gradient':
        return (
          <div className="min-h-[500px] p-6 flex flex-col justify-between font-sans text-left select-none relative overflow-hidden">
            {/* Animated Vibrant Shifting Mesh */}
            <motion.div
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 10,
                ease: 'linear',
                repeat: Infinity,
              }}
              className="absolute inset-0 z-0 bg-gradient-to-br from-[#A855F7] via-[#EC4899] to-[#3B82F6] bg-[length:200%_200%]"
            />

            {/* Header profile area */}
            <div className="space-y-5 pt-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/45 flex items-center justify-center text-white font-black text-lg">
                  AM
                </div>
                <div className="text-[8px] font-black tracking-widest text-white bg-pink-500 border border-white/25 px-3 py-1 rounded-full uppercase shadow-sm">
                  PRO MEMBER
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-xl font-black text-white tracking-tight leading-tight">
                  {profile.name}
                </h4>
                <p className="text-xs font-bold text-white/90">
                  {profile.title}
                </p>
                <p className="text-[10px] text-white/60 tracking-wide uppercase font-black">
                  {profile.company}
                </p>
              </div>

              <p className="text-[11px] leading-relaxed text-white/80 border-t border-white/10 pt-3">
                {profile.bio}
              </p>
            </div>

            {/* Dynamic Action Buttons */}
            <div className="space-y-2.5 my-6 relative z-10">
              <button className="w-full py-2.5 bg-white hover:bg-zinc-50 text-[#A855F7] text-xs font-black rounded-2xl shadow-xl transition-all">
                Save Contact Card
              </button>
              <button className="w-full py-2.5 bg-black/25 hover:bg-black/35 border border-white/15 text-white text-xs font-bold rounded-2xl transition-all">
                Connect Online
              </button>
            </div>

            {/* Details list */}
            <div className="space-y-2 relative z-10">
              <h5 className="text-[9px] font-bold uppercase tracking-widest text-white/60">Contact info</h5>
              <div className="p-3 bg-black/15 border border-white/10 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2 text-[10px] text-white">
                  <Mail size={10} className="text-white" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] text-white">
                  <Phone size={10} className="text-white" />
                  <span>{profile.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] text-white">
                  <MapPin size={10} className="text-white" />
                  <span>{profile.location}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'light':
      default:
        return (
          <div className="bg-white min-h-[500px] p-6 flex flex-col justify-between font-sans text-left select-none">
            {/* Header profile area */}
            <div className="space-y-5 pt-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#6B3A4A] to-[#C89B5B] flex items-center justify-center text-white font-bold text-lg shadow-sm border border-white">
                  AM
                </div>
                <div className="text-[8px] font-extrabold tracking-widest text-[#6B3A4A] bg-[#6B3A4A]/5 border border-[#6B3A4A]/10 px-2.5 py-1 rounded-full uppercase">
                  ★ Pro Member
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="font-extrabold text-lg tracking-tight text-[#1F1F1F]">
                  {profile.name}
                </h4>
                <p className="text-xs font-semibold text-[#6B3A4A]">
                  {profile.title}
                </p>
                <p className="text-[10px] text-[#6B6B6B] font-medium">
                  {profile.company}
                </p>
              </div>

              <p className="text-[11px] leading-relaxed text-[#6B6B6B] border-t border-[#E9E2DC]/50 pt-3">
                {profile.bio}
              </p>
            </div>

            {/* Dynamic Action Buttons */}
            <div className="space-y-2 my-5">
              <button className="w-full py-2.5 bg-[#6B3A4A] hover:bg-[#522c38] text-white text-xs font-bold rounded-xl shadow-md shadow-[#6B3A4A]/10 transition-colors">
                Save Contact Card
              </button>
              <button className="w-full py-2.5 bg-white border border-[#E9E2DC] hover:bg-slate-50 text-[#6B6B6B] text-xs font-semibold rounded-xl transition-colors">
                Connect Online
              </button>
            </div>

            {/* Details and Links list */}
            <div className="space-y-2">
              <h5 className="text-[9px] font-bold uppercase tracking-wider text-[#6B3A4A]">Contact info</h5>
              <div className="p-3 bg-white border border-[#E9E2DC] rounded-xl space-y-2 shadow-sm">
                <div className="flex items-center space-x-2 text-[10px] text-[#1F1F1F] font-medium">
                  <Mail size={10} className="text-[#C89B5B]" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] text-[#1F1F1F] font-medium">
                  <Phone size={10} className="text-[#C89B5B]" />
                  <span>{profile.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] text-[#1F1F1F] font-medium">
                  <MapPin size={10} className="text-[#C89B5B]" />
                  <span>{profile.location}</span>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <section id="templates" className="py-24 bg-[#FAFAF8] border-t border-[#E9E2DC]/80 scroll-mt-16 relative">
      {/* Background gradients and glowing effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Soft radial glow */}
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-[#C89B5B]/5 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] rounded-full bg-[#6B3A4A]/3 blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(#C89B5B_1px,transparent_1px)] bg-[size:24px_24px] opacity-15 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
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
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#6B3A4A]/5 border border-[#6B3A4A]/10 text-xs font-semibold text-[#6B3A4A] tracking-wider uppercase">
              <span>Interactive Sandbox</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F1F1F] tracking-tight leading-tight font-sans">
              Live Real-Time <br />Theme Preview
            </h2>
            <p className="text-[#6B6B6B] text-sm sm:text-base leading-relaxed max-w-xl font-medium">
              Experience the luxury feeling of smart layouts. Instantly transform your entire profile design aesthetic, fonts, border accents, and layouts in one click.
            </p>
          </motion.div>

          {/* Theme selection buttons redesigned as premium cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative">
            {themes.map((theme) => {
              const isActive = activeTheme === theme.id;
              return (
                <motion.button
                  key={theme.id}
                  onClick={() => {
                    setActiveTheme(theme.id);
                    setCycleTrigger((prev) => prev + 1);
                  }}
                  whileHover={shouldReduceMotion ? {} : { y: -2, scale: 1.01 }}
                  className={`flex flex-col text-left p-4 rounded-2xl border text-sm transition-all duration-300 relative overflow-hidden z-10 cursor-pointer ${
                    isActive
                      ? `bg-white ${theme.borderClass} border-zinc-200 shadow-md scale-[1.02] shadow-[#6B3A4A]/5`
                      : 'bg-white/60 border-[#E9E2DC]/80 text-[#6B6B6B] hover:bg-white hover:border-[#C89B5B]/30'
                  }`}
                >
                  <div className="flex justify-between items-center w-full mb-1.5">
                    <span className="font-extrabold text-sm text-[#1F1F1F] font-sans">{theme.label}</span>
                    {isActive && <Check size={12} className="text-[#C89B5B]" />}
                  </div>

                  {/* Theme color circles preview */}
                  <div className="flex space-x-1 mb-2">
                    {theme.colors.map((color, index) => (
                      <span
                        key={index}
                        className="w-3.5 h-3.5 rounded-full border border-zinc-200/50 shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  <span className="text-[9px] uppercase font-bold tracking-wider text-[#8A8A8A]">
                    {theme.sub}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Right Col: Interactive Phone Mockup */}
        <div className="lg:col-span-7 flex justify-center items-center">
          {/* Phone Bezel container wrapping float animation */}
          <motion.div
            animate={shouldReduceMotion ? {} : { y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
            className="relative"
          >
            {/* Phone Bezel with Morph animation */}
            <motion.div
              variants={morphVariants}
              animate={animateState}
              className="w-[320px] rounded-[42px] bg-[#1A1A1A] border-[8px] border-[#1A1A1A] shadow-[0_30px_70px_-10px_rgba(74,44,58,0.25)] overflow-hidden relative"
            >
              {/* Notch */}
              <div className="absolute top-0 inset-x-0 h-5 bg-[#1A1A1A] flex justify-center items-center z-40">
                <div className="w-16 h-3 bg-black rounded-full" />
              </div>

              {/* Dynamic Theme Content Rendering */}
              {renderThemeMockup()}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
