'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import { Settings, Save, Shield, Users, Globe, Mail } from 'lucide-react';
import { toast } from '@/components/ui/Toast';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await adminService.getSettings();
        if (res.success) setSettings(res.data);
      } catch {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await adminService.updateSettings({
        siteName: settings.siteName,
        supportEmail: settings.supportEmail,
        maintenanceMode: settings.maintenanceMode,
        allowSignups: settings.allowSignups,
        defaultFreeSeats: settings.defaultFreeSeats,
      });
      if (res.success) {
        toast.success('Settings saved successfully');
        setSettings(res.data);
      }
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 dark:bg-white/10 rounded mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl p-6 space-y-4">
              <div className="h-4 w-32 bg-gray-200 dark:bg-white/10 rounded" />
              <div className="h-10 bg-gray-100 dark:bg-white/5 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure platform-wide behaviour and features.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General */}
        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-white/10">
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400">
              <Globe size={16} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">General</h2>
              <p className="text-xs text-gray-500">Basic platform information.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-medium uppercase text-gray-500 dark:text-gray-400 mb-1.5">Platform Name</label>
              <input
                type="text"
                value={settings.siteName || ''}
                onChange={e => setSettings(s => ({ ...s, siteName: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium uppercase text-gray-500 dark:text-gray-400 mb-1.5">Support Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={settings.supportEmail || ''}
                  onChange={e => setSettings(s => ({ ...s, supportEmail: e.target.value }))}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* User Access */}
        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-white/10">
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400">
              <Users size={16} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">User Access</h2>
              <p className="text-xs text-gray-500">Control who can access and join the platform.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Allow New Signups</p>
                <p className="text-xs text-gray-500 mt-0.5">When disabled, new users cannot register.</p>
              </div>
              <button
                type="button"
                onClick={() => setSettings(s => ({ ...s, allowSignups: !s.allowSignups }))}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${settings.allowSignups ? 'bg-[#2563EB]' : 'bg-gray-200 dark:bg-white/20'}`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${settings.allowSignups ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
            <div>
              <label className="block text-[11px] font-medium uppercase text-gray-500 dark:text-gray-400 mb-1.5">Default Free Seats per Org</label>
              <input
                type="number"
                min="1"
                max="100"
                value={settings.defaultFreeSeats || 5}
                onChange={e => setSettings(s => ({ ...s, defaultFreeSeats: parseInt(e.target.value) }))}
                className="w-full md:w-48 px-3 py-2.5 text-sm border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]"
              />
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white dark:bg-[#111] border border-red-100 dark:border-red-500/20 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-red-100 dark:border-red-500/20">
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500">
              <Shield size={16} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Maintenance Mode</h2>
              <p className="text-xs text-gray-500">Temporarily disable access for non-admin users.</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border border-red-100 dark:border-red-500/20 bg-red-50/50 dark:bg-red-500/5">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Maintenance Mode</p>
              <p className="text-xs text-red-500 mt-0.5">⚠️ This will block access for all non-admin users.</p>
            </div>
            <button
              type="button"
              onClick={() => setSettings(s => ({ ...s, maintenanceMode: !s.maintenanceMode }))}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${settings.maintenanceMode ? 'bg-red-500' : 'bg-gray-200 dark:bg-white/20'}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${settings.maintenanceMode ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-[#2563EB] hover:bg-[#6366F1] rounded-lg transition-colors shadow-sm disabled:opacity-60"
          >
            <Save size={15} />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
