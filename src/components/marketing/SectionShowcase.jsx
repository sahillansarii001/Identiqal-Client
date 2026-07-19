"use client";

import React from "react";
import { motion } from "framer-motion";
import { Smartphone, LayoutTemplate, Share2, BarChart3 } from "lucide-react";

export const SectionShowcase = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Everything you need to network <span className="text-blue-600">smarter</span>.
          </h2>
          <p className="text-lg text-slate-600">
            A beautiful, intuitive toolkit designed to help you make lasting connections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="lg:col-span-2 bg-slate-50 border border-slate-200 rounded-3xl p-8 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <LayoutTemplate className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Beautiful Templates</h3>
              <p className="text-slate-600 max-w-sm">
                Choose from dozens of professionally designed templates that look perfect on any device.
              </p>
            </div>
            <div className="mt-8 h-48 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center justify-center">
              <span className="text-slate-400 font-medium">Template Gallery Mockup</span>
            </div>
          </motion.div>

          {/* Feature 2 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-blue-50 border border-blue-100 rounded-3xl p-8 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 bg-white border border-blue-200 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <Smartphone className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Mobile First</h3>
              <p className="text-blue-800/70">
                Your card is instantly formatted as an app-like experience for anyone who opens it on their phone.
              </p>
            </div>
            <div className="mt-8 flex justify-center">
              <div className="w-32 h-48 bg-white rounded-t-3xl border-t-4 border-x-4 border-slate-900 shadow-xl" />
            </div>
          </motion.div>

          {/* Feature 3 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-slate-900 text-white rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <BarChart3 size={120} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-6 border border-slate-700">
                <BarChart3 className="text-blue-400" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Deep Analytics</h3>
              <p className="text-slate-400">
                Track views, link clicks, and lead generation rates in real-time. Know exactly who is engaging with your profile.
              </p>
            </div>
          </motion.div>

          {/* Feature 4 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="lg:col-span-2 bg-slate-50 border border-slate-200 rounded-3xl p-8 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <Share2 className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Instant Sharing</h3>
              <p className="text-slate-600 max-w-sm">
                Share via QR code, NFC tap, or custom URL. The recipient doesn't need an app to view and save your details.
              </p>
            </div>
            <div className="mt-8 flex space-x-4 items-center">
               <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center justify-center font-bold text-slate-300">QR</div>
               <div className="h-2 w-12 bg-slate-200 rounded-full" />
               <div className="w-16 h-16 bg-blue-600 rounded-2xl shadow-sm flex items-center justify-center text-white font-bold">NFC</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
