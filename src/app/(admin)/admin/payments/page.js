'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import { DollarSign, Download, Search, TrendingUp } from 'lucide-react';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { toast } from '@/components/ui/Toast';

const STATUS_BADGE = {
  succeeded: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
  pending:   'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
  failed:    'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
  refunded:  'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400',
};

export default function AdminPaymentsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [search, setSearch] = useState('');

  const fetchTransactions = async (p = 1) => {
    setLoading(true);
    try {
      const res = await adminService.getTransactions(p, 15);
      if (res.success) {
        setTransactions(res.data.transactions);
        setTotalPages(res.data.pages);
        setPage(res.data.page);
        const total = res.data.transactions.reduce((sum, t) => sum + (t.status === 'succeeded' ? (t.amount || 0) : 0), 0);
        setTotalRevenue(total);
      }
    } catch {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTransactions(1); }, []);

  const exportCSV = () => {
    const headers = ['ID,User,Email,Amount,Currency,Status,Date'];
    const rows = transactions.map(t =>
      `${t._id},"${t.userId?.name || ''}","${t.userId?.email || ''}",${(t.amount || 0) / 100},${t.currency},${t.status},${new Date(t.createdAt).toISOString()}`
    );
    const csv = [...headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payments_export.csv';
    a.click();
    toast.success('Export downloaded');
  };

  const filtered = transactions.filter(t =>
    t.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.userId?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Payments</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">All platform transactions and revenue.</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 dark:bg-transparent dark:text-gray-300 dark:border-white/10 dark:hover:bg-white/5 transition-colors">
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl p-5 shadow-sm flex items-center gap-4">
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500">
          <DollarSign size={22} />
        </div>
        <div>
          <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Visible Page Revenue</p>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white">${(totalRevenue / 100).toFixed(2)}</h3>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/5">
          <div className="relative w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by user..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A45B]/50 bg-white dark:bg-transparent dark:text-white"
            />
          </div>
        </div>

        {loading ? <SkeletonLoader type="table" rows={6} /> : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50/50 dark:bg-white/5 text-gray-500 dark:text-gray-400 font-medium text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Transaction ID</th>
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {filtered.map(t => (
                    <tr key={t._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-mono text-[11px] text-gray-500 dark:text-gray-400">{t._id?.slice(-8).toUpperCase()}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{t.userId?.name || '—'}</p>
                          <p className="text-[11px] text-gray-500">{t.userId?.email || '—'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        ${((t.amount || 0) / 100).toFixed(2)} <span className="text-[11px] font-normal text-gray-500">{(t.currency || 'USD').toUpperCase()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-md capitalize ${STATUS_BADGE[t.status] || STATUS_BADGE.pending}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 max-w-[160px] truncate">
                        {t.description || '—'}
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && !loading && (
                    <tr>
                      <td colSpan="6" className="px-6 py-16 text-center text-gray-400">
                        <DollarSign size={32} className="mx-auto mb-3 opacity-30" />
                        <p className="text-sm">No transactions found.</p>
                        <p className="text-xs mt-1 text-gray-400">Transactions will appear here once users subscribe or make payments.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                <p className="text-xs text-gray-500">Page {page} of {totalPages}</p>
                <div className="flex gap-2">
                  <button disabled={page <= 1} onClick={() => fetchTransactions(page - 1)} className="px-3 py-1.5 text-xs border border-gray-200 dark:border-white/10 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-40 transition-colors">
                    Previous
                  </button>
                  <button disabled={page >= totalPages} onClick={() => fetchTransactions(page + 1)} className="px-3 py-1.5 text-xs border border-gray-200 dark:border-white/10 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-40 transition-colors">
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
