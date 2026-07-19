"use client";

import React from "react";
import { Navbar } from "@/components/marketing/Navbar.jsx";
import { Footer } from "@/components/marketing/Footer.jsx";
import { FileText, Calendar } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
            {/* Header */}
            <div className="border-b border-slate-100 pb-6 space-y-4">
              <div className="inline-flex items-center space-x-2 text-xs font-bold text-indigo-650 uppercase tracking-widest bg-indigo-50 border border-indigo-150 px-3 py-1 rounded-full">
                <FileText size={14} />
                <span>Agreement Terms</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Terms of Service
              </h1>
              <p className="text-xs text-slate-500 flex items-center space-x-1.5">
                <Calendar size={12} />
                <span>Last Updated: July 14, 2026</span>
              </p>
            </div>

            {/* Contents */}
            <div className="space-y-6 text-sm text-slate-650 leading-relaxed">
              <section className="space-y-3">
                <h2 className="text-base font-bold text-slate-900">
                  1. Acceptance of Terms
                </h2>
                <p>
                  By creating an account, publishing content via Identiqal slug
                  links, or using dashboard team workspaces, you agree to comply
                  with and be bound by these Terms of Service.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-base font-bold text-slate-900">
                  2. Account Registration & Security
                </h2>
                <p>
                  You are responsible for safeguarding your credentials. You
                  agree not to distribute malicious scripts, spam links, or
                  phishing forms inside the component builder sections.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-base font-bold text-slate-900">
                  3. Subscriptions & Billing
                </h2>
                <p>
                  Some services require paid recurring subscriptions (Pro
                  Networker, Business Team). Upgrade fees are billed in advance
                  on a recurring monthly schedule. All refund eligibility and
                  cancellations can be managed directly under workspace billing
                  dashboards.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-base font-bold text-slate-900">
                  4. Content Ownership & Code Conduct
                </h2>
                <p>
                  Identiqal does not claim ownership over visitor inquiries or
                  branding portfolios compiled by you. You grant us host
                  licensing rights solely required to render and serve templates
                  on the web.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
