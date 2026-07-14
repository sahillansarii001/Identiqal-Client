import React from 'react';
import { XCircle, CheckCircle2, RotateCcw, AlertTriangle } from 'lucide-react';

export const ProblemFraming = () => {
  return (
    <section className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            Why traditional networking tools fail you
          </h2>
          <p className="text-slate-600">
            Paper business cards are outdated the moment they are printed, and generic link-in-bio tools are too static to represent a professional corporate presence.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Paper Cards */}
          <div className="bg-zinc-50 border border-slate-200 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-4 right-4 text-red-500/10">
              <XCircle size={64} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <XCircle className="text-red-500 shrink-0" size={20} />
              <span>Paper Cards</span>
            </h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                Cannot be updated instantly when roles or details change.
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                High printing costs and heavy environmental waste.
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                Zero analytics on who actually views or saves them.
              </li>
            </ul>
          </div>

          {/* Generic Link-In-Bios */}
          <div className="bg-zinc-50 border border-slate-200 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-4 right-4 text-amber-500/10">
              <AlertTriangle size={64} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <AlertTriangle className="text-amber-500 shrink-0" size={20} />
              <span>Generic Link-In-Bios</span>
            </h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                Rigid templates that lack flexible section layouts.
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                No integrated lead-capture or custom forms.
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                Lack of workspace organization locking controls.
              </li>
            </ul>
          </div>

          {/* Identiqal */}
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 relative overflow-hidden shadow-lg shadow-indigo-100/10">
            <div className="absolute top-4 right-4 text-indigo-500/10">
              <CheckCircle2 size={64} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <CheckCircle2 className="text-indigo-650 shrink-0" size={20} />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Identiqal Cards</span>
            </h3>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">✓</span>
                Fully configurable, reorderable visual block sections.
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">✓</span>
                One-click contacts save, QR code codes, and form leads.
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">✓</span>
                Interactive dashboard stats and team workspaces.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
