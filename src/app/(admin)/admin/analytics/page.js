'use client';

import React from 'react';
import { 
  BarChart3, 
  Server, 
  Database, 
  Activity, 
  Globe, 
  Users, 
  ArrowUpRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-[10px] font-black text-indigo-600 dark:text-indigo-400 tracking-wider uppercase border border-indigo-100 dark:border-indigo-500/20 mb-3">
          <Activity size={10} />
          <span>Global Operations</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">System Analytics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">Global platform usage, system health, and infrastructure metrics.</p>
      </div>

      {/* System Health Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <HealthCard 
          title="Global Uptime" 
          value="99.99%" 
          status="Healthy" 
          icon={<Server size={18} />} 
          color="emerald" 
        />
        <HealthCard 
          title="API Latency" 
          value="42ms" 
          status="Optimal" 
          icon={<Zap size={18} />} 
          color="blue" 
        />
        <HealthCard 
          title="Database Load" 
          value="24%" 
          status="Stable" 
          icon={<Database size={18} />} 
          color="indigo" 
        />
        <HealthCard 
          title="Active Sessions" 
          value="1,492" 
          status="+12% vs last hr" 
          icon={<Users size={18} />} 
          color="sky" 
        />
      </div>

      {/* Mock Traffic Chart */}
      <div className="bg-white dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-[24px] p-6 sm:p-8 shadow-xs mt-8">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6 mb-8">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Platform Traffic (Last 7 Days)</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Aggregated global requests across all active organizations.</p>
          </div>
          <div className="hidden sm:flex items-center space-x-2 text-xs font-bold text-slate-500 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <Globe size={14} className="text-indigo-500" />
            <span>US-East (Primary)</span>
          </div>
        </div>

        {/* Mock Chart Area */}
        <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 px-2">
          {[40, 65, 45, 80, 55, 90, 75].map((val, i) => (
            <div key={i} className="relative w-full group flex flex-col justify-end h-full">
              {/* Background Track */}
              <div className="absolute inset-0 bg-slate-50 dark:bg-slate-800/30 rounded-t-lg -z-10" />
              
              {/* Bar Fill */}
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${val}%` }}
                transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                className="w-full bg-gradient-to-t from-blue-600 to-indigo-400 dark:from-blue-700 dark:to-indigo-500 rounded-t-lg transition-all duration-300 group-hover:opacity-80 relative overflow-hidden"
              >
                {/* Highlight line on top of bar */}
                <div className="absolute top-0 inset-x-0 h-1 bg-white/30" />
              </motion.div>
              
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-slate-900 text-white text-[10px] font-bold py-1.5 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all scale-95 group-hover:scale-100 shadow-lg">
                {val * 10}k reqs
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-4 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>
      
      {/* Disclaimer */}
      <div className="flex items-center space-x-2 justify-center mt-12 text-[11px] text-slate-400 font-medium bg-slate-50 dark:bg-slate-800/20 py-3 rounded-xl border border-slate-100 dark:border-slate-800 border-dashed">
        <ShieldCheck size={14} className="text-emerald-500" />
        <span>Extended metrics (funnels, retention) are currently aggregating data and will be visible shortly.</span>
      </div>
    </div>
  );
}

const HealthCard = ({ title, value, status, icon, color }) => {
  const colors = {
    emerald: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    blue: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
    indigo: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    sky: 'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400',
  };
  
  return (
    <div className="bg-white dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-[20px] p-5 shadow-xs hover:shadow-md transition-all duration-300">
      <div className="flex items-center space-x-3 mb-4">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors[color]}`}>
          {icon}
        </div>
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</span>
      </div>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{value}</div>
        <div className="text-[10px] font-bold text-slate-400 flex items-center">
          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse bg-emerald-500`} />
          {status}
        </div>
      </div>
    </div>
  );
};