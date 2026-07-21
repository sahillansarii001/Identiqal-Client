'use client';
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCardBuilderStore } from '@/store/cardBuilderStore';
import {
  X, Upload, Trash2, RefreshCw, Sun, Contrast, Droplets,
  Wind, Eye, Layers, Move, ZoomIn, RotateCw, FlipHorizontal2,
  FlipVertical2, AlignCenter, Maximize2, Minimize2, Image as ImgIcon,
  ChevronDown,
} from 'lucide-react';

const OVERLAY_OPTIONS = [
  { id: 'None', label: 'None', preview: 'bg-transparent border-2 border-dashed border-gray-300' },
  { id: 'Dark Overlay', label: 'Dark', preview: 'bg-black/60' },
  { id: 'Light Overlay', label: 'Light', preview: 'bg-white/60' },
  { id: 'Gradient Overlay', label: 'Gradient', preview: 'bg-gradient-to-b from-blue-600/70 to-transparent' },
  { id: 'Glass Overlay', label: 'Glass', preview: 'bg-white/20 backdrop-blur-sm border border-white/30' },
];

const PLACEMENT_OPTIONS = [
  { id: 'Inside Header', label: 'Inside Header', icon: '▥' },
  { id: 'Behind Header Design', label: 'Behind Header', icon: '◫' },
  { id: 'Above Header Design', label: 'Above Header', icon: '⬡' },
  { id: 'Free Position', label: 'Free Position', icon: '✥' },
];

const FIT_OPTIONS = ['Cover', 'Contain', 'Fill', 'Original'];

const TAB_DEFS = [
  { id: 'image', label: 'Image', icon: ImgIcon },
  { id: 'transform', label: 'Transform', icon: Move },
  { id: 'placement', label: 'Placement', icon: Layers },
  { id: 'effects', label: 'Effects', icon: Sun },
  { id: 'overlay', label: 'Overlay', icon: Eye },
];

// ── Slider ────────────────────────────────────────────────────────────────────
const Slider = ({ label, value, min, max, step = 1, unit = '', onChange }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-[11px]">
      <span className="font-semibold text-gray-600">{label}</span>
      <span className="font-mono text-gray-400">{value}{unit}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1.5 rounded-full accent-blue-500 cursor-pointer" />
  </div>
);

// ── Section heading ───────────────────────────────────────────────────────────
const Section = ({ title, children }) => (
  <div className="space-y-3">
    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{title}</p>
    {children}
  </div>
);

export default function CoverEditorPanel() {
  const store = useCardBuilderStore();
  const {
    isCoverEditorOpen, closeCoverEditor,
    imageUrl, imageScale, imagePositionX, imagePositionY, imageOpacity,
    overlayType, imageRotation, imagePlacement, imageFit,
    imageBlur, imageBrightness, imageContrast, imageSaturation,
    updateHeaderImage, updateHeaderImageRealTime,
  } = store;

  const [activeTab, setActiveTab] = useState('image');
  const fileRef = useRef(null);

  const rt = (patch) => updateHeaderImageRealTime(patch);
  const commit = (patch) => updateHeaderImage(patch);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => commit({ imageUrl: ev.target.result });
    reader.readAsDataURL(file);
  };

  if (!isCoverEditorOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="cover-editor"
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 36 }}
        className="fixed right-0 top-0 h-full w-[320px] bg-white border-l border-gray-200 shadow-2xl z-[60] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <ImgIcon size={14} className="text-blue-600" />
            </div>
            <span className="font-bold text-gray-900 text-sm">Cover Image</span>
          </div>
          <button onClick={closeCoverEditor}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex border-b border-gray-100 shrink-0 overflow-x-auto no-scrollbar">
          {TAB_DEFS.map((t) => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex-1 min-w-0 flex flex-col items-center gap-0.5 py-2 px-1 text-[10px] font-semibold transition-all border-b-2 ${
                  activeTab === t.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}>
                <Icon size={13} />
                <span className="truncate w-full text-center">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 no-scrollbar">

          {/* ── IMAGE TAB ── */}
          {activeTab === 'image' && (
            <div className="space-y-4">
              {imageUrl ? (
                <div className="relative rounded-xl overflow-hidden aspect-video bg-gray-100 group">
                  <img src={imageUrl} alt="Cover" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <label className="w-8 h-8 bg-white rounded-lg flex items-center justify-center cursor-pointer shadow-sm hover:bg-gray-50 transition">
                      <RefreshCw size={14} className="text-gray-700" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                    </label>
                    <button onClick={() => commit({ imageUrl: '' })}
                      className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center hover:bg-red-600 transition shadow-sm">
                      <Trash2 size={14} className="text-white" />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-3 h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition">
                    <Upload size={18} className="text-gray-400 group-hover:text-blue-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-600 group-hover:text-blue-600">Upload Cover Image</p>
                    <p className="text-[11px] text-gray-400">JPG, PNG, WebP up to 10MB</p>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                </label>
              )}

              {/* URL paste */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-500">Or paste image URL</label>
                <input type="text" value={imageUrl || ''} placeholder="https://example.com/image.jpg"
                  onChange={(e) => rt({ imageUrl: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400" />
              </div>

              {/* Quick actions */}
              {imageUrl && (
                <Section title="Quick Actions">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Fit Header', action: () => commit({ imageScale: 100, imagePositionX: 0, imagePositionY: 0 }), icon: Minimize2 },
                      { label: 'Fill Header', action: () => commit({ imageScale: 140, imagePositionX: 0, imagePositionY: 0 }), icon: Maximize2 },
                      { label: 'Center', action: () => commit({ imagePositionX: 0, imagePositionY: 0 }), icon: AlignCenter },
                      { label: 'Reset All', action: () => commit({ imageScale: 100, imagePositionX: 0, imagePositionY: 0, imageRotation: 0, imageOpacity: 80, overlayType: 'None', imageBrightness: 100, imageContrast: 100, imageSaturation: 100, imageBlur: 0 }), icon: RefreshCw },
                    ].map((btn) => {
                      const Icon = btn.icon;
                      return (
                        <button key={btn.label} onClick={btn.action}
                          className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-[11px] font-semibold transition-all">
                          <Icon size={12} />
                          {btn.label}
                        </button>
                      );
                    })}
                  </div>
                </Section>
              )}
            </div>
          )}

          {/* ── TRANSFORM TAB ── */}
          {activeTab === 'transform' && (
            <div className="space-y-4">
              <Section title="Scale & Position">
                <Slider label="Zoom" value={imageScale} min={50} max={300} unit="%" onChange={(v) => rt({ imageScale: v })} />
                <Slider label="Position X" value={imagePositionX} min={-300} max={300} unit="px" onChange={(v) => rt({ imagePositionX: v })} />
                <Slider label="Position Y" value={imagePositionY} min={-300} max={300} unit="px" onChange={(v) => rt({ imagePositionY: v })} />
              </Section>
              <Section title="Rotation">
                <Slider label="Rotate" value={imageRotation} min={0} max={360} unit="°" onChange={(v) => rt({ imageRotation: v })} />
              </Section>
              <Section title="Flip">
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => commit({ imageRotation: (imageRotation + 180) % 360 })}
                    className="flex items-center gap-1.5 px-3 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-[11px] font-semibold transition">
                    <FlipHorizontal2 size={13} /> Flip H
                  </button>
                  <button onClick={() => commit({ imagePositionY: -imagePositionY })}
                    className="flex items-center gap-1.5 px-3 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-[11px] font-semibold transition">
                    <FlipVertical2 size={13} /> Flip V
                  </button>
                </div>
              </Section>
              <Section title="Fit Mode">
                <div className="grid grid-cols-2 gap-2">
                  {FIT_OPTIONS.map((f) => (
                    <button key={f} onClick={() => commit({ imageFit: f })}
                      className={`py-2 rounded-xl text-[11px] font-semibold transition ${
                        imageFit === f ? 'bg-blue-500 text-white shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}>
                      {f}
                    </button>
                  ))}
                </div>
              </Section>
            </div>
          )}

          {/* ── PLACEMENT TAB ── */}
          {activeTab === 'placement' && (
            <div className="space-y-4">
              <Section title="Placement Mode">
                <div className="space-y-2">
                  {PLACEMENT_OPTIONS.map((p) => (
                    <button key={p.id} onClick={() => commit({ imagePlacement: p.id })}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-sm font-semibold text-left ${
                        imagePlacement === p.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      }`}>
                      <span className="text-lg leading-none">{p.icon}</span>
                      {p.label}
                      {p.id === 'Free Position' && (
                        <span className="ml-auto text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">Canva Mode</span>
                      )}
                    </button>
                  ))}
                </div>
              </Section>
              {imagePlacement === 'Free Position' && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-[11px] text-orange-700 font-medium">
                  In Free Position mode, the image is not clipped — drag it anywhere on the card canvas.
                </div>
              )}
            </div>
          )}

          {/* ── EFFECTS TAB ── */}
          {activeTab === 'effects' && (
            <div className="space-y-4">
              <Section title="Adjustments">
                <Slider label="Brightness" value={imageBrightness} min={0} max={200} unit="%" onChange={(v) => rt({ imageBrightness: v })} />
                <Slider label="Contrast" value={imageContrast} min={0} max={200} unit="%" onChange={(v) => rt({ imageContrast: v })} />
                <Slider label="Saturation" value={imageSaturation} min={0} max={200} unit="%" onChange={(v) => rt({ imageSaturation: v })} />
                <Slider label="Blur" value={imageBlur} min={0} max={20} unit="px" onChange={(v) => rt({ imageBlur: v })} />
                <Slider label="Opacity" value={imageOpacity} min={0} max={100} unit="%" onChange={(v) => rt({ imageOpacity: v })} />
              </Section>
              <button onClick={() => commit({ imageBrightness: 100, imageContrast: 100, imageSaturation: 100, imageBlur: 0, imageOpacity: 80 })}
                className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-[12px] font-semibold transition">
                Reset Effects
              </button>
            </div>
          )}

          {/* ── OVERLAY TAB ── */}
          {activeTab === 'overlay' && (
            <div className="space-y-4">
              <Section title="Overlay Style">
                <div className="space-y-2">
                  {OVERLAY_OPTIONS.map((ov) => (
                    <button key={ov.id} onClick={() => commit({ overlayType: ov.id })}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all ${
                        overlayType === ov.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}>
                      <div className={`w-8 h-5 rounded-md ${ov.preview} shrink-0`} />
                      <span className="text-sm font-semibold text-gray-700">{ov.label}</span>
                      {overlayType === ov.id && (
                        <span className="ml-auto w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </Section>
            </div>
          )}
        </div>

        {/* Footer */}
        {imageUrl && (
          <div className="p-4 border-t border-gray-100 shrink-0">
            <button onClick={() => commit({ imageUrl: '', imageScale: 100, imagePositionX: 0, imagePositionY: 0, imageOpacity: 80, overlayType: 'None', imageBrightness: 100, imageContrast: 100, imageSaturation: 100, imageBlur: 0 })}
              className="w-full py-2.5 flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 rounded-xl text-sm font-semibold transition">
              <Trash2 size={14} />
              Remove Cover Image
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
