'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Monitor, 
  Smartphone, 
  CreditCard, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  RotateCcw,
  CheckCircle,
  X,
  Compass
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

const steps = [
  { id: 'header', label: 'Header Layout', desc: 'Structure & curves' },
  { id: 'theme', label: 'Color Themes', desc: 'Palettes & moods' },
  { id: 'image', label: 'Upload Image', desc: 'Avatar asset library' },
  { id: 'styling', label: 'Image Styling', desc: 'Filters & shapes' },
  { id: 'footer', label: 'Footer Preset', desc: 'Disclaimers & height' },
  { id: 'summary', label: 'Save Template', desc: 'Finalize composition' },
];

export default function DesignStudio() {
  const [activeStep, setActiveStep] = useState(0);
  const [previewDevice, setPreviewDevice] = useState('smartphone'); // 'smartphone', 'desktop', 'card', 'profile'
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'error'
  const [lastSaved, setLastSaved] = useState(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const store = useCardBuilderStore();
  const { 
    displayPreset, 
    colorTheme, 
    footerPreset, 
    sections,
    imageUrl,
    imageScale,
    imagePositionX,
    imagePositionY,
    imageOpacity,
    overlayType,
    imageRotation,
    imagePlacement,
    containerStyle,
    containerSize,
    containerBorder,
    containerShadow,
    containerPadding,
    imageFit,
    imageBlur,
    imageBrightness,
    imageContrast,
    imageSaturation,
  } = store;

  // FALLBACK PROFILE PREVIEW FOR DESIGNS
  const mockAboutSection = {
    sectionId: 'about',
    type: 'about',
    isVisible: true,
    data: {
      headline: 'Alex Rivers',
      bio: 'Senior Product Designer at Framer. Crafting premium user experiences & building modern interfaces.',
      avatarUrl: imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    }
  };
  const activeSections = sections.length > 0 ? sections : [mockAboutSection];

  // Auto-Save Draft
  useEffect(() => {
    const handleAutoSave = () => {
      setSaveStatus('saving');
      try {
        const draft = {
          displayPreset,
          colorTheme,
          footerPreset,
          imageUrl,
          imageScale,
          imagePositionX,
          imagePositionY,
          imageOpacity,
          overlayType,
          imageRotation,
          imagePlacement,
          containerStyle,
          containerSize,
          containerBorder,
          containerShadow,
          containerPadding,
          imageFit,
          imageBlur,
          imageBrightness,
          imageContrast,
          imageSaturation,
        };
        localStorage.setItem('identiqal_studio_draft', JSON.stringify(draft));
        setTimeout(() => {
          setSaveStatus('saved');
          setLastSaved(new Date().toLocaleTimeString());
        }, 800);
      } catch (err) {
        setSaveStatus('error');
      }
    };

    // Trigger save on layout adjustments
    const timer = setTimeout(handleAutoSave, 2000);
    return () => clearTimeout(timer);
  }, [
    displayPreset, 
    colorTheme, 
    footerPreset, 
    imageUrl,
    imageScale,
    imagePositionX,
    imagePositionY,
    imageOpacity,
    overlayType,
    imageRotation,
    imagePlacement,
    containerStyle,
    containerSize,
    containerBorder,
    containerShadow,
    containerPadding,
    imageFit,
    imageBlur,
    imageBrightness,
    imageContrast,
    imageSaturation,
  ]);

  // Restore Draft on mount
  useEffect(() => {
    const draftStr = localStorage.getItem('identiqal_studio_draft');
    if (draftStr) {
      try {
        const draft = JSON.parse(draftStr);
        // Feed fields back to Zustand cardBuilderStore
        if (draft.displayPreset) store.setDesignPreset('displayPreset', draft.displayPreset);
        if (draft.colorTheme) store.setDesignPreset('colorTheme', draft.colorTheme);
        if (draft.footerPreset) store.setDesignPreset('footerPreset', draft.footerPreset);
        store.updateHeaderImageRealTime({
          imageUrl: draft.imageUrl || '',
          imageScale: draft.imageScale || 100,
          imagePositionX: draft.imagePositionX || 0,
          imagePositionY: draft.imagePositionY || 0,
          imageOpacity: draft.imageOpacity !== undefined ? draft.imageOpacity : 80,
          overlayType: draft.overlayType || 'None',
          imageRotation: draft.imageRotation || 0,
          imagePlacement: draft.imagePlacement || 'Inside Header',
          containerStyle: draft.containerStyle || 'None',
          containerSize: draft.containerSize || 100,
          containerBorder: draft.containerBorder || false,
          containerShadow: draft.containerShadow || false,
          containerPadding: draft.containerPadding || 0,
          imageFit: draft.imageFit || 'Cover',
          imageBlur: draft.imageBlur || 0,
          imageBrightness: draft.imageBrightness || 100,
          imageContrast: draft.imageContrast || 100,
          imageSaturation: draft.imageSaturation || 100,
        });
        toast.success('Restored draft from last active studio session');
      } catch (err) {
        console.error('Failed to restore draft:', err);
      }
    }
  }, []);

  const handleCancelClick = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    localStorage.removeItem('identiqal_studio_draft');
    window.location.href = '/admin/templates';
  };

  const renderStep = () => {
    switch (steps[activeStep].id) {
      case 'header':
        return <HeaderPicker />;
      case 'theme':
        return <ThemePicker />;
      case 'image':
        return <ImageUploadPanel />;
      case 'styling':
        return <ImageStylingPanel />;
      case 'footer':
        return <FooterPicker />;
      case 'summary':
        return <TemplateSummary />;
      default:
        return null;
    }
  };

  const next = () => {
    if (activeStep < steps.length - 1) setActiveStep(activeStep + 1);
  };
  const back = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  return (
    <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111111] overflow-hidden flex flex-col h-[calc(100vh-10rem)] min-h-[600px] shadow-xl text-gray-900 dark:text-white transition-all duration-200">
      {/* ───────────────── STUDIO TOP HEADER ───────────────── */}
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
                <>
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-ping" />
                  <span>Saving draft...</span>
                </>
              )}
              {saveStatus === 'saved' && (
                <>
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  <span>Draft saved {lastSaved && `at ${lastSaved}`}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stepper Wizard Breadcrumbs */}
        <nav className="hidden lg:flex items-center gap-3 bg-gray-100 dark:bg-zinc-950 px-4 py-1.5 rounded-xl border border-gray-250 dark:border-zinc-800/40 backdrop-blur-md">
          {steps.map((step, idx) => {
            const isActive = idx === activeStep;
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
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-gray-350 dark:text-zinc-800"><polyline points="9 18 15 12 9 6"/></svg>
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Action button */}
        <button 
          type="button"
          onClick={handleCancelClick}
          className="px-3.5 py-1.5 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 text-xs font-bold transition-all border border-gray-250 dark:border-zinc-750 flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <X size={12} />
          Cancel
        </button>
      </header>

      {/* ───────────────── MAIN AREA Redesign ───────────────── */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Parameters / Step selection picker */}
        <main className="w-full lg:w-[420px] xl:w-[460px] shrink-0 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-white/10 bg-white dark:bg-[#111111] flex flex-col overflow-y-auto custom-scrollbar p-6">
          <div className="mb-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600 dark:text-blue-500">Step {activeStep + 1} of {steps.length}</span>
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

          {/* Stepper Footer Controls */}
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

        {/* Right Side: Sticky Live Preview frame */}
        <section className="flex-1 bg-gray-50/50 dark:bg-[#0A0A0A] flex flex-col overflow-hidden relative select-none">
          {/* Device Frame switcher tab bar */}
          <div className="h-12 bg-white dark:bg-[#111111] border-b border-gray-200 dark:border-white/10 px-5 flex items-center justify-between shrink-0">
            <span className="text-[9px] text-gray-400 dark:text-zinc-550 font-black uppercase tracking-wider">Live Template Preview</span>
            <div className="flex bg-gray-100 dark:bg-zinc-950 p-0.5 rounded-xl border border-gray-200 dark:border-zinc-800">
              {[
                { id: 'smartphone', label: 'Mobile', icon: Smartphone },
                { id: 'desktop', label: 'Desktop', icon: Monitor },
                { id: 'card', label: 'Smart Card', icon: CreditCard },
                { id: 'profile', label: 'Profile View', icon: Compass }
              ].map(device => {
                const Icon = device.icon;
                const isActive = previewDevice === device.id;
                return (
                  <button
                    key={device.id}
                    type="button"
                    onClick={() => setPreviewDevice(device.id)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm border border-gray-200/50 dark:border-zinc-700/50' 
                        : 'text-gray-555 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    <Icon size={12} />
                    {device.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Canvas area rendering preview */}
          <div className="flex-1 flex items-center justify-center p-8 overflow-auto custom-scrollbar relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
            
            <div className="transition-all duration-300 transform scale-100 flex items-center justify-center w-full h-full max-h-[70vh]">
              {previewDevice === 'smartphone' && (
                <div className="w-[325px] h-[580px] rounded-[36px] border-8 border-zinc-800 bg-white shadow-[0_32px_64px_rgba(0,0,0,0.65)] relative overflow-hidden flex flex-col shrink-0 select-none">
                  {/* Top phone camera speaker bar notch */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-zinc-800 rounded-full z-30 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-zinc-900 rounded-full mr-2"></span>
                    <span className="w-8 h-1 bg-zinc-900 rounded-full"></span>
                  </div>
                  
                  {/* Content frame */}
                  <div 
                    className="flex-1 overflow-y-auto scrollbar-none pt-6 relative" 
                    style={{ 
                      backgroundColor: colorTheme?.background || '#ffffff', 
                      color: colorTheme?.text || '#1A1A1A' 
                    }}
                  >
                    {activeSections.map(sec => (
                      <SectionRenderer 
                        key={sec.sectionId}
                        section={{
                          ...sec,
                          imageUrl,
                          imageScale,
                          imagePositionX,
                          imagePositionY,
                          imageOpacity,
                          overlayType,
                          imageRotation,
                          imagePlacement,
                          containerStyle,
                          containerSize,
                          containerBorder,
                          containerShadow,
                          containerPadding,
                          imageFit,
                          imageBlur,
                          imageBrightness,
                          imageContrast,
                          imageSaturation,
                        }}
                        theme={{
                          colors: {
                            primary: colorTheme?.primary || '#2563EB',
                            text: colorTheme?.text || '#1A1A1A',
                            background: colorTheme?.background || '#ffffff',
                          },
                          font: { heading: 'Inter', body: 'Inter' }
                        }}
                        displayPreset={displayPreset}
                        colorTheme={colorTheme}
                        previewMode={true}
                      />
                    ))}
                    {footerPreset && (
                      <div 
                        className="py-4 text-center border-t text-[10px]" 
                        style={{ 
                          color: colorTheme?.text || '#1a1a1a', 
                          background: footerPreset.background || 'transparent', 
                          borderColor: colorTheme?.border || 'rgba(0,0,0,0.06)' 
                        }}
                      >
                        {footerPreset.copyrightText || footerPreset.contentTemplate || 'Powered by Identiqal'}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {previewDevice === 'desktop' && (
                <div className="w-full max-w-[700px] h-[450px] rounded-2xl border border-zinc-800 bg-white shadow-2xl relative overflow-hidden flex flex-col shrink-0 select-none">
                  {/* Window browser top menu */}
                  <div className="h-8 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 gap-1.5 shrink-0 z-20">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                    <div className="flex-1 max-w-xs mx-auto h-5 bg-zinc-800 rounded-md text-[9px] text-zinc-500 flex items-center justify-center font-mono select-none">
                      identiqal.com/studio/template-preview
                    </div>
                  </div>
                  {/* Browser view */}
                  <div 
                    className="flex-1 overflow-y-auto pt-4 relative" 
                    style={{ 
                      backgroundColor: colorTheme?.background || '#ffffff', 
                      color: colorTheme?.text || '#1A1A1A' 
                    }}
                  >
                    <div className="max-w-xl mx-auto px-6">
                      {activeSections.map(sec => (
                        <SectionRenderer 
                          key={sec.sectionId}
                          section={{
                            ...sec,
                            imageUrl,
                            imageScale,
                            imagePositionX,
                            imagePositionY,
                            imageOpacity,
                            overlayType,
                            imageRotation,
                            imagePlacement,
                            containerStyle,
                            containerSize,
                            containerBorder,
                            containerShadow,
                            containerPadding,
                            imageFit,
                            imageBlur,
                            imageBrightness,
                            imageContrast,
                            imageSaturation,
                          }}
                          theme={{
                            colors: {
                              primary: colorTheme?.primary || '#2563EB',
                              text: colorTheme?.text || '#1A1A1A',
                              background: colorTheme?.background || '#ffffff',
                            },
                            font: { heading: 'Inter', body: 'Inter' }
                          }}
                          displayPreset={displayPreset}
                          colorTheme={colorTheme}
                          previewMode={true}
                        />
                      ))}
                      {footerPreset && (
                        <div 
                          className="py-4 text-center border-t text-[10px]" 
                          style={{ 
                            color: colorTheme?.text || '#1a1a1a', 
                            background: footerPreset.background || 'transparent', 
                            borderColor: colorTheme?.border || 'rgba(0,0,0,0.06)' 
                          }}
                        >
                          {footerPreset.copyrightText || footerPreset.contentTemplate || 'Powered by Identiqal'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {previewDevice === 'card' && (
                <div 
                  className="w-[340px] aspect-[1.586/1] rounded-2xl border border-zinc-800 p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between select-none" 
                  style={{ 
                    background: `linear-gradient(135deg, ${colorTheme?.primary || '#2563EB'}20, ${colorTheme?.background || '#09090b'})`, 
                    color: colorTheme?.text || '#ffffff' 
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-[15px] font-black tracking-tight" style={{ color: colorTheme?.primary || '#2563EB' }}>{mockAboutSection.data.headline}</div>
                      <div className="text-[10px] text-zinc-400 mt-1 max-w-[190px] leading-tight opacity-80">{mockAboutSection.data.bio.slice(0, 60)}...</div>
                    </div>
                    <div className="w-12 h-12 rounded-full border border-zinc-800 overflow-hidden shrink-0 shadow-lg">
                      <img src={imageUrl || mockAboutSection.data.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="flex justify-between items-end border-t border-zinc-800/40 pt-3">
                    <span className="text-[8px] text-zinc-500 font-mono tracking-widest uppercase">Identiqal NFC Smart Card</span>
                    <span className="text-[9px] font-bold py-0.5 px-2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">{displayPreset?.name || 'Solid'}</span>
                  </div>
                </div>
              )}

              {previewDevice === 'profile' && (
                <div 
                  className="w-full max-w-[500px] h-[450px] rounded-3xl border border-zinc-800 shadow-2xl relative overflow-hidden flex flex-col select-none"
                  style={{ 
                    backgroundColor: colorTheme?.background || '#ffffff', 
                    color: colorTheme?.text || '#1A1A1A' 
                  }}
                >
                  <div className="flex-1 overflow-y-auto relative scrollbar-none">
                    {activeSections.map(sec => (
                      <SectionRenderer 
                        key={sec.sectionId}
                        section={{
                          ...sec,
                          imageUrl,
                          imageScale,
                          imagePositionX,
                          imagePositionY,
                          imageOpacity,
                          overlayType,
                          imageRotation,
                          imagePlacement,
                          containerStyle,
                          containerSize,
                          containerBorder,
                          containerShadow,
                          containerPadding,
                          imageFit,
                          imageBlur,
                          imageBrightness,
                          imageContrast,
                          imageSaturation,
                        }}
                        theme={{
                          colors: {
                            primary: colorTheme?.primary || '#2563EB',
                            text: colorTheme?.text || '#1A1A1A',
                            background: colorTheme?.background || '#ffffff',
                          },
                          font: { heading: 'Inter', body: 'Inter' }
                        }}
                        displayPreset={displayPreset}
                        colorTheme={colorTheme}
                        previewMode={true}
                      />
                    ))}
                    {footerPreset && (
                      <div 
                        className="py-6 text-center border-t text-xs" 
                        style={{ 
                          color: colorTheme?.text || '#1a1a1a', 
                          background: footerPreset.background || 'transparent', 
                          borderColor: colorTheme?.border || 'rgba(0,0,0,0.06)' 
                        }}
                      >
                        {footerPreset.copyrightText || footerPreset.contentTemplate || 'Powered by Identiqal'}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* ───────────────── EXIT CONFIRM MODAL ───────────────── */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in px-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl">
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
          </div>
        </div>
      )}
    </div>
  );
}
