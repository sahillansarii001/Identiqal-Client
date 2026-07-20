'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import { Layers, Search, Filter, Download, Edit2, ExternalLink } from 'lucide-react';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import Drawer from '@/components/ui/Drawer';
import { toast } from '@/components/ui/Toast';

export default function AdminOrganizationsPage() {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [search, setSearch] = useState('');

  const fetchOrgs = async () => {
    setLoading(true);
    try {
      const res = await adminService.getOrganizations(1, 100);
      if (res.success) setOrgs(res.data.organizations);
    } catch (err) {
      toast.error('Failed to load organizations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrgs(); }, []);

  const filtered = orgs.filter(o =>
    o.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.ownerId?.email?.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ['ID,Name,Owner,Seats,Created'];
    const rows = orgs.map(o => `${o._id},"${o.name}","${o.ownerId?.email || ''}",${o.totalSeats || 0},${new Date(o.createdAt).toISOString()}`);
    const csv = [...headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'organizations_export.csv';
    a.click();
    toast.success('Export downloaded');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Organizations</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View and manage all workspace organizations.</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 dark:bg-transparent dark:text-gray-300 dark:border-white/10 dark:hover:bg-white/5 transition-colors">
          <Download size={16} />
          Export CSV
        </button>
      </div>

      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/5">
          <div className="relative w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search organizations..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 bg-white dark:bg-transparent dark:text-white"
            />
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">{filtered.length} workspaces</span>
        </div>

        {loading ? (
          <SkeletonLoader type="table" rows={5} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/50 dark:bg-white/5 text-gray-500 dark:text-gray-400 font-medium text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Organization</th>
                  <th className="px-6 py-3">Owner</th>
                  <th className="px-6 py-3">Seats</th>
                  <th className="px-6 py-3">Created</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {filtered.map(org => (
                  <tr key={org._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] dark:bg-[#3B82F6]/10 dark:text-[#3B82F6] font-bold text-xs">
                          {(org.name || '?')[0].toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{org.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">{org.ownerId?.name || '—'}</p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">{org.ownerId?.email || '—'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                        {org.totalSeats || 0} seats
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {new Date(org.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => { setSelectedOrg(org); setIsDrawerOpen(true); }}
                        className="p-1.5 text-gray-400 hover:text-[#2563EB] hover:bg-[#2563EB]/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Edit2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center text-gray-400">
                      <Layers size={32} className="mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No organizations found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Organization Details">
        {selectedOrg && (
          <div className="space-y-5">
            <div className="flex items-center gap-4 pb-5 border-b border-gray-100 dark:border-white/10">
              <div className="w-14 h-14 rounded-xl bg-[#2563EB]/10 dark:bg-[#3B82F6]/10 flex items-center justify-center text-2xl font-black text-[#2563EB] dark:text-[#3B82F6]">
                {(selectedOrg.name || '?')[0].toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{selectedOrg.name}</h3>
                <p className="text-sm text-gray-500">ID: {selectedOrg._id}</p>
              </div>
            </div>

            {[
              { label: 'Owner Name', value: selectedOrg.ownerId?.name },
              { label: 'Owner Email', value: selectedOrg.ownerId?.email },
              { label: 'Total Seats', value: selectedOrg.totalSeats || '0' },
              { label: 'Created', value: new Date(selectedOrg.createdAt).toLocaleString() },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[11px] font-medium uppercase text-gray-400 mb-1">{label}</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{value || '—'}</p>
              </div>
            ))}
          </div>
        )}
      </Drawer>
    </div>
  );
}
