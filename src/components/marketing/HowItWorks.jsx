"use client";

import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Claim your URL",
    desc: "Sign up and reserve your unique identiqal.com/username link in seconds.",
  },
  {
    num: "02",
    title: "Design your card",
    desc: "Add your links, bio, and contact info using our intuitive drag-and-drop builder.",
  },
  {
    num: "03",
    title: "Share instantly",
    desc: "Share your QR code, NFC tag, or link with anyone, anywhere.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Get started in minutes
          </h2>
          <p className="text-lg text-slate-600">
            No coding required. Just pick a template and start sharing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden"
            >
              <div className="text-6xl font-black text-blue-100 absolute top-2 right-4 pointer-events-none">
                {step.num}
              </div>
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mb-6">
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
