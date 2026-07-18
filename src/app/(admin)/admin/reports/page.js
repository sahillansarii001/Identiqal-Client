'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import { BarChart3, Download, FileText } from 'lucide-react';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { toast } from '@/components/ui/Toast';

export default function AdminReportsPage() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, analyticsRes, usersRes] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getAdvancedAnalytics(),
          adminService.getUsers(1, 100),
        ]);
        if (statsRes.success) setStats(statsRes.data);
        if (analyticsRes.success) setAnalytics(analyticsRes.data);
        if (usersRes.success) setUsers(usersRes.data.users);
      } catch (err) {
        toast.error('Failed to load report data');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const exportPlatformSummaryCSV = () => {
    if (!stats) return;
    const data = [
      ['Metric', 'Value'],
      ['Total Users', stats.totalUsers],
      ['Total Organizations', stats.totalOrganizations],
      ['Total Cards', stats.totalCards],
      ['Total Leads', stats.totalLeads],
      ['Report Generated', new Date().toISOString()],
    ];
    const csv = data.map(row => row.join(',')).join('\n');
    downloadCSV(csv, 'platform_summary_report.csv');
  };

  const exportUserGrowthCSV = () => {
    if (!analytics?.usersGrowth) return;
    const headers = ['Date,New Signups'];
    const rows = analytics.usersGrowth.map(d => `${d._id},${d.count}`);
    downloadCSV([headers, ...rows].join('\n'), 'user_growth_report.csv');
  };

  const exportCardGrowthCSV = () => {
    if (!analytics?.cardsGrowth) return;
    const headers = ['Date,Cards Created'];
    const rows = analytics.cardsGrowth.map(d => `${d._id},${d.count}`);
    downloadCSV([headers, ...rows].join('\n'), 'card_growth_report.csv');
  };

  const exportUsersCSV = () => {
    if (!users.length) return;
    const headers = ['ID,Name,Email,Role,Verified,Joined'];
    const rows = users.map(u => `${u._id},"${u.name}","${u.email}",${u.role},${u.isVerified},${new Date(u.createdAt).toISOString()}`);
    downloadCSV([headers, ...rows].join('\n'), 'users_full_report.csv');
    toast.success('Users report downloaded');
  };

  const downloadCSV = (csv, filename) => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    toast.success('Report downloaded');
  };

  const reports = [
    {
      title: 'Platform Summary',
      description: 'Total users, organizations, cards, and leads overview.',
      icon: <BarChart3 size={18} className="text-blue-500" />,
      bg: 'bg-blue-50 dark:bg-blue-500/10',
      action: exportPlatformSummaryCSV,
    },
    {
      title: 'User Growth (30 days)',
      description: 'Daily new user signups for the past 30 days.',
      icon: <FileText size={18} className="text-emerald-500" />,
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      action: exportUserGrowthCSV,
    },
    {
      title: 'Card Growth (30 days)',
      description: 'Daily cards created for the past 30 days.',
      icon: <FileText size={18} className="text-purple-500" />,
      bg: 'bg-purple-50 dark:bg-purple-500/10',
      action: exportCardGrowthCSV,
    },
    {
      title: 'Full Users Export',
      description: 'All registered users with roles and verification status.',
      icon: <FileText size={18} className="text-amber-500" />,
      bg: 'bg-amber-50 dark:bg-amber-500/10',
      action: exportUsersCSV,
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <div className="h-6 w-48 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-72 bg-gray-100 dark:bg-white/5 rounded animate-pulse mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <SkeletonLoader key={i} type="card" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Reports</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Export platform data as CSV for analysis and record keeping.</p>
      </div>

      {/* Summary Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: stats.totalUsers },
            { label: 'Organizations', value: stats.totalOrganizations },
            { label: 'Digital Cards', value: stats.totalCards },
            { label: 'Total Leads', value: stats.totalLeads },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl p-5 shadow-sm">
              <p className="text-[11px] font-medium uppercase text-gray-500 tracking-wider">{label}</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{(value || 0).toLocaleString()}</h3>
            </div>
          ))}
        </div>
      )}

      {/* Export Cards */}
      <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Available Exports</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report, i) => (
          <div key={i} className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl p-5 shadow-sm flex items-center gap-4 hover:border-gray-300 dark:hover:border-white/20 transition-colors">
            <div className={`p-3 rounded-xl ${report.bg} shrink-0`}>
              {report.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{report.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{report.description}</p>
            </div>
            <button
              onClick={report.action}
              className="shrink-0 flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors"
            >
              <Download size={13} />
              CSV
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
