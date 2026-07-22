'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useCardBuilderStore } from '@/store/cardBuilderStore';
import axiosInstance from '@/services/axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Upload, Trash2, Plus, Check, Sparkles,
  Share2, ExternalLink, Eye, User, Image as ImgIcon, Sun, Layers, Move,
  Globe, Camera, Briefcase, Code, Video, MessageCircle, Mail, Phone,
  Link2, GripVertical, RefreshCw, Contrast, Droplets, ZoomIn
} from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/* -------------------------------------------------------------------------- */
/* THUMBNAIL COMPONENT FOR DISPLAY PRESETS                                    */
/* -------------------------------------------------------------------------- */
const HeaderPresetThumbnail = ({ preset, activeTheme }) => {
  const primaryColor = activeTheme?.primary || '#2563EB';
  const accentColor = activeTheme?.accent || '#3B82F6';
  const name = preset?.name || '';

  let headerBg = primaryColor;
  let headerHeight = 'h-[44px]';
  const isLuxury = name === 'Luxury' || preset?.headerStyle === 'Luxury';
  const isAurora = name === 'Aurora' || preset?.headerStyle === 'Aurora';
  const isMinimal = name === 'Minimal' || preset?.headerStyle === 'Minimal';
  const isSleek = name === 'Sleek' || preset?.headerStyle === 'Sleek';
  const isBlend = name === 'Blend' || preset?.headerStyle === 'Blend';

  if (isLuxury) {
    headerBg = 'linear-gradient(135deg, #1A1A1A, #2A2520, #1A1A1A)';
  } else if (isAurora) {
    headerBg = 'radial-gradient(circle at 10% 20%, rgba(56, 189, 248, 0.8) 0%, transparent 55%), radial-gradient(circle at 90% 30%, rgba(124, 58, 237, 0.8) 0%, transparent 60%), radial-gradient(circle at 50% 80%, rgba(79, 70, 229, 0.9) 0%, transparent 70%), linear-gradient(135deg, #2563EB, #4F46E5)';
  } else if (isBlend) {
    headerBg = `linear-gradient(to bottom, ${primaryColor}, transparent)`;
  } else if (preset?.headerStyle === 'Gradient') {
    headerBg = `linear-gradient(135deg, ${primaryColor}, ${accentColor})`;
  }

  if (isAurora) headerHeight = 'h-[65px]';
  else if (isMinimal) headerHeight = 'h-[8px]';

  return (
    <div className="w-full h-full bg-white dark:bg-[#1C191D] relative flex flex-col overflow-hidden rounded-[14px]">
      {!isSleek ? (
        <div
          className={`w-full ${headerHeight} relative overflow-hidden shrink-0 transition-all`}
          style={{ background: headerBg }}
        >
          {isAurora && (
            <div className="absolute bottom-0 left-0 w-full h-[18px] bg-gradient-to-b from-transparent to-white dark:to-[#1C191D]" />
          )}
          {name === 'Classic' && (
            <svg className="absolute bottom-0 w-full text-white dark:text-[#1C191D] fill-current" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
            </svg>
          )}
          {name === 'Modern' && (
            <svg className="absolute bottom-0 w-full text-white dark:text-[#1C191D] fill-current" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon points="0,100 100,0 100,100"></polygon>
            </svg>
          )}
          {name === 'Creative' && (
            <svg className="absolute bottom-0 w-full text-white dark:text-[#1C191D] fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C50,22,150,75,321.39,56.44Z"></path>
            </svg>
          )}
          {isLuxury && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#D4A45B] via-[#F4E0A5] to-[#D4A45B]" />
          )}
        </div>
      ) : (
        <div className="w-full h-[45px] flex items-center justify-center pt-2 px-2 shrink-0">
          <div
            className="w-full h-6 rounded-full border border-white/20 shadow-sm"
            style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` }}
          />
        </div>
      )}
      <div className="flex-1 bg-white dark:bg-[#1C191D]" />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* STEP DEFINITIONS                                                           */
/* -------------------------------------------------------------------------- */
const STEP_TITLES = [
  'Choose Header Design',
  'Customize Header',
  'Choose Card Theme',
  'Add Links',
  'Choose Footer',
  'Card Ready!',
];

export default function SetupWizard() {
  const {
    wizardStep, setWizardStep, nextWizardStep, prevWizardStep, completeWizard,
    displayPreset, colorTheme, footerPreset, setDesignPreset,
    imageUrl, imageScale, imagePositionX, imagePositionY, imageOpacity,
    overlayType, imageRotation, imagePlacement, imageFit, imageBlur,
    imageBrightness, imageContrast, imageSaturation,
    updateHeaderImage, updateHeaderImageRealTime,
    avatarUrl, avatarShape, avatarScale, avatarPositionX, avatarPositionY,
    avatarRotation, avatarFlipH, avatarFlipV, avatarBorderWidth,
    avatarBorderColor, avatarShadow, avatarGlow, avatarBackground, avatarOpacity,
    avatarPosition, avatarLayer, updateAvatar, updateAvatarRealTime,
    sections, updateSection, slug
  } = useCardBuilderStore();

  const [displayPresets, setDisplayPresets] = useState([]);
  const [colorThemes, setColorThemes] = useState([]);
  const [footerPresets, setFooterPresets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch presets
  useEffect(() => {
    const fetchPresets = async () => {
      try {
        const [dRes, cRes, fRes] = await Promise.all([
          axiosInstance.get('/presets/display'),
          axiosInstance.get('/presets/colors'),
          axiosInstance.get('/presets/footers')
        ]);
        setDisplayPresets(Array.isArray(dRes) ? dRes : (dRes.data || []));
        setColorThemes(Array.isArray(cRes) ? cRes : (cRes.data || []));
        setFooterPresets(Array.isArray(fRes) ? fRes : (fRes.data || []));
      } catch (err) {
        console.error('Failed to load presets:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPresets();
  }, []);

  const coverFileRef = useRef(null);
  const coverVideoFileRef = useRef(null);
  const avatarFileRef = useRef(null);

  // URL upload states
  const [showCoverUrl, setShowCoverUrl] = useState(false);
  const [coverUrlText, setCoverUrlText] = useState('');
  const [showAvatarUrl, setShowAvatarUrl] = useState(false);
  const [avatarUrlText, setAvatarUrlText] = useState('');

  const submitCoverUrl = () => {
    if (!coverUrlText.trim()) return;
    const isVid = !!coverUrlText.trim().match(/\.(mp4|webm|ogg|mov|mkv)($|\?)/i);
    updateHeaderImage({ imageUrl: coverUrlText.trim(), isVideo: isVid, imageScale: 100, imagePositionX: 0, imagePositionY: 0, imageOpacity: 80, overlayType: 'None' });
  };

  const handleCoverUrlChange = (val) => {
    setCoverUrlText(val);
    if (val.trim()) {
      const isVid = !!val.trim().match(/\.(mp4|webm|ogg|mov|mkv)($|\?)/i);
      updateHeaderImageRealTime({ imageUrl: val.trim(), isVideo: isVid });
      updateHeaderImage({ imageUrl: val.trim(), isVideo: isVid, imageScale: 100, imagePositionX: 0, imagePositionY: 0, imageOpacity: 80, overlayType: 'None' });
    }
  };

  const submitAvatarUrl = () => {
    if (!avatarUrlText.trim()) return;
    updateAvatar({ avatarUrl: avatarUrlText.trim() });
  };

  const handleAvatarUrlChange = (val) => {
    setAvatarUrlText(val);
    if (val.trim()) {
      updateAvatarRealTime({ avatarUrl: val.trim() });
      updateAvatar({ avatarUrl: val.trim() });
    }
  };

  // Step 1 handler: Auto advance on selecting header layout
  const handleSelectHeader = (preset) => {
    setDesignPreset('displayPreset', preset);
    nextWizardStep();
  };

  // Step 3 handler: Auto advance on avatar upload
  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateAvatar({ avatarUrl: ev.target.result });
    };
    reader.readAsDataURL(file);
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateHeaderImage({ imageUrl: ev.target.result, isVideo: false, imageScale: 100, imagePositionX: 0, imagePositionY: 0, imageOpacity: 80, overlayType: 'None' });
    };
    reader.readAsDataURL(file);
  };

  const handleCoverVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateHeaderImage({ imageUrl: ev.target.result, isVideo: true, imageScale: 100, imagePositionX: 0, imagePositionY: 0, imageOpacity: 80, overlayType: 'None' });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="flex flex-col h-full bg-white dark:bg-[#181518] relative z-10 w-full max-w-full overflow-x-hidden"
      style={{ touchAction: "pan-y", overscrollBehaviorX: "none" }}
    >
      
      {/* ── Wizard Header & Progress Bar ── */}
      <div className="p-3.5 sm:p-4 border-b border-gray-100 dark:border-white/10 bg-white/90 dark:bg-[#181518]/90 backdrop-blur-md sticky top-0 z-20 w-full max-w-full">
        <div className="flex items-center justify-between gap-2 mb-3 min-w-0">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest block">
              Step {wizardStep + 1} of {STEP_TITLES.length}
            </span>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base truncate">
              {STEP_TITLES[wizardStep]}
            </h3>
          </div>
          <button
            onClick={completeWizard}
            className="text-[11px] sm:text-xs font-semibold text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors whitespace-nowrap shrink-0"
          >
            Skip Wizard
          </button>
        </div>

        {/* Step Progress Dots / Bar */}
        <div className="flex items-center gap-1.5 w-full">
          {STEP_TITLES.map((_, idx) => (
            <div
              key={idx}
              onClick={() => setWizardStep(idx)}
              className={`h-1.5 flex-1 rounded-full cursor-pointer transition-all duration-300 ${
                idx === wizardStep
                  ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'
                  : idx < wizardStep
                  ? 'bg-blue-300 dark:bg-blue-900/60'
                  : 'bg-gray-100 dark:bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── Wizard Content Area ── */}
      <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 pb-6 no-scrollbar w-full max-w-full overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={wizardStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >

            {/* ============================================================ */}
            {/* STEP 1 — CHOOSE HEADER DESIGN                                */}
            {/* ============================================================ */}
            {wizardStep === 0 && (
              <div className="space-y-4">
                <p className="text-xs text-gray-500 dark:text-zinc-400">
                  Select a layout for your card's header area. Click any design to apply & continue.
                </p>

                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
                    {displayPresets.map((preset) => {
                      const isSelected = displayPreset?._id === preset._id;
                      return (
                        <button
                          key={preset._id}
                          onClick={() => handleSelectHeader(preset)}
                          className={`group relative rounded-[18px] sm:rounded-[20px] border-2 p-2 sm:p-2.5 flex flex-col items-center gap-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg w-full overflow-hidden ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 shadow-[0_0_16px_rgba(59,130,246,0.3)]'
                              : 'border-gray-200 dark:border-white/10 hover:border-blue-400/50 bg-white dark:bg-[#1C191D]'
                          }`}
                        >
                          <div className="w-full h-24 relative overflow-hidden rounded-[14px]">
                            <HeaderPresetThumbnail preset={preset} activeTheme={colorTheme} />
                            {isSelected && (
                              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-sm z-10">
                                <Check size={12} strokeWidth={3} />
                              </div>
                            )}
                          </div>
                          <span className="text-xs font-bold text-gray-800 dark:text-gray-200 capitalize">
                            {preset.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ============================================================ */}
            {/* STEP 2 — CUSTOMIZE HEADER                                    */}
            {/* ============================================================ */}
            {wizardStep === 1 && (
              <div className="space-y-5">
                <p className="text-xs text-gray-500 dark:text-zinc-400">
                  Fine-tune your cover image styling, positioning, overlay, and effects.
                </p>

                {/* Upload & Remove */}
                <div className="flex gap-2">
                  <button
                    onClick={() => coverFileRef.current?.click()}
                    className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 active:scale-[0.99] text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Upload size={14} /> Upload Image
                  </button>
                  <input ref={coverFileRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />

                  <button
                    onClick={() => coverVideoFileRef.current?.click()}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Video size={14} /> Upload Video
                  </button>
                  <input ref={coverVideoFileRef} type="file" accept="video/*" className="hidden" onChange={handleCoverVideoUpload} />

                  {imageUrl && (
                    <button
                      onClick={() => updateHeaderImage({ imageUrl: '', isVideo: false })}
                      className="px-4 py-3 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 rounded-2xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  )}
                </div>

                {/* Always-visible Image/Video URL field */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] font-semibold text-gray-500 dark:text-zinc-400">
                    Or load from image/video URL:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={coverUrlText}
                      onChange={(e) => handleCoverUrlChange(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && submitCoverUrl()}
                      placeholder="https://example.com/cover.jpg or .mp4"
                      className="flex-1 px-3.5 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                    <button
                      onClick={submitCoverUrl}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer shrink-0"
                    >
                      Load
                    </button>
                  </div>
                </div>

                {/* Cover Sliders & Controls */}
                <div className="space-y-4 pt-2">
                  {/* Zoom */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Zoom Level</span>
                      <span className="font-mono text-gray-400">{imageScale}%</span>
                    </div>
                    <input
                      type="range" min="50" max="250" value={imageScale}
                      onChange={(e) => updateHeaderImageRealTime({ imageScale: Number(e.target.value) })}
                      className="w-full h-1.5 rounded-full accent-blue-500 cursor-pointer"
                    />
                  </div>

                  {/* Position X / Y */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Position X</span>
                        <span className="font-mono text-gray-400">{imagePositionX}px</span>
                      </div>
                      <input
                        type="range" min="-150" max="150" value={imagePositionX}
                        onChange={(e) => updateHeaderImageRealTime({ imagePositionX: Number(e.target.value) })}
                        className="w-full h-1.5 rounded-full accent-blue-500 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Position Y</span>
                        <span className="font-mono text-gray-400">{imagePositionY}px</span>
                      </div>
                      <input
                        type="range" min="-150" max="150" value={imagePositionY}
                        onChange={(e) => updateHeaderImageRealTime({ imagePositionY: Number(e.target.value) })}
                        className="w-full h-1.5 rounded-full accent-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Opacity */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Opacity</span>
                      <span className="font-mono text-gray-400">{imageOpacity}%</span>
                    </div>
                    <input
                      type="range" min="0" max="100" value={imageOpacity}
                      onChange={(e) => updateHeaderImageRealTime({ imageOpacity: Number(e.target.value) })}
                      className="w-full h-1.5 rounded-full accent-blue-500 cursor-pointer"
                    />
                  </div>

                  {/* Overlay Presets */}
                  <div className="space-y-2 pt-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">Overlay Effect</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['None', 'Dark Overlay', 'Light Overlay', 'Gradient Overlay', 'Glass Overlay'].map((ov) => (
                        <button
                          key={ov}
                          onClick={() => updateHeaderImage({ overlayType: ov })}
                          className={`py-2 px-2 rounded-xl text-[11px] font-semibold border transition-all truncate ${
                            overlayType === ov
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold'
                              : 'border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                          }`}
                        >
                          {ov.replace(' Overlay', '')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fit Mode */}
                  <div className="space-y-2 pt-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">Fit Mode</label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {['Cover', 'Contain', 'Fill', 'Original'].map((fit) => (
                        <button
                          key={fit}
                          onClick={() => updateHeaderImage({ imageFit: fit })}
                          className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border text-center transition-all ${
                            imageFit === fit
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold'
                              : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                          }`}
                        >
                          {fit}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* STEP 3 — CHOOSE CARD THEME                                  */}
            {/* ============================================================ */}
            {wizardStep === 2 && (
              <div className="space-y-4">
                <p className="text-xs text-gray-500 dark:text-zinc-400">
                  Choose a color palette theme for your card.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {colorThemes.map((theme) => {
                    const isSelected = colorTheme?._id === theme._id;
                    return (
                      <button
                        key={theme._id}
                        onClick={() => setDesignPreset('colorTheme', theme)}
                        className={`relative rounded-2xl border p-3.5 flex flex-col gap-2.5 transition-all duration-200 text-left overflow-hidden ${
                          isSelected
                            ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md scale-[1.02]'
                            : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                        }`}
                        style={{ backgroundColor: theme.background }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold truncate" style={{ color: theme.text }}>
                            {theme.name}
                          </span>
                          {isSelected && (
                            <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0 shadow-sm">
                              <Check size={10} strokeWidth={3} />
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1.5">
                          <div className="w-5 h-5 rounded-full shadow-sm" style={{ backgroundColor: theme.primary }} />
                          <div className="w-5 h-5 rounded-full shadow-sm" style={{ backgroundColor: theme.secondary }} />
                          <div className="w-5 h-5 rounded-full shadow-sm" style={{ backgroundColor: theme.accent }} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* STEP 4 — ADD LINKS                                           */}
            {/* ============================================================ */}
            {wizardStep === 3 && <WizardLinksSection />}

            {/* ============================================================ */}
            {/* STEP 5 — CHOOSE FOOTER                                       */}
            {/* ============================================================ */}
            {wizardStep === 4 && (
              <div className="space-y-4">
                <p className="text-xs text-gray-500 dark:text-zinc-400">
                  Select a footer preset for your digital card.
                </p>

                <div className="grid grid-cols-1 gap-2.5">
                  {footerPresets.map((footer) => {
                    const isSelected = footerPreset?._id === footer._id;
                    return (
                      <button
                        key={footer._id}
                        onClick={() => setDesignPreset('footerPreset', footer)}
                        className={`text-left p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 shadow-sm'
                            : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1C191D]'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold capitalize">{footer.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono mt-0.5 truncate max-w-[220px]">
                            {footer.contentTemplate}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-sm shrink-0">
                            <Check size={12} strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* STEP 6 — FINISH                                              */}
            {/* ============================================================ */}
            {wizardStep === 5 && (
              <div className="space-y-6 text-center py-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-blue-500/25 animate-bounce">
                  <Sparkles size={36} />
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
                    Your Digital Card is Ready! 🎉
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-xs mx-auto">
                    You can edit any section later by clicking on it in the sidebar.
                  </p>
                </div>

                <div className="space-y-3 pt-4 max-w-xs mx-auto">
                  <button
                    onClick={completeWizard}
                    className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02]"
                  >
                    Done & Return to Builder
                  </button>

                  <a
                    href={`/${slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-800 dark:text-gray-200 font-semibold text-xs rounded-2xl transition-all flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={14} /> Open Public Page
                  </a>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Fixed Footer Controls ── */}
      {wizardStep < STEP_TITLES.length - 1 && (
        <div className="p-3.5 sm:p-4 border-t border-gray-100 dark:border-white/10 bg-white/95 dark:bg-[#181518]/95 backdrop-blur-md shrink-0 z-30 flex items-center justify-between gap-3 w-full">
          <button
            onClick={prevWizardStep}
            disabled={wizardStep === 0}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              wizardStep === 0
                ? 'opacity-40 cursor-not-allowed text-gray-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
            }`}
          >
            <ChevronLeft size={16} /> Back
          </button>

          <button
            onClick={nextWizardStep}
            className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5"
          >
            {wizardStep === STEP_TITLES.length - 2 ? 'Finish' : 'Next'} <ChevronRight size={16} />
          </button>
        </div>
      )}

    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* STEP 5 WIZARD LINKS SECTION                                                */
/* -------------------------------------------------------------------------- */
const PLATFORMS = [
  { label: 'Website', prefix: 'https://', icon: Globe },
  { label: 'Instagram', prefix: 'https://instagram.com/', icon: Camera },
  { label: 'LinkedIn', prefix: 'https://linkedin.com/in/', icon: Briefcase },
  { label: 'GitHub', prefix: 'https://github.com/', icon: Code },
  { label: 'YouTube', prefix: 'https://youtube.com/@', icon: Video },
  { label: 'WhatsApp', prefix: 'https://wa.me/', icon: MessageCircle },
  { label: 'Email', prefix: 'mailto:', icon: Mail },
  { label: 'Phone', prefix: 'tel:', icon: Phone },
  { label: 'Custom', prefix: 'https://', icon: Link2 },
];

function WizardLinksSection() {
  const { sections, updateSection } = useCardBuilderStore();
  const linksSection = sections.find((s) => s.type === 'links');
  const links = linksSection?.data?.links || [];

  const handleUpdateLinks = (newLinks) => {
    if (linksSection) {
      updateSection(linksSection.sectionId, { links: newLinks });
    }
  };

  const addLink = (platform) => {
    const newLink = {
      label: platform.label === 'Custom' ? 'My Link' : platform.label,
      url: platform.prefix,
    };
    handleUpdateLinks([...links, newLink]);
  };

  const removeLink = (index) => {
    handleUpdateLinks(links.filter((_, i) => i !== index));
  };

  const updateLinkField = (index, field, value) => {
    const updated = [...links];
    updated[index] = { ...updated[index], [field]: value };
    handleUpdateLinks(updated);
  };

  return (
    <div className="space-y-5">
      <p className="text-xs text-gray-500 dark:text-zinc-400">
        Add your social media profiles, website, and contact links.
      </p>

      {/* Platform preset buttons */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">Quick Add Platform</label>
        <div className="grid grid-cols-3 gap-2">
          {PLATFORMS.map((p) => {
            const Icon = p.icon;
            return (
              <button
                key={p.label}
                onClick={() => addLink(p)}
                className="py-2 px-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-blue-400 dark:hover:border-blue-500 text-gray-700 dark:text-gray-300 text-[11px] font-semibold flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Icon size={14} className="text-blue-500 shrink-0" />
                <span className="truncate">{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Added Links List */}
      <div className="space-y-3 pt-2">
        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">Your Card Links ({links.length})</label>
        
        {links.length === 0 ? (
          <div className="p-6 text-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl text-xs text-gray-400">
            Click a platform above to add your first link!
          </div>
        ) : (
          <div className="space-y-3">
            {links.map((link, index) => (
              <div
                key={index}
                className="p-3 bg-white dark:bg-[#1C191D] border border-gray-200 dark:border-white/10 rounded-2xl space-y-2 relative group shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Link {index + 1}</span>
                  <button
                    onClick={() => removeLink(index)}
                    className="text-gray-400 hover:text-red-500 p-1 rounded-lg transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <input
                  type="text"
                  value={link.label || ''}
                  onChange={(e) => updateLinkField(index, 'label', e.target.value)}
                  placeholder="Label (e.g. Portfolio)"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  value={link.url || ''}
                  onChange={(e) => updateLinkField(index, 'url', e.target.value)}
                  placeholder="URL (https://...)"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs text-gray-900 dark:text-white font-mono"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
