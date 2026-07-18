'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import { Megaphone, Plus, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';
import Drawer from '@/components/ui/Drawer';
import { toast } from '@/components/ui/Toast';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';

const TYPE_CONFIG = {
  info:    { icon: <Info size={16} />,            bg: 'bg-blue-50 dark:bg-blue-500/10',    text: 'text-blue-600 dark:text-blue-400',    border: 'border-l-blue-400' },
  success: { icon: <CheckCircle2 size={16} />,    bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-l-emerald-400' },
  warning: { icon: <AlertTriangle size={16} />,   bg: 'bg-amber-50 dark:bg-amber-500/10',  text: 'text-amber-600 dark:text-amber-400',  border: 'border-l-amber-400' },
  error:   { icon: <XCircle size={16} />,         bg: 'bg-red-50 dark:bg-red-500/10',      text: 'text-red-600 dark:text-red-400',      border: 'border-l-red-400' },
};

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', type: 'info', isActive: true });

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAnnouncements();
      if (res.success) setAnnouncements(res.data);
    } catch { toast.error('Failed to load announcements'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await adminService.createAnnouncement(form);
      if (res.success) {
        toast.success('Announcement created');
        setAnnouncements([res.data, ...announcements]);
        setIsDrawerOpen(false);
        setForm({ title: '', content: '', type: 'info', isActive: true });
      }
    } catch { toast.error('Failed to create announcement'); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Announcements</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Broadcast platform-wide system messages.</p>
        </div>
        <button onClick={() => setIsDrawerOpen(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#5A3045] hover:bg-[#7A4055] rounded-lg transition-colors shadow-sm">
          <Plus size={16} />
          New Announcement
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" />)}
        </div>
      ) : announcements.length === 0 ? (
        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl p-16 text-center">
          <Megaphone size={32} className="mx-auto mb-3 text-gray-300" />
          <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">No announcements yet</h3>
          <p className="text-xs text-gray-500 mt-1 mb-4">Broadcasts will be shown to users across the platform.</p>
          <button onClick={() => setIsDrawerOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#5A3045] hover:bg-[#7A4055] rounded-lg transition-colors">
            <Plus size={14} />
            Create Announcement
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map(a => {
            const config = TYPE_CONFIG[a.type] || TYPE_CONFIG.info;
            return (
              <div key={a._id} className={`bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 border-l-4 ${config.border} rounded-xl p-5 shadow-sm flex items-start gap-4`}>
                <div className={`p-2 rounded-lg ${config.bg} ${config.text} shrink-0`}>
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{a.title}</h3>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${a.isActive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-gray-100 text-gray-500 dark:bg-white/10'}`}>
                      {a.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{a.content}</p>
                  <p className="text-[11px] text-gray-400 mt-2">{new Date(a.createdAt).toLocaleString()}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="New Announcement">
        <form onSubmit={handleCreate} className="space-y-5">
          <div>
            <label className="block text-[11px] font-medium uppercase text-gray-500 dark:text-gray-400 mb-1">Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5A3045]"
              placeholder="Platform update available"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium uppercase text-gray-500 dark:text-gray-400 mb-1">Message</label>
            <textarea
              required
              rows={4}
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5A3045] resize-none"
              placeholder="We have released a new feature..."
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium uppercase text-gray-500 dark:text-gray-400 mb-1">Type</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(TYPE_CONFIG).map(([type, cfg]) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, type }))}
                  className={`flex items-center gap-2 py-2 px-3 text-xs font-medium rounded-lg border capitalize transition-colors ${
                    form.type === type
                      ? 'border-[#5A3045] bg-[#5A3045] text-white'
                      : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {cfg.icon}
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="rounded text-[#5A3045] focus:ring-[#5A3045]" />
            <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300">Active (visible to users)</label>
          </div>
          <div className="pt-4 border-t border-gray-100 dark:border-white/10">
            <button type="submit" disabled={saving} className="w-full py-2.5 text-sm font-medium text-white bg-[#5A3045] hover:bg-[#7A4055] rounded-lg transition-colors shadow-sm disabled:opacity-50">
              {saving ? 'Publishing...' : 'Publish Announcement'}
            </button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
