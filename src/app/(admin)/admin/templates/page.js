'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { adminService } from '@/services/adminService';
import {
  LayoutTemplate, Plus, Edit2, Trash2, Copy, Search,
  X, Check, ChevronDown, Globe, FileText, Star, Users, Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/components/ui/Toast';

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = ['General', 'Developer', 'Designer', 'Freelancer', 'Startup', 'Agency', 'Healthcare', 'Real Estate', 'Photographer', 'Educator', 'Finance'];
const BADGE_OPTIONS = ['', 'NEW', 'PREMIUM', 'POPULAR', 'TRENDING', 'AI PICK'];
const LAYOUT_STYLES = ['minimal', 'bold', 'corporate', 'creative'];
const BUTTON_STYLES = ['rounded', 'square', 'outline'];
const FONT_OPTIONS = ['Inter', 'Roboto', 'Poppins', 'Playfair Display', 'Montserrat', 'Georgia'];

const defaultForm = {
  name: '',
  category: 'General',
  description: '',
  badge: '',
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

// ─── Mini Card Preview ────────────────────────────────────────────────────────
function MiniPreview({ form }) {
  const btnBg = form.buttonStyle === 'outline' ? 'transparent' : form.primary;
  const btnBorder = form.buttonStyle === 'outline' ? `1.5px solid ${form.primary}` : 'none';
  const btnRadius = form.buttonStyle === 'rounded' ? '999px' : form.buttonStyle === 'square' ? '2px' : '6px';
  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-xl" style={{ backgroundColor: form.background, fontFamily: form.fontFamily }}>
      <div className="h-16 w-full" style={{ backgroundColor: form.primary }} />
      <div className="px-4 pb-3 -mt-6">
        <div className="w-12 h-12 rounded-full border-4 flex items-center justify-center text-sm font-black shadow"
          style={{ backgroundColor: form.secondary, borderColor: form.background, color: '#fff' }}>
          JD
        </div>
      </div>
      <div className="px-4 pb-3">
        <p className="text-xs font-bold" style={{ color: form.text }}>Jane Doe</p>
        <p className="text-[10px] mt-0.5 opacity-60" style={{ color: form.text }}>Senior Designer · Acme</p>
      </div>
      <div className="px-4 pb-4 space-y-1.5">
        {['Portfolio', 'LinkedIn', 'Contact'].map(l => (
          <div key={l} className="w-full py-1.5 text-[9px] font-semibold text-center"
            style={{ backgroundColor: btnBg, border: btnBorder, borderRadius: btnRadius, color: form.buttonStyle === 'outline' ? form.primary : '#fff' }}>
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

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

// ─── Template Drawer ──────────────────────────────────────────────────────────
function TemplateDrawer({ isOpen, onClose, editingTemplate, onSaved }) {
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingTemplate) {
      setForm({
        name: editingTemplate.name || '',
        category: editingTemplate.category || 'General',
        description: editingTemplate.description || '',
        badge: editingTemplate.badge || '',
        status: editingTemplate.status || 'draft',
        primary: editingTemplate.colors?.primary || '#5A3045',
        secondary: editingTemplate.colors?.secondary || '#D4A45B',
        background: editingTemplate.colors?.background || '#FFFFFF',
        text: editingTemplate.colors?.text || '#1E1520',
        accent: editingTemplate.colors?.accent || '#D4A45B',
        fontFamily: editingTemplate.font?.family || 'Inter',
        layoutStyle: editingTemplate.layoutStyle || 'minimal',
        buttonStyle: editingTemplate.buttonStyle || 'rounded',
      });
    } else {
      setForm(defaultForm);
    }
  }, [editingTemplate, isOpen]);

  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Template name is required'); return; }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        category: form.category,
        description: form.description,
        badge: form.badge,
        status: form.status,
        colors: { primary: form.primary, secondary: form.secondary, background: form.background, text: form.text, accent: form.accent },
        font: { family: form.fontFamily, heading: form.fontFamily, body: form.fontFamily },
        layoutStyle: form.layoutStyle,
        buttonStyle: form.buttonStyle,
      };
      let res;
      if (editingTemplate) {
        res = await adminService.updateCardTemplate(editingTemplate._id, payload);
      } else {
        res = await adminService.createCardTemplate(payload);
      }
      if (res.success) {
        toast.success(editingTemplate ? 'Template updated' : 'Template created');
        onSaved(res.data, !!editingTemplate);
        onClose();
      }
    } catch {
      toast.error('Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-full max-w-4xl bg-white dark:bg-[#0F0D10] shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10 shrink-0">
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  {editingTemplate ? 'Edit Template' : 'New Template'}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Changes update the preview in real time.</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-hidden flex">
              {/* Left: Form */}
              <form onSubmit={handleSave} className="w-[55%] h-full overflow-y-auto p-6 space-y-5 border-r border-gray-100 dark:border-white/10">

                {/* Name */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5">Template Name *</label>
                  <input type="text" required value={form.name} onChange={e => set('name')(e.target.value)}
                    placeholder="e.g. Gold Luxury"
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5A3045]/30 focus:border-[#5A3045]" />
                </div>

                {/* Category + Badge row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5">Category</label>
                    <div className="relative">
                      <select value={form.category} onChange={e => set('category')(e.target.value)}
                        className="w-full appearance-none px-3 py-2 text-sm border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5A3045]/30 pr-8">
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5">Badge</label>
                    <div className="relative">
                      <select value={form.badge} onChange={e => set('badge')(e.target.value)}
                        className="w-full appearance-none px-3 py-2 text-sm border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5A3045]/30 pr-8">
                        {BADGE_OPTIONS.map(b => <option key={b} value={b}>{b || '— None —'}</option>)}
                      </select>
                      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5">Description</label>
                  <textarea rows={3} value={form.description} onChange={e => set('description')(e.target.value)}
                    placeholder="Briefly describe this template's style and best use case..."
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5A3045]/30 resize-none" />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5">Status</label>
                  <div className="flex gap-2">
                    {['draft', 'published'].map(s => (
                      <button key={s} type="button" onClick={() => set('status')(s)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-lg border capitalize transition-colors ${
                          form.status === s
                            ? s === 'published'
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                              : 'border-gray-400 bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300'
                            : 'border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400'
                        }`}>
                        {s === 'published' ? <Globe size={11} /> : <FileText size={11} />}
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-3">Colors</p>
                  <div className="grid grid-cols-2 gap-3">
                    <ColorField label="Primary" value={form.primary} onChange={set('primary')} />
                    <ColorField label="Secondary" value={form.secondary} onChange={set('secondary')} />
                    <ColorField label="Background" value={form.background} onChange={set('background')} />
                    <ColorField label="Text" value={form.text} onChange={set('text')} />
                    <ColorField label="Accent" value={form.accent} onChange={set('accent')} />
                  </div>
                </div>

                {/* Font */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5">Font Family</label>
                  <div className="relative">
                    <select value={form.fontFamily} onChange={e => set('fontFamily')(e.target.value)}
                      className="w-full appearance-none px-3 py-2 text-sm border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5A3045]/30 pr-8">
                      {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Layout Style */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">Layout Style</label>
                  <div className="grid grid-cols-4 gap-2">
                    {LAYOUT_STYLES.map(style => (
                      <button key={style} type="button" onClick={() => set('layoutStyle')(style)}
                        className={`py-2 text-xs font-medium rounded-lg border capitalize transition-colors ${
                          form.layoutStyle === style
                            ? 'border-[#5A3045] bg-[#5A3045] text-white'
                            : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                        }`}>
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
                      <button key={style} type="button" onClick={() => set('buttonStyle')(style)}
                        className={`py-2 text-xs font-medium rounded-lg border capitalize transition-colors ${
                          form.buttonStyle === style
                            ? 'border-[#5A3045] bg-[#5A3045] text-white'
                            : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                        }`}>
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Save button */}
                <div className="pt-4 border-t border-gray-100 dark:border-white/10">
                  <button type="submit" disabled={saving}
                    className="w-full py-2.5 text-sm font-semibold text-white bg-[#5A3045] hover:bg-[#7A4055] rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                    {saving ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Check size={15} />}
                    {saving ? 'Saving...' : editingTemplate ? 'Save Changes' : 'Create Template'}
                  </button>
                </div>
              </form>

              {/* Right: Live Preview */}
              <div className="flex-1 h-full overflow-y-auto bg-gray-50 dark:bg-white/5 p-6 flex flex-col">
                <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-4">Live Preview</p>
                <div className="sticky top-0">
                  <div className="max-w-[220px] mx-auto">
                    <MiniPreview form={form} />
                  </div>
                  <div className="mt-4 p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mb-1">Template Info</p>
                    <div className="flex flex-wrap gap-1.5">
                      {form.badge && (
                        <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-[#5A3045] text-white">{form.badge}</span>
                      )}
                      <span className="px-2 py-0.5 text-[9px] font-medium rounded bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">{form.category}</span>
                      <span className="px-2 py-0.5 text-[9px] font-medium rounded bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 capitalize">{form.layoutStyle}</span>
                    </div>
                    {form.description && (
                      <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">{form.description}</p>
                    )}
                  </div>
                  <p className="text-center text-[10px] text-gray-400 mt-3">This preview shows how the card will look.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Badge Pill ───────────────────────────────────────────────────────────────
function BadgePill({ badge }) {
  if (!badge) return null;
  const colors = {
    'AI PICK':  'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
    'PREMIUM':  'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400',
    'NEW':      'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
    'TRENDING': 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
    'POPULAR':  'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400',
  };
  return (
    <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded uppercase ${colors[badge] || 'bg-gray-100 text-gray-600'}`}>
      {badge}
    </span>
  );
}

// ─── Template Card ────────────────────────────────────────────────────────────
function TemplateCard({ template, onEdit, onDuplicate, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = () => {
    if (confirmDelete) { onDelete(template._id); }
    else { setConfirmDelete(true); setTimeout(() => setConfirmDelete(false), 3000); }
  };

  const { colors = {}, buttonStyle, layoutStyle } = template;
  const btnBg = buttonStyle === 'outline' ? 'transparent' : colors.primary || '#5A3045';
  const btnBorder = buttonStyle === 'outline' ? `1px solid ${colors.primary || '#5A3045'}` : 'none';
  const btnRadius = buttonStyle === 'rounded' ? '999px' : buttonStyle === 'square' ? '2px' : '6px';

  return (
    <div className="group bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-white/20 transition-all">
      {/* Visual preview */}
      <div className="h-40 relative overflow-hidden" style={{ backgroundColor: colors.background || '#fff' }}>
        {/* Header band */}
        <div className="absolute top-0 left-0 right-0 h-14" style={{ backgroundColor: colors.primary || '#5A3045' }} />
        {/* Avatar */}
        <div className="absolute top-7 left-4 w-11 h-11 rounded-full border-2 shadow flex items-center justify-center text-xs font-black"
          style={{ backgroundColor: colors.secondary || '#D4A45B', borderColor: colors.background || '#fff', color: '#fff' }}>
          JD
        </div>
        {/* Fake links */}
        <div className="absolute bottom-3 left-4 right-4 space-y-1.5">
          {[1, 2].map(i => (
            <div key={i} className="h-4"
              style={{ backgroundColor: btnBg, border: btnBorder, borderRadius: btnRadius, opacity: 0.75, width: i === 1 ? '80%' : '55%' }} />
          ))}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button onClick={() => onEdit(template)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white text-gray-900 rounded-lg hover:bg-gray-50 shadow-sm transition">
            <Edit2 size={11} /> Edit
          </button>
          <button onClick={() => onDuplicate(template)}
            className="p-1.5 bg-white text-gray-900 rounded-lg hover:bg-gray-50 shadow-sm transition" title="Duplicate">
            <Copy size={13} />
          </button>
          <button onClick={handleDelete}
            className={`p-1.5 rounded-lg shadow-sm transition ${confirmDelete ? 'bg-red-500 text-white' : 'bg-white text-gray-900 hover:bg-gray-50'}`}
            title={confirmDelete ? 'Click again to confirm' : 'Delete'}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 border-t border-gray-100 dark:border-white/5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{template.name || 'Untitled Template'}</p>
          <div className="flex items-center gap-1 shrink-0">
            <BadgePill badge={template.badge} />
            <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded uppercase ${
              template.status === 'published'
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                : 'bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400'
            }`}>{template.status || 'draft'}</span>
          </div>
        </div>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 capitalize">
          {template.category} · {layoutStyle}
        </p>
        {template.description && (
          <p className="text-[10px] text-gray-400 mt-1 leading-relaxed line-clamp-2">{template.description}</p>
        )}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            {[colors.primary, colors.secondary, colors.background, colors.text, colors.accent].filter(Boolean).map((c, i) => (
              <div key={i} className="w-3 h-3 rounded-full border border-gray-200 dark:border-white/10" style={{ backgroundColor: c }} title={c} />
            ))}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-gray-400">
            <Users size={9} />
            <span>{template.usageCount ?? 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getCardTemplates();
      if (res.success) setTemplates(res.data);
    } catch {
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTemplates(); }, [fetchTemplates]);

  const openCreate = () => { setEditingTemplate(null); setIsDrawerOpen(true); };
  const openEdit   = (t) => { setEditingTemplate(t); setIsDrawerOpen(true); };

  const handleSaved = (saved, isUpdate) => {
    setTemplates(prev =>
      isUpdate ? prev.map(t => t._id === saved._id ? saved : t) : [saved, ...prev]
    );
  };

  const handleDuplicate = async (template) => {
    try {
      const res = await adminService.createCardTemplate({
        name: `${template.name || 'Untitled'} (Copy)`,
        category: template.category,
        description: template.description,
        badge: template.badge,
        status: 'draft',
        colors: template.colors,
        font: template.font,
        layoutStyle: template.layoutStyle,
        buttonStyle: template.buttonStyle,
      });
      if (res.success) {
        toast.success('Template duplicated');
        setTemplates(prev => [res.data, ...prev]);
      }
    } catch {
      toast.error('Failed to duplicate template');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await adminService.deleteCardTemplate(id);
      if (res.success) {
        toast.success('Template deleted');
        setTemplates(prev => prev.filter(t => t._id !== id));
      }
    } catch {
      toast.error('Failed to delete template');
    }
  };

  const handleSeed = async () => {
    try {
      setLoading(true);
      const res = await adminService.seedCardTemplates();
      if (res.success) {
        toast.success('Demo templates loaded successfully!');
        fetchTemplates(); // refresh the list
      }
    } catch {
      toast.error('Failed to load demo templates');
      setLoading(false);
    }
  };

  const filtered = templates.filter(t => {
    const matchFilter = filter === 'all' || t.status === filter;
    const matchSearch = !search || (t.name || '').toLowerCase().includes(search.toLowerCase()) || (t.category || '').toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    all: templates.length,
    published: templates.filter(t => t.status === 'published').length,
    draft: templates.filter(t => t.status === 'draft').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Templates</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Manage pre-built card templates for users to choose from.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSeed}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 dark:bg-transparent dark:text-gray-300 dark:border-white/20 dark:hover:bg-white/5 transition-colors shadow-sm">
            <Database size={15} />
            Load Demo Templates
          </button>
          <button id="create-template-btn" onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#5A3045] hover:bg-[#7A4055] rounded-lg transition-colors shadow-sm">
            <Plus size={15} />
            New Template
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {/* Filter tabs */}
        <div className="flex items-center bg-gray-100 dark:bg-white/5 p-1 rounded-lg gap-0.5">
          {['all', 'published', 'draft'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                filter === f
                  ? 'bg-white dark:bg-white/15 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}>
              {f} <span className="ml-1 text-[10px] opacity-60">({counts[f]})</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-56">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search templates..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5A3045]/20 focus:border-[#5A3045]/50 transition-all" />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden animate-pulse">
              <div className="h-40 bg-gray-100 dark:bg-white/5" />
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
            <LayoutTemplate size={22} />
          </div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {search ? `No templates match "${search}"` : filter !== 'all' ? `No ${filter} templates` : 'No templates yet'}
          </h3>
          <p className="text-xs text-gray-500 mt-1 mb-5">
            {search ? 'Try a different search term.' : 'Create your first template so users can pick a style during onboarding.'}
          </p>
          {!search && (
            <button onClick={openCreate}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#5A3045] hover:bg-[#7A4055] rounded-lg transition-colors">
              <Plus size={14} /> Create Template
            </button>
          )}
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(template => (
            <motion.div key={template._id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
              <TemplateCard
                template={template}
                onEdit={openEdit}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Drawer */}
      <TemplateDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        editingTemplate={editingTemplate}
        onSaved={handleSaved}
      />
    </div>
  );
}
