'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { adminService } from '@/services/adminService';
import {
  Sparkles, Plus, Edit2, Trash2, Copy, Search,
  X, Check, ChevronDown, Globe, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/components/ui/Toast';

// ─── Constants ───────────────────────────────────────────────────────────────
const LAYOUT_STYLES = ['minimal', 'bold', 'corporate', 'creative'];
const BUTTON_STYLES = ['rounded', 'square', 'outline'];
const FONT_OPTIONS = ['Inter', 'Roboto', 'Poppins', 'Playfair Display', 'Montserrat', 'Georgia'];

const defaultForm = {
  name: '',
  status: 'draft',
  primary: '#5A3045',
  secondary: '#D4A45B',
  background: '#FFFFFF',
  text: '#1E1520',
  accent: '#D4A45B',
  fontFamily: 'Inter',
  layoutStyle: 'minimal',
  buttonStyle: 'rounded',
};

// ─── Live Card Preview ────────────────────────────────────────────────────────
function CardPreview({ form }) {
  const btnRadius = form.buttonStyle === 'rounded' ? 'rounded-full' : form.buttonStyle === 'square' ? 'rounded-none' : 'rounded-md';
  const btnBorder = form.buttonStyle === 'outline' ? `2px solid ${form.primary}` : 'none';
  const btnBg = form.buttonStyle === 'outline' ? 'transparent' : form.primary;
  const btnColor = form.buttonStyle === 'outline' ? form.primary : '#ffffff';

  return (
    <div
      className="w-full rounded-2xl overflow-hidden shadow-xl"
      style={{ backgroundColor: form.background, fontFamily: form.fontFamily }}
    >
      {/* Header Band */}
      <div className="h-20 w-full" style={{ backgroundColor: form.primary }} />

      {/* Avatar */}
      <div className="px-5 pb-4 -mt-8">
        <div
          className="w-16 h-16 rounded-full border-4 flex items-center justify-center text-xl font-black shadow-md"
          style={{ backgroundColor: form.secondary, borderColor: form.background, color: '#fff' }}
        >
          JD
        </div>
      </div>

      {/* Info */}
      <div className="px-5 pb-4">
        <h3 className="text-base font-bold leading-tight" style={{ color: form.text }}>John Doe</h3>
        <p className="text-xs mt-0.5" style={{ color: form.text, opacity: 0.6 }}>Senior Product Designer</p>
        <p className="text-xs mt-0.5" style={{ color: form.secondary }}>Acme Inc.</p>
      </div>

      {/* Social Links */}
      <div className="px-5 pb-3 space-y-2">
        {['LinkedIn', 'Website', 'Email'].map((link) => (
          <div
            key={link}
            className={`w-full py-2 px-4 text-xs font-semibold text-center ${btnRadius} cursor-pointer`}
            style={{ backgroundColor: btnBg, border: btnBorder, color: btnColor, opacity: 0.9 }}
          >
            {link}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t mt-1" style={{ borderColor: `${form.text}15` }}>
        <p className="text-[9px] text-center" style={{ color: form.text, opacity: 0.4 }}>
          Powered by Identiqal
        </p>
      </div>
    </div>
  );
}

// ─── Color Picker Row ─────────────────────────────────────────────────────────
function ColorField({ label, value, onChange }) {
  const inputRef = React.useRef(null);

  return (
    <div>
      <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5">
        {label}
      </label>
      <div className="flex items-center gap-2 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 overflow-hidden">
        {/* Clickable color swatch — opens native picker */}
        <div
          className="w-11 h-10 shrink-0 cursor-pointer border-r border-gray-200 dark:border-white/10 transition-opacity hover:opacity-80"
          style={{ backgroundColor: value }}
          onClick={() => inputRef.current?.click()}
          title="Click to open colour picker"
        />
        {/* Hidden native color input */}
        <input
          ref={inputRef}
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="sr-only"
          tabIndex={-1}
        />
        {/* Hex text input */}
        <input
          type="text"
          value={value}
          maxLength={7}
          onChange={e => {
            const v = e.target.value;
            onChange(v);
          }}
          className="flex-1 text-sm font-mono bg-transparent border-none focus:outline-none text-gray-900 dark:text-white px-2 py-2.5 placeholder-gray-400"
          placeholder="#000000"
          spellCheck={false}
        />
      </div>
    </div>
  );
}

// ─── Theme Editor Drawer ──────────────────────────────────────────────────────
function ThemeDrawer({ isOpen, onClose, editingTheme, onSaved }) {
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingTheme) {
      setForm({
        name: editingTheme.name || 'Untitled Theme',
        status: editingTheme.status || 'draft',
        primary: editingTheme.colors?.primary || '#5A3045',
        secondary: editingTheme.colors?.secondary || '#D4A45B',
        background: editingTheme.colors?.background || '#FFFFFF',
        text: editingTheme.colors?.text || '#1E1520',
        accent: editingTheme.colors?.accent || '#D4A45B',
        fontFamily: editingTheme.font?.family || 'Inter',
        layoutStyle: editingTheme.layoutStyle || 'minimal',
        buttonStyle: editingTheme.buttonStyle || 'rounded',
      });
    } else {
      setForm(defaultForm);
    }
  }, [editingTheme, isOpen]);

  const setField = (key) => (value) => setForm(f => ({ ...f, [key]: value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name || 'Untitled Theme',
        status: form.status,
        colors: { primary: form.primary, secondary: form.secondary, background: form.background, text: form.text, accent: form.accent },
        font: { family: form.fontFamily, heading: form.fontFamily, body: form.fontFamily },
        layoutStyle: form.layoutStyle,
        buttonStyle: form.buttonStyle,
      };

      let res;
      if (editingTheme) {
        res = await adminService.updateTheme(editingTheme._id, payload);
      } else {
        res = await adminService.createTheme(payload);
      }

      if (res.success) {
        toast.success(editingTheme ? 'Theme updated' : 'Theme created');
        onSaved(res.data, !!editingTheme);
        onClose();
      }
    } catch {
      toast.error('Failed to save theme');
    } finally {
      setSaving(false);
    }
  };

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Wide Drawer — two-column layout */}
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-full max-w-4xl bg-white dark:bg-[#0F0D10] shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10 shrink-0">
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  {editingTheme ? 'Edit Theme' : 'New Theme'}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Changes update the preview in real time.</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body — form left, preview right */}
            <div className="flex-1 overflow-hidden flex">
              {/* ─ Left: Form ─ */}
              <form onSubmit={handleSave} className="w-[55%] h-full overflow-y-auto p-6 space-y-6 border-r border-gray-100 dark:border-white/10">
                {/* Name + Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5">Theme Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setField('name')(e.target.value)}
                      placeholder="e.g. Midnight Minimal"
                      className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5A3045]/30 focus:border-[#5A3045]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5">Status</label>
                    <div className="flex gap-2">
                      {['draft', 'published'].map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setField('status')(s)}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-lg border capitalize transition-colors ${
                            form.status === s
                              ? s === 'published'
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                                : 'border-gray-400 bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300'
                              : 'border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          {s === 'published' ? <Globe size={11} /> : <FileText size={11} />}
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-3">Colors</p>
                  <div className="grid grid-cols-2 gap-3">
                    <ColorField label="Primary" value={form.primary} onChange={setField('primary')} />
                    <ColorField label="Secondary" value={form.secondary} onChange={setField('secondary')} />
                    <ColorField label="Background" value={form.background} onChange={setField('background')} />
                    <ColorField label="Text" value={form.text} onChange={setField('text')} />
                    <ColorField label="Accent" value={form.accent} onChange={setField('accent')} />
                  </div>
                </div>

                {/* Font */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5">Font Family</label>
                  <div className="relative">
                    <select
                      value={form.fontFamily}
                      onChange={e => setField('fontFamily')(e.target.value)}
                      className="w-full appearance-none px-3 py-2 text-sm border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5A3045]/30 pr-8"
                    >
                      {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Layout Style */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">Layout Style</label>
                  <div className="grid grid-cols-4 gap-2">
                    {LAYOUT_STYLES.map(style => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => setField('layoutStyle')(style)}
                        className={`py-2 text-xs font-medium rounded-lg border capitalize transition-colors ${
                          form.layoutStyle === style
                            ? 'border-[#5A3045] bg-[#5A3045] text-white'
                            : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/20'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Button Style */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">Button Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {BUTTON_STYLES.map(style => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => setField('buttonStyle')(style)}
                        className={`py-2 text-xs font-medium rounded-lg border capitalize transition-colors ${
                          form.buttonStyle === style
                            ? 'border-[#5A3045] bg-[#5A3045] text-white'
                            : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/20'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Save */}
                <div className="pt-4 border-t border-gray-100 dark:border-white/10">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-2.5 text-sm font-semibold text-white bg-[#5A3045] hover:bg-[#7A4055] rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Check size={15} />
                    )}
                    {saving ? 'Saving...' : editingTheme ? 'Save Changes' : 'Create Theme'}
                  </button>
                </div>
              </form>

              {/* ─ Right: Live Preview ─ */}
              <div className="flex-1 h-full overflow-y-auto bg-gray-50 dark:bg-white/5 p-6 flex flex-col">
                <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-4">Live Preview</p>
                <div className="sticky top-0">
                  <div className="max-w-[260px] mx-auto">
                    <CardPreview form={form} />
                  </div>
                  <p className="text-center text-[10px] text-gray-400 mt-4">This is how the card will look for users.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Theme Card ───────────────────────────────────────────────────────────────
function ThemeCard({ theme, onEdit, onDuplicate, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(theme._id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <div className="group bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-white/20 transition-all">
      {/* Preview Area */}
      <div className="h-36 relative overflow-hidden" style={{ backgroundColor: theme.colors?.background || '#f9f9f9' }}>
        {/* Header band */}
        <div className="absolute top-0 left-0 right-0 h-14" style={{ backgroundColor: theme.colors?.primary || '#5A3045' }} />
        {/* Avatar */}
        <div
          className="absolute top-7 left-4 w-12 h-12 rounded-full border-2 shadow-sm flex items-center justify-center text-xs font-black"
          style={{ backgroundColor: theme.colors?.secondary || '#D4A45B', borderColor: theme.colors?.background || '#fff', color: '#fff' }}
        >
          JD
        </div>
        {/* Mini links */}
        <div className="absolute bottom-3 left-4 right-4 space-y-1.5">
          {[1, 2].map(i => (
            <div
              key={i}
              className="h-4 rounded-sm"
              style={{
                backgroundColor: theme.buttonStyle === 'outline' ? 'transparent' : theme.colors?.primary || '#5A3045',
                border: theme.buttonStyle === 'outline' ? `1px solid ${theme.colors?.primary || '#5A3045'}` : 'none',
                borderRadius: theme.buttonStyle === 'rounded' ? '999px' : theme.buttonStyle === 'square' ? '2px' : '6px',
                opacity: 0.7,
                width: i === 1 ? '80%' : '60%',
              }}
            />
          ))}
        </div>

        {/* Hover overlay with actions */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={() => onEdit(theme)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white text-gray-900 rounded-lg hover:bg-gray-50 shadow-sm transition"
          >
            <Edit2 size={11} />
            Edit
          </button>
          <button
            onClick={() => onDuplicate(theme)}
            className="p-1.5 bg-white text-gray-900 rounded-lg hover:bg-gray-50 shadow-sm transition"
            title="Duplicate"
          >
            <Copy size={13} />
          </button>
          <button
            onClick={handleDelete}
            className={`p-1.5 rounded-lg shadow-sm transition ${confirmDelete ? 'bg-red-500 text-white' : 'bg-white text-gray-900 hover:bg-gray-50'}`}
            title={confirmDelete ? 'Click again to confirm delete' : 'Delete'}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 border-t border-gray-100 dark:border-white/5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
            {theme.name || 'Untitled Theme'}
          </p>
          <span className={`shrink-0 px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
            theme.status === 'published'
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
              : 'bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400'
          }`}>
            {theme.status || 'draft'}
          </span>
        </div>
        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 capitalize">{theme.layoutStyle} · {theme.buttonStyle}</p>
        <div className="flex items-center gap-1 mt-2">
          {[theme.colors?.primary, theme.colors?.secondary, theme.colors?.background, theme.colors?.text, theme.colors?.accent].filter(Boolean).map((c, i) => (
            <div
              key={i}
              className="w-3.5 h-3.5 rounded-full border border-gray-200 dark:border-white/10"
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
          <span className="text-[10px] text-gray-400 ml-1">{new Date(theme.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminThemesPage() {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'published' | 'draft'
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingTheme, setEditingTheme] = useState(null);

  const fetchThemes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getThemes();
      if (res.success) setThemes(res.data);
    } catch {
      toast.error('Failed to load themes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchThemes(); }, [fetchThemes]);

  const openCreate = () => { setEditingTheme(null); setIsDrawerOpen(true); };
  const openEdit = (theme) => { setEditingTheme(theme); setIsDrawerOpen(true); };

  const handleSaved = (savedTheme, isUpdate) => {
    setThemes(prev =>
      isUpdate
        ? prev.map(t => t._id === savedTheme._id ? savedTheme : t)
        : [savedTheme, ...prev]
    );
  };

  const handleDuplicate = async (theme) => {
    try {
      const res = await adminService.createTheme({
        name: `${theme.name || 'Untitled'} (Copy)`,
        status: 'draft',
        colors: theme.colors,
        font: theme.font,
        layoutStyle: theme.layoutStyle,
        buttonStyle: theme.buttonStyle,
      });
      if (res.success) {
        toast.success('Theme duplicated');
        setThemes(prev => [res.data, ...prev]);
      }
    } catch {
      toast.error('Failed to duplicate theme');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await adminService.deleteTheme(id);
      if (res.success) {
        toast.success('Theme deleted');
        setThemes(prev => prev.filter(t => t._id !== id));
      }
    } catch {
      toast.error('Failed to delete theme');
    }
  };

  const filtered = themes.filter(t => {
    const matchesFilter = filter === 'all' || t.status === filter;
    const matchesSearch = !search || (t.name || '').toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const counts = {
    all: themes.length,
    published: themes.filter(t => t.status === 'published').length,
    draft: themes.filter(t => t.status === 'draft').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Themes</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Create and manage global themes for digital cards.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#5A3045] hover:bg-[#7A4055] rounded-lg transition-colors shadow-sm"
        >
          <Plus size={15} />
          New Theme
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {/* Filter Tabs */}
        <div className="flex items-center bg-gray-100 dark:bg-white/5 p-1 rounded-lg gap-0.5">
          {['all', 'published', 'draft'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                filter === f
                  ? 'bg-white dark:bg-white/15 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {f} <span className="ml-1 text-[10px] opacity-60">({counts[f]})</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-56">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search themes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5A3045]/20 focus:border-[#5A3045]/50 transition-all"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden animate-pulse">
              <div className="h-36 bg-gray-100 dark:bg-white/5" />
              <div className="p-3 space-y-2">
                <div className="h-3 w-2/3 bg-gray-100 dark:bg-white/5 rounded" />
                <div className="h-2 w-1/2 bg-gray-100 dark:bg-white/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl p-16 text-center shadow-sm">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 mb-4">
            <Sparkles size={22} />
          </div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {search ? `No themes match "${search}"` : filter !== 'all' ? `No ${filter} themes` : 'No themes yet'}
          </h3>
          <p className="text-xs text-gray-500 mt-1 mb-5">
            {search ? 'Try a different search term.' : 'Create your first theme to allow users to customise their digital cards.'}
          </p>
          {!search && (
            <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#5A3045] hover:bg-[#7A4055] rounded-lg transition-colors">
              <Plus size={14} />
              Create Theme
            </button>
          )}
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {filtered.map(theme => (
            <motion.div key={theme._id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
              <ThemeCard
                theme={theme}
                onEdit={openEdit}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Theme Editor Drawer */}
      <ThemeDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        editingTheme={editingTheme}
        onSaved={handleSaved}
      />
    </div>
  );
}
