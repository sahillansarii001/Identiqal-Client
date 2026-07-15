'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUp, Sparkles, Shield, Heart, QrCode, BarChart3, RefreshCw } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const shouldReduceMotion = useReducedMotion();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whyFeatures = [
    {
      icon: <Sparkles size={16} />,
      title: 'AI-Powered Profile Suggestions',
      description: 'Receive intelligent recommendations that improve your profile automatically.',
    },
    {
      icon: <QrCode size={16} />,
      title: 'Smart QR Sharing',
      description: 'One QR adapts for meetings, resumes, events, and social media.',
    },
    {
      icon: <BarChart3 size={16} />,
      title: 'Visitor Analytics',
      description: 'Track profile visits, clicks, and engagement in real time.',
    },
    {
      icon: <RefreshCw size={16} />,
      title: 'Instant Updates',
      description: 'Update your profile once and every shared link reflects the latest information instantly.',
    },
  ];

  const metrics = [
    { label: 'Profile Views', value: '12.4K', trend: '▲ +18.2%', progress: '75%' },
    { label: 'QR Scans', value: '3.8K', trend: '▲ +14.5%', progress: '62%' },
    { label: 'Leads Generated', value: '742', trend: '▲ +22.1%', progress: '48%' },
    { label: 'Connections Saved', value: '2.1K', trend: '▲ +9.4%', progress: '68%' },
  ];

  const logos = ['Google', 'Microsoft', 'Adobe', 'Spotify', 'Notion', 'GitHub'];

  const productLinks = [
    { name: 'Features', href: '/#features' },
    { name: 'Templates', href: '/templates' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Enterprise', href: '#' },
    { name: 'Roadmap', href: '#' },
  ];

  const resourceLinks = [
    { name: 'Documentation', href: '#' },
    { name: 'API', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Community', href: '#' },
    { name: 'Help Center', href: '/support' },
    { name: 'FAQs', href: '#' },
  ];

  const companyLinks = [
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/support' },
    { name: 'Partners', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Press', href: '#' },
  ];

  const legalLinks = [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    { name: 'Cookies', href: '#' },
    { name: 'Security', href: '#' },
    { name: 'Status', href: '#' },
  ];

  // Animation variants for columns stagger entry
  const footerContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const columnVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const socialBounceVariants = {
    hover: {
      y: -4,
      scale: 1.15,
      transition: { type: 'spring', stiffness: 400, damping: 10 },
    },
  };

  return (
    <motion.footer
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="bg-[#F8F4F1] border-t border-[#E9E2DC] pt-20 pb-12 relative z-10 font-sans mt-auto"
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
        {/* 1. TOP PREMIUM "WHY CHOOSE IDENTIQAL?" SECTION */}
        <div className="mb-24">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8 }}
            className="bg-white border border-[#E9E2DC] rounded-[32px] p-8 sm:p-12 lg:p-16 shadow-[0_24px_50px_rgba(107,58,74,0.02)] relative overflow-hidden"
          >
            {/* Soft decorative glow */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-[#C89B5B]/5 blur-[120px]" />
              <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-[#6B3A4A]/3 blur-[100px]" />
            </div>

            <div className="relative z-10 grid lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Heading + Features */}
              <div className="lg:col-span-6 space-y-8 text-left">
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#C89B5B] bg-[#C89B5B]/10 px-2.5 py-1 rounded-full border border-[#C89B5B]/20 inline-block">
                    Platform Value
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-[#1F1F1F] tracking-tight leading-tight font-sans">
                    Why Professionals <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6B3A4A] to-[#C89B5B]">
                      Choose Identiqal
                    </span>
                  </h3>
                  <p className="text-sm text-[#6B6B6B] leading-relaxed max-w-xl font-medium">
                    More than a digital business card. An intelligent networking platform that helps you stand out, connect faster, and leave a lasting impression.
                  </p>
                </div>

                {/* Staggered Feature Rows */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.1 } }
                  }}
                  className="space-y-6"
                >
                  {whyFeatures.map((feat, idx) => (
                    <motion.div
                      key={idx}
                      variants={{
                        hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -30 },
                        visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } }
                      }}
                      className="flex items-start space-x-4 group cursor-default"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#C89B5B]/10 text-[#C89B5B] border border-[#C89B5B]/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                        {feat.icon}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-sm text-[#1F1F1F] group-hover:text-[#6B3A4A] transition-colors duration-300 font-sans">
                          {feat.title}
                        </h4>
                        <p className="text-xs text-[#6B6B6B] leading-relaxed font-sans max-w-md">
                          {feat.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Right Column: Dashboard Mockup */}
              <div className="lg:col-span-6 flex justify-center items-center relative py-8">
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className="w-full max-w-[420px] bg-white/80 backdrop-blur-md border border-[#E9E2DC] rounded-[24px] p-6 shadow-xl relative z-10"
                >
                  {/* Dashboard Header */}
                  <div className="flex justify-between items-center pb-4 border-b border-[#E9E2DC] mb-5">
                    <span className="text-[10px] font-black text-[#6B3A4A] tracking-wider font-sans uppercase">Visitor Dashboard</span>
                    <span className="text-[9px] font-bold text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">● Real-time Live</span>
                  </div>

                  {/* Metrics 2x2 Grid */}
                  <div className="grid grid-cols-2 gap-6">
                    {metrics.map((m, idx) => (
                      <div key={idx} className="space-y-2 text-left">
                        <span className="text-[10px] uppercase font-bold text-[#8A8A8A] tracking-wider font-sans block">{m.label}</span>
                        <div className="flex items-baseline space-x-1.5">
                          <span className="text-2xl font-black text-[#1F1F1F] font-sans">{m.value}</span>
                          <span className="text-[9px] font-bold text-green-600 bg-green-500/10 px-1 py-0.5 rounded">
                            {m.trend}
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full h-1.5 bg-[#E9E2DC]/50 rounded-full overflow-hidden relative">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: m.progress }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                            className="h-full bg-gradient-to-r from-[#6B3A4A] to-[#C89B5B] rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Floating notifications */}
                  {/* Notification 1: Sarah viewed */}
                  <motion.div
                    animate={shouldReduceMotion ? {} : { y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                    className="absolute -top-4 -right-4 bg-white border border-[#E9E2DC] shadow-lg px-3 py-2.5 rounded-xl text-[10px] font-extrabold text-[#1F1F1F] flex items-center space-x-2 backdrop-blur-sm z-20"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#C89B5B]/20 text-[#C89B5B] flex items-center justify-center text-[9px] font-black">
                      S
                    </div>
                    <span>Sarah viewed your profile</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  </motion.div>

                  {/* Notification 2: +12 visits */}
                  <motion.div
                    animate={shouldReduceMotion ? {} : { y: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 0.5 }}
                    className="absolute -bottom-4 -left-4 bg-[#6B3A4A] text-white shadow-lg px-3 py-2.5 rounded-xl text-[10px] font-extrabold flex items-center space-x-2 z-20"
                  >
                    <Sparkles size={10} className="text-[#C89B5B]" />
                    <span>+12 new profile visits</span>
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Bottom Section: Grayscale client logos */}
            <div className="mt-16 pt-10 border-t border-[#E9E2DC] text-center">
              <span className="text-[10px] uppercase font-bold text-[#8A8A8A] tracking-widest block mb-8">
                Trusted by professionals worldwide
              </span>
              <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
                {logos.map((logo, idx) => (
                  <span
                    key={idx}
                    className="text-sm font-black tracking-tight text-[#8A8A8A] hover:text-[#6B3A4A] transition-colors duration-300 grayscale hover:grayscale-0 cursor-default opacity-60 hover:opacity-100"
                  >
                    {logo}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* 2. MAIN 5-COLUMN STAGGERED LINKS GRID */}
        <motion.div
          variants={footerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-16 lg:gap-12 pb-16 items-start text-left"
        >
          {/* Column 1 (Brand): Spans 2 Columns on large screens */}
          <motion.div variants={columnVariants} className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3.5">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-[50px] h-[50px] rounded-xl bg-[#6B3A4A] flex items-center justify-center shadow-md relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#C89B5B]/30 to-transparent" />
                  <span className="font-sans font-black text-lg text-white tracking-wider">iQ</span>
                </div>
                <span className="text-xl font-extrabold tracking-tight text-[#1F1F1F] font-sans">Identiqal</span>
              </Link>
              
              <span className="inline-flex items-center space-x-0.5 bg-[#C89B5B]/10 text-[#C89B5B] border border-[#C89B5B]/20 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide uppercase">
                <Sparkles size={8} className="fill-current" />
                <span>Built with AI</span>
              </span>
            </div>

            <p className="text-xs text-[#6B6B6B] leading-relaxed max-w-sm font-medium">
              Create smarter digital identities powered by AI.
            </p>

            {/* Newsletter Section */}
            <div className="space-y-3 max-w-sm">
              <h5 className="text-[11px] font-black uppercase text-[#6B3A4A] tracking-wider">Stay Updated</h5>
              {subscribed ? (
                <div className="p-2 bg-green-50 text-green-700 text-xs font-semibold rounded-lg border border-green-200">
                  ✓ Thanks for subscribing!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 text-xs bg-white/70 border border-[#E9E2DC] focus:border-[#C89B5B] rounded-lg outline-none transition-all focus:ring-2 focus:ring-[#C89B5B]/20"
                  />
                  <motion.button
                    type="submit"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                    className="bg-[#6B3A4A] hover:bg-[#522c38] text-white px-4 py-2.5 text-xs font-bold rounded-lg transition-all hover:shadow-[0_0_15px_rgba(107,58,74,0.15)]"
                  >
                    Subscribe
                  </motion.button>
                </form>
              )}
            </div>

            {/* Social icons inside circular glass buttons */}
            <div className="flex space-x-2 pt-2">
              {[
                { name: 'LinkedIn', icon: <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>, href: '#' },
                { name: 'GitHub', icon: <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.442 22 12.017 22 6.484 17.522 2 12 2z"/></svg>, href: '#' },
                { name: 'Instagram', icon: <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>, href: '#' },
                { name: 'X', icon: <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, href: '#' },
                { name: 'Discord', icon: <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.094 13.094 0 01-1.873-.894.077.077 0 01-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 01.077-.011 13.924 13.924 0 0010.979 0 .074.074 0 01.078.012c.12.097.246.194.373.287a.077.077 0 01-.006.128 12.98 12.98 0 01-1.873.894.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z"/></svg>, href: '#' },
              ].map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  variants={socialBounceVariants}
                  whileHover="hover"
                  aria-label={item.name}
                  className="w-10 h-10 rounded-full bg-white/40 backdrop-blur-sm border border-[#E9E2DC]/60 flex items-center justify-center text-[#6B3A4A] hover:bg-[#6B3A4A] hover:text-[#C89B5B] hover:shadow-md hover:border-[#6B3A4A] transition-colors duration-300"
                >
                  {item.icon}
                </motion.a>
              ))}
            </div>

            {/* Muted trust tags */}
            <div className="flex flex-wrap gap-4 pt-2 text-[10px] font-bold text-[#8A8A8A]">
              <span>✓ Secure SSL</span>
              <span>✓ GDPR Ready</span>
              <span>⚡ Fast CDN</span>
            </div>
          </motion.div>

          {/* Column 2 (Product) */}
          <motion.div variants={columnVariants} className="space-y-6">
            <h4 className="text-[11px] font-extrabold text-[#1F1F1F] uppercase tracking-widest font-sans">
              Product
            </h4>
            <ul className="space-y-4 text-xs font-medium">
              {productLinks.map((link) => (
                <motion.li
                  key={link.name}
                  whileHover={shouldReduceMotion ? {} : { x: 4 }}
                  className="transition-colors duration-300"
                >
                  <Link
                    href={link.href}
                    className="text-[#6B6B6B] hover:text-[#6B3A4A] relative py-1 hover:after:w-full after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-[#C89B5B] after:transition-all after:duration-300 transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3 (Resources) */}
          <motion.div variants={columnVariants} className="space-y-6">
            <h4 className="text-[11px] font-extrabold text-[#1F1F1F] uppercase tracking-widest font-sans">
              Resources
            </h4>
            <ul className="space-y-4 text-xs font-medium">
              {resourceLinks.map((link) => (
                <motion.li
                  key={link.name}
                  whileHover={shouldReduceMotion ? {} : { x: 4 }}
                  className="transition-colors duration-300"
                >
                  <Link
                    href={link.href}
                    className="text-[#6B6B6B] hover:text-[#6B3A4A] relative py-1 hover:after:w-full after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-[#C89B5B] after:transition-all after:duration-300 transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4 (Company) */}
          <motion.div variants={columnVariants} className="space-y-6">
            <h4 className="text-[11px] font-extrabold text-[#1F1F1F] uppercase tracking-widest font-sans">
              Company
            </h4>
            <ul className="space-y-4 text-xs font-medium">
              {companyLinks.map((link) => (
                <motion.li
                  key={link.name}
                  whileHover={shouldReduceMotion ? {} : { x: 4 }}
                  className="transition-colors duration-300"
                >
                  <Link
                    href={link.href}
                    className="text-[#6B6B6B] hover:text-[#6B3A4A] relative py-1 hover:after:w-full after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-[#C89B5B] after:transition-all after:duration-300 transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Column 5 (Legal) */}
          <motion.div variants={columnVariants} className="space-y-6">
            <h4 className="text-[11px] font-extrabold text-[#1F1F1F] uppercase tracking-widest font-sans">
              Legal
            </h4>
            <ul className="space-y-4 text-xs font-medium">
              {legalLinks.map((link) => (
                <motion.li
                  key={link.name}
                  whileHover={shouldReduceMotion ? {} : { x: 4 }}
                  className="transition-colors duration-300"
                >
                  <Link
                    href={link.href}
                    className="text-[#6B6B6B] hover:text-[#6B3A4A] relative py-1 hover:after:w-full after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-[#C89B5B] after:transition-all after:duration-300 transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* 3. LIGHT BOTTOM DIVIDER */}
        <div className="h-[1px] bg-[#E9E2DC]/50 w-full mb-8" />

        {/* 4. BOTTOM SECTION */}
        <div className="text-center text-xs text-[#6B6B6B] font-medium">
          <span>© 2026 Identiqal. All rights reserved.</span>
        </div>
      </div>
    </motion.footer>
  );
};
