'use client';

import React from 'react';
import Link from 'next/link';
import { useCards } from '@/hooks/useCards.js';
import { useAuthStore } from '@/store/authStore.js';
import { Button } from '@/components/ui/Button.jsx';
import {
  Layers,
  Inbox,
  TrendingUp,
  ArrowUpRight,
  Plus,
  Compass,
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const { user } = useAuthStore();
  const { cards, isLoading } = useCards();

  const totalCards = cards.length;
  const publishedCardsCount = cards.filter(c => c.isPublished).length;

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl z-0" />
        <div className="relative z-10 space-y-1">
          <h2 className="text-xl font-extrabold text-slate-900">Welcome back, {user?.name}!</h2>
          <p className="text-xs text-slate-500">Manage your smart cards, captured leads, and brand themes here.</p>
        </div>
        <Link href="/dashboard/cards" className="relative z-10 shrink-0">
          <Button className="space-x-1.5 py-2.5">
            <Plus size={16} />
            <span>Create New Card</span>
          </Button>
        </Link>
      </div>

      {/* Overview Stats */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Cards</span>
            <Layers size={18} className="text-blue-600" />
          </div>
          {isLoading ? (
            <div className="h-8 w-16 bg-slate-100 rounded animate-pulse" />
          ) : (
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-slate-900">{totalCards}</span>
              <span className="text-xs text-slate-500">({publishedCardsCount} published)</span>
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Captured Leads</span>
            <Inbox size={18} className="text-indigo-650" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900">Leads Hub</span>
            <span className="text-xs text-slate-500">active capture</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Performance</span>
            <TrendingUp size={18} className="text-purple-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900">Analytics</span>
            <span className="text-xs text-slate-500">live reporting</span>
          </div>
        </div>
      </div>

      {/* Cards List section */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">Recent Digital Cards</h3>
          <Link href="/dashboard/cards" className="text-xs text-indigo-600 hover:text-indigo-750 font-semibold flex items-center space-x-1">
            <span>View All</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
          </div>
        ) : totalCards === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-300 rounded-2xl space-y-3">
            <Compass size={32} className="mx-auto text-slate-400" />
            <p className="text-xs text-slate-500">You haven't built any business cards yet.</p>
            <Link href="/dashboard/cards" className="inline-block">
              <Button size="sm">Create Your First Card</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {cards.slice(0, 3).map((card) => (
              <div
                key={card._id}
                className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between hover:border-slate-350 hover:shadow-sm transition-all"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{card.title}</h4>
                  <p className="text-[10px] text-slate-500">slug: /{card.slug}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`text-[9px] px-2 py-0.5 rounded-full border ${
                    card.isPublished 
                      ? 'bg-green-50 border-green-200 text-green-700 font-semibold' 
                      : 'bg-slate-100 border-slate-200 text-slate-500 font-semibold'
                  }`}>
                    {card.isPublished ? 'Published' : 'Draft'}
                  </span>
                  <Link href={`/dashboard/cards/${card._id}/edit`}>
                    <Button variant="secondary" size="sm">
                      Edit Card
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
