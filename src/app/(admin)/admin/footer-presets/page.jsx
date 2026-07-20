'use client';

import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '@/services/axiosInstance';
import { Plus, Edit2, Trash2, Copy, Search, X, Check, Type } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/components/ui/Toast';

const defaultForm = {
  name: '',
  status: 'draft',
  isPremium: false,
  contentTemplate: 'Powered by Identiqal',
};

// ─── Drawer ──────────────────────────────────────────────────────────
function PresetDrawer({ isOpen, onClose, editingPreset, onSaved }) {
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingPreset?._id) {
      setForm({
        name: editingPreset.name || '',
        status: editingPreset.status || 'draft',
        isPremium: editingPreset.isPremium || false,
        contentTemplate: editingPreset.contentTemplate || 'Powered by Identiqal',
      });
    } else {
      setForm(defaultForm);
    }
  }, [editingPreset, isOpen]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.name) return toast.error('Name is required');
    setSaving(true);
    try {
      if (editingPreset?._id) {
        await axiosInstance.put(`/presets/footers/${editingPreset._id}`, form);
        toast.success('Preset updated successfully');
      } else {
        await axiosInstance.post('/presets/footers', form);
        toast.success('Preset created successfully');
      }
      onSaved();
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to save preset');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 transition-opacity" onClick={onClose} />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col border-l border-gray-100 dark:border-white/10"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {editingPreset ? 'Edit Footer Preset' : 'New Footer Preset'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Preset Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3045]"
                placeholder="e.g., Minimal Footer"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={e => handleChange('status', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3045]"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              
              <div className="flex items-center mt-6">
                <input
                  type="checkbox"
                  id="isPremium"
                  checked={form.isPremium}
                  onChange={e => handleChange('isPremium', e.target.checked)}
                  className="w-4 h-4 text-[#5A3045] bg-gray-100 border-gray-300 rounded focus:ring-[#5A3045]"
                />
                <label htmlFor="isPremium" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Premium Only</label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Content Template (HTML/Text)</label>
              <textarea
                value={form.contentTemplate}
                onChange={e => handleChange('contentTemplate', e.target.value)}
                rows={6}
                className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3045] font-mono"
                placeholder="e.g., <div>Powered by Identiqal</div>"
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-[#5A3045] hover:bg-[#7A4055] text-white text-sm font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50">
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={16} />}
            <span>{saving ? 'Saving...' : 'Save Preset'}</span>
          </button>
        </div>
      </motion.div>
    </>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function FooterPresetsPage() {
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingPreset, setEditingPreset] = useState(null);
  const [search, setSearch] = useState('');

  const fetchPresets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/presets/footers');
      setPresets(Array.isArray(res) ? res : (res.data || []));

    } catch (error) {
      toast.error('Failed to load presets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPresets();
  }, [fetchPresets]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this preset?')) return;
    try {
      await axiosInstance.delete(`/presets/footers/${id}`);
      toast.success('Preset deleted');
      fetchPresets();
    } catch (error) {
      toast.error('Failed to delete preset');
    }
  };

  const handleDuplicate = (preset) => {
    setEditingPreset({ ...preset, _id: undefined, name: `${preset.name} (Copy)` });
    setDrawerOpen(true);
  };

  const filteredPresets = presets.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Type className="text-[#5A3045]" /> Footer Presets
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage footer configurations available for users.</p>
        </div>
        <button
          onClick={() => { setEditingPreset(null); setDrawerOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#5A3045] hover:bg-[#7A4055] text-white rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus size={18} /> New Preset
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search footers by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3045]"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#5A3045]/30 border-t-[#5A3045] rounded-full animate-spin" />
        </div>
      ) : filteredPresets.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
          <p className="text-gray-500 dark:text-gray-400">No footers found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPresets.map(preset => (
            <div key={preset._id} className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm flex flex-col">
              <div className="p-4 border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/20 font-mono text-[10px] text-gray-600 dark:text-gray-300 break-words line-clamp-3">
                {preset.contentTemplate}
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white truncate" title={preset.name}>{preset.name}</h3>
                    {preset.isPremium && <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Premium</span>}
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${preset.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                    {preset.status}
                  </span>
                </div>
                <div className="mt-auto pt-4 flex gap-2 border-t border-gray-100 dark:border-white/10">
                  <button onClick={() => { setEditingPreset(preset); setDrawerOpen(true); }} className="flex-1 flex justify-center items-center gap-1.5 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                    <Edit2 size={14} /> Edit
                  </button>
                  <button onClick={() => handleDuplicate(preset)} className="flex-1 flex justify-center items-center gap-1.5 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                    <Copy size={14} /> Duplicate
                  </button>
                  <button onClick={() => handleDelete(preset._id)} className="flex-1 flex justify-center items-center gap-1.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {drawerOpen && (
          <PresetDrawer
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            editingPreset={editingPreset}
            onSaved={fetchPresets}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
