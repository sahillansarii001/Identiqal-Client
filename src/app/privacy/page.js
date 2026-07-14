'use client';

import React from 'react';
import { Navbar } from '@/components/marketing/Navbar.jsx';
import { Footer } from '@/components/marketing/Footer.jsx';
import { ShieldCheck, Calendar } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      <Navbar />
      
      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
            {/* Header */}
            <div className="border-b border-slate-100 pb-6 space-y-4">
              <div className="inline-flex items-center space-x-2 text-xs font-bold text-indigo-650 uppercase tracking-widest bg-indigo-50 border border-indigo-150 px-3 py-1 rounded-full">
                <ShieldCheck size={14} />
                <span>Security & Trust</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Privacy Policy
              </h1>
              <p className="text-xs text-slate-500 flex items-center space-x-1.5">
                <Calendar size={12} />
                <span>Last Updated: July 14, 2026</span>
              </p>
            </div>

            {/* Contents */}
            <div className="space-y-6 text-sm text-slate-650 leading-relaxed">
              <section className="space-y-3">
                <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
                <p>
                  We collect information you provide directly to us when creating your account, building digital business cards, and configuring inquiry lead forms. This includes:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                  <li>Account Details: Name, email address, password hash, and subscription level choice.</li>
                  <li>Card Profile Details: Public bio headlines, custom links list, uploaded logo URLs, and profile configurations.</li>
                  <li>Captured Visitor Inquiries: Full name, phone details, emails, and custom text inputs submitted by visitors directly into your cards.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-base font-bold text-slate-900">2. How We Use Information</h2>
                <p>
                  We process data specifically to provide the visual canvas editor, capture and log analytics scans, aggregate device metrics, and forward leads. We do not sell or monetize personal data logs to third-party brokers.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-base font-bold text-slate-900">3. Analytics & Device Logging</h2>
                <p>
                  When visitors access a published card, we log simple client metrics (browser referrers, device type logs, and timestamps) to aggregate overall dashboard analytics stats. No cross-site profiling trackers are embedded.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-base font-bold text-slate-900">4. Your Data Control</h2>
                <p>
                  You hold complete authority over your business cards and captured leads. Deleting a digital card removes all related dashboard logs, forms configuration, and database entries instantly.
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
