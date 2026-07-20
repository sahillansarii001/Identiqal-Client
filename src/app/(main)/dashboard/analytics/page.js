"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCards } from "@/hooks/useCards.js";
import { useAnalytics } from "@/hooks/useAnalytics.js";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Layers,
  Eye,
  MousePointerClick,
  QrCode,
  Download,
  Smartphone,
  Globe,
  TrendingUp,
  ChevronDown,
  Monitor,
  Tablet,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/Button.jsx";

// Premium CountUp counter component
const CountUp = ({ value, duration = 1.2 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10);
    if (isNaN(end) || end === 0) {
      setCount(value);
      return;
    }
    const totalMiliseconds = duration * 1000;
    const incrementTime = 30;
    const steps = Math.ceil(totalMiliseconds / incrementTime);
    const stepValue = end / steps;
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      start = Math.floor(stepValue * currentStep);
      if (currentStep >= steps) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);
    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
};

// Mini SVG Sparkline curve graph
const Sparkline = ({ stroke = "#2563EB" }) => (
  <svg className="w-16 h-8 overflow-visible opacity-80" viewBox="0 0 50 20">
    <path
      d="M0,15 Q10,2 18,12 T35,5 T50,15"
      fill="none"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default function AnalyticsDashboardPage() {
  const { cards, isLoading: loadingCards } = useCards();
  const [selectedCardId, setSelectedCardId] = useState("");

  const { analytics, isLoading: loadingAnalytics } =
    useAnalytics(selectedCardId);

  useEffect(() => {
    if (cards.length > 0 && !selectedCardId) {
      setSelectedCardId(cards[0]._id);
    }
  }, [cards, selectedCardId]);

  const stats = analytics.totals || { view: 0, click: 0, scan: 0, save: 0 };
  const devices = analytics.devices || {};
  const referrers = analytics.referrers || {};

  // Device calculations for progress bars
  const totalDevices = Object.values(devices).reduce((a, b) => a + b, 0) || 1;
  const getDeviceIcon = (dev) => {
    const l = dev.toLowerCase();
    if (l.includes('mobile')) return <Smartphone size={14} />;
    if (l.includes('tablet')) return <Tablet size={14} />;
    return <Monitor size={14} />;
  };
  const getDeviceColor = (dev) => {
    const l = dev.toLowerCase();
    if (l.includes('mobile')) return "bg-blue-500";
    if (l.includes('tablet')) return "bg-indigo-500";
    return "bg-slate-700 dark:bg-slate-300";
  };

  // Referrer calculation
  const totalReferrals = Object.values(referrers).reduce((a, b) => a + b, 0) || 1;
  const sortedReferrers = Object.entries(referrers).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-8 w-full pb-12">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-[10px] font-black text-blue-600 dark:text-blue-400 tracking-wider uppercase border border-blue-100 dark:border-blue-500/20 mb-3">
            <BarChart3 size={10} />
            <span>Live Data Hub</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Performance Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Monitor real-time interactions, scan events, and traffic sources across your cards.
          </p>
        </div>
      </div>

      {loadingCards ? (
        <div className="h-20 bg-slate-100 dark:bg-slate-800/50 rounded-2xl animate-pulse" />
      ) : cards.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-[24px] space-y-5 shadow-sm shadow-blue-900/5">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto ring-4 ring-white dark:ring-[#0f172a] shadow-sm">
            <AlertCircle size={28} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No Data Available
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              Create and publish a digital business card to begin gathering detailed analytics.
            </p>
          </div>
          <Link href="/dashboard/cards" className="inline-block mt-2">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-6 py-3 shadow-md shadow-blue-600/20">
              Create My First Card
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Card Filter - Sleek pill design */}
          <div className="inline-flex items-center space-x-3 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-2 pr-4 rounded-full shadow-sm">
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
              <Layers size={14} className="text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest shrink-0">
              Analyzing:
            </span>
            <div className="relative">
              <select
                value={selectedCardId}
                onChange={(e) => setSelectedCardId(e.target.value)}
                className="appearance-none bg-transparent border-none text-sm font-bold text-slate-900 dark:text-white focus:ring-0 pr-6 py-1 cursor-pointer outline-none"
              >
                {cards.map((c) => (
                  <option key={c._id} value={c._id} className="text-slate-900">
                    {c.title} (/{c.slug})
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Stats Grid */}
          {loadingAnalytics ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-36 bg-slate-100 dark:bg-slate-800/50 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total Views" count={stats.view} icon={<Eye size={18} />} accent="blue" />
              <StatCard label="Link Clicks" count={stats.click} icon={<MousePointerClick size={18} />} accent="indigo" />
              <StatCard label="QR Scans" count={stats.scan} icon={<QrCode size={18} />} accent="sky" />
              <StatCard label="Contacts Saved" count={stats.save} icon={<Download size={18} />} accent="emerald" />
            </div>
          )}

          {/* Detailed Reports */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Devices Report */}
            <div className="bg-white dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-[24px] p-6 sm:p-8 space-y-6 shadow-xs relative overflow-hidden group">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                    <Smartphone size={18} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Device Breakdown</h3>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">Where your traffic comes from</p>
                  </div>
                </div>
              </div>
              
              {loadingAnalytics ? (
                <div className="space-y-4">
                  <div className="h-10 bg-slate-100 dark:bg-slate-800/50 rounded-xl animate-pulse" />
                  <div className="h-10 bg-slate-100 dark:bg-slate-800/50 rounded-xl animate-pulse" />
                </div>
              ) : Object.keys(devices).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-slate-400 space-y-2">
                  <Monitor size={24} className="opacity-50" />
                  <p className="text-xs font-medium">No device logs available.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {Object.entries(devices).map(([device, val]) => {
                    const pct = Math.round((val / totalDevices) * 100);
                    return (
                      <div key={device} className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 font-semibold capitalize">
                            {getDeviceIcon(device)}
                            <span>{device || "Unknown"}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-900 dark:text-white">{val}</span>
                            <span className="text-slate-400 font-medium w-8 text-right">{pct}%</span>
                          </div>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full rounded-full ${getDeviceColor(device)}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Referrers Report */}
            <div className="bg-white dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-[24px] p-6 sm:p-8 space-y-6 shadow-xs relative overflow-hidden group">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                    <Globe size={18} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Top Referrers</h3>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">Websites sending traffic to your card</p>
                  </div>
                </div>
              </div>
              
              {loadingAnalytics ? (
                <div className="space-y-4">
                  <div className="h-12 bg-slate-100 dark:bg-slate-800/50 rounded-xl animate-pulse" />
                  <div className="h-12 bg-slate-100 dark:bg-slate-800/50 rounded-xl animate-pulse" />
                </div>
              ) : sortedReferrers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-slate-400 space-y-2">
                  <Globe size={24} className="opacity-50" />
                  <p className="text-xs font-medium">No referrer logs available.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sortedReferrers.map(([ref, val], idx) => {
                    const pct = Math.round((val / totalReferrals) * 100);
                    const domain = ref || "Direct Visit / Social App";
                    return (
                      <div key={ref} className="relative p-3 rounded-xl border border-slate-100 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-800/20 overflow-hidden group/item hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-colors">
                        {/* Background Progress Fill */}
                        <div 
                          className="absolute inset-y-0 left-0 bg-indigo-50 dark:bg-indigo-500/5 opacity-50 z-0 transition-all duration-1000 ease-out"
                          style={{ width: `${pct}%` }}
                        />
                        <div className="relative z-10 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 rounded bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-[10px] font-black text-slate-400">
                              {idx + 1}
                            </div>
                            <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[150px] sm:max-w-[200px]">
                              {domain}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-black text-indigo-600 dark:text-indigo-400">{val}</div>
                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Visits</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Glow-accented Stat Card
const StatCard = ({ label, count, icon, accent }) => {
  const colorMap = {
    blue: { bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', line: '#3B82F6', hover: 'hover:border-blue-500/30' },
    indigo: { bg: 'bg-indigo-50 dark:bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400', line: '#6366F1', hover: 'hover:border-indigo-500/30' },
    sky: { bg: 'bg-sky-50 dark:bg-sky-500/10', text: 'text-sky-600 dark:text-sky-400', line: '#0EA5E9', hover: 'hover:border-sky-500/30' },
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', line: '#10B981', hover: 'hover:border-emerald-500/30' },
  };
  const theme = colorMap[accent] || colorMap.blue;

  return (
    <div className={`bg-white dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 relative overflow-hidden group hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ${theme.hover}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest relative z-10">
          {label}
        </span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 relative z-10 ${theme.bg} ${theme.text}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between relative z-10">
        <div className="space-y-1">
          <div className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">
            <CountUp value={count} />
          </div>
          <div className="flex items-center space-x-1 text-[10px] font-bold text-emerald-500">
            <CheckCircle2 size={12} />
            <span>Active Sync</span>
          </div>
        </div>
        <div className="opacity-50 group-hover:opacity-100 transition-opacity pb-2">
          <Sparkline stroke={theme.line} />
        </div>
      </div>
      
      {/* Decorative Glow */}
      <div className={`absolute -bottom-6 -right-6 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity pointer-events-none ${theme.bg}`} />
    </div>
  );
};