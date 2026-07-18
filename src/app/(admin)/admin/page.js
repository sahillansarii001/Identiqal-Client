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
        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">User Growth (Last 30 Days)</h3>
          </div>
          <div className="h-48 flex items-end justify-between gap-1">
            {analytics?.usersGrowth?.length > 0 ? (
              analytics.usersGrowth.map((day, i) => {
                const max = Math.max(...analytics.usersGrowth.map(d => d.count), 1);
                const height = `${(day.count / max) * 100}%`;
                return (
                  <div key={i} className="relative w-full group flex flex-col justify-end h-full">
                    <div 
                      className="w-full bg-[#5A3045] dark:bg-[#D4A45B] rounded-t-sm transition-all duration-300 group-hover:opacity-80" 
                      style={{ height }}
                    />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 transition-opacity">
                      {day.count} users<br/>{day._id}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">Not enough data</div>
            )}
          </div>
        </div>

        {/* Simple Bar Chart for Card Growth */}
        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Cards Published (Last 30 Days)</h3>
          </div>
          <div className="h-48 flex items-end justify-between gap-1">
            {analytics?.cardsGrowth?.length > 0 ? (
              analytics.cardsGrowth.map((day, i) => {
                const max = Math.max(...analytics.cardsGrowth.map(d => d.count), 1);
                const height = `${(day.count / max) * 100}%`;
                return (
                  <div key={i} className="relative w-full group flex flex-col justify-end h-full">
                    <div 
                      className="w-full bg-[#7A4055] dark:bg-[#E5B56C] rounded-t-sm transition-all duration-300 group-hover:opacity-80" 
                      style={{ height }}
                    />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 transition-opacity">
                      {day.count} cards<br/>{day._id}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">Not enough data</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
