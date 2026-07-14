'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCards } from '@/hooks/useCards.js';
import { useAnalytics } from '@/hooks/useAnalytics.js';
import { Button } from '@/components/ui/Button.jsx';
import {
  BarChart3,
  Layers,
  Eye,
  MousePointerClick,
  QrCode,
  Download,
  Smartphone,
  Globe,
} from 'lucide-react';

export default function AnalyticsDashboardPage() {
  const { cards, isLoading: loadingCards } = useCards();
  const [selectedCardId, setSelectedCardId] = useState('');

  const { analytics, isLoading: loadingAnalytics } = useAnalytics(selectedCardId);

  useEffect(() => {
    if (cards.length > 0 && !selectedCardId) {
      setSelectedCardId(cards[0]._id);
    }
  }, [cards, selectedCardId]);

  const stats = analytics.totals || { view: 0, click: 0, scan: 0, save: 0 };
  const devices = analytics.devices || {};
  const referrers = analytics.referrers || {};

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="border-b border-slate-900 pb-5">
        <h1 className="text-xl font-extrabold text-slate-100">Performance Analytics</h1>
        <p className="text-xs text-slate-400">Monitor views, scan events, and click rates over time.</p>
      </div>

      {loadingCards ? (
        <div className="h-20 bg-slate-900/30 rounded-2xl animate-pulse" />
      ) : cards.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/10 border border-slate-900 rounded-3xl space-y-4">
          <BarChart3 size={48} className="mx-auto text-slate-700" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-350">No analytics data</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">Create and publish a digital business card to begin gathering analytics.</p>
          </div>
          <Link href="/dashboard/cards" className="inline-block">
            <Button size="sm">Go to My Cards</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Card filter dropdown */}
          <div className="flex items-center space-x-3 bg-slate-900/30 border border-slate-900 p-4 rounded-xl">
            <Layers size={16} className="text-slate-500" />
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Select Digital Card:</span>
            <select
              value={selectedCardId}
              onChange={(e) => setSelectedCardId(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg text-xs p-2 text-slate-350 focus:outline-none"
            >
              {cards.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title} (/{c.slug})
                </option>
              ))}
            </select>
          </div>

          {/* Counts Grid */}
          {loadingAnalytics ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-slate-900/30 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <AnalyticsCard label="Page Views" count={stats.view} icon={<Eye size={18} className="text-blue-500" />} />
              <AnalyticsCard label="Link Clicks" count={stats.click} icon={<MousePointerClick size={18} className="text-indigo-500" />} />
              <AnalyticsCard label="QR Scans" count={stats.scan} icon={<QrCode size={18} className="text-purple-500" />} />
              <AnalyticsCard label="Contacts Saved" count={stats.save} icon={<Download size={18} className="text-pink-500" />} />
            </div>
          )}

          {/* Device & Referrer breakdowns */}
          <div className="grid md:grid-cols-2 gap-8 pt-4">
            {/* Devices */}
            <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-350 flex items-center space-x-1.5 border-b border-slate-900 pb-3">
                <Smartphone size={14} className="text-indigo-400" />
                <span>Device Types</span>
              </h3>
              {loadingAnalytics ? (
                <div className="space-y-2">
                  <div className="h-8 bg-slate-900/20 rounded animate-pulse" />
                  <div className="h-8 bg-slate-900/20 rounded animate-pulse" />
                </div>
              ) : Object.keys(devices).length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">No device logs available.</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(devices).map(([device, val]) => (
                    <div key={device} className="flex items-center justify-between text-xs">
                      <span className="capitalize text-slate-400 font-medium">{device || 'Unknown'}</span>
                      <span className="font-bold text-slate-100">{val} logs</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Referrers */}
            <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-350 flex items-center space-x-1.5 border-b border-slate-900 pb-3">
                <Globe size={14} className="text-indigo-400" />
                <span>Referrer Sources</span>
              </h3>
              {loadingAnalytics ? (
                <div className="space-y-2">
                  <div className="h-8 bg-slate-900/20 rounded animate-pulse" />
                  <div className="h-8 bg-slate-900/20 rounded animate-pulse" />
                </div>
              ) : Object.keys(referrers).length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">No referrer logs available.</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(referrers).map(([ref, val]) => (
                    <div key={ref} className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">{ref || 'Direct Visit'}</span>
                      <span className="font-bold text-slate-100">{val} views</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Small count card helper
const AnalyticsCard = ({ label, count, icon }) => {
  return (
    <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 space-y-3 hover:border-slate-850 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
        {icon}
      </div>
      <div className="text-2xl font-black text-slate-100">{count}</div>
    </div>
  );
};
