"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/marketing/Navbar.jsx";
import { Footer } from "@/components/marketing/Footer.jsx";
import FaqAccordion from "@/components/ui/FaqAccordion.jsx";
import Counter from "@/components/ui/Counter.jsx";
import {
  Sparkles,
  Heart,
  TrendingUp,
  Globe,
  Users,
  Compass,
  CheckCircle2,
  HelpCircle,
  Clock,
  Briefcase,
  Lightbulb,
} from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: <Heart size={20} className="text-[#2563EB]" />,
      title: "Integrity First",
      description:
        "We believe professional networks should be built on trust, transparency, and data ownership principles.",
    },
    {
      icon: <Lightbulb size={20} className="text-[#3B82F6]" />,
      title: "Continuous Innovation",
      description:
        "Integrating modern machine learning to automate the tedious aspects of networking and follow-ups.",
    },
    {
      icon: <Globe size={20} className="text-[#2563EB]" />,
      title: "Global Connectivity",
      description:
        "Building tools that empower creators and corporate developers across borders to share credentials seamlessly.",
    },
  ];

  const team = [
    {
      name: "Alexander Mercer",
      role: "CEO & Co-Founder",
      initials: "AM",
      bio: "Ex-Apple Lead Designer, advisor to next-gen AI startups.",
    },
    {
      name: "Dr. Evelyn Foster",
      role: "CTO & Head of AI",
      initials: "EF",
      bio: "Ph.D. in Machine Learning from MIT. Ex-Google Brain scientist.",
    },
    {
      name: "Kento Tanaka",
      role: "Head of Product",
      initials: "KT",
      bio: "Product veteran. Led workspace design scaling at Vercel.",
    },
  ];

  const stats = [
    { number: "10M+", label: "Cards Shared Worldwide" },
    { number: "99.9%", label: "Platform Uptime SLA" },
    { number: "150+", label: "Countries Supported" },
  ];

  const history = [
    {
      year: "2024",
      title: "The Seed Idea",
      description:
        "Founded with the mission to eradicate paper waste and modernise static corporate cards.",
    },
    {
      year: "2025",
      title: "AI Expansion",
      description:
        "Launched smart bio writer models, geolocation views, and custom team integrations.",
    },
    {
      year: "2026",
      title: "Workspace Phase",
      description:
        "Upgraded team workspaces, styling permission locks, and unified NFC systems.",
    },
  ];

  const faqs = [
    {
      q: "How does NFC card integration work?",
      a: "You can hook any standard NFC business card to your Identiqal slug. Tapping the physical card on a smartphone redirects readers instantly to your digital profile.",
    },
    {
      q: "Can we manage multiple cards under one workspace?",
      a: "Yes! The Business plan supports organization workspace locking where admins manage cards for all team members, locks styles, and aggregates statistics.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        {/* HERO SECTION */}
        <section className="relative py-24 px-6 overflow-hidden">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full bg-[#2563EB]/5 blur-[120px]" />
            <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] rounded-full bg-[#3B82F6]/5 blur-[100px]" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#2563EB]/5 border border-[#2563EB]/10 text-xs font-semibold text-[#2563EB]">
              <Compass size={12} className="text-[#3B82F6]" />
              <span>Our Story & Mission</span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-tight text-[#0F172A] max-w-4xl mx-auto font-sans">
              Redefining the First <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#2563EB] to-[#3B82F6]">
                Professional Impression.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-brand-secondary max-w-2xl mx-auto font-medium">
              We believe networking shouldn't rely on paper waste. Our mission
              is to build highly interactive, customizable, and secure digital
              identities that help you stand out.
            </p>
          </div>
        </section>

        {/* MISSION & VISION */}
        <section className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12 border-t border-[#E2E8F0]">
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 text-left space-y-4 shadow-sm shadow-[#2563EB]/3">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB]/5 flex items-center justify-center text-[#2563EB]">
              <Compass size={20} />
            </div>
            <h3 className="text-xl font-bold text-[#0F172A]">Our Mission</h3>
            <p className="text-xs text-brand-secondary leading-relaxed">
              To build a secure, planet-friendly digital identity ecosystem that
              streamlines contact sharing, eliminates printing costs, and
              automates marketing lead pipelines for businesses and creators.
            </p>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 text-left space-y-4 shadow-sm shadow-[#2563EB]/3">
            <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/5 flex items-center justify-center text-[#3B82F6]">
              <Lightbulb size={20} />
            </div>
            <h3 className="text-xl font-bold text-[#0F172A]">Our Vision</h3>
            <p className="text-xs text-brand-secondary leading-relaxed">
              To transform the traditional contact exchange into a secure,
              insights-driven digital gateway. We imagine a future where
              professional contacts sync instantly and intelligently.
            </p>
          </div>
        </section>

        {/* STATISTICS */}
        <section className="py-20 bg-white border-y border-[#E2E8F0] my-12">
          <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-3 gap-8 text-center">
            {stats.map((stat, idx) => {
              const numPart = stat.number.match(/[0-9.]+/)?.[0] || "";
              const suffixPart = stat.number.replace(/[0-9.]/g, "") || "";
              return (
                <div key={idx} className="space-y-2">
                  <span className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-[#2563EB] to-[#3B82F6]">
                    <Counter value={numPart} suffix={suffixPart} />
                  </span>
                  <p className="text-xs font-bold text-brand-secondary uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* TIMELINE */}
        <section className="max-w-4xl mx-auto px-6 py-12 text-left">
          <h3 className="text-2xl font-extrabold text-[#0F172A] mb-12 text-center">
            How We Grew
          </h3>
          <div className="relative border-l border-[#E2E8F0] ml-4 space-y-12">
            {history.map((hist, idx) => (
              <div key={idx} className="relative pl-8 group">
                {/* timeline node icon */}
                <div className="absolute top-0 left-[-10px] w-5 h-5 rounded-full bg-[#2563EB] border-4 border-white shadow-sm flex items-center justify-center z-10 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-xs font-black text-[#3B82F6] uppercase tracking-wider">
                  {hist.year}
                </span>
                <h4 className="font-extrabold text-base text-[#0F172A] mt-1">
                  {hist.title}
                </h4>
                <p className="text-xs text-brand-secondary mt-2 leading-relaxed">
                  {hist.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CORE VALUES */}
        <section className="py-20 bg-white border-y border-[#E2E8F0] my-12">
          <div className="max-w-7xl mx-auto px-6">
            <h3 className="text-2xl font-extrabold text-[#0F172A] mb-12 text-center">
              Our Core Values
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((val, idx) => (
                <div
                  key={idx}
                  className="bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#2563EB]/30 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-[#2563EB]/5 group text-left space-y-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
                    {val.icon}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-[#0F172A]">
                      {val.title}
                    </h4>
                    <p className="text-xs text-brand-secondary leading-relaxed pt-1.5">
                      {val.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MEET THE TEAM */}
        <section className="max-w-7xl mx-auto px-6 py-12 text-center">
          <h3 className="text-2xl font-extrabold text-[#0F172A] mb-12">
            Meet the Team
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#E2E8F0] hover:border-[#2563EB]/30 rounded-2xl p-6 transition-all duration-300 hover:shadow-md text-left space-y-4 relative overflow-hidden"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-linear-to-tr from-[#2563EB] to-[#3B82F6] flex items-center justify-center text-white font-bold text-base shadow-sm">
                    {member.initials}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#0F172A]">
                      {member.name}
                    </h4>
                    <p className="text-[10px] text-[#3B82F6] font-bold uppercase">
                      {member.role}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-brand-secondary leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="max-w-4xl mx-auto px-6 py-12 border-t border-[#E2E8F0] text-left">
          <h3 className="text-2xl font-extrabold text-[#0F172A] mb-12 text-center flex items-center justify-center space-x-2">
            <HelpCircle size={22} className="text-[#3B82F6]" />
            <span>Frequently Asked Questions</span>
          </h3>
          <div className="max-w-2xl mx-auto">
            <FaqAccordion items={faqs} />
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="max-w-7xl mx-auto px-6 pt-12">
          <div className="bg-[#2563EB] border border-[#E2E8F0] rounded-3xl p-12 sm:p-16 relative overflow-hidden shadow-xl shadow-[#2563EB]/10 text-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#3B82F6]/10 blur-[80px] pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Join the digital networking era.
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-lg mx-auto">
                No setup fees. Easily manage profiles, share custom links, and
                review analytics instantly.
              </p>
              <div className="flex items-center justify-center gap-4 pt-2">
                <Link href="/signup">
                  <button className="bg-[#3B82F6] hover:bg-[#b0874c] text-white font-bold text-xs px-6 py-3 rounded-lg shadow-md transition-all">
                    Create Your Card
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-xs px-6 py-3 rounded-lg backdrop-blur-sm transition-all">
                    Get Started Free
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

