'use client';

import React from 'react';
import { BarChart3 } from 'lucide-react';

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Detailed platform usage analytics. (Advanced charts powered by real data coming soon.)</p>
      </div>
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl p-16 text-center shadow-sm">
        <BarChart3 size={40} className="mx-auto mb-4 text-gray-300" />
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Analytics Dashboard</h3>
        <p className="text-xs text-gray-500 mt-2 max-w-sm mx-auto">The platform overview on the Dashboard page already includes 30-day User &amp; Card growth charts. Extended analytics with funnel reports, retention, and session data will be added here.</p>
      </div>
    </div>
  );
}
