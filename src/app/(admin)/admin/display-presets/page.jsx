'use client';

import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '@/services/axiosInstance';
import { Plus, Edit2, Trash2, Copy, Search, X, Check, LayoutTemplate } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/components/ui/Toast';

const CATEGORIES = ['General', 'Business', 'Personal', 'Creative', 'Corporate', 'Luxury', 'Minimal', 'Dark'];
const HEADER_STYLES = [
  { label: 'Wave (Classic)', value: 'Curved Wave' },
  { label: 'Flat (Solid Color)', value: 'Solid Color' },
  { label: 'Diagonal (Split)', value: 'Diagonal Split' },
  { label: 'Blend (Gradient Fade)', value: 'Blend' },
  { label: 'Curved (Sleek)', value: 'Sleek' },
  { label: 'Organic (Abstract Shape)', value: 'Organic Blob' },
  { label: 'Glass', value: 'Glass' },
  { label: 'Minimal', value: 'Minimal' },
  { label: 'Luxury (Premium)', value: 'Luxury' },
  { label: 'Neon (Futuristic)', value: 'Neon' },
];

const defaultForm = {
  name: '',
  description: '',
  category: 'General',
  status: 'draft',
  headerStyle: 'Solid Color',
  headerHeight: '200px',
  backgroundType: 'Solid Color',
  profilePhotoStyle: 'Circle',
  profilePhotoPosition: 'Center',
  cardShape: 'Rounded',
  animationStyle: 'Fade',
  // Visual helper values
  footerEnabled: false,
  footerStyle: 'Simple',
  borderRadius: '24px',
  gradient: false,
  shadow: 'none',
  overlay: 0,
};

/* ─── Header Preset Artwork Preview Component ─────────────────────────── */
const HeaderPresetThumbnail = ({ preset, activeTheme }) => {
  const primaryColor = activeTheme?.primary || '#5A3045';
  const accentColor = activeTheme?.accent || '#D4A45B';
  const name = preset?.name || '';

  let headerBg = primaryColor;
  let headerHeight = 'h-[80px]';
  const isLuxury = name === 'Luxury' || preset?.headerStyle === 'Luxury';
  const isNeon = name === 'Neon' || preset?.headerStyle === 'Neon';
  const isMinimal = name === 'Minimal' || preset?.headerStyle === 'Minimal';
  const isSleek = name === 'Sleek' || preset?.headerStyle === 'Sleek';
  const isBlend = name === 'Blend' || preset?.headerStyle === 'Blend';
  const isCurved = preset?.headerStyle === 'Curved Wave';
  const isDiagonal = preset?.headerStyle === 'Diagonal Split';
  const isOrganic = preset?.headerStyle === 'Organic Blob';

  if (isLuxury) {
    headerBg = 'linear-gradient(135deg, #1A1A1A, #2A2520, #1A1A1A)';
  } else if (isNeon) {
    headerBg = 'linear-gradient(135deg, #0A0A0E, #140E24)';
  } else if (isBlend) {
    headerBg = `linear-gradient(to bottom, ${primaryColor}, transparent)`;
  } else if (preset?.headerStyle === 'Gradient') {
    headerBg = `linear-gradient(135deg, ${primaryColor}, ${accentColor})`;
  }

  if (isMinimal) {
    headerHeight = 'h-[16px]';
  }

  return (
    <div className="w-full h-full bg-white dark:bg-[#1C191D] relative flex flex-col">
      {/* Header Artwork */}
      {!isSleek ? (
        <div 
          className={`w-full ${headerHeight} relative overflow-hidden shrink-0`}
          style={{ 
            background: headerBg,
            boxShadow: isNeon ? '0 4px 10px rgba(56, 189, 248, 0.45), 0 2px 4px rgba(217, 70, 239, 0.3)' : 'none'
          }}
        >
          {/* Wave Curved */}
          {(name === 'Classic' || isCurved) && (
            <svg className="absolute bottom-0 w-full text-white dark:text-[#1C191D] fill-current" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
            </svg>
          )}
          {/* Diagonal */}
          {(name === 'Modern' || isDiagonal) && (
            <svg className="absolute bottom-0 w-full text-white dark:text-[#1C191D] fill-current" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon points="0,100 100,0 100,100"></polygon>
            </svg>
          )}
          {/* Organic Blob */}
          {(name === 'Creative' || isOrganic) && (
            <svg className="absolute bottom-0 w-full text-white dark:text-[#1C191D] fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C50,22,150,75,321.39,56.44Z"></path>
            </svg>
          )}
          {/* Luxury gold stripe */}
          {isLuxury && (
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#D4A45B] via-[#F4E0A5] to-[#D4A45B]" />
          )}
        </div>
      ) : (
        /* Sleek Floating Pill */
        <div className="w-full h-[80px] flex items-center justify-center pt-3 px-3 shrink-0">
          <div 
            className="w-full h-11 rounded-full border border-white/20 shadow-sm"
            style={{ 
              background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
            }}
          />
        </div>
      )}
      <div className="flex-1 bg-white dark:bg-[#1C191D]" />
    </div>
  );
};

// ─── Drawer ──────────────────────────────────────────────────────────
function PresetDrawer({ isOpen, onClose, editingPreset, onSaved }) {
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingPreset?._id) {
      setForm({
        name: editingPreset.name || '',
        description: editingPreset.description || '',
        category: editingPreset.category || 'General',
        status: editingPreset.status || 'draft',
        headerStyle: editingPreset.headerStyle || 'Solid Color',
        headerHeight: editingPreset.headerHeight || '200px',
        backgroundType: editingPreset.backgroundType || 'Solid Color',
        profilePhotoStyle: editingPreset.profilePhotoStyle || 'Circle',
        profilePhotoPosition: editingPreset.profilePhotoPosition || 'Center',
        cardShape: editingPreset.cardShape || 'Rounded',
        animationStyle: editingPreset.animationStyle || 'Fade',
        // Visual fields
        footerEnabled: editingPreset.footerEnabled || false,
        footerStyle: editingPreset.footerStyle || 'Simple',
        borderRadius: editingPreset.borderRadius || '24px',
        gradient: editingPreset.gradient || false,
        shadow: editingPreset.shadow || 'none',
        overlay: editingPreset.overlay || 0,
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
        await axiosInstance.put(`/presets/display/${editingPreset._id}`, form);
        toast.success('Preset updated successfully');
      } else {
        await axiosInstance.post('/presets/display', form);
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
        className="fixed inset-y-0 right-0 w-full max-w-4xl bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col md:flex-row border-l border-gray-100 dark:border-white/10"
      >
        {/* Left Column: Form Controls */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {editingPreset ? 'Edit Display Preset' : 'New Display Preset'}
            </h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors md:hidden">
              <X size={18} className="text-gray-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Section 1: Basic Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white pb-1.5 border-b border-gray-100 dark:border-white/10">1. Basic Info</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Preset Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => handleChange('name', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3045]"
                    placeholder="e.g., Executive Pro"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={e => handleChange('category', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3045]"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
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
              </div>
            </div>

            {/* Section 2: Header design */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white pb-1.5 border-b border-gray-100 dark:border-white/10">2. Header Design</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Header Style</label>
                  <select
                    value={form.headerStyle}
                    onChange={e => handleChange('headerStyle', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3045]"
                  >
                    {HEADER_STYLES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Header Height</label>
                  <input
                    type="text"
                    value={form.headerHeight}
                    onChange={e => handleChange('headerHeight', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3045]"
                    placeholder="e.g., 200px"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Header controls */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white pb-1.5 border-b border-gray-100 dark:border-white/10">3. Card & Header Controls</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Border Radius</label>
                  <select
                    value={form.borderRadius}
                    onChange={e => handleChange('borderRadius', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3045]"
                  >
                    <option value="0px">Sharp (0px)</option>
                    <option value="12px">Rounded (12px)</option>
                    <option value="24px">Extra Rounded (24px)</option>
                    <option value="36px">Pill (36px)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Card Shadow</label>
                  <select
                    value={form.shadow}
                    onChange={e => handleChange('shadow', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3045]"
                  >
                    <option value="none">None</option>
                    <option value="soft">Soft Shadow</option>
                    <option value="heavy">Heavy Shadow</option>
                  </select>
                </div>
                <div className="col-span-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Enable Header Gradient overlay</span>
                  <input
                    type="checkbox"
                    checked={form.gradient}
                    onChange={e => handleChange('gradient', e.target.checked)}
                    className="w-4 h-4 text-[#5A3045] focus:ring-[#5A3045] border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Profile image */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white pb-1.5 border-b border-gray-100 dark:border-white/10">4. Profile Photo</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Profile Style</label>
                  <select
                    value={form.profilePhotoStyle}
                    onChange={e => handleChange('profilePhotoStyle', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3045]"
                  >
                    <option value="Circle">Circle</option>
                    <option value="Rounded Square">Rounded Square</option>
                    <option value="Square">Square</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Position</label>
                  <select
                    value={form.profilePhotoPosition}
                    onChange={e => handleChange('profilePhotoPosition', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3045]"
                  >
                    <option value="Center">Center</option>
                    <option value="Left">Left</option>
                    <option value="Hidden">Hidden</option>
                    <option value="Floating">Floating</option>
                    <option value="Overlapping Header">Overlapping Header</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 5: Footer */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white pb-1.5 border-b border-gray-100 dark:border-white/10">5. Footer</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Enable Footer Stripe</span>
                  <input
                    type="checkbox"
                    checked={form.footerEnabled}
                    onChange={e => handleChange('footerEnabled', e.target.checked)}
                    className="w-4 h-4 text-[#5A3045] focus:ring-[#5A3045] border-gray-300 rounded"
                  />
                </div>
                {form.footerEnabled && (
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Footer Style</label>
                    <select
                      value={form.footerStyle}
                      onChange={e => handleChange('footerStyle', e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3045]"
                    >
                      <option value="Simple">Simple</option>
                      <option value="Glass">Glass</option>
                      <option value="Branded">Branded</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Action buttons */}
          <div className="p-4 border-t border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] flex justify-end gap-3 shrink-0">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-[#5A3045] hover:bg-[#7A4055] text-white text-sm font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50">
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={16} />}
              <span>{saving ? 'Saving...' : 'Save Preset'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Card Preview Panel */}
        <div className="hidden md:flex md:w-[380px] bg-gray-50 dark:bg-black/40 border-l border-gray-100 dark:border-white/10 flex-col items-center justify-center p-6 relative overflow-hidden">
          <div className="text-xs font-bold text-gray-400 absolute top-4 left-4 uppercase tracking-wider">Live Preview</div>
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
          
          {/* Phone Card Mockup */}
          <div 
            className="w-[260px] h-[400px] bg-white dark:bg-[#1A1A22] border-2 border-gray-200 dark:border-white/10 shadow-xl overflow-hidden flex flex-col transition-all duration-300 relative"
            style={{
              borderRadius: form.borderRadius || '24px',
              boxShadow: form.shadow === 'soft' ? '0 12px 30px rgba(0,0,0,0.1)' : form.shadow === 'heavy' ? '0 24px 50px rgba(0,0,0,0.2)' : 'none',
            }}
          >
            {/* Header Design Preview */}
            <div className="w-full relative shrink-0" style={{ height: `${(parseInt(form.headerHeight) / 3) || 66}px` }}>
              <HeaderPresetThumbnail preset={form} activeTheme={{ primary: '#5A3045', accent: '#D4A45B' }} />
            </div>

            {/* Profile Image Preview */}
            {form.profilePhotoPosition !== 'Hidden' && (
              <div className="flex justify-center -mt-8 relative z-10">
                <div 
                  className="w-16 h-16 bg-gray-200 dark:bg-white/10 border-2 border-white dark:border-[#1A1A22] flex items-center justify-center text-[10px] text-gray-400 font-medium"
                  style={{
                    borderRadius: form.profilePhotoStyle === 'Circle' ? '50%' : form.profilePhotoStyle === 'Rounded Square' ? '20%' : '0px'
                  }}
                >
                  Photo
                </div>
              </div>
            )}

            {/* Body Content */}
            <div className="p-4 flex-1 flex flex-col items-center space-y-3">
              <div className="w-24 h-4 bg-gray-200 dark:bg-white/10 rounded" />
              <div className="w-32 h-2.5 bg-gray-100 dark:bg-white/5 rounded" />
              
              {/* Mock buttons/links */}
              <div className="w-full space-y-1.5 pt-4">
                <div className="w-full h-8 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200/50 dark:border-white/5 flex items-center px-3 justify-between">
                  <div className="w-16 h-2 bg-gray-200 dark:bg-white/10 rounded" />
                  <span className="text-[10px] text-gray-400">→</span>
                </div>
                <div className="w-full h-8 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200/50 dark:border-white/5 flex items-center px-3 justify-between">
                  <div className="w-20 h-2 bg-gray-200 dark:bg-white/10 rounded" />
                  <span className="text-[10px] text-gray-400">→</span>
                </div>
              </div>
            </div>

            {/* Footer Preview */}
            {form.footerEnabled && (
              <div className="w-full py-2 bg-gray-50 dark:bg-black/20 border-t border-gray-100 dark:border-white/5 text-center text-[8px] text-gray-400">
                {form.footerStyle || 'Simple'} Footer
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function DisplayPresetsPage() {
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingPreset, setEditingPreset] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'published', 'draft'

  const fetchPresets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/presets/display');
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
      await axiosInstance.delete(`/presets/display/${id}`);
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

  // Search + status filter
  const filteredPresets = presets.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.category.toLowerCase().includes(search.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && p.status === statusFilter;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <LayoutTemplate className="text-[#5A3045]" /> Display Presets
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage global display layout definitions for cards.</p>
        </div>
        <button
          onClick={() => { setEditingPreset(null); setDrawerOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#5A3045] hover:bg-[#7A4055] text-white rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus size={18} /> New Preset
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-200 dark:border-white/10">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search presets by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-black/10 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3045]"
          />
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-black/20 p-1 rounded-xl shrink-0 w-full md:w-auto">
          {['all', 'published', 'draft'].map(filter => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`flex-1 md:flex-none px-4 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                statusFilter === filter
                  ? 'bg-white dark:bg-[#5A3045] text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#5A3045]/30 border-t-[#5A3045] rounded-full animate-spin" />
        </div>
      ) : filteredPresets.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
          <p className="text-gray-500 dark:text-gray-400">No presets found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPresets.map(preset => (
            <div 
              key={preset._id} 
              className="bg-white dark:bg-[#151215] rounded-[18px] border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 flex flex-col w-full max-w-[360px] mx-auto group"
            >
              {/* Large Visual Header Preview (60-70% height area) */}
              <div className="h-[120px] w-full border-b border-gray-100 dark:border-white/5 relative shrink-0 overflow-hidden">
                <HeaderPresetThumbnail preset={preset} activeTheme={{ primary: '#5A3045', accent: '#D4A45B' }} />
              </div>

              {/* Bottom Presets Metadata & Info */}
              <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate" title={preset.name}>
                      {preset.name}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      preset.status === 'published' 
                        ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400' 
                        : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400'
                    }`}>
                      {preset.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                    {preset.category}
                  </p>
                </div>

                {/* Quick Actions Row */}
                <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-white/5">
                  <button 
                    onClick={() => { setEditingPreset(preset); setDrawerOpen(true); }} 
                    className="flex-1 flex justify-center items-center gap-1 py-1.5 text-[11px] font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg border border-gray-200/40 dark:border-white/5 transition-colors"
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                  <button 
                    onClick={() => handleDuplicate(preset)} 
                    className="flex-1 flex justify-center items-center gap-1 py-1.5 text-[11px] font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg border border-gray-200/40 dark:border-white/5 transition-colors"
                  >
                    <Copy size={12} /> Duplicate
                  </button>
                  <button 
                    onClick={() => handleDelete(preset._id)} 
                    className="p-1.5 flex justify-center items-center text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg border border-red-100 dark:border-red-950/40 transition-colors"
                    title="Delete Preset"
                  >
                    <Trash2 size={12} />
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
