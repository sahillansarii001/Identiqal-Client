'use client';

import React, { useState } from 'react';
import { User, Link as LinkIcon, Quote, FileText, Check } from 'lucide-react';

export const SectionShowcase = () => {
  const [activeTab, setActiveTab] = useState('about');

  const tabs = [
    { id: 'about', label: 'About Block', icon: <User size={16} /> },
    { id: 'links', label: 'Social & Web Links', icon: <LinkIcon size={16} /> },
    { id: 'testimonials', label: 'Testimonials', icon: <Quote size={16} /> },
    { id: 'form', label: 'Inquiry Form', icon: <FileText size={16} /> },
  ];

  return (
    <section id="showcase" className="py-20 bg-white border-t border-slate-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Text and tabs */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              Create a card that fits your workflow.
            </h2>
            <p className="text-slate-600">
              Pick from a rich registry of components. Rearrange them instantly, toggle visibility, and configure details directly inside the dashboard builder canvas.
            </p>

            {/* Selector list */}
            <div className="flex flex-col space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl border text-left text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-slate-100 border-indigo-500/50 text-indigo-750 shadow-sm'
                      : 'bg-transparent border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className={activeTab === tab.id ? 'text-indigo-650' : 'text-slate-500'}>
                    {tab.icon}
                  </span>
                  <span className="flex-1">{tab.label}</span>
                  {activeTab === tab.id && <Check size={14} className="text-indigo-650 animate-fade-in" />}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive display canvas */}
          <div className="lg:col-span-7 bg-zinc-50 border border-slate-200 rounded-3xl p-6 backdrop-blur-sm min-h-[360px] flex items-center justify-center">
            {activeTab === 'about' && (
              <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4 animate-fade-in">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-blue-600 text-xl shadow-lg">
                    JD
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">John Doe</h3>
                    <p className="text-xs text-slate-650">VP of Technology, Innovate Ltd</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-150 pt-3">
                  Helping tech teams scale infrastructure, optimize operations, and design premium consumer experiences. Love digital networking!
                </p>
              </div>
            )}

            {activeTab === 'links' && (
              <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-3 animate-fade-in">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Connect online</h4>
                <div className="flex items-center space-x-3 p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                  <span className="text-blue-500">🔗</span>
                  <span className="text-xs text-slate-800 font-bold">Official Company Website</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                  <span className="text-indigo-600">🐙</span>
                  <span className="text-xs text-slate-800 font-bold">GitHub Code Portfolio</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                  <span className="text-blue-600">💼</span>
                  <span className="text-xs text-slate-800 font-bold">Professional LinkedIn Profile</span>
                </div>
              </div>
            )}

            {activeTab === 'testimonials' && (
              <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4 animate-fade-in">
                <div className="text-indigo-600 text-2xl font-bold">“</div>
                <p className="text-xs text-slate-700 italic -mt-2 leading-relaxed">
                  John Doe was instrumental in helping us re-architect our cloud servers. His digital business card made sharing his contacts and schedule easy!
                </p>
                <div className="flex items-center space-x-3 border-t border-slate-150 pt-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs">
                    SC
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Sarah Connor</h5>
                    <p className="text-[10px] text-slate-500">CEO, Skynet Industries</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'form' && (
              <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-3 animate-fade-in">
                <h4 className="text-xs font-bold text-slate-850 mb-1">Inquire / Book Consultation</h4>
                <div className="space-y-2">
                  <div className="h-8 bg-slate-50 border border-slate-200 rounded-lg px-2.5 flex items-center text-[10px] text-slate-400">
                    Full Name
                  </div>
                  <div className="h-8 bg-slate-50 border border-slate-200 rounded-lg px-2.5 flex items-center text-[10px] text-slate-400">
                    Email Address
                  </div>
                  <div className="h-16 bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-start text-[10px] text-slate-400">
                    Your inquiry details...
                  </div>
                  <div className="h-8 bg-indigo-650 rounded-lg flex items-center justify-center text-xs text-white font-semibold shadow-md shadow-indigo-600/10">
                    Submit Message
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
