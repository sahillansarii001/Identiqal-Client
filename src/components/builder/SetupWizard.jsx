'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useCardBuilderStore } from '@/store/cardBuilderStore';
import { useAuthStore } from '@/store/authStore';
import axiosInstance from '@/services/axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Upload, Trash2, Plus, Check, Sparkles,
  Share2, ExternalLink, Eye, User, Image as ImgIcon, Sun, Layers, Move,
  Globe, Camera, Briefcase, Code, Video, MessageCircle, Mail, Phone,
  Link2, GripVertical, RefreshCw, Contrast, Droplets, ZoomIn, Minus,
  Smartphone, Search, Cake, MapPin, FileText, StickyNote, Music,
  Play, Radio, Coffee, ShoppingBag, Download, DollarSign, Headphones,
  HelpCircle, Calendar, Users, Tv, Mic, MessageSquare
} from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { LINK_PLATFORMS, CATEGORIES } from '@/constants/links';

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
  'Profile Info',
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
            {/* STEP 1 — PROFILE INFO                                        */}
            {/* ============================================================ */}
            {wizardStep === 0 && <WizardProfileSection />}

            {/* ============================================================ */}
            {/* STEP 2 — CHOOSE HEADER DESIGN                                */}
            {/* ============================================================ */}
            {wizardStep === 1 && (
              <div className="space-y-4">
                <p className="text-xs text-gray-500 dark:text-zinc-400">
                  Select a layout for your card's header area. Click any design to apply & continue.
                </p>

                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5 max-w-[340px] mx-auto">
                    {displayPresets.map((preset) => {
                      const isSelected = displayPreset?._id === preset._id;
                      return (
                        <button
                          key={preset._id}
                          onClick={() => handleSelectHeader(preset)}
                          className={`group relative rounded-[16px] border-2 p-1.5 sm:p-2 flex flex-col items-center gap-1.5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg w-full overflow-hidden ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 shadow-[0_0_16px_rgba(59,130,246,0.3)]'
                              : 'border-gray-200 dark:border-white/10 hover:border-blue-400/50 bg-white dark:bg-[#1C191D]'
                          }`}
                        >
                          <div className="w-full h-18 relative overflow-hidden rounded-[12px]">
                            <HeaderPresetThumbnail preset={preset} activeTheme={colorTheme} />
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-sm z-10">
                                <Check size={10} strokeWidth={3} />
                              </div>
                            )}
                          </div>
                          <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200 capitalize">
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
            {/* STEP 3 — CUSTOMIZE HEADER                                    */}
            {/* ============================================================ */}
            {wizardStep === 2 && (
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
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateHeaderImageRealTime({ imageScale: Math.max(50, imageScale - 1) })} className="w-5 h-5 flex items-center justify-center bg-gray-100 dark:bg-white/10 rounded-md text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors shrink-0">
                        <Minus size={12} />
                      </button>
                      <input
                        type="range" min="50" max="250" value={imageScale}
                        onChange={(e) => updateHeaderImageRealTime({ imageScale: Number(e.target.value) })}
                        className="flex-1 h-1.5 rounded-full accent-blue-500 cursor-pointer"
                      />
                      <button onClick={() => updateHeaderImageRealTime({ imageScale: Math.min(250, imageScale + 1) })} className="w-5 h-5 flex items-center justify-center bg-gray-100 dark:bg-white/10 rounded-md text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors shrink-0">
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Position X / Y */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Position X</span>
                        <span className="font-mono text-gray-400">{imagePositionX}px</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateHeaderImageRealTime({ imagePositionX: Math.max(-150, imagePositionX - 1) })} className="w-5 h-5 flex items-center justify-center bg-gray-100 dark:bg-white/10 rounded-md text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors shrink-0">
                          <Minus size={12} />
                        </button>
                        <input
                          type="range" min="-150" max="150" value={imagePositionX}
                          onChange={(e) => updateHeaderImageRealTime({ imagePositionX: Number(e.target.value) })}
                          className="flex-1 h-1.5 rounded-full accent-blue-500 cursor-pointer"
                        />
                        <button onClick={() => updateHeaderImageRealTime({ imagePositionX: Math.min(150, imagePositionX + 1) })} className="w-5 h-5 flex items-center justify-center bg-gray-100 dark:bg-white/10 rounded-md text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors shrink-0">
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Position Y</span>
                        <span className="font-mono text-gray-400">{imagePositionY}px</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateHeaderImageRealTime({ imagePositionY: Math.max(-150, imagePositionY - 1) })} className="w-5 h-5 flex items-center justify-center bg-gray-100 dark:bg-white/10 rounded-md text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors shrink-0">
                          <Minus size={12} />
                        </button>
                        <input
                          type="range" min="-150" max="150" value={imagePositionY}
                          onChange={(e) => updateHeaderImageRealTime({ imagePositionY: Number(e.target.value) })}
                          className="flex-1 h-1.5 rounded-full accent-blue-500 cursor-pointer"
                        />
                        <button onClick={() => updateHeaderImageRealTime({ imagePositionY: Math.min(150, imagePositionY + 1) })} className="w-5 h-5 flex items-center justify-center bg-gray-100 dark:bg-white/10 rounded-md text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors shrink-0">
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Opacity */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Opacity</span>
                      <span className="font-mono text-gray-400">{imageOpacity}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateHeaderImageRealTime({ imageOpacity: Math.max(0, imageOpacity - 1) })} className="w-5 h-5 flex items-center justify-center bg-gray-100 dark:bg-white/10 rounded-md text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors shrink-0">
                        <Minus size={12} />
                      </button>
                      <input
                        type="range" min="0" max="100" value={imageOpacity}
                        onChange={(e) => updateHeaderImageRealTime({ imageOpacity: Number(e.target.value) })}
                        className="flex-1 h-1.5 rounded-full accent-blue-500 cursor-pointer"
                      />
                      <button onClick={() => updateHeaderImageRealTime({ imageOpacity: Math.min(100, imageOpacity + 1) })} className="w-5 h-5 flex items-center justify-center bg-gray-100 dark:bg-white/10 rounded-md text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors shrink-0">
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Overlay Presets */}
                  <div className="space-y-2 pt-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">Overlay Effect</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['None', 'Dark Overlay', 'Light Overlay', 'Gradient Overlay', 'Vignette'].map((ov) => (
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
            {/* STEP 4 — CHOOSE CARD THEME                                  */}
            {/* ============================================================ */}
            {wizardStep === 3 && (
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
            {/* STEP 5 — ADD LINKS                                           */}
            {/* ============================================================ */}
            {wizardStep === 4 && <WizardLinksSection />}

            {/* ============================================================ */}
            {/* STEP 6 — CHOOSE FOOTER                                       */}
            {/* ============================================================ */}
            {wizardStep === 5 && (
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
            {/* STEP 7 — FINISH                                              */}
            {/* ============================================================ */}
            {wizardStep === 6 && (
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
/* -------------------------------------------------------------------------- */
/* STEP 5 WIZARD LINKS SECTION                                                */
/* -------------------------------------------------------------------------- */

/* Drag and Drop Item Component for Links */
const SortableLinkItem = ({ link, index, removeLink, editLink }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: `link-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3 bg-white dark:bg-[#1C191D] border border-gray-200 dark:border-white/10 rounded-2xl space-y-2 relative group shadow-sm ${isDragging ? 'shadow-lg ring-2 ring-blue-500/50' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 overflow-hidden">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 mt-0.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-md transition-colors shrink-0"
          >
            <GripVertical size={14} />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{link.label || 'No Label'}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-mono truncate mt-0.5">{link.url || 'No URL'}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          <button
            onClick={() => editLink(index)}
            className="px-2.5 py-1 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 rounded-lg text-[10px] font-bold transition-all"
          >
            Edit
          </button>
          <button
            onClick={() => removeLink(index)}
            className="px-2.5 py-1 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-[10px] font-bold transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* LINK EDITOR MODAL                                                          */
/* -------------------------------------------------------------------------- */
const LinkEditorModal = ({ editorData, onSave, onCancel }) => {
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (editorData) {
      setLabel(editorData.link.label || '');
      setUrl(editorData.link.url || '');
      setError('');
    }
  }, [editorData]);

  const handleSave = () => {
    if (!url.trim()) {
      setError('URL is required');
      return;
    }
    // simple URL validation
    if (!url.includes('.') && !url.startsWith('tel:') && !url.startsWith('mailto:')) {
       setError('Please enter a valid URL, email, or phone number');
       return;
    }
    
    onSave({ ...editorData.link, label, url });
  };

  const content = (
    <AnimatePresence>
      {editorData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex justify-center items-end sm:items-center bg-black/40 backdrop-blur-sm p-0 sm:p-4"
          onClick={onCancel}
        >
          {(() => {
            const platform = LINK_PLATFORMS.find(p => p.id === editorData.platformId);
            const Icon = platform?.icon || Link2;
            
            return (
              <motion.div
                initial={{ y: 50, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 20, opacity: 0, scale: 0.98 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full h-[85vh] sm:h-auto sm:max-h-[85vh] sm:w-[420px] bg-white dark:bg-[#1C1C1E] shadow-2xl flex flex-col rounded-t-[32px] sm:rounded-3xl border border-transparent dark:border-white/10 overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-4 shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center border border-blue-100 dark:border-blue-500/20 shadow-sm">
                      <Icon size={22} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg tracking-tight">{editorData.isNew ? 'Add Link' : 'Edit Link'}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{platform?.label || 'Custom Link'}</p>
                    </div>
                  </div>
                  <button onClick={onCancel} className="p-2.5 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                    <Plus size={22} className="rotate-45" />
                  </button>
                </div>

                {/* Body */}
                <div className="flex-1 px-6 py-4 space-y-5 overflow-y-auto">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ml-1">Display Name</label>
                    <input
                      type="text"
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                      placeholder="e.g. My Portfolio"
                      className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/[0.03] border border-gray-200/75 dark:border-white/10 rounded-2xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ml-1">URL / Username</label>
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => { setUrl(e.target.value); setError(''); }}
                      placeholder="https://..."
                      className={`w-full px-4 py-3.5 bg-gray-50 dark:bg-white/[0.03] border rounded-2xl text-sm text-gray-900 dark:text-white font-mono focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 ${error ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/10' : 'border-gray-200/75 dark:border-white/10'}`}
                    />
                    {error && <p className="text-xs text-red-500 mt-1.5 ml-1 font-medium flex items-center gap-1.5"><Check size={12} className="rotate-45" /> {error}</p>}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 pt-4 flex items-center gap-3 shrink-0">
                  <button onClick={onCancel} className="flex-1 px-4 py-3.5 text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-white/10 rounded-2xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all">
                    Cancel
                  </button>
                  <button onClick={handleSave} className="flex-1 px-4 py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98]">
                    Save
                  </button>
                </div>
              </motion.div>
            );
          })()}
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(content, document.body);
};

function WizardProfileSection() {
  const { sections, addSection, updateSection, updateSectionRealTime } = useCardBuilderStore();
  
  const aboutSection = sections.find(s => s.type === 'about');
  
  const headline = aboutSection?.data?.headline || '';
  const bio = aboutSection?.data?.bio || '';

  const handleUpdate = (field, value) => {
    if (aboutSection) {
      updateSectionRealTime(aboutSection.sectionId, { [field]: value });
    } else {
      addSection({
        sectionId: 'about-' + Date.now(),
        type: 'about',
        isVisible: true,
        data: { headline: '', bio: '', [field]: value }
      });
    }
  };

  const handleBlur = (field, value) => {
    if (aboutSection) {
      updateSection(aboutSection.sectionId, { [field]: value });
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500 dark:text-zinc-400">
        Let's start with your basics. Add your name and a short bio.
      </p>
      
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ml-1">Your Name</label>
          <input
            type="text"
            value={headline}
            onChange={(e) => handleUpdate('headline', e.target.value)}
            onBlur={(e) => handleBlur('headline', e.target.value)}
            placeholder="e.g. John Doe"
            className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/[0.03] border border-gray-200/75 dark:border-white/10 rounded-2xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ml-1">Short Bio</label>
          <textarea
            value={bio}
            onChange={(e) => handleUpdate('bio', e.target.value)}
            onBlur={(e) => handleBlur('bio', e.target.value)}
            rows={3}
            placeholder="e.g. Crafting premium user experiences..."
            className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/[0.03] border border-gray-200/75 dark:border-white/10 rounded-2xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 resize-none"
          />
        </div>
      </div>
    </div>
  );
}

function WizardLinksSection() {
  const { sections, updateSection, addSection } = useCardBuilderStore();
  const { user } = useAuthStore();
  
  const userGoal = user?.goal && CATEGORIES[user.goal] ? user.goal : 'personal';
  const categoryData = CATEGORIES[userGoal];

  const linksSection = sections.find((s) => s.type === 'links');
  const links = linksSection?.data?.links || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [activeEditor, setActiveEditor] = useState(null);

  const handleUpdateLinks = (newLinks) => {
    if (linksSection) {
      updateSection(linksSection.sectionId, { links: newLinks });
    } else {
      addSection({
        type: 'links',
        sectionId: `links-${Date.now()}`,
        isVisible: true,
        order: sections.length,
        data: { links: newLinks }
      });
    }
  };

  const openAddModal = (platform) => {
    setActiveEditor({
      isNew: true,
      platformId: platform.id,
      link: {
        label: platform.id === 'custom' ? 'My Link' : platform.label,
        url: platform.prefix,
        platformId: platform.id
      }
    });
  };

  const openEditModal = (index) => {
    const link = links[index];
    setActiveEditor({
      isNew: false,
      index,
      platformId: link.platformId,
      link: { ...link }
    });
  };

  const handleSaveLink = (updatedLink) => {
    if (activeEditor.isNew) {
      handleUpdateLinks([updatedLink, ...links]);
    } else {
      const updated = [...links];
      updated[activeEditor.index] = updatedLink;
      handleUpdateLinks(updated);
    }
    setActiveEditor(null);
  };

  const removeLink = (index) => {
    handleUpdateLinks(links.filter((_, i) => i !== index));
  };

  // Drag and Drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = links.findIndex((_, idx) => `link-${idx}` === active.id);
      const newIndex = links.findIndex((_, idx) => `link-${idx}` === over.id);
      handleUpdateLinks(arrayMove(links, oldIndex, newIndex));
    }
  };

  // Filter available platforms based on category and search
  const availablePlatforms = LINK_PLATFORMS.filter(p => categoryData.links.includes(p.id));
  const filteredPlatforms = availablePlatforms.filter(p => p.label.toLowerCase().includes(searchQuery.toLowerCase()));

  const renderPlatformButton = (platformId) => {
    const p = LINK_PLATFORMS.find(p => p.id === platformId);
    if (!p) return null;
    
    const Icon = p.icon;
    const isAdded = !p.allowDuplicates && links.some(l => l.platformId === p.id || l.label === p.label);
    
    return (
      <button
        key={p.id}
        onClick={() => {
          if (isAdded) {
            const idx = links.findIndex(l => l.platformId === p.id || l.label === p.label);
            if (idx !== -1) openEditModal(idx);
          } else {
            openAddModal(p);
          }
        }}
        className={`group py-2 px-2.5 rounded-xl border text-[11px] font-semibold flex items-center justify-between transition-all ${
          isAdded 
            ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-500/20'
            : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-blue-400 dark:hover:border-blue-500 text-gray-700 dark:text-gray-300 hover:scale-[1.02]'
        }`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <Icon size={14} className={isAdded ? 'text-blue-600 dark:text-blue-400 shrink-0' : 'text-gray-400 dark:text-gray-500 shrink-0'} />
          <span className="truncate">{p.label}</span>
        </div>
        {isAdded ? (
          <Minus size={14} className="text-blue-600 dark:text-blue-400 shrink-0 opacity-70 group-hover:opacity-100" />
        ) : (
          <Plus size={14} className="text-gray-400 dark:text-gray-500 shrink-0 opacity-50 group-hover:opacity-100" />
        )}
      </button>
    );
  };

  return (
    <div className="space-y-6">
      <LinkEditorModal 
        editorData={activeEditor} 
        onSave={handleSaveLink} 
        onCancel={() => setActiveEditor(null)} 
      />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 dark:text-zinc-400">
            Add your social media profiles, website, and contact links.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search links (e.g. Instagram, Website)"
            className="w-full pl-8 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
          />
        </div>

        {/* Quick Add Lists */}
        {searchQuery ? (
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">Search Results</label>
            {filteredPlatforms.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {filteredPlatforms.map(p => renderPlatformButton(p.id))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 py-4 text-center">No links found for "{searchQuery}"</p>
            )}
          </div>
        ) : (
          <div className="space-y-5">

            {/* Popular */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">Popular for {userGoal}</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {categoryData.popular.map(id => renderPlatformButton(id))}
              </div>
            </div>

            {/* All available links for user goal */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">All Available Links</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {availablePlatforms.map(p => renderPlatformButton(p.id))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Added Links List with Drag and Drop */}
      <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-white/10">
        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">Your Card Links ({links.length})</label>
        
        {links.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-300 dark:text-gray-600">
              <Link2 size={24} />
            </div>
            <p className="text-xs text-gray-400 font-medium">No links added yet</p>
            <button
              onClick={() => document.querySelector('input[type="search"]')?.focus()}
              className="mt-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg text-[11px] font-bold transition-all"
            >
              + Add Your First Link
            </button>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={links.map((_, i) => `link-${i}`)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {links.map((link, index) => (
                  <SortableLinkItem 
                    key={`link-${index}`} 
                    link={link} 
                    index={index} 
                    removeLink={removeLink} 
                    editLink={openEditModal} 
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}
