"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCards } from "@/hooks/useCards.js";
import { useAnalytics } from "@/hooks/useAnalytics.js";
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
} from "lucide-react";

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

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#3B82F6]">
            Insights
          </span>
          <h1 className="text-2xl font-black text-inherit mt-1">
            Performance Analytics
          </h1>
          <p className="text-xs text-[#8A7A6A] mt-1">
            Monitor views, scan events, and click rates across your cards.
          </p>
        </div>
      </div>

      {loadingCards ? (
        <div className="h-20 bg-[#F5EFE9] rounded-2xl animate-pulse" />
      ) : cards.length === 0 ? (
        <div className="text-center py-24 bg-white border border-[#E2E8F0] rounded-3xl space-y-5 shadow-sm shadow-[#2563EB]/3">
          <div className="w-16 h-16 bg-[#2563EB]/5 rounded-2xl flex items-center justify-center mx-auto">
            <BarChart3 size={28} className="text-[#2563EB]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-inherit">
              No analytics data yet
            </h3>
            <p className="text-xs text-[#8A7A6A] max-w-xs mx-auto">
              Create and publish a digital business card to begin gathering
              analytics.
            </p>
          </div>
          <Link href="/dashboard/cards" className="inline-block">
            <span className="inline-flex items-center bg-[#2563EB] hover:bg-[#6A3B4B] text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer">
              Go to My Cards
            </span>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Card filter */}
          <div className="flex items-center space-x-3 bg-white border border-[#E2E8F0] p-4 rounded-2xl shadow-sm shadow-[#2563EB]/3">
            <div className="w-8 h-8 rounded-xl bg-[#2563EB]/5 flex items-center justify-center">
              <Layers size={15} className="text-[#2563EB]" />
            </div>
            <span className="text-[10px] text-[#8A7A6A] font-black uppercase tracking-widest">
              Active Card:
            </span>
            <select
              value={selectedCardId}
              onChange={(e) => setSelectedCardId(e.target.value)}
              className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs p-2 text-inherit focus:outline-none focus:border-[#2563EB]/40 transition-colors font-semibold flex-1"
            >
              {cards.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title} (/{c.slug})
                </option>
              ))}
            </select>
          </div>

          {/* Stats Grid */}
          {loadingAnalytics ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-28 bg-[#F5EFE9] rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                label="Page Views"
                count={stats.view}
                icon={<Eye size={18} className="text-[#2563EB]" />}
                accent="#2563EB"
              />
              <StatCard
                label="Link Clicks"
                count={stats.click}
                icon={
                  <MousePointerClick size={18} className="text-[#3B82F6]" />
                }
                accent="#3B82F6"
              />
              <StatCard
                label="QR Scans"
                count={stats.scan}
                icon={<QrCode size={18} className="text-[#2563EB]" />}
                accent="#2563EB"
              />
              <StatCard
                label="Contacts Saved"
                count={stats.save}
                icon={<Download size={18} className="text-[#3B82F6]" />}
                accent="#3B82F6"
              />
            </div>
          )}

          {/* Device & Referrer */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Devices */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-4 shadow-sm shadow-[#2563EB]/3">
              <div className="flex items-center space-x-2 border-b border-[#F0E8E0] pb-3">
                <div className="w-7 h-7 rounded-lg bg-[#2563EB]/5 flex items-center justify-center">
                  <Smartphone size={13} className="text-[#2563EB]" />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#8A7A6A]">
                  Device Types
                </h3>
              </div>
              {loadingAnalytics ? (
                <div className="space-y-2">
                  <div className="h-8 bg-[#F5EFE9] rounded-xl animate-pulse" />
                  <div className="h-8 bg-[#F5EFE9] rounded-xl animate-pulse" />
                </div>
              ) : Object.keys(devices).length === 0 ? (
                <p className="text-xs text-[#8A7A6A] text-center py-6">
                  No device logs available.
                </p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(devices).map(([device, val]) => (
                    <div
                      key={device}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="capitalize text-inherit font-semibold">
                        {device || "Unknown"}
                      </span>
                      <span className="font-black text-[#2563EB] bg-[#2563EB]/5 px-2.5 py-0.5 rounded-full">
                        {val} logs
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Referrers */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-4 shadow-sm shadow-[#2563EB]/3">
              <div className="flex items-center space-x-2 border-b border-[#F0E8E0] pb-3">
                <div className="w-7 h-7 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center">
                  <Globe size={13} className="text-[#3B82F6]" />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#8A7A6A]">
                  Referrer Sources
                </h3>
              </div>
              {loadingAnalytics ? (
                <div className="space-y-2">
                  <div className="h-8 bg-[#F5EFE9] rounded-xl animate-pulse" />
                  <div className="h-8 bg-[#F5EFE9] rounded-xl animate-pulse" />
                </div>
              ) : Object.keys(referrers).length === 0 ? (
                <p className="text-xs text-[#8A7A6A] text-center py-6">
                  No referrer logs available.
                </p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(referrers).map(([ref, val]) => (
                    <div
                      key={ref}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-inherit font-semibold">
                        {ref || "Direct Visit"}
                      </span>
                      <span className="font-black text-[#3B82F6] bg-[#3B82F6]/10 px-2.5 py-0.5 rounded-full">
                        {val} views
                      </span>
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

const StatCard = ({ label, count, icon, accent }) => (
  <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 space-y-3 hover:shadow-md hover:shadow-[#2563EB]/5 hover:border-[#2563EB]/20 transition-all duration-300 group">
    <div className="flex items-center justify-between">
      <span className="text-[9px] font-black text-[#8A7A6A] uppercase tracking-widest">
        {label}
      </span>
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
        style={{ backgroundColor: `${accent}10` }}
      >
        {icon}
      </div>
    </div>
    <div className="text-3xl font-black text-inherit">{count}</div>
    <div className="flex items-center space-x-1 text-[9px] font-bold text-green-600">
      <TrendingUp size={10} />
      <span>Live tracking</span>
    </div>
  </div>
);

