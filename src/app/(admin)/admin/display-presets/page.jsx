'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import axiosInstance from '@/services/axiosInstance';
import { Plus, Edit2, Trash2, Copy, Search, X, Check, LayoutTemplate, ArrowLeft, ArrowRight, RotateCcw, Undo, Redo, Sparkles } from 'lucide-react';
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
  { label: 'Aurora (Premium)', value: 'Aurora' },
];

const defaultForm = {
  name: '',
  description: '',
  category: 'General',
  status: 'draft',
  headerStyle: 'Solid Color',
  headerHeight: '220px',
  backgroundType: 'Solid Color',
  profilePhotoStyle: 'Circle',
  profilePhotoPosition: 'Center',
  cardShape: 'Rounded',
  animationStyle: 'Fade',
  borderRadius: '24px',
  shadow: 'none',
  gradient: false,
  overlay: 0,
  footerEnabled: false,
  footerStyle: 'Simple',
  footerHeight: '40px',
  footerColor: '#F8FAFC',
  headerColor: '#2563EB',
  headerColorEnd: '#3B82F6',
  gradientDirection: 'Vertical',
  headerPattern: 'None',
  headerThemeMode: 'Solid',
  allowDrag: true,
  allowZoom: true,
  defaultZoom: 100,
  defaultPositionX: 0,
  defaultPositionY: 0,
};

/* ─── Header Preset Artwork Preview Component ─────────────────────────── */
const HeaderPresetThumbnail = ({ preset, activeTheme }) => {
  const primaryColor = activeTheme?.primary || '#2563EB';
  const accentColor = activeTheme?.accent || '#3B82F6';
  const name = preset?.name || '';

  let headerBg = primaryColor;
  let headerHeight = 'h-[80px]';
  const isLuxury = name === 'Luxury' || preset?.headerStyle === 'Luxury';
  const isAurora = name === 'Aurora' || preset?.headerStyle === 'Aurora';
  const isMinimal = name === 'Minimal' || preset?.headerStyle === 'Minimal';
  const isSleek = name === 'Sleek' || preset?.headerStyle === 'Sleek';
  const isBlend = name === 'Blend' || preset?.headerStyle === 'Blend';
  const isCurved = preset?.headerStyle === 'Curved Wave';
  const isDiagonal = preset?.headerStyle === 'Diagonal Split';
  const isOrganic = preset?.headerStyle === 'Organic Blob';

  if (isLuxury) {
    headerBg = 'linear-gradient(135deg, #1A1A1A, #2A2520, #1A1A1A)';
  } else if (isAurora) {
    headerBg = 'radial-gradient(circle at 10% 20%, rgba(56, 189, 248, 0.8) 0%, transparent 55%), radial-gradient(circle at 90% 30%, rgba(124, 58, 237, 0.8) 0%, transparent 60%), radial-gradient(circle at 50% 80%, rgba(79, 70, 229, 0.9) 0%, transparent 70%), linear-gradient(135deg, #2563EB, #4F46E5)';
  } else if (isBlend) {
    headerBg = `linear-gradient(to bottom, ${primaryColor}, transparent)`;
  } else if (preset?.headerStyle === 'Gradient') {
    headerBg = `linear-gradient(135deg, ${primaryColor}, ${accentColor})`;
  }

  if (isAurora) {
    headerHeight = 'h-[110px]';
  } else if (isMinimal) {
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
            boxShadow: isAurora ? '0 10px 30px -10px rgba(79, 70, 229, 0.15)' : 'none'
          }}
        >
          {/* Bottom natural fade for Aurora */}
          {isAurora && (
            <div className="absolute bottom-0 left-0 w-full h-[22px] bg-gradient-to-b from-transparent to-white dark:to-[#1C191D]" />
          )}
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

// ─── Visual Preset Builder Modal ──────────────────────────────────────
function PresetDrawer({ isOpen, onClose, editingPreset, onSaved }) {
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(1);

  // Undo/Redo stacks
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);

  // Load preset or check for local draft
  useEffect(() => {
    if (editingPreset?._id) {
      const formState = {
        name: editingPreset.name || '',
        description: editingPreset.description || '',
        category: editingPreset.category || 'General',
        status: editingPreset.status || 'draft',
        headerStyle: editingPreset.headerStyle || 'Solid Color',
        headerHeight: editingPreset.headerHeight || '220px',
        backgroundType: editingPreset.backgroundType || 'Solid Color',
        profilePhotoStyle: editingPreset.profilePhotoStyle || 'Circle',
        profilePhotoPosition: editingPreset.profilePhotoPosition || 'Center',
        cardShape: editingPreset.cardShape || 'Rounded',
        animationStyle: editingPreset.animationStyle || 'Fade',
        borderRadius: editingPreset.borderRadius || '24px',
        shadow: editingPreset.shadow || 'none',
        gradient: editingPreset.gradient || false,
        overlay: editingPreset.overlay || 0,
        footerEnabled: editingPreset.footerEnabled || false,
        footerStyle: editingPreset.footerStyle || 'Simple',
        footerHeight: editingPreset.footerHeight || '40px',
        footerColor: editingPreset.footerColor || '#F8FAFC',
        headerColor: editingPreset.headerColor || '#2563EB',
        headerColorEnd: editingPreset.headerColorEnd || '#3B82F6',
        gradientDirection: editingPreset.gradientDirection || 'Vertical',
        headerPattern: editingPreset.headerPattern || 'None',
        headerThemeMode: editingPreset.headerThemeMode || 'Solid',
        allowDrag: editingPreset.allowDrag !== undefined ? editingPreset.allowDrag : true,
        allowZoom: editingPreset.allowZoom !== undefined ? editingPreset.allowZoom : true,
        defaultZoom: editingPreset.defaultZoom !== undefined ? editingPreset.defaultZoom : 100,
        defaultPositionX: editingPreset.defaultPositionX !== undefined ? editingPreset.defaultPositionX : 0,
        defaultPositionY: editingPreset.defaultPositionY !== undefined ? editingPreset.defaultPositionY : 0,
      };
      setForm(formState);
      setHistory([]);
      setFuture([]);
    } else {
      const draft = localStorage.getItem('identiqal_display_preset_draft');
      if (draft) {
        try {
          setForm(JSON.parse(draft));
        } catch (e) {
          setForm(defaultForm);
        }
      } else {
        setForm(defaultForm);
      }
      setHistory([]);
      setFuture([]);
    }
  }, [editingPreset, isOpen]);

  // Auto-Save Draft
  useEffect(() => {
    if (isOpen && form.name && !editingPreset?._id) {
      const timer = setTimeout(() => {
        localStorage.setItem('identiqal_display_preset_draft', JSON.stringify(form));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [form, isOpen, editingPreset]);

  const handleChange = (field, value) => {
    setHistory(prev => [...prev.slice(-30), form]);
    setFuture([]);
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(prevHist => prevHist.slice(0, -1));
    setFuture(prevFut => [form, ...prevFut]);
    setForm(prev);
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture(prevFut => prevFut.slice(1));
    setHistory(prevHist => [...prevHist, form]);
    setForm(next);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all modifications to default?')) {
      handleChange('borderRadius', defaultForm.borderRadius);
      setForm(defaultForm);
      setHistory([]);
      setFuture([]);
    }
  };

  const handleSave = async (forceStatus = null) => {
    if (!form.name) return toast.error('Preset Name is required');
    const finalForm = {
      ...form,
      status: forceStatus || form.status
    };

    setSaving(true);
    try {
      if (editingPreset?._id) {
        await axiosInstance.put(`/presets/display/${editingPreset._id}`, finalForm);
        toast.success('Preset updated successfully');
      } else {
        await axiosInstance.post('/presets/display', finalForm);
        toast.success('Preset created successfully');
        localStorage.removeItem('identiqal_display_preset_draft');
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

  // Preset constants
  const HEADER_SHAPES = [
    { name: 'Wave', value: 'Curved Wave', desc: 'Wave boundary', bg: 'linear-gradient(135deg, #2563EB, #1D4ED8)' },
    { name: 'Flat', value: 'Solid Color', desc: 'Minimal clean line', bg: '#2563EB' },
    { name: 'Diagonal', value: 'Diagonal Split', desc: 'Modern slash cut', bg: 'linear-gradient(135deg, #4F46E5, #3B82F6)' },
    { name: 'Blend', value: 'Blend', desc: 'Gradient background fade', bg: 'linear-gradient(to bottom, #7C3AED, transparent)' },
    { name: 'Glass', value: 'Glass', desc: 'Translucent panel', bg: 'rgba(255,255,255,0.2)' },
    { name: 'Aurora', value: 'Aurora', desc: 'Northern lights blend', bg: 'radial-gradient(circle at 10% 20%, #38BDF8 0%, transparent 50%), radial-gradient(circle at 90% 30%, #7C3AED 0%, transparent 60%), linear-gradient(135deg, #2563EB, #4F46E5)' },
    { name: 'Luxury', value: 'Luxury', desc: 'Premium gold stripe', bg: 'linear-gradient(135deg, #1A1A1A, #2A2520, #1A1A1A)' },
    { name: 'Minimal', value: 'Minimal', desc: 'No header space', bg: '#E2E8F0' },
    { name: 'Creative', value: 'Organic Blob', desc: 'Abstract blob curve', bg: 'linear-gradient(135deg, #EC4899, #8B5CF6)' },
    { name: 'Executive', value: 'Solid Color', layout: 'Left', desc: 'Left branding style', bg: '#0F172A' },
  ];

  const PROFILE_POSITIONS = [
    { name: 'Top Center', value: 'Center', desc: 'Centered below header' },
    { name: 'Overlapping Header', value: 'Overlapping Header', desc: 'Overlays the cut' },
    { name: 'Floating', value: 'Floating', desc: 'Floating panel overlay' },
    { name: 'Hidden', value: 'Hidden', desc: 'No photo display' },
  ];

  const PROFILE_SHAPES = [
    { name: 'Circle', value: 'Circle' },
    { name: 'Rounded Square', value: 'Rounded Square' },
    { name: 'Square', value: 'Square' },
  ];

  const FOOTER_STYLES = [
    { name: 'Solid', value: 'Simple' },
    { name: 'Glass', value: 'Glass' },
    { name: 'Gradient', value: 'Gradient' },
    { name: 'Thin Strip', value: 'Thin Strip' },
  ];

  const HEIGHTS = ['Small', 'Medium', 'Tall'];

  const heightVal = form.headerHeight === '160px' ? 'Small' : form.headerHeight === '280px' ? 'Tall' : 'Medium';
  const handleHeightChange = (val) => {
    const heightMap = { 'Small': '160px', 'Medium': '220px', 'Tall': '280px' };
    handleChange('headerHeight', heightMap[val]);
  };

  // Mockup dynamic variables
  let headerHeightPx = 66;
  if (form.headerHeight === '160px') headerHeightPx = 54;
  if (form.headerHeight === '280px') headerHeightPx = 90;
  if (form.headerStyle === 'Minimal') headerHeightPx = 12;

  let headerBgStyle = form.headerColor || '#2563EB';
  if (form.headerStyle === 'Aurora') {
    headerBgStyle = 'radial-gradient(circle at 10% 20%, rgba(56, 189, 248, 0.85) 0%, transparent 55%), radial-gradient(circle at 90% 30%, rgba(124, 58, 237, 0.85) 0%, transparent 60%), radial-gradient(circle at 50% 80%, rgba(79, 70, 229, 0.95) 0%, transparent 70%), linear-gradient(135deg, #2563EB, #4F46E5)';
  } else if (form.headerStyle === 'Luxury') {
    headerBgStyle = 'linear-gradient(135deg, #1A1A1A, #2D251E, #1A1A1A)';
  } else if (form.headerStyle === 'Glass') {
    headerBgStyle = 'rgba(255,255,255,0.12)';
  } else if (form.headerThemeMode === 'Gradient') {
    const dir = form.gradientDirection === 'Horizontal' ? 'to right' : form.gradientDirection === 'Diagonal' ? '135deg' : 'to bottom';
    headerBgStyle = `linear-gradient(${dir}, ${form.headerColor}, ${form.headerColorEnd})`;
  } else if (form.headerThemeMode === 'Glass') {
    headerBgStyle = 'rgba(255,255,255,0.12)';
  }

  return (
    <div className="fixed inset-0 w-screen h-screen z-50 bg-[#FBFBFA] dark:bg-[#0D0B0D] flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Left side: Visual Step Builder */}
      <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-slate-200 dark:border-white/5 bg-white dark:bg-[#121013]">
        {/* Step Progress & Controls Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.01]">
          <div className="flex items-center space-x-3">
            <LayoutTemplate className="text-blue-500" size={20} />
            <h2 className="text-base font-bold text-slate-800 dark:text-white">
              {editingPreset ? `Edit Preset: ${form.name}` : 'Display Preset Builder'}
            </h2>
          </div>

          {/* Quick Actions (Undo, Redo, Reset) */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleUndo}
              disabled={history.length === 0}
              title="Undo"
              className="p-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <Undo size={14} />
            </button>
            <button
              onClick={handleRedo}
              disabled={future.length === 0}
              title="Redo"
              className="p-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <Redo size={14} />
            </button>
            <button
              onClick={handleReset}
              title="Reset defaults"
              className="p-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <RotateCcw size={14} />
            </button>
            <div className="h-6 w-px bg-slate-200 dark:bg-white/10 mx-1" />
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Wizard Steps Header */}
        <div className="px-6 py-3 border-b border-slate-100 dark:border-white/5 bg-slate-50/20 dark:bg-black/10 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map(s => (
              <button
                key={s}
                onClick={() => setStep(s)}
                className={`flex items-center space-x-2 pb-1.5 transition-all text-xs font-bold border-b-2 cursor-pointer ${
                  step === s
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600'
                }`}
              >
                <span>Step {s}</span>
                <span className="hidden sm:inline">
                  {s === 1 && '— Basic Info'}
                  {s === 2 && '— Header Design'}
                  {s === 3 && '— Profile & Footer'}
                  {s === 4 && '— Summary'}
                </span>
              </button>
            ))}
          </div>
          <span className="text-[10px] bg-slate-100 dark:bg-white/5 text-slate-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
            Step {step} of 4
          </span>
        </div>

        {/* Builder Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="max-w-xl mx-auto space-y-6 py-4"
              >
                <div>
                  <h3 className="text-lg font-black text-slate-800 dark:text-white">General Information</h3>
                  <p className="text-xs text-slate-400 mt-1">Set the basic profile and publishing descriptors for your preset.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Preset Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => handleChange('name', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      placeholder="eg. Executive Pro"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category</label>
                      <select
                        value={form.category}
                        onChange={e => handleChange('category', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-slate-100"
                      >
                        {CATEGORIES.map(c => <option key={c} value={c} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">{c}</option>)}
                      </select>
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Status</label>
                      <select
                        value={form.status}
                        onChange={e => handleChange('status', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-slate-100"
                      >
                        <option value="draft" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Draft</option>
                        <option value="published" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Published</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-6 py-2"
              >
                <div className="max-w-3xl mx-auto">
                  <h3 className="text-base font-black text-slate-800 dark:text-white mb-1">Header Style</h3>
                  <p className="text-xs text-slate-400 mb-4">Click a layout thumbnail to immediately update the card header shape.</p>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {HEADER_SHAPES.map(shape => {
                      const isSelected = form.headerStyle === shape.value && 
                        (shape.name !== 'Executive' || form.profilePhotoPosition === 'Left') &&
                        (shape.name !== 'Minimal' || form.headerStyle === 'Minimal');
                      return (
                        <button
                          key={shape.name}
                          onClick={() => {
                            handleChange('headerStyle', shape.value);
                            if (shape.name === 'Executive') {
                              handleChange('profilePhotoPosition', 'Left');
                              handleChange('borderRadius', '12px');
                              handleChange('buttonStyle', 'Rectangular');
                            } else if (shape.name === 'Minimal') {
                              handleChange('profilePhotoPosition', 'Left');
                              handleChange('borderRadius', '0px');
                            }
                          }}
                          className={`p-2.5 rounded-2xl border text-left transition-all duration-300 relative group cursor-pointer ${
                            isSelected
                              ? 'border-blue-500 bg-blue-500/[0.03] dark:bg-blue-500/[0.05] ring-2 ring-blue-500/20 shadow-sm'
                              : 'border-slate-200 dark:border-white/10 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.02]'
                          }`}
                        >
                          <div 
                            className="w-full h-11 rounded-xl mb-1.5 overflow-hidden relative border border-slate-100/50 dark:border-white/5 shadow-inner"
                            style={{ background: shape.bg }}
                          >
                            {shape.name === 'Glass' && (
                              <div className="absolute inset-0 bg-gradient-to-tr from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 -z-10" />
                            )}
                          </div>
                          <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block truncate">{shape.name}</span>
                          <span className="text-[8px] text-slate-400 block mt-0.5 truncate">{shape.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto border-t border-slate-100 dark:border-white/5 pt-6">
                  {/* Left sub-column: Height and Corners */}
                  <div className="space-y-5">
                    {/* Header Height */}
                    {form.headerStyle !== 'Minimal' && (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
                          <span>Header Height</span>
                          <span className="text-[10px] text-blue-500">{heightVal}</span>
                        </label>
                        <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                          {HEIGHTS.map(h => (
                            <button
                              key={h}
                              onClick={() => handleHeightChange(h)}
                              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                                heightVal === h
                                  ? 'bg-white dark:bg-white/10 text-slate-800 dark:text-white shadow-sm'
                                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                              }`}
                            >
                              {h}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Border Radius */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
                        <span>Card Corner Radius</span>
                        <span className="text-[10px] text-blue-500">
                          {form.borderRadius === '0px' && 'Sharp'}
                          {form.borderRadius === '12px' && 'Rounded'}
                          {form.borderRadius === '24px' && 'Extra Rounded'}
                          {form.borderRadius === '36px' && 'Pill'}
                        </span>
                      </label>
                      <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                        {[['0px', 'Sharp'], ['12px', 'Rounded'], ['24px', 'Extra'], ['36px', 'Pill']].map(([radius, label]) => (
                          <button
                            key={radius}
                            onClick={() => handleChange('borderRadius', radius)}
                            className={`flex-1 py-1.5 text-[10px] font-semibold rounded-lg transition-all cursor-pointer ${
                              form.borderRadius === radius
                                ? 'bg-white dark:bg-white/10 text-slate-800 dark:text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Shadow & Pattern */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Preset Shadow</label>
                        <select
                          value={form.shadow}
                          onChange={e => handleChange('shadow', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-slate-800 dark:text-slate-100"
                        >
                          <option value="none" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">None</option>
                          <option value="soft" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Soft Shadow</option>
                          <option value="heavy" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Heavy Shadow</option>
                        </select>
                      </div>

                      <div className="flex flex-col space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Texture Pattern</label>
                        <select
                          value={form.headerPattern}
                          onChange={e => handleChange('headerPattern', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-slate-800 dark:text-slate-100"
                        >
                          <option value="None" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">None</option>
                          <option value="Dots" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Noise/Dots</option>
                          <option value="Mesh" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Fine Mesh</option>
                          <option value="Grid" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Structural Grid</option>
                          <option value="Noise" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Authentic Grain</option>
                        </select>
                      </div>
                    </div>

                    {/* Repositionable Banner Options */}
                    <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-4">
                      <span className="text-xs font-black text-slate-800 dark:text-white block">Banner repositioning behavior</span>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-black/10 rounded-xl border border-slate-100 dark:border-white/5">
                          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-350">Allow Drag</span>
                          <input
                            type="checkbox"
                            checked={form.allowDrag !== false}
                            onChange={e => handleChange('allowDrag', e.target.checked)}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-black/10 rounded-xl border border-slate-100 dark:border-white/5">
                          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-350">Allow Zoom</span>
                          <input
                            type="checkbox"
                            checked={form.allowZoom !== false}
                            onChange={e => handleChange('allowZoom', e.target.checked)}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Default alignment coordinates */}
                      <div className="space-y-3 p-3 bg-slate-50 dark:bg-black/10 rounded-xl border border-slate-100 dark:border-white/5">
                        <span className="text-[10px] font-extrabold tracking-wider text-slate-500 block uppercase">Default layout configuration</span>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-[10px]">
                            <label className="font-semibold text-slate-650 dark:text-slate-350">Default Zoom</label>
                            <span className="font-mono text-slate-500">{form.defaultZoom || 100}%</span>
                          </div>
                          <input
                            type="range"
                            min="80"
                            max="200"
                            step="5"
                            value={form.defaultZoom || 100}
                            onChange={e => handleChange('defaultZoom', parseInt(e.target.value))}
                            className="w-full accent-blue-500 h-1 bg-slate-200 dark:bg-white/5 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                              <label className="font-semibold text-slate-650 dark:text-slate-350">Offset X</label>
                              <span className="font-mono text-slate-500">{form.defaultPositionX || 0}px</span>
                            </div>
                            <input
                              type="range"
                              min="-100"
                              max="100"
                              value={form.defaultPositionX || 0}
                              onChange={e => handleChange('defaultPositionX', parseInt(e.target.value))}
                              className="w-full accent-blue-500 h-1 bg-slate-200 dark:bg-white/5 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                              <label className="font-semibold text-slate-650 dark:text-slate-350">Offset Y</label>
                              <span className="font-mono text-slate-500">{form.defaultPositionY || 0}px</span>
                            </div>
                            <input
                              type="range"
                              min="-100"
                              max="100"
                              value={form.defaultPositionY || 0}
                              onChange={e => handleChange('defaultPositionY', parseInt(e.target.value))}
                              className="w-full accent-blue-500 h-1 bg-slate-200 dark:bg-white/5 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right sub-column: Color Pickers */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Header Color Mode</label>
                      <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                        {['Solid', 'Gradient', 'Glass', 'Automatic'].map(mode => (
                          <button
                            key={mode}
                            onClick={() => handleChange('headerThemeMode', mode)}
                            className={`flex-1 py-1.5 text-[10px] font-semibold rounded-lg transition-all cursor-pointer ${
                              form.headerThemeMode === mode
                                ? 'bg-white dark:bg-white/10 text-slate-800 dark:text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    </div>

                    {form.headerThemeMode === 'Solid' && (
                      <div className="p-4 bg-slate-50 dark:bg-black/10 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Solid Color</span>
                          <p className="text-[10px] text-slate-400">Header primary fill</p>
                        </div>
                        <input
                          type="color"
                          value={form.headerColor}
                          onChange={e => handleChange('headerColor', e.target.value)}
                          className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 dark:border-white/10"
                        />
                      </div>
                    )}

                    {form.headerThemeMode === 'Gradient' && (
                      <div className="p-4 bg-slate-50 dark:bg-black/10 rounded-2xl border border-slate-100 dark:border-white/5 space-y-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 space-y-1">
                            <span className="text-[10px] font-bold text-slate-500 block uppercase">Start color</span>
                            <div className="flex items-center space-x-2">
                              <input
                                type="color"
                                value={form.headerColor}
                                onChange={e => handleChange('headerColor', e.target.value)}
                                className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200"
                              />
                              <span className="text-xs font-mono">{form.headerColor}</span>
                            </div>
                          </div>
                          <div className="flex-1 space-y-1">
                            <span className="text-[10px] font-bold text-slate-500 block uppercase">End color</span>
                            <div className="flex items-center space-x-2">
                              <input
                                type="color"
                                value={form.headerColorEnd}
                                onChange={e => handleChange('headerColorEnd', e.target.value)}
                                className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200"
                              />
                              <span className="text-xs font-mono">{form.headerColorEnd}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Gradient Direction</label>
                          <div className="flex bg-slate-200/50 dark:bg-black/20 p-0.5 rounded-lg">
                            {['Vertical', 'Horizontal', 'Diagonal'].map(dir => (
                              <button
                                key={dir}
                                onClick={() => handleChange('gradientDirection', dir)}
                                className={`flex-1 py-1 text-[10px] font-bold rounded transition-all cursor-pointer ${
                                  form.gradientDirection === dir
                                    ? 'bg-white dark:bg-white/10 text-slate-800 dark:text-white shadow-xs'
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                              >
                                {dir}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {form.headerThemeMode === 'Glass' && (
                      <div className="p-4 bg-slate-50 dark:bg-black/10 rounded-2xl border border-slate-100 dark:border-white/5 space-y-2.5">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Glass Transparency</span>
                        <div className="flex items-center space-x-4">
                          <input
                            type="range"
                            min="0"
                            max="80"
                            value={form.overlay}
                            onChange={e => handleChange('overlay', parseInt(e.target.value))}
                            className="flex-1 accent-blue-500"
                          />
                          <span className="text-xs font-mono">{form.overlay}% blur</span>
                        </div>
                      </div>
                    )}

                    {form.headerThemeMode === 'Automatic' && (
                      <div className="p-4 bg-blue-500/[0.02] border border-blue-500/10 rounded-2xl flex items-start space-x-3">
                        <Sparkles className="text-blue-500 shrink-0 mt-0.5" size={15} />
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-blue-500">Auto Theme Mode</span>
                          <p className="text-[10px] text-slate-400 leading-relaxed">
                            This preset will bypass static preset colors and adapt directly to the card creator's active theme configuration.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto py-2"
              >
                {/* Profile Controls */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-black text-slate-800 dark:text-white">Profile Photo</h3>
                    <p className="text-xs text-slate-400 mt-1">Set the alignment positioning and crop styles for cards.</p>
                  </div>

                  <div className="space-y-4">
                    {/* Position */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Photo Position</label>
                      <div className="grid grid-cols-2 gap-2">
                        {PROFILE_POSITIONS.map(pos => {
                          const isSelected = form.profilePhotoPosition === pos.value;
                          return (
                            <button
                              key={pos.name}
                              onClick={() => handleChange('profilePhotoPosition', pos.value)}
                              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-500/[0.03] dark:bg-blue-500/[0.05] ring-1 ring-blue-500/20'
                                  : 'border-slate-200 dark:border-white/10 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.02]'
                              }`}
                            >
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{pos.name}</span>
                              <span className="text-[9px] text-slate-400 block mt-0.5 leading-tight">{pos.desc}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Shape */}
                    {form.profilePhotoPosition !== 'Hidden' && (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Photo Shape</label>
                        <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                          {PROFILE_SHAPES.map(shape => (
                            <button
                              key={shape.name}
                              onClick={() => handleChange('profilePhotoStyle', shape.value)}
                              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                                form.profilePhotoStyle === shape.value
                                  ? 'bg-white dark:bg-white/10 text-slate-800 dark:text-white shadow-sm'
                                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                              }`}
                            >
                              {shape.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="space-y-6 md:border-l md:border-slate-100 dark:md:border-white/5 md:pl-8">
                  <div>
                    <h3 className="text-base font-black text-slate-800 dark:text-white">Footer Stripe</h3>
                    <p className="text-xs text-slate-400 mt-1">Configure bottom badge alignment overlays.</p>
                  </div>

                  <div className="space-y-5">
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-black/10 rounded-2xl border border-slate-100 dark:border-white/5">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Enable Footer Stripe</span>
                        <p className="text-[10px] text-slate-400">Display copyright/branding badge</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={form.footerEnabled}
                        onChange={e => handleChange('footerEnabled', e.target.checked)}
                        className="w-4.5 h-4.5 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                      />
                    </div>

                    {form.footerEnabled && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Footer Style</label>
                          <div className="grid grid-cols-2 gap-2">
                            {FOOTER_STYLES.map(style => {
                              const isSelected = form.footerStyle === style.value;
                              return (
                                <button
                                  key={style.name}
                                  onClick={() => handleChange('footerStyle', style.value)}
                                  className={`py-2 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                                    isSelected
                                      ? 'border-blue-500 bg-blue-500/[0.03] dark:bg-blue-500/[0.05]'
                                      : 'border-slate-200 dark:border-white/10 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.02]'
                                  }`}
                                >
                                  {style.name}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Footer Height</label>
                            <input
                              type="range"
                              min="30"
                              max="80"
                              value={parseInt(form.footerHeight) || 40}
                              onChange={e => handleChange('footerHeight', `${e.target.value}px`)}
                              className="w-full accent-blue-500 mt-1"
                            />
                            <span className="text-[10px] text-slate-400 font-mono block mt-1">{form.footerHeight}</span>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase block">Footer Color</label>
                            <div className="flex items-center space-x-2 mt-1">
                              <input
                                type="color"
                                value={form.footerColor || '#F8FAFC'}
                                onChange={e => handleChange('footerColor', e.target.value)}
                                className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200"
                              />
                              <span className="text-[10px] font-mono text-slate-500">{form.footerColor || '#F8FAFC'}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="max-w-md mx-auto py-6 space-y-6 text-center"
              >
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/40 text-blue-500 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <Check size={28} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-black text-slate-800 dark:text-white">Preset is ready!</h3>
                  <p className="text-xs text-slate-400">Review layout metadata before publishing to all workspace users.</p>
                </div>

                <div className="bg-slate-50 dark:bg-black/25 rounded-2xl p-5 border border-slate-100 dark:border-white/5 space-y-3.5 text-left text-xs">
                  <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                    <span className="text-slate-400 font-bold">Preset Name</span>
                    <span className="font-extrabold text-slate-800 dark:text-white">{form.name || 'Untitled'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                    <span className="text-slate-400 font-bold">Category</span>
                    <span className="font-bold text-slate-600 dark:text-slate-300">{form.category}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                    <span className="text-slate-400 font-bold">Header Shape</span>
                    <span className="font-bold text-slate-600 dark:text-slate-300 capitalize">{form.headerStyle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold">Publishing Status</span>
                    <span className={`px-2 py-0.5 rounded font-black text-[9px] uppercase tracking-wider ${
                      form.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {form.status}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => handleSave('draft')}
                    disabled={saving}
                    className="flex-1 py-3 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Save as Draft
                  </button>
                  <button
                    onClick={() => handleSave('published')}
                    disabled={saving}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/10 cursor-pointer flex items-center justify-center space-x-2"
                  >
                    {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                    <span>Publish Preset</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Actions Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01] flex justify-between items-center shrink-0">
          <button
            onClick={() => setStep(prev => Math.max(1, prev - 1))}
            disabled={step === 1}
            className="flex items-center space-x-1.5 px-4 py-2 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-white rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          >
            <ArrowLeft size={13} />
            <span>Back</span>
          </button>

          {step < 4 ? (
            <button
              onClick={() => {
                if (step === 1 && !form.name) return toast.error('Preset Name is required');
                setStep(prev => Math.min(4, prev + 1));
              }}
              className="flex items-center space-x-1.5 px-5 py-2 bg-slate-900 hover:bg-black dark:bg-white dark:text-black dark:hover:bg-slate-100 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight size={13} />
            </button>
          ) : (
            <button
              onClick={() => handleSave()}
              disabled={saving}
              className="flex items-center space-x-1.5 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/15 cursor-pointer"
            >
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={13} />}
              <span>Save Preset</span>
            </button>
          )}
        </div>
      </div>

      {/* Right side: Persistent Live Mockup Card Preview */}
      <div className="hidden md:flex md:w-[360px] bg-slate-50 dark:bg-black/40 border-l border-slate-200 dark:border-white/5 flex-col items-center justify-center p-6 relative overflow-hidden shrink-0">
        <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 absolute top-6 left-6 uppercase tracking-widest">
          Live Mockup Preview
        </div>

        {/* Phone Card Mockup */}
        <div 
          className="w-[250px] h-[390px] bg-white dark:bg-[#151316] border border-slate-200/60 dark:border-white/10 shadow-xl overflow-hidden flex flex-col transition-all duration-300 relative"
          style={{
            borderRadius: form.borderRadius || '24px',
            boxShadow: form.shadow === 'soft' ? '0 12px 30px rgba(0,0,0,0.06)' : form.shadow === 'heavy' ? '0 24px 50px rgba(0,0,0,0.15)' : 'none',
          }}
        >
          {/* Header Design Preview */}
          <div className="w-full relative shrink-0 overflow-hidden" style={{ height: `${headerHeightPx}px`, background: headerBgStyle }}>
            {/* Wave shape mockup inside card header */}
            {form.headerStyle === 'Curved Wave' && (
              <svg className="absolute bottom-0 w-full text-white dark:text-[#151316] fill-current" viewBox="0 0 1440 120" preserveAspectRatio="none">
                <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
              </svg>
            )}
            {form.headerStyle === 'Diagonal Split' && (
              <svg className="absolute bottom-0 w-full text-white dark:text-[#151316] fill-current" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polygon points="0,100 100,0 100,100"></polygon>
              </svg>
            )}
            {form.headerStyle === 'Organic Blob' && (
              <svg className="absolute bottom-0 w-full text-white dark:text-[#151316] fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C50,22,150,75,321.39,56.44Z"></path>
              </svg>
            )}
            {form.headerStyle === 'Luxury' && (
              <div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-gradient-to-r from-[#D4A45B] via-[#F4E0A5] to-[#D4A45B]" />
            )}
            {form.headerStyle === 'Aurora' && (
              <div className="absolute bottom-0 left-0 w-full h-[18px] bg-gradient-to-b from-transparent to-white dark:to-[#151316]" />
            )}
            {form.headerStyle === 'Blend' && (
              <div className="absolute bottom-0 left-0 w-full h-[22px] bg-gradient-to-b from-transparent to-white dark:to-[#151316]" />
            )}
          </div>

          {/* Profile Photo Crop Layout */}
          {form.profilePhotoPosition !== 'Hidden' && (
            <div className={`flex relative z-10 px-4 ${
              form.profilePhotoPosition === 'Left' ? 'justify-start -mt-6' : 'justify-center -mt-8'
            }`}>
              <div 
                className="w-14 h-14 bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 flex items-center justify-center text-[9px] text-slate-400 font-bold shadow-xs shrink-0"
                style={{
                  borderRadius: form.profilePhotoStyle === 'Circle' ? '50%' : form.profilePhotoStyle === 'Rounded Square' ? '20%' : '0px'
                }}
              >
                Avatar
              </div>
            </div>
          )}

          {/* Card Body Profile mock elements */}
          <div className={`p-4 flex-1 flex flex-col space-y-3 ${
            form.profilePhotoPosition === 'Left' ? 'items-start text-left' : 'items-center text-center'
          }`}>
            <div className="w-20 h-3 bg-slate-200 dark:bg-white/10 rounded" />
            <div className="w-28 h-2 bg-slate-100 dark:bg-white/5 rounded" />
            
            {/* mock links */}
            <div className="w-full space-y-1.5 pt-3">
              <div className="w-full h-8 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 flex items-center px-3 justify-between">
                <div className="w-16 h-2 bg-slate-200 dark:bg-white/10 rounded" />
                <span className="text-[10px] text-slate-300">→</span>
              </div>
              <div className="w-full h-8 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 flex items-center px-3 justify-between">
                <div className="w-20 h-2 bg-slate-200 dark:bg-white/10 rounded" />
                <span className="text-[10px] text-slate-300">→</span>
              </div>
            </div>
          </div>

          {/* Footer Preview Stripe */}
          {form.footerEnabled && (
            <div 
              className={`w-full text-center text-[8px] font-bold border-t border-slate-100 dark:border-white/5 tracking-wide flex items-center justify-center shrink-0 ${
                form.footerStyle === 'Glass' ? 'backdrop-blur-md bg-white/10 dark:bg-black/10 text-slate-400' :
                form.footerStyle === 'Gradient' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm' :
                form.footerStyle === 'Thin Strip' ? 'bg-slate-900 text-white/80 py-1' :
                'bg-slate-50 dark:bg-black/20 text-slate-400'
              }`}
              style={{
                height: form.footerHeight || '36px',
                backgroundColor: form.footerStyle === 'Simple' && form.footerColor ? form.footerColor : undefined,
                color: form.footerStyle === 'Gradient' ? '#ffffff' : undefined
              }}
            >
              <span>{form.footerStyle || 'Simple'} Footer Badge</span>
            </div>
          )}
        </div>
      </div>
    </div>
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
            <LayoutTemplate className="text-[#2563EB]" /> Display Presets
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage global display layout definitions for cards.</p>
        </div>
        <button
          onClick={() => { setEditingPreset(null); setDrawerOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg font-medium transition-colors shadow-sm cursor-pointer"
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
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-black/10 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          />
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-black/20 p-1 rounded-xl shrink-0 w-full md:w-auto">
          {['all', 'published', 'draft'].map(filter => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`flex-1 md:flex-none px-4 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                statusFilter === filter
                  ? 'bg-white dark:bg-[#2563EB] text-gray-900 dark:text-white shadow-sm'
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
          <div className="w-8 h-8 border-4 border-[#2563EB]/30 border-t-[#2563EB] rounded-full animate-spin" />
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
                <HeaderPresetThumbnail preset={preset} activeTheme={{ primary: '#2563EB', accent: '#3B82F6' }} />
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
