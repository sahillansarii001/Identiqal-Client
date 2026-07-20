"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUp,
  Sparkles,
  Shield,
  Heart,
  QrCode,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import { useSafeReducedMotion } from "@/hooks/useSafeReducedMotion.js";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const shouldReduceMotion = useSafeReducedMotion();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const whyFeatures = [
    {
      icon: <Sparkles size={16} />,
      title: "AI-Powered Profile Suggestions",
      description:
        "Receive intelligent recommendations that improve your profile automatically.",
    },
    {
      icon: <QrCode size={16} />,
      title: "Smart QR Sharing",
      description:
        "One QR adapts for meetings, resumes, events, and social media.",
    },
    {
      icon: <BarChart3 size={16} />,
      title: "Visitor Analytics",
      description: "Track profile visits, clicks, and engagement in real time.",
    },
    {
      icon: <RefreshCw size={16} />,
      title: "Instant Updates",
      description:
        "Update your profile once and every shared link reflects the latest information instantly.",
    },
  ];

  const metrics = [
    {
      label: "Profile Views",
      value: "12.4K",
      trend: "▲ +18.2%",
      progress: "75%",
    },
    { label: "QR Scans", value: "3.8K", trend: "▲ +14.5%", progress: "62%" },
    {
      label: "Leads Generated",
      value: "742",
      trend: "▲ +22.1%",
      progress: "48%",
    },
    {
      label: "Connections Saved",
      value: "2.1K",
      trend: "▲ +9.4%",
      progress: "68%",
    },
  ];

  const logos = ["Google", "Microsoft", "Adobe", "Spotify", "Notion", "GitHub"];

  const productLinks = [
    { name: "Features", href: "/#features" },
    { name: "Templates", href: "/templates" },
    { name: "Pricing", href: "/pricing" },
    { name: "Enterprise", href: "#" },
    { name: "Roadmap", href: "#" },
  ];

  const resourceLinks = [
    { name: "Documentation", href: "#" },
    { name: "API", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Community", href: "#" },
    { name: "Help Center", href: "/support" },
    { name: "FAQs", href: "#" },
  ];

  const companyLinks = [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/support" },
    { name: "Partners", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Press", href: "#" },
  ];

  const legalLinks = [
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
    { name: "Cookies", href: "#" },
    { name: "Security", href: "#" },
    { name: "Status", href: "#" },
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
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const socialBounceVariants = {
    hover: {
      y: -4,
      scale: 1.15,
      rotate: 12,
      transition: { type: "spring", stiffness: 400, damping: 12 },
    },
  };

  return (
    <motion.footer
      initial={
        shouldReduceMotion
          ? { opacity: 0 }
          : { opacity: 0, y: 30, filter: "blur(8px)" }
      }
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#FAFAFA] border-t border-[#E2E8F0] pt-20 pb-12 relative z-10 font-sans mt-auto"
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
        {/* 1. TOP PREMIUM "WHY CHOOSE IDENTIQAL?" SECTION */}
        <div className="mb-24">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="bg-white border border-[#E2E8F0] rounded-[32px] p-8 sm:p-12 lg:p-16 shadow-[0_24px_50px_rgba(37,99,235,0.02)] relative overflow-hidden"
          >
            {/* Soft decorative glow */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-[#3B82F6]/5 blur-[120px]" />
              <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-[#2563EB]/3 blur-[100px]" />
            </div>

            <div className="relative z-10 grid lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Heading + Features */}
              <div className="lg:col-span-6 space-y-8 text-left">
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#3B82F6] bg-[#3B82F6]/10 px-2.5 py-1 rounded-full border border-[#3B82F6]/20 inline-block">
                    Platform Value
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight font-sans">
                    Why Professionals <br />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-[#2563EB] to-[#3B82F6]">
                      Choose Identiqal
                    </span>
                  </h3>
                  <p className="text-sm text-brand-secondary leading-relaxed max-w-xl font-medium">
                    More than a digital business card. An intelligent networking
                    platform that helps you stand out, connect faster, and leave
                    a lasting impression.
                  </p>
                </div>

                {/* Staggered Feature Rows */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.1 } },
                  }}
                  className="space-y-6"
                >
                  {whyFeatures.map((feat, idx) => (
                    <motion.div
                      key={idx}
                      variants={{
                        hidden: shouldReduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, x: -30 },
                        visible: {
                          opacity: 1,
                          x: 0,
                          transition: { duration: 0.5, ease: "easeOut" },
                        },
                      }}
                      className="flex items-start space-x-4 group cursor-default"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                        {feat.icon}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-sm text-[#0F172A] group-hover:text-[#2563EB] transition-colors duration-300 font-sans">
                          {feat.title}
                        </h4>
                        <p className="text-xs text-brand-secondary leading-relaxed font-sans max-w-md">
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
                  initial={
                    shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 30 }
                  }
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="w-full max-w-[420px] bg-white/80 backdrop-blur-md border border-[#E2E8F0] rounded-[24px] p-6 shadow-xl relative z-10"
                >
                  {/* Dashboard Header */}
                  <div className="flex justify-between items-center pb-4 border-b border-[#E2E8F0] mb-5">
                    <span className="text-[10px] font-black text-[#2563EB] tracking-wider font-sans uppercase">
                      Visitor Dashboard
                    </span>
                    <span className="text-[9px] font-bold text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                      ● Real-time Live
                    </span>
                  </div>

                  {/* Metrics 2x2 Grid */}
                  <div className="grid grid-cols-2 gap-6">
                    {metrics.map((m, idx) => (
                      <div key={idx} className="space-y-2 text-left">
                        <span className="text-[10px] uppercase font-bold text-[#8A8A8A] tracking-wider font-sans block">
                          {m.label}
                        </span>
                        <div className="flex items-baseline space-x-1.5">
                          <span className="text-2xl font-black text-[#0F172A] font-sans">
                            {m.value}
                          </span>
                          <span className="text-[9px] font-bold text-green-600 bg-green-500/10 px-1 py-0.5 rounded">
                            {m.trend}
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full h-1.5 bg-[#E2E8F0]/50 rounded-full overflow-hidden relative">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: m.progress }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 1,
                              ease: "easeOut",
                              delay: 0.2,
                            }}
                            className="h-full bg-linear-to-r from-[#2563EB] to-[#3B82F6] rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Floating notifications */}
                  {/* Notification 1: Sarah viewed */}
                  <motion.div
                    animate={shouldReduceMotion ? {} : { y: [0, -6, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 4,
                      ease: "easeInOut",
                    }}
                    className="absolute -top-4 -right-4 bg-white border border-[#E2E8F0] shadow-lg px-3 py-2.5 rounded-xl text-[10px] font-extrabold text-[#0F172A] flex items-center space-x-2 backdrop-blur-sm z-20"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] flex items-center justify-center text-[9px] font-black">
                      S
                    </div>
                    <span>Sarah viewed your profile</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  </motion.div>

                  {/* Notification 2: +12 visits */}
                  <motion.div
                    animate={shouldReduceMotion ? {} : { y: [0, 6, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 4,
                      ease: "easeInOut",
                      delay: 0.5,
                    }}
                    className="absolute -bottom-4 -left-4 bg-[#2563EB] text-white shadow-lg px-3 py-2.5 rounded-xl text-[10px] font-extrabold flex items-center space-x-2 z-20"
                  >
                    <Sparkles size={10} className="text-[#3B82F6]" />
                    <span>+12 new profile visits</span>
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Bottom Section: Grayscale client logos */}
            <div className="mt-16 pt-10 border-t border-[#E2E8F0] text-center">
              <span className="text-[10px] uppercase font-bold text-[#8A8A8A] tracking-widest block mb-8">
                Trusted by professionals worldwide
              </span>
              <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
                {logos.map((logo, idx) => (
                  <span
                    key={idx}
                    className="text-sm font-black tracking-tight text-[#8A8A8A] hover:text-[#2563EB] transition-colors duration-300 grayscale hover:grayscale-0 cursor-default opacity-60 hover:opacity-100"
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-x-12 gap-y-16 pb-20 items-start text-left"
        >
          {/* Column 1 (Brand & Newsletter): Spans 2 Columns */}
          <motion.div
            variants={columnVariants}
            className="lg:col-span-2 flex flex-col h-full"
          >
            <Link href="/" className="flex items-center space-x-3 mb-6">
              <div className="w-[42px] h-[42px] rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/40 to-transparent" />
                <span className="font-sans font-black text-xl text-white tracking-wider">iQ</span>
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-900 font-sans">
                Identiqal
              </span>
            </Link>

            <p className="text-sm text-slate-500 leading-relaxed max-w-sm mb-8 font-medium">
              Create smarter, AI-powered digital identities. Stand out, connect faster, and leave a lasting impression.
            </p>

            {/* Premium Newsletter Section */}
            <div className="mt-auto space-y-4 max-w-sm">
              <h5 className="text-xs font-bold uppercase text-slate-900 tracking-wider flex items-center gap-2">
                Join our newsletter
              </h5>
              {subscribed ? (
                <div className="p-3 bg-green-50/80 backdrop-blur text-green-700 text-sm font-semibold rounded-2xl border border-green-200 shadow-sm flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</div>
                  Thanks for subscribing!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="relative group flex items-center">
                  <motion.input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    whileFocus={
                      shouldReduceMotion ? {} : { boxShadow: "0 0 0 4px rgba(37, 99, 235, 0.1)" }
                    }
                    className="w-full pl-5 pr-32 py-3.5 text-sm bg-white border border-slate-200 rounded-2xl outline-none transition-all duration-300 focus:border-blue-500 shadow-sm group-hover:shadow-md"
                  />
                  <motion.button
                    type="submit"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                    className="absolute right-1.5 top-1.5 bottom-1.5 bg-blue-600 hover:bg-blue-700 text-white px-5 text-xs font-bold rounded-xl transition-colors duration-200 shadow-sm flex items-center gap-1"
                  >
                    Subscribe
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Links Columns */}
          {[
            { title: "Product", links: productLinks },
            { title: "Resources", links: resourceLinks },
            { title: "Company", links: companyLinks },
            { title: "Legal", links: legalLinks },
          ].map((col, idx) => (
            <motion.div key={col.title} variants={columnVariants} className="space-y-6">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest font-sans">
                {col.title}
              </h4>
              <ul className="space-y-4">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors duration-200 flex items-center group"
                    >
                      <span>{link.name}</span>
                      <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-blue-600">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* BOTTOM SECTION */}
        <div className="pt-8 mt-4 border-t border-slate-200/80 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-400">
            <span>© 2026 Identiqal. All rights reserved.</span>
            <div className="hidden md:flex items-center gap-4 border-l border-slate-200 pl-6">
              <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Systems Operational</span>
            </div>
          </div>

          {/* Social icons */}
          <div className="flex items-center space-x-3">
            {[
              { name: "LinkedIn", icon: <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>, href: "#" },
              { name: "GitHub", icon: <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.442 22 12.017 22 6.484 17.522 2 12 2z" /></svg>, href: "#" },
              { name: "X", icon: <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>, href: "#" },
            ].map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 hover:shadow-sm transition-all duration-300"
              >
                {item.icon}
              </motion.a>
            ))}
          </div>
        </div>
      </div>


</motion.footer>
  );
};
