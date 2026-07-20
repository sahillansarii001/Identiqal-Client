'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import { Users, Layers, Sparkles, Inbox, TrendingUp, CreditCard } from 'lucide-react';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { motion } from 'framer-motion';

export default function AdminDashboardOverview() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, analyticsRes] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getAdvancedAnalytics()
        ]);
        if (statsRes.success) setStats(statsRes.data);
        if (analyticsRes.success) setAnalytics(analyticsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <SkeletonLoader key={i} type="card" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SkeletonLoader type="card" />
          <SkeletonLoader type="card" />
        </div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: <Users size={16} />, trend: '+12%', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { title: 'Organizations', value: stats?.totalOrganizations || 0, icon: <Layers size={16} />, trend: '+5%', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { title: 'Digital Cards', value: stats?.totalCards || 0, icon: <CreditCard size={16} />, trend: '+28%', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
    { title: 'Total Leads', value: stats?.totalLeads || 0, icon: <Inbox size={16} />, trend: '+14%', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Platform Overview</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Real-time metrics and system health.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            key={i} 
            className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl p-5 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div className={`p-2 rounded-lg ${card.bg} ${card.color}`}>
                {card.icon}
              </div>
              <span className="flex items-center text-xs font-semibold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md">
                <TrendingUp size={12} className="mr-1" />
                {card.trend}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">{card.title}</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{card.value.toLocaleString()}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Simple Bar Chart for User Growth */}
        <div className="bg-white dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex justify-between items-center mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">User Growth</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Last 30 Days</p>
            </div>
          </div>
          
          <div className="h-56 relative">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between border-t border-b border-slate-100 dark:border-slate-800/50 py-1 pointer-events-none z-0">
              <div className="w-full border-b border-slate-100 dark:border-slate-800/50 border-dashed" />
              <div className="w-full border-b border-slate-100 dark:border-slate-800/50 border-dashed" />
              <div className="w-full border-b border-slate-100 dark:border-slate-800/50 border-dashed" />
            </div>

            <div className="h-full flex items-end justify-around gap-2 sm:gap-4 relative z-10 px-2 sm:px-6">
              {analytics?.usersGrowth?.length > 0 ? (
                analytics.usersGrowth.map((day, i) => {
                  const max = Math.max(...analytics.usersGrowth.map(d => d.count), 1);
                  const height = `${(day.count / max) * 100}%`;
                  return (
                    <div key={i} className="relative w-full max-w-[48px] group flex flex-col justify-end h-full">
                      {/* Background Track */}
                      <div className="absolute inset-0 bg-slate-50 dark:bg-slate-800/30 rounded-t-lg -z-10" />
                      
                      {/* Bar Fill */}
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height }}
                        transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                        className="w-full bg-gradient-to-t from-blue-600 to-sky-400 dark:from-blue-700 dark:to-sky-400 rounded-t-lg transition-all duration-300 group-hover:opacity-80 relative overflow-hidden"
                      >
                        <div className="absolute top-0 inset-x-0 h-1 bg-white/30" />
                      </motion.div>
                      
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-slate-900 text-white text-[10px] font-bold py-1.5 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all scale-95 group-hover:scale-100 shadow-lg whitespace-nowrap z-20">
                        {day.count} users<br/>
                        <span className="text-slate-400 font-normal">{day._id}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-slate-400">Not enough data</div>
              )}
            </div>
          </div>
        </div>

        {/* Simple Bar Chart for Card Growth */}
        <div className="bg-white dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex justify-between items-center mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Cards Published</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Last 30 Days</p>
            </div>
          </div>
          
          <div className="h-56 relative">
             {/* Background Grid Lines */}
             <div className="absolute inset-0 flex flex-col justify-between border-t border-b border-slate-100 dark:border-slate-800/50 py-1 pointer-events-none z-0">
              <div className="w-full border-b border-slate-100 dark:border-slate-800/50 border-dashed" />
              <div className="w-full border-b border-slate-100 dark:border-slate-800/50 border-dashed" />
              <div className="w-full border-b border-slate-100 dark:border-slate-800/50 border-dashed" />
            </div>

            <div className="h-full flex items-end justify-around gap-2 sm:gap-4 relative z-10 px-2 sm:px-6">
              {analytics?.cardsGrowth?.length > 0 ? (
                analytics.cardsGrowth.map((day, i) => {
                  const max = Math.max(...analytics.cardsGrowth.map(d => d.count), 1);
                  const height = `${(day.count / max) * 100}%`;
                  return (
                    <div key={i} className="relative w-full max-w-[48px] group flex flex-col justify-end h-full">
                      {/* Background Track */}
                      <div className="absolute inset-0 bg-slate-50 dark:bg-slate-800/30 rounded-t-lg -z-10" />
                      
                      {/* Bar Fill */}
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height }}
                        transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                        className="w-full bg-gradient-to-t from-indigo-600 to-purple-400 dark:from-indigo-700 dark:to-purple-500 rounded-t-lg transition-all duration-300 group-hover:opacity-80 relative overflow-hidden"
                      >
                        <div className="absolute top-0 inset-x-0 h-1 bg-white/30" />
                      </motion.div>
                      
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-slate-900 text-white text-[10px] font-bold py-1.5 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all scale-95 group-hover:scale-100 shadow-lg whitespace-nowrap z-20">
                        {day.count} cards<br/>
                        <span className="text-slate-400 font-normal">{day._id}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-slate-400">Not enough data</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
