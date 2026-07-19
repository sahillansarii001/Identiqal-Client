"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/marketing/Navbar.jsx";
import { Footer } from "@/components/marketing/Footer.jsx";
import {
  Layers,
  QrCode,
  Sparkles,
  Play,
  Check,
  TrendingUp,
  Inbox,
  Smartphone,
  ShieldCheck,
  Cpu,
  ArrowRight,
  Database,
  Search,
  Zap,
  Star,
} from "lucide-react";

export default function FeaturesPage() {
  const coreFeatures = [
    {
      icon: <Layers size={22} className="text-[#2563EB]" />,
      title: "Drag & Drop Builder",
      description:
        "Easily compose and reorder bio details, contact cards, portfolio displays, and social links on an interactive canvas layout block editor.",
    },
    {
      icon: <QrCode size={22} className="text-[#3B82F6]" />,
      title: "Smart QR Modes",
      description:
        "Generate dynamic QR codes redirectable instantly. Toggle between sharing your full contacts page or your direct custom booking form.",
    },
    {
      icon: <Sparkles size={22} className="text-[#2563EB]" />,
      title: "Smart Introduction Generator",
      description:
        "Leverage built-in AI models to scan your professional qualifications and draft a high-converting elevator pitch bio summary in one click.",
    },
    {
      icon: <TrendingUp size={22} className="text-[#3B82F6]" />,
      title: "Profile Replay Analytics",
      description:
        "Monitor click-through metrics, geolocation traffic origins, device platforms, and visitor session patterns directly inside your dashboard.",
    },
    {
      icon: <ShieldCheck size={22} className="text-[#2563EB]" />,
      title: "AI Profile Health Score",
      description:
        "Get automated structural feedback and completeness reviews to ensure contact forms, social tags, and downloads are fully active.",
    },
    {
      icon: <Inbox size={22} className="text-[#3B82F6]" />,
      title: "Lead Collection",
      description:
        "Capture prospective clients with customizable inquiry forms. Inbound messages are delivered directly with instant email logs.",
    },
    {
      icon: <Smartphone size={22} className="text-[#2563EB]" />,
      title: "Mobile Friendly Design",
      description:
        "Templates are meticulously built to adapt dynamically. Ensure a premium loading visual across all screen breakpoints.",
    },
    {
      icon: <Cpu size={22} className="text-[#3B82F6]" />,
      title: "App Integrations",
      description:
        "Directly hook into third-party tools like Calendly booking schedulers, HubSpot pipelines, Zapier tasks, and corporate email signatures.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        {/* HERO SECTION */}
        <section className="relative py-24 px-6 overflow-hidden">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute -top-40 left-1/4 w-[550px] h-[550px] rounded-full bg-[#2563EB]/5 blur-[120px]" />
            <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] rounded-full bg-[#3B82F6]/5 blur-[100px]" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#2563EB]/5 border border-[#2563EB]/10 text-xs font-semibold text-[#2563EB]">
              <Sparkles size={12} className="text-[#3B82F6]" />
              <span>Full Product Suite Capabilities</span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-tight text-[#0F172A] max-w-4xl mx-auto font-sans">
              Advanced Digital Identity. <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#2563EB] to-[#3B82F6]">
                Engineered for Professionals.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-brand-secondary max-w-2xl mx-auto font-medium">
              Take complete control of how you network. Drag-and-drop custom
              pages, utilize deep analytics, embed custom capture forms, and
              optimize search discovery with AI.
            </p>

            <div className="flex items-center justify-center gap-4 pt-2">
              <Link href="/signup">
                <button className="bg-[#2563EB] text-white hover:bg-[#6A3B4B] font-semibold px-8 py-4 rounded-xl transition-all shadow-md">
                  Get Started Free
                </button>
              </Link>
              <a href="#suite">
                <button className="bg-white border border-[#E2E8F0] hover:border-[#2563EB]/30 text-[#2563EB] font-semibold px-8 py-4 rounded-xl transition-all">
                  Explore Features
                </button>
              </a>
            </div>
          </div>
        </section>

        {/* MOCKUP PREVIEW GRID BLOCK */}
        <section
          id="suite"
          className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-12 gap-8 items-center border-t border-[#E2E8F0]"
        >
          <div className="lg:col-span-5 space-y-6 text-left">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#3B82F6]">
              Interactive Sandbox
            </span>
            <h2 className="text-3xl font-extrabold text-[#0F172A]">
              Drag & Drop Layout Blocks
            </h2>
            <p className="text-xs text-brand-secondary leading-relaxed">
              Design a page that fits your exact workflow. Add and organize
              visual layout elements: personal descriptions, direct calendar
              bookings, picture showcases, lead contact forms, and testimonial
              quote headers. Reorder instantly and save live updates in
              real-time.
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex items-center space-x-2 text-xs font-semibold text-[#0F172A]">
                <Check size={14} className="text-[#3B82F6]" />
                <span>Custom Hex color brand codes</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-[#0F172A]">
                <Check size={14} className="text-[#3B82F6]" />
                <span>NFC business card integrations</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm shadow-[#2563EB]/3 flex justify-center items-center">
            {/* Visual Builder mockup preview */}
            <div className="w-full max-w-md bg-[#F8FAFC] border border-[#E2E8F0] p-5 rounded-xl space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[#E2E8F0]">
                <span className="text-[10px] font-black text-[#2563EB]">
                  BUILDER CANVAS
                </span>
                <span className="text-[9px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                  ● Online Live
                </span>
              </div>
              {/* Blocks */}
              <div className="p-3 bg-white border border-[#E2E8F0] rounded-lg shadow-sm flex justify-between items-center text-xs text-[#0F172A] font-semibold">
                <span>👤 Header Biography block</span>
                <span className="text-[10px] text-[#3B82F6] uppercase font-bold">
                  Active
                </span>
              </div>
              <div className="p-3 bg-white border border-[#E2E8F0] rounded-lg shadow-sm flex justify-between items-center text-xs text-[#0F172A] font-semibold">
                <span>🔗 Dynamic Links List block</span>
                <span className="text-[10px] text-[#3B82F6] uppercase font-bold">
                  Active
                </span>
              </div>
              <div className="p-3 bg-white border border-[#E2E8F0] rounded-lg shadow-sm flex justify-between items-center text-xs text-[#0F172A] font-semibold">
                <span>📬 Inbound Lead Message Form</span>
                <span className="text-[10px] text-green-500 uppercase font-bold">
                  Visible
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* CORE FEATURES GRID */}
        <section className="py-20 bg-white border-y border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#3B82F6]">
                Deep Dive
              </span>
              <h2 className="text-3xl font-extrabold text-[#0F172A]">
                Everything you need to grow your network
              </h2>
              <p className="text-xs text-brand-secondary">
                Discover features engineered to simplify modern connections,
                automate capture logic, and analyze visual interactions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coreFeatures.map((feat, idx) => (
                <div
                  key={idx}
                  className="bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#2563EB]/30 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-[#2563EB]/5 group text-left space-y-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
                    {feat.icon}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-[#0F172A] font-sans">
                      {feat.title}
                    </h4>
                    <p className="text-xs text-brand-secondary leading-relaxed pt-1.5 font-sans">
                      {feat.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* INTEGRATIONS AND SECURITY */}
        <section className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
          {/* Security */}
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 text-left space-y-4 shadow-sm shadow-[#2563EB]/3">
            <div className="w-12 h-12 rounded-xl bg-[#2563EB]/5 flex items-center justify-center text-[#2563EB]">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold text-[#0F172A]">
              Enterprise Grade Security
            </h3>
            <p className="text-xs text-brand-secondary leading-relaxed">
              We care deeply about details. Your digital contact database is
              secured behind top-tier TLS/SSL encryption models. Export inquiry
              logs securely, lock admin-seat styling parameters, and manage team
              workspaces.
            </p>
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold pt-2">
              <div className="flex items-center space-x-2">
                <Check size={14} className="text-[#3B82F6]" />
                <span>SSL Secure Encryption</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check size={14} className="text-[#3B82F6]" />
                <span>GDPR Privacy compliant</span>
              </div>
            </div>
          </div>

          {/* Apps */}
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 text-left space-y-4 shadow-sm shadow-[#2563EB]/3">
            <div className="w-12 h-12 rounded-xl bg-[#3B82F6]/5 flex items-center justify-center text-[#3B82F6]">
              <Cpu size={24} />
            </div>
            <h3 className="text-xl font-bold text-[#0F172A]">
              Seamless App Integrations
            </h3>
            <p className="text-xs text-brand-secondary leading-relaxed">
              Identiqal seamlessly connects with your existing daily tech tools.
              Collect contact card data and feed it directly to automation
              processes, email tags, and customer relations management panels.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {[
                "Calendly",
                "Hubspot",
                "Zapier",
                "Mailchimp",
                "Google Maps",
                "ActiveCampaign",
              ].map((tool) => (
                <span
                  key={tool}
                  className="text-[10px] font-bold bg-[#F8FAFC] text-brand-secondary border border-[#E2E8F0] px-3 py-1.5 rounded-full"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="max-w-7xl mx-auto px-6 pt-12">
          <div className="bg-[#2563EB] border border-[#E2E8F0] rounded-3xl p-12 sm:p-16 relative overflow-hidden shadow-xl shadow-[#2563EB]/10 text-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#3B82F6]/10 blur-[80px] pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Unlock full networking capabilities.
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-lg mx-auto">
                Join professionals worldwide replacing outdated paper business
                cards with clean, AI-powered smart digital profiles.
              </p>
              <div className="flex items-center justify-center gap-4 pt-2">
                <Link href="/signup">
                  <button className="bg-[#3B82F6] hover:bg-[#b0874c] text-white font-bold text-xs px-6 py-3 rounded-lg shadow-md transition-all">
                    Create Your Card Free
                  </button>
                </Link>
                <Link href="/pricing">
                  <button className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-xs px-6 py-3 rounded-lg backdrop-blur-sm transition-all">
                    View Pricing
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

