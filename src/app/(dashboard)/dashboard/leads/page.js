'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCards } from '@/hooks/useCards.js';
import { useLeads } from '@/hooks/useLeads.js';
import { useAuthStore } from '@/store/authStore.js';
import { Button } from '@/components/ui/Button.jsx';
import { Modal } from '@/components/ui/Modal.jsx';
import {
  Inbox,
  Download,
  AlertTriangle,
  Calendar,
  Layers,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

export default function LeadsDashboardPage() {
  const { user } = useAuthStore();
  const { cards, isLoading: loadingCards } = useCards();
  const [selectedCardId, setSelectedCardId] = useState('');
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  // Hook to fetch leads for active card
  const { leads, isLoading: loadingLeads, refetch } = useLeads(selectedCardId);

  // Set default selected card
  useEffect(() => {
    if (cards.length > 0 && !selectedCardId) {
      setSelectedCardId(cards[0]._id);
    }
  }, [cards, selectedCardId]);

  const handleDownloadCsv = () => {
    // Gate CSV download by subscriptionTier (Pro/Business only)
    if (user?.subscriptionTier === 'free') {
      setUpgradeModalOpen(true);
      return;
    }

    if (leads.length === 0) {
      alert('No leads to download');
      return;
    }

    // Generate CSV
    const headers = ['Name', 'Email', 'Phone', 'Message', 'Source', 'Date'];
    const rows = leads.map((l) => [
      l.name,
      l.email,
      l.phone || '',
      l.message.replace(/\n/g, ' '),
      l.source,
      new Date(l.createdAt).toLocaleDateString(),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.map((cell) => `"${cell}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_card_${selectedCardId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-900 pb-5 gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100">Leads Hub</h1>
          <p className="text-xs text-slate-400">View contact inquiries and reverse-save capture data.</p>
        </div>

        {cards.length > 0 && (
          <Button
            onClick={handleDownloadCsv}
            variant={user?.subscriptionTier === 'free' ? 'outline' : 'primary'}
            className="space-x-1.5 py-2 text-xs"
          >
            <Download size={14} />
            <span>Download CSV Log</span>
            {user?.subscriptionTier === 'free' && (
              <span className="text-[8px] bg-indigo-500/10 text-indigo-400 px-1 rounded-md uppercase font-bold border border-indigo-500/25 ml-1">
                Pro
              </span>
            )}
          </Button>
        )}
      </div>

      {loadingCards ? (
        <div className="h-20 bg-slate-900/30 rounded-2xl animate-pulse" />
      ) : cards.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/10 border border-slate-900 rounded-3xl space-y-4">
          <Inbox size={48} className="mx-auto text-slate-700" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-350">No captured leads</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">Create and publish a card with an inquiry form to capture visitor leads.</p>
          </div>
          <Link href="/dashboard/cards" className="inline-block">
            <Button size="sm">Go to My Cards</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
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

          {/* Leads table/list */}
          {loadingLeads ? (
            <div className="space-y-3">
              <div className="h-16 bg-slate-900/20 rounded-xl animate-pulse" />
              <div className="h-16 bg-slate-900/20 rounded-xl animate-pulse" />
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/10 border border-slate-900 rounded-2xl text-slate-500 text-xs">
              No lead captures registered for this card yet.
            </div>
          ) : (
            <div className="space-y-4">
              {leads.map((lead) => (
                <div
                  key={lead._id}
                  className="p-5 bg-slate-900/30 border border-slate-900 hover:border-slate-850 rounded-2xl space-y-4 transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-200">{lead.name}</h4>
                      <p className="text-xs text-slate-500">{lead.email} | {lead.phone || 'No phone'}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-[9px] bg-slate-950 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-full capitalize">
                        source: {lead.source}
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center space-x-1">
                        <Calendar size={12} />
                        <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                      </span>
                    </div>
                  </div>
                  {lead.message && (
                    <div className="p-3.5 bg-slate-950/80 border border-slate-850 rounded-xl text-xs text-slate-350 leading-relaxed font-mono whitespace-pre-wrap">
                      {lead.message}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Upgrade Plan Modal */}
      <Modal isOpen={upgradeModalOpen} onClose={() => setUpgradeModalOpen(false)} title="Upgrade to Pro Plan">
        <div className="flex flex-col items-center space-y-4 py-4 text-center">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400">
            <Sparkles size={24} />
          </div>
          <h3 className="font-bold text-slate-100">Unlock CSV Export Logs</h3>
          <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
            CSV logs and excel spreadsheet downloads are exclusive to Pro and Business plan users. Upgrade your tier to activate immediately.
          </p>
          <div className="flex space-x-3 pt-4 border-t border-slate-800 w-full justify-end">
            <Button variant="secondary" onClick={() => setUpgradeModalOpen(false)}>
              Cancel
            </Button>
            <Link href="/dashboard/billing">
              <Button onClick={() => setUpgradeModalOpen(false)} className="space-x-1.5">
                <span>View Billing Settings</span>
                <ArrowUpRight size={14} />
              </Button>
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
}
