'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone,
  Globe,
  Eye,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  X,
  Share2,
  QrCode,
  Contact,
  Maximize2,
  ExternalLink,
} from 'lucide-react';
import HeaderPicker from '@/components/studio/HeaderPicker';
import ThemePicker from '@/components/studio/ThemePicker';
import ImageUploadPanel from '@/components/studio/ImageUploadPanel';
import ImageStylingPanel from '@/components/studio/ImageStylingPanel';
import FooterPicker from '@/components/studio/FooterPicker';
import TemplateSummary from '@/components/studio/TemplateSummary';
import { useCardBuilderStore } from '@/store/cardBuilderStore';
import { SectionRenderer } from '@/components/builder/SectionRenderer';
import { toast } from '@/components/ui/Toast';

/* ─── Wizard steps ────────────────────────────────────────────── */
const steps = [
  { id: 'header',  label: 'Header Layout',  desc: 'Structure & curves' },
  { id: 'theme',   label: 'Color Themes',   desc: 'Palettes & moods' },
  { id: 'image',   label: 'Upload Image',   desc: 'Avatar asset library' },
  { id: 'styling', label: 'Image Styling',  desc: 'Filters & shapes' },
  { id: 'footer',  label: 'Footer Preset',  desc: 'Disclaimers & height' },
  { id: 'summary', label: 'Save Template',  desc: 'Finalize composition' },
];

/* ─── Preview mode definitions ────────────────────────────────── */
const PREVIEW_MODES = [
  { id: 'card',   label: 'Card Preview', icon: Smartphone },
  { id: 'public', label: 'Public Page',  icon: Globe },
  { id: 'live',   label: 'Live',         icon: Eye },
];

/* ─── Shared section props builder ───────────────────────────── */
function buildSectionProps(sec, store) {
  return {
    ...sec,
    imageUrl:         store.imageUrl,
    imageScale:       store.imageScale,
    imagePositionX:   store.imagePositionX,
    imagePositionY:   store.imagePositionY,
    imageOpacity:     store.imageOpacity,
    overlayType:      store.overlayType,
    imageRotation:    store.imageRotation,
    imagePlacement:   store.imagePlacement,
    containerStyle:   store.containerStyle,
    containerSize:    store.containerSize,
    containerBorder:  store.containerBorder,
    containerShadow:  store.containerShadow,
    containerPadding: store.containerPadding,
    imageFit:         store.imageFit,
    imageBlur:        store.imageBlur,
    imageBrightness:  store.imageBrightness,
    imageContrast:    store.imageContrast,
    imageSaturation:  store.imageSaturation,
  };
}

function buildTheme(colorTheme) {
  return {
    colors: {
      primary:    colorTheme?.primary    || '#2563EB',
      text:       colorTheme?.text       || '#1A1A1A',
      background: colorTheme?.background || '#ffffff',
      accent:     colorTheme?.accent     || '#2563EB',
    },
    font: { heading: 'Inter', body: 'Inter' },
  };
}

/* ─── Scrollable card content shared renderer ─────────────────── */
function CardContent({ activeSections, store, colorTheme, footerPreset, interactive = false }) {
  const theme = buildTheme(colorTheme);
  return (
    <>
      {activeSections.map((sec) => (
        <SectionRenderer
          key={sec.sectionId}
          section={buildSectionProps(sec, store)}
          theme={theme}
          displayPreset={store.displayPreset}
          colorTheme={colorTheme}
          previewMode={!interactive}
        />
      ))}
      {footerPreset && (
        <div
          className="py-4 text-center border-t text-[10px]"
          style={{
            color:       colorTheme?.text   || '#1a1a1a',
            background:  footerPreset.background || 'transparent',
            borderColor: colorTheme?.border || 'rgba(0,0,0,0.06)',
          }}
        >
          {footerPreset.copyrightText || footerPreset.contentTemplate || 'Powered by Identiqal'}
        </div>
      )}
    </>
  );
}

/* ─── Phone shell wrapper ─────────────────────────────────────── */
function PhoneShell({ colorTheme, children }) {
  return (
    <div className="w-[305px] h-[560px] rounded-[38px] border-[7px] border-zinc-800 dark:border-zinc-700 bg-white shadow-[0_32px_80px_rgba(0,0,0,0.55)] relative overflow-hidden flex flex-col shrink-0 select-none">
      {/* Notch */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-zinc-800 rounded-full z-30 flex items-center justify-center gap-1.5">
        <span className="w-1.5 h-1.5 bg-zinc-900 rounded-full" />
        <span className="w-7 h-1 bg-zinc-900 rounded-full" />
      </div>
      {/* Scrollable content */}
      <div
        className="flex-1 overflow-y-auto scrollbar-none pt-6 relative"
        style={{
          backgroundColor: colorTheme?.background || '#ffffff',
          color:           colorTheme?.text        || '#1A1A1A',
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ─── Card Preview mode ───────────────────────────────────────── */
function CardPreview({ activeSections, store, colorTheme, footerPreset }) {
  return (
    <PhoneShell colorTheme={colorTheme}>
      <CardContent
        activeSections={activeSections}
        store={store}
        colorTheme={colorTheme}
        footerPreset={footerPreset}
      />
    </PhoneShell>
  );
}

/* ─── Public Page mode ────────────────────────────────────────── */
function PublicPagePreview({ activeSections, store, colorTheme, footerPreset, mockUser }) {
  return (
    <div className="w-full max-w-[680px] h-[500px] rounded-2xl border border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl relative overflow-hidden flex flex-col shrink-0 select-none">
      {/* Browser chrome */}
      <div className="h-9 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 gap-2 shrink-0 z-20">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
        <div className="flex-1 max-w-[260px] mx-auto h-5 bg-zinc-800 rounded-md flex items-center justify-center gap-1.5 px-2">
          <Globe size={8} className="text-zinc-500" />
          <span className="text-[9px] text-zinc-500 font-mono truncate">
            identiqal.com/{mockUser}
          </span>
        </div>
        <ExternalLink size={10} className="text-zinc-600 ml-auto" />
      </div>

      {/* Page body */}
      <div
        className="flex-1 overflow-y-auto scrollbar-none relative"
        style={{ backgroundColor: colorTheme?.background || '#f1f5f9' }}
      >
        {/* Subtle page background texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${colorTheme?.primary || '#2563EB'}12, transparent)`,
          }}
        />

        <div className="relative z-10 flex flex-col items-center px-6 py-8 gap-5">
          {/* Card container — simulates the real public page wrapper */}
          <div
            className="w-full max-w-[360px] rounded-[24px] border shadow-[0_16px_48px_-8px_rgba(0,0,0,0.12)] overflow-hidden"
            style={{
              backgroundColor: colorTheme?.background || '#ffffff',
              borderColor: 'rgba(0,0,0,0.06)',
            }}
          >
            <CardContent
              activeSections={activeSections}
              store={store}
              colorTheme={colorTheme}
              footerPreset={footerPreset}
            />
          </div>

          {/* Public action buttons row */}
          <div className="flex items-center gap-3">
            {[
              { icon: Share2,  label: 'Share',   color: '#2563EB' },
              { icon: QrCode,  label: 'QR Code', color: '#7c3aed' },
              { icon: Contact, label: 'Contact', color: '#059669' },
            ].map(({ icon: Icon, label, color }) => (
              <button
                key={label}
                type="button"
                className="flex flex-col items-center gap-1.5 px-4 py-2.5 rounded-2xl border bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                style={{ borderColor: `${color}25` }}
              >
                <Icon size={14} style={{ color }} />
                <span className="text-[9px] font-bold text-zinc-500">{label}</span>
              </button>
            ))}
          </div>

          {/* Powered-by footer */}
          <p className="text-[9px] font-semibold uppercase tracking-widest opacity-40 mt-1"
            style={{ color: colorTheme?.text || '#64748b' }}
          >
            Powered by Identiqal
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Live Preview overlay ────────────────────────────────────── */
function LivePreviewOverlay({ activeSections, store, colorTheme, footerPreset, onClose }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: colorTheme?.background || '#090d16' }}
    >
      {/* Top bar */}
      <div className="h-12 shrink-0 flex items-center justify-between px-6 border-b border-white/10 backdrop-blur-md bg-black/30">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-bold text-white/80 tracking-wide">Live Preview</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/50 font-mono border border-white/10">
            Interactive
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-xs font-bold transition-all cursor-pointer border border-white/10"
        >
          <X size={12} />
          Exit Preview
        </button>
      </div>

      {/* Fullscreen content */}
      <div className="flex-1 overflow-auto flex items-start justify-center py-10 px-4">
        {/* Subtle hint */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 mt-2">
          <span className="text-[10px] text-white/30 font-medium tracking-wider">
            Interact with the card exactly as your visitors will
          </span>
        </div>

        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26, delay: 0.1 }}
          className="mt-8"
        >
          <PhoneShell colorTheme={colorTheme}>
            <CardContent
              activeSections={activeSections}
              store={store}
              colorTheme={colorTheme}
              footerPreset={footerPreset}
              interactive={true}
            />
          </PhoneShell>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─── Main DesignStudio page ──────────────────────────────────── */
export default function DesignStudio() {
  const [activeStep,      setActiveStep]      = useState(0);
  const [previewMode,     setPreviewMode]      = useState('card'); // 'card' | 'public' | 'live'
  const [saveStatus,      setSaveStatus]       = useState('saved');
  const [lastSaved,       setLastSaved]        = useState(null);
  const [showExitConfirm, setShowExitConfirm]  = useState(false);
  const [liveOpen,        setLiveOpen]         = useState(false);

  const store = useCardBuilderStore();
  const {
    displayPreset, colorTheme, footerPreset, sections,
    imageUrl, imageScale, imagePositionX, imagePositionY,
    imageOpacity, overlayType, imageRotation, imagePlacement,
    containerStyle, containerSize, containerBorder, containerShadow,
    containerPadding, imageFit, imageBlur, imageBrightness,
    imageContrast, imageSaturation,
  } = store;

  // Mock user for public page URL bar
  const mockUser = 'alex.rivers';

  // Fallback profile section
  const mockAboutSection = {
    sectionId: 'about',
    type: 'about',
    isVisible: true,
    data: {
      headline: 'Alex Rivers',
      bio: 'Senior Product Designer at Framer. Crafting premium user experiences & building modern interfaces.',
      avatarUrl: imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
  };
  const activeSections = sections.length > 0 ? sections : [mockAboutSection];

  // Open Live overlay when tab clicked
  useEffect(() => {
    if (previewMode === 'live') {
      setLiveOpen(true);
      setPreviewMode('card'); // reset tab so it doesn't stay stuck
    }
  }, [previewMode]);

  const handleCloseLive = useCallback(() => setLiveOpen(false), []);

  // Auto-save draft
  useEffect(() => {
    const handleAutoSave = () => {
      setSaveStatus('saving');
      try {
        const draft = {
          displayPreset, colorTheme, footerPreset,
          imageUrl, imageScale, imagePositionX, imagePositionY,
          imageOpacity, overlayType, imageRotation, imagePlacement,
          containerStyle, containerSize, containerBorder, containerShadow,
          containerPadding, imageFit, imageBlur, imageBrightness,
          imageContrast, imageSaturation,
        };
        localStorage.setItem('identiqal_studio_draft', JSON.stringify(draft));
        setTimeout(() => {
          setSaveStatus('saved');
          setLastSaved(new Date().toLocaleTimeString());
        }, 800);
      } catch { setSaveStatus('error'); }
    };
    const timer = setTimeout(handleAutoSave, 2000);
    return () => clearTimeout(timer);
  }, [
    displayPreset, colorTheme, footerPreset,
    imageUrl, imageScale, imagePositionX, imagePositionY,
    imageOpacity, overlayType, imageRotation, imagePlacement,
    containerStyle, containerSize, containerBorder, containerShadow,
    containerPadding, imageFit, imageBlur, imageBrightness,
    imageContrast, imageSaturation,
  ]);

  // Restore draft on mount
  useEffect(() => {
    const draftStr = localStorage.getItem('identiqal_studio_draft');
    if (!draftStr) return;
    try {
      const draft = JSON.parse(draftStr);
      if (draft.displayPreset) store.setDesignPreset('displayPreset', draft.displayPreset);
      if (draft.colorTheme)    store.setDesignPreset('colorTheme', draft.colorTheme);
      if (draft.footerPreset)  store.setDesignPreset('footerPreset', draft.footerPreset);
      store.updateHeaderImageRealTime({
        imageUrl:         draft.imageUrl         || '',
        imageScale:       draft.imageScale        || 100,
        imagePositionX:   draft.imagePositionX    || 0,
        imagePositionY:   draft.imagePositionY    || 0,
        imageOpacity:     draft.imageOpacity      ?? 80,
        overlayType:      draft.overlayType       || 'None',
        imageRotation:    draft.imageRotation     || 0,
        imagePlacement:   draft.imagePlacement    || 'Inside Header',
        containerStyle:   draft.containerStyle    || 'None',
        containerSize:    draft.containerSize     || 100,
        containerBorder:  draft.containerBorder   || false,
        containerShadow:  draft.containerShadow   || false,
        containerPadding: draft.containerPadding  || 0,
        imageFit:         draft.imageFit          || 'Cover',
        imageBlur:        draft.imageBlur         || 0,
        imageBrightness:  draft.imageBrightness   || 100,
        imageContrast:    draft.imageContrast     || 100,
        imageSaturation:  draft.imageSaturation   || 100,
      });
      toast.success('Restored draft from last active studio session');
    } catch (err) {
      console.error('Failed to restore draft:', err);
    }
  }, []);

  const confirmExit = () => {
    localStorage.removeItem('identiqal_studio_draft');
    window.location.href = '/admin/templates';
  };

  const renderStep = () => {
    switch (steps[activeStep].id) {
      case 'header':  return <HeaderPicker />;
      case 'theme':   return <ThemePicker />;
      case 'image':   return <ImageUploadPanel />;
      case 'styling': return <ImageStylingPanel />;
      case 'footer':  return <FooterPicker />;
      case 'summary': return <TemplateSummary />;
      default:        return null;
    }
  };

  const next = () => { if (activeStep < steps.length - 1) setActiveStep(activeStep + 1); };
  const back = () => { if (activeStep > 0)               setActiveStep(activeStep - 1); };

  return (
    <>
      <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111111] overflow-hidden flex flex-col h-[calc(100vh-10rem)] min-h-[600px] shadow-xl text-gray-900 dark:text-white transition-all duration-200">

        {/* ─── TOP HEADER ──────────────────────────────────── */}
        <header className="h-14 shrink-0 bg-gray-50 dark:bg-[#161616] border-b border-gray-200 dark:border-white/10 px-5 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Sparkles size={14} className="text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-xs font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-1.5">
                Template Studio
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-150 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border border-gray-200 dark:border-zinc-700 font-bold font-mono">ADMIN</span>
              </h1>
              <div className="text-[10px] text-gray-450 dark:text-zinc-550 flex items-center gap-1">
                {saveStatus === 'saving' && (
                  <><span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-ping" /><span>Saving draft...</span></>
                )}
                {saveStatus === 'saved' && (
                  <><span className="w-1.5 h-1.5 bg-green-500 rounded-full" /><span>Draft saved {lastSaved && `at ${lastSaved}`}</span></>
                )}
              </div>
            </div>
          </div>

          {/* Stepper breadcrumbs */}
          <nav className="hidden lg:flex items-center gap-3 bg-gray-100 dark:bg-zinc-950 px-4 py-1.5 rounded-xl border border-gray-250 dark:border-zinc-800/40 backdrop-blur-md">
            {steps.map((step, idx) => {
              const isActive    = idx === activeStep;
              const isCompleted = idx < activeStep;
              return (
                <React.Fragment key={step.id}>
                  <button
                    type="button"
                    onClick={() => setActiveStep(idx)}
                    className="flex items-center gap-2 text-left group cursor-pointer"
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black border transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/25'
                        : isCompleted
                          ? 'bg-blue-950/20 text-blue-400 border-blue-900/60'
                          : 'bg-gray-200 dark:bg-zinc-900 text-gray-500 dark:text-zinc-500 border-gray-300 dark:border-zinc-800'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className={`text-[10px] font-extrabold tracking-wide transition-colors ${
                      isActive ? 'text-blue-600 dark:text-blue-400' : isCompleted ? 'text-gray-700 dark:text-zinc-300' : 'text-gray-400 dark:text-zinc-500 group-hover:text-gray-900 dark:group-hover:text-zinc-300'
                    }`}>
                      {step.label}
                    </span>
                  </button>
                  {idx < steps.length - 1 && (
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-gray-350 dark:text-zinc-800">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  )}
                </React.Fragment>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setShowExitConfirm(true)}
            className="px-3.5 py-1.5 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 text-xs font-bold transition-all border border-gray-250 dark:border-zinc-750 flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <X size={12} />
            Cancel
          </button>
        </header>

        {/* ─── MAIN AREA ───────────────────────────────────── */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

          {/* Left: Step editor panel */}
          <main className="w-full lg:w-[420px] xl:w-[460px] shrink-0 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-white/10 bg-white dark:bg-[#111111] flex flex-col overflow-y-auto custom-scrollbar p-6">
            <div className="mb-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600 dark:text-blue-500">
                Step {activeStep + 1} of {steps.length}
              </span>
              <h2 className="text-lg font-black text-gray-900 dark:text-white">{steps[activeStep].label}</h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">{steps[activeStep].desc}</p>
            </div>

            <div className="flex-1 pt-4 border-t border-gray-200 dark:border-zinc-850">
              <AnimatePresence mode="wait">
                <motion.div
                  key={steps[activeStep].id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-6"
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Stepper nav controls */}
            <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-200 dark:border-zinc-850">
              <button
                type="button"
                onClick={back}
                disabled={activeStep === 0}
                className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:pointer-events-none text-gray-700 dark:text-zinc-350 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-gray-200 dark:border-transparent"
              >
                <ArrowLeft size={13} />
                Prev
              </button>
              <button
                type="button"
                onClick={next}
                disabled={activeStep === steps.length - 1}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                Next
                <ArrowRight size={13} />
              </button>
            </div>
          </main>

          {/* Right: Preview panel */}
          <section className="flex-1 bg-gray-50/50 dark:bg-[#0A0A0A] flex flex-col overflow-hidden relative select-none">

            {/* ─── PREVIEW MODE SWITCHER BAR ─── */}
            <div className="h-12 bg-white dark:bg-[#111111] border-b border-gray-200 dark:border-white/10 px-5 flex items-center justify-between shrink-0">
              <span className="text-[9px] text-gray-400 dark:text-zinc-550 font-black uppercase tracking-wider hidden sm:block">
                Template Preview
              </span>

              {/* Segmented control */}
              <div className="relative flex bg-gray-100 dark:bg-zinc-900 p-1 rounded-xl border border-gray-200 dark:border-zinc-800 gap-0.5">
                {PREVIEW_MODES.map((mode) => {
                  const Icon     = mode.icon;
                  const isActive = previewMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setPreviewMode(mode.id)}
                      className="relative px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-colors duration-150 cursor-pointer z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      style={{ color: isActive ? undefined : undefined }}
                    >
                      {/* Animated sliding pill */}
                      {isActive && (
                        <motion.div
                          layoutId="preview-tab-indicator"
                          className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200/60 dark:border-zinc-700/50"
                          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                        />
                      )}
                      <span className={`relative flex items-center gap-1.5 transition-colors duration-150 ${
                        isActive
                          ? mode.id === 'live'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200'
                      }`}>
                        {/* Live indicator dot */}
                        {mode.id === 'live' && isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        )}
                        <Icon size={12} />
                        {mode.label}
                        {mode.id === 'live' && (
                          <Maximize2 size={9} className="opacity-60" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Mode description badge */}
              <AnimatePresence mode="wait">
                <motion.span
                  key={previewMode}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="hidden md:block text-[9px] text-gray-400 dark:text-zinc-600 font-medium"
                >
                  {previewMode === 'card'   && 'Card as seen on mobile'}
                  {previewMode === 'public' && 'Visitor public profile view'}
                  {previewMode === 'live'   && 'Opening interactive preview...'}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* ─── CANVAS ─── */}
            <div className="flex-1 flex items-center justify-center p-6 overflow-auto custom-scrollbar relative">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.08),rgba(255,255,255,0))] pointer-events-none" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={previewMode}
                  initial={{ opacity: 0, scale: 0.97, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: -8 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                  className="flex items-center justify-center w-full h-full"
                >
                  {previewMode === 'card' && (
                    <CardPreview
                      activeSections={activeSections}
                      store={store}
                      colorTheme={colorTheme}
                      footerPreset={footerPreset}
                    />
                  )}

                  {previewMode === 'public' && (
                    <PublicPagePreview
                      activeSections={activeSections}
                      store={store}
                      colorTheme={colorTheme}
                      footerPreset={footerPreset}
                      mockUser={mockUser}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </section>
        </div>

        {/* ─── EXIT CONFIRM MODAL ──────────────────────────── */}
        <AnimatePresence>
          {showExitConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
            >
              <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 360, damping: 26 }}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl"
              >
                <h3 className="text-base font-black text-white">Unsaved Session Changes</h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  You are about to exit the template studio builder. Exiting now will permanently discard this studio session draft.
                </p>
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowExitConfirm(false)}
                    className="flex-1 py-2.5 text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-350 rounded-xl transition-all cursor-pointer"
                  >
                    Go Back
                  </button>
                  <button
                    type="button"
                    onClick={confirmExit}
                    className="flex-1 py-2.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all cursor-pointer shadow-lg shadow-red-600/10"
                  >
                    Discard Draft
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── LIVE PREVIEW OVERLAY (outside studio frame) ─── */}
      <AnimatePresence>
        {liveOpen && (
          <LivePreviewOverlay
            activeSections={activeSections}
            store={store}
            colorTheme={colorTheme}
            footerPreset={footerPreset}
            onClose={handleCloseLive}
          />
        )}
      </AnimatePresence>
    </>
  );
}
