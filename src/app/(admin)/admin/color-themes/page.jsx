'use client';

import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '@/services/axiosInstance';
import { Plus, Edit2, Trash2, Copy, Search, X, Check, Paintbrush } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/components/ui/Toast';

const CATEGORIES = ['General', 'Business', 'Personal', 'Creative', 'Corporate', 'Luxury', 'Minimal', 'Dark'];

const defaultForm = {
  name: '',
  category: 'General',
  status: 'draft',
  primary: '#0d6efd',
  secondary: '#6c757d',
  accent: '#0d6efd',
  background: '#ffffff',
  surface: '#f8f9fa',
  text: '#212529',
  border: '#dee2e6',
  button: '#0d6efd',
  icon: '#495057',
};

// ─── Color Field ─────────────────────────────────────────────────────────────
function ColorField({ label, value, onChange }) {
  const ref = React.useRef(null);
  return (
    <div>
      <label className="block text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">{label}</label>
      <div className="flex items-center gap-2 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 overflow-hidden">
        <div className="w-9 h-9 shrink-0 cursor-pointer border-r border-gray-200 dark:border-white/10"
          style={{ backgroundColor: value }} onClick={() => ref.current?.click()} />
        <input ref={ref} type="color" value={value} onChange={e => onChange(e.target.value)} className="sr-only" tabIndex={-1} />
        <input type="text" value={value} maxLength={7}
          onChange={e => onChange(e.target.value)}
          className="flex-1 text-xs font-mono bg-transparent border-none focus:outline-none text-gray-900 dark:text-white px-1 py-2"
          spellCheck={false} />
      </div>
    </div>
  );
}

// ─── Drawer ──────────────────────────────────────────────────────────
function ThemeDrawer({ isOpen, onClose, editingTheme, onSaved }) {
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingTheme) {
      setForm({
        name: editingTheme.name || '',
        category: editingTheme.category || 'General',
        status: editingTheme.status || 'draft',
        primary: editingTheme.primary || '#0d6efd',
        secondary: editingTheme.secondary || '#6c757d',
        accent: editingTheme.accent || '#0d6efd',
        background: editingTheme.background || '#ffffff',
        surface: editingTheme.surface || '#f8f9fa',
        text: editingTheme.text || '#212529',
        border: editingTheme.border || '#dee2e6',
        button: editingTheme.button || '#0d6efd',
        icon: editingTheme.icon || '#495057',
      });
    } else {
      setForm(defaultForm);
    }
  }, [editingTheme, isOpen]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.name) return toast.error('Name is required');
    setSaving(true);
    try {
      if (editingTheme?._id) {
        await axiosInstance.put(`/presets/colors/${editingTheme._id}`, form);
        toast.success('Theme updated successfully');
      } else {
        await axiosInstance.post('/presets/colors', form);
        toast.success('Theme created successfully');
      }
      onSaved();
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to save theme');
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
            {editingTheme ? 'Edit Theme' : 'New Theme'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white pb-2 border-b border-gray-100 dark:border-white/10">Basic Info</h3>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Theme Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                placeholder="e.g., Midnight Glow"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={e => handleChange('category', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={e => handleChange('status', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white pb-2 border-b border-gray-100 dark:border-white/10">Color Palette</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <ColorField label="Primary" value={form.primary} onChange={v => handleChange('primary', v)} />
              <ColorField label="Secondary" value={form.secondary} onChange={v => handleChange('secondary', v)} />
              <ColorField label="Accent" value={form.accent} onChange={v => handleChange('accent', v)} />
              <ColorField label="Button" value={form.button} onChange={v => handleChange('button', v)} />
              <ColorField label="Background" value={form.background} onChange={v => handleChange('background', v)} />
              <ColorField label="Surface" value={form.surface} onChange={v => handleChange('surface', v)} />
              <ColorField label="Text" value={form.text} onChange={v => handleChange('text', v)} />
              <ColorField label="Border" value={form.border} onChange={v => handleChange('border', v)} />
              <ColorField label="Icon" value={form.icon} onChange={v => handleChange('icon', v)} />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-[#2563EB] hover:bg-[#6366F1] text-white text-sm font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50">
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={16} />}
            <span>{saving ? 'Saving...' : 'Save Theme'}</span>
          </button>
        </div>
      </motion.div>
    </>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function ColorThemesPage() {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingTheme, setEditingTheme] = useState(null);
  const [search, setSearch] = useState('');

  const fetchThemes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/presets/colors');
      setThemes(Array.isArray(res) ? res : (res.data || []));

    } catch (error) {
      toast.error('Failed to load themes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchThemes();
  }, [fetchThemes]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this theme?')) return;
    try {
      await axiosInstance.delete(`/presets/colors/${id}`);
      toast.success('Theme deleted');
      fetchThemes();
    } catch (error) {
      toast.error('Failed to delete theme');
    }
  };

  const handleDuplicate = (theme) => {
    setEditingTheme({ ...theme, _id: undefined, name: `${theme.name} (Copy)` });
    setDrawerOpen(true);
  };

  const filteredThemes = themes.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Paintbrush className="text-[#2563EB]" /> Color Themes
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage global color palettes available for users.</p>
        </div>
        <button
          onClick={() => { setEditingTheme(null); setDrawerOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-[#6366F1] text-white rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus size={18} /> New Theme
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search themes by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#2563EB]/30 border-t-[#2563EB] rounded-full animate-spin" />
        </div>
      ) : filteredThemes.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
          <p className="text-gray-500 dark:text-gray-400">No themes found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredThemes.map(theme => (
            <div key={theme._id} className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
              <div className="h-32 w-full flex flex-col p-4" style={{ backgroundColor: theme.background }}>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full shadow" style={{ backgroundColor: theme.primary }} />
                  <div className="w-8 h-8 rounded-full shadow" style={{ backgroundColor: theme.secondary }} />
                  <div className="w-8 h-8 rounded-full shadow" style={{ backgroundColor: theme.accent }} />
                </div>
                <div className="mt-auto flex justify-between items-end">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase shadow-sm" style={{ backgroundColor: theme.surface, color: theme.text }}>
                    {theme.text}
                  </span>
                  <div className="px-3 py-1.5 rounded-lg text-xs font-medium shadow-sm" style={{ backgroundColor: theme.button, color: '#fff' }}>
                    Button
                  </div>
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white truncate" title={theme.name}>{theme.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{theme.category}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${theme.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                    {theme.status}
                  </span>
                </div>
                <div className="mt-auto pt-4 flex gap-2 border-t border-gray-100 dark:border-white/10">
                  <button onClick={() => { setEditingTheme(theme); setDrawerOpen(true); }} className="flex-1 flex justify-center items-center gap-1.5 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                    <Edit2 size={14} /> Edit
                  </button>
                  <button onClick={() => handleDuplicate(theme)} className="flex-1 flex justify-center items-center gap-1.5 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                    <Copy size={14} /> Duplicate
                  </button>
                  <button onClick={() => handleDelete(theme._id)} className="flex-1 flex justify-center items-center gap-1.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
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
          <ThemeDrawer
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            editingTheme={editingTheme}
            onSaved={fetchThemes}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
