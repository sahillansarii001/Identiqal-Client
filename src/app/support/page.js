'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/marketing/Navbar.jsx';
import { Footer } from '@/components/marketing/Footer.jsx';
import { Button } from '@/components/ui/Button.jsx';
import { Input } from '@/components/ui/Input.jsx';
import { HelpCircle, Mail, MessageSquare, CheckCircle2 } from 'lucide-react';

export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      <Navbar />
      
      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Side: Contact Info */}
            <div className="md:col-span-5 space-y-6">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="space-y-2">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    Contact Support
                  </h1>
                  <p className="text-xs text-slate-650 leading-relaxed">
                    Have questions about customized layout sections, billing invoices, or seat allocations? Get in touch with our team.
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-start space-x-3 text-xs">
                    <Mail className="text-indigo-650 shrink-0 mt-0.5" size={16} />
                    <div>
                      <h4 className="font-bold text-slate-900">Email Support</h4>
                      <p className="text-slate-600 mt-0.5">support@identiqal.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 text-xs">
                    <MessageSquare className="text-indigo-650 shrink-0 mt-0.5" size={16} />
                    <div>
                      <h4 className="font-bold text-slate-900">Live Chat</h4>
                      <p className="text-slate-600 mt-0.5">Available Mon-Fri | 9am - 5pm EST</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Support Request Form */}
            <div className="md:col-span-7">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm h-full flex flex-col justify-center">
                {submitted ? (
                  <div className="text-center space-y-4 py-8">
                    <div className="w-12 h-12 bg-green-50 border border-green-200 text-green-700 rounded-full flex items-center justify-center mx-auto shadow-md shadow-green-100/10">
                      <CheckCircle2 size={24} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-slate-900">Message Received!</h3>
                      <p className="text-xs text-slate-600 max-w-xs mx-auto">
                        Thank you for reaching out. A support coordinator will respond to your registered email address within 24 hours.
                      </p>
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => setSubmitted(false)}>
                      Send Another Inquiry
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-550 flex items-center space-x-1.5 border-b border-slate-100 pb-3">
                      <HelpCircle size={16} className="text-indigo-655" />
                      <span>Submit a Support Request</span>
                    </h3>

                    <Input
                      label="Your Name"
                      placeholder="Jane Doe"
                      required
                    />
                    <Input
                      label="Email Address"
                      placeholder="jane@company.com"
                      type="email"
                      required
                    />
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">Inquiry Message</label>
                      <textarea
                        className="w-full px-4 py-2.5 bg-white border border-slate-250 focus:ring-2 focus:ring-indigo-500 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none"
                        rows={4}
                        placeholder="Please describe how we can assist you..."
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full py-3" isLoading={loading}>
                      Send Message
                    </Button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
