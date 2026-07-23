'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCardBuilderStore } from '@/store/cardBuilderStore';
import {
  X, Upload, Trash2, RefreshCw, User, RotateCw,
  FlipHorizontal2, FlipVertical2, Layers, Plus, Minus
} from 'lucide-react';

// Shape definitions with clip-path or borderRadius
const SHAPES = [
  { id: 'circle',    label: 'Circle',    preview: 'rounded-full' },
  { id: 'rounded',   label: 'Rounded',   preview: 'rounded-2xl' },
  { id: 'square',    label: 'Square',    preview: 'rounded-none' },
  { id: 'capsule',   label: 'Capsule',   preview: 'rounded-full', style: { borderRadius: '9999px', aspectRatio: '2/1' } },
  { id: 'hexagon',   label: 'Hexagon',   preview: '', style: { clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' } },
  { id: 'diamond',   label: 'Diamond',   preview: '', style: { clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' } },
  { id: 'blob',      label: 'Blob',      preview: '', style: { clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' } },
  { id: 'star',      label: 'Star',      preview: '', style: { clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' } },
  { id: 'shield',    label: 'Shield',    preview: '', style: { clipPath: 'polygon(50% 0%, 100% 25%, 100% 70%, 50% 100%, 0% 70%, 0% 25%)' } },
  { id: 'organic',   label: 'Organic',   preview: '', style: { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' } },
];

const POSITION_PRESETS = [
  ['top-left', 'top-center', 'top-right'],
  ['center-left', 'center', 'center-right'],
  ['bottom-left', 'bottom-center', 'bottom-right'],
];

const LAYER_OPTIONS = [
  { id: 'above-cover', label: 'Above Cover Image' },
  { id: 'above-header', label: 'Above Header' },
  { id: 'between', label: 'Between Header & Body' },
  { id: 'floating', label: 'Floating' },
];

const Slider = ({ label, value, min, max, step = 1, unit = '', onChange }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-[11px]">
      <span className="font-semibold text-gray-600">{label}</span>
      <span className="font-mono text-gray-400">{value}{unit}</span>
    </div>
    <div className="flex items-center gap-2">
      <button 
        onClick={() => onChange(Math.max(min, value - step))}
        className="w-5 h-5 flex items-center justify-center bg-gray-100 rounded-md text-gray-500 hover:text-gray-900 transition-colors shrink-0"
      >
        <Minus size={12} />
      </button>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-1.5 rounded-full accent-violet-500 cursor-pointer" />
      <button 
        onClick={() => onChange(Math.min(max, value + step))}
        className="w-5 h-5 flex items-center justify-center bg-gray-100 rounded-md text-gray-500 hover:text-gray-900 transition-colors shrink-0"
      >
        <Plus size={12} />
      </button>
    </div>
  </div>
);

const Section = ({ title, children }) => (
  <div className="space-y-3">
    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{title}</p>
    {children}
  </div>
);

const TAB_DEFS = [
  { id: 'image', label: 'Image' },
  { id: 'shape', label: 'Shape' },
  { id: 'appearance', label: 'Style' },
  { id: 'position', label: 'Position' },
  { id: 'layer', label: 'Layer' },
];

export default function AvatarEditorPanel() {
  const store = useCardBuilderStore();
  const {
    isAvatarEditorOpen, closeAvatarEditor,
    avatarUrl, avatarShape, avatarScale,
    avatarPositionX, avatarPositionY, avatarRotation,
    avatarFlipH, avatarFlipV,
    avatarBorderWidth, avatarBorderColor,
    avatarShadow, avatarGlow, avatarBackground, avatarOpacity,
    avatarPosition, avatarLayer,
    updateAvatar, updateAvatarRealTime,
  } = store;

  const [activeTab, setActiveTab] = useState('image');

  const rt = (patch) => updateAvatarRealTime(patch);
  const commit = (patch) => updateAvatar(patch);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => commit({ avatarUrl: ev.target.result });
    reader.readAsDataURL(file);
  };

  const getShapeStyle = (shape) => {
    const def = SHAPES.find((s) => s.id === shape);
    if (!def) return {};
    return def.style || {};
  };
  const getShapeClass = (shape) => {
    const def = SHAPES.find((s) => s.id === shape);
    return def?.preview || '';
  };

  if (!isAvatarEditorOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="avatar-editor"
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 36 }}
        className="fixed right-0 top-0 h-full w-[320px] bg-white border-l border-gray-200 shadow-2xl z-[60] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
              <User size={14} className="text-violet-600" />
            </div>
            <span className="font-bold text-gray-900 text-sm">Profile Photo</span>
          </div>
          <button onClick={closeAvatarEditor}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex border-b border-gray-100 shrink-0 overflow-x-auto no-scrollbar">
          {TAB_DEFS.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex-1 min-w-0 py-2.5 px-1 text-[10px] font-semibold transition-all border-b-2 ${
                activeTab === t.id
                  ? 'border-violet-500 text-violet-600'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Live mini preview */}
        <div className="flex justify-center py-4 bg-gray-50 border-b border-gray-100 shrink-0">
          <div
            style={{
              width: 80, height: 80,
              transform: `scale(${avatarScale / 100}) rotate(${avatarRotation}deg) scaleX(${avatarFlipH ? -1 : 1}) scaleY(${avatarFlipV ? -1 : 1})`,
              ...getShapeStyle(avatarShape),
              overflow: 'hidden',
              border: `${avatarBorderWidth}px solid ${avatarBorderColor}`,
              boxShadow: avatarShadow ? '0 4px 16px rgba(0,0,0,0.2)' : avatarGlow ? `0 0 20px ${avatarBorderColor}80` : 'none',
              background: avatarBackground === 'transparent' ? '#f3f4f6' : avatarBackground,
              opacity: avatarOpacity / 100,
            }}
            className={`relative ${getShapeClass(avatarShape)}`}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <User size={28} className="text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 no-scrollbar">

          {/* ── IMAGE ── */}
          {activeTab === 'image' && (
            <div className="space-y-4">
              {avatarUrl ? (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-gray-200">
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-700 truncate">Profile Photo</p>
                    <p className="text-[11px] text-gray-400">Uploaded</p>
                  </div>
                  <div className="flex gap-1.5">
                    <label className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition shadow-sm">
                      <RefreshCw size={13} className="text-gray-600" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                    </label>
                    <button onClick={() => commit({ avatarUrl: '' })}
                      className="w-8 h-8 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center hover:bg-red-100 transition">
                      <Trash2 size={13} className="text-red-500" />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-3 h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-violet-400 hover:bg-violet-50/50 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-violet-100 flex items-center justify-center transition">
                    <Upload size={18} className="text-gray-400 group-hover:text-violet-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-600 group-hover:text-violet-600">Upload Profile Photo</p>
                    <p className="text-[11px] text-gray-400">JPG, PNG, WebP</p>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                </label>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-500">Or paste photo URL</label>
                <input type="text" value={avatarUrl?.startsWith('http') ? avatarUrl : ''} placeholder="https://example.com/photo.jpg"
                  onChange={(e) => {
                    const val = e.target.value;
                    rt({ avatarUrl: val });
                    commit({ avatarUrl: val });
                  }}
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400" />
              </div>
            </div>
          )}

          {/* ── SHAPE ── */}
          {activeTab === 'shape' && (
            <Section title="Container Shape">
              <div className="grid grid-cols-5 gap-2">
                {SHAPES.map((shape) => (
                  <button key={shape.id} onClick={() => commit({ avatarShape: shape.id })}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${
                      avatarShape === shape.id
                        ? 'border-violet-500 bg-violet-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}>
                    <div
                      className={`w-8 h-8 bg-violet-300 overflow-hidden ${shape.preview || ''}`}
                      style={shape.style || {}}
                    />
                    <span className="text-[9px] font-bold text-gray-500 text-center leading-tight">{shape.label}</span>
                  </button>
                ))}
              </div>
            </Section>
          )}

          {/* ── APPEARANCE ── */}
          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <Section title="Border">
                <Slider label="Border Width" value={avatarBorderWidth} min={0} max={12} unit="px" onChange={(v) => rt({ avatarBorderWidth: v })} />
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-gray-600">Border Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={avatarBorderColor}
                      onChange={(e) => rt({ avatarBorderColor: e.target.value })}
                      className="w-10 h-8 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
                    <input type="text" value={avatarBorderColor}
                      onChange={(e) => rt({ avatarBorderColor: e.target.value })}
                      className="flex-1 px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 font-mono" />
                  </div>
                </div>
              </Section>
              <Section title="Shadow & Glow">
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => commit({ avatarShadow: !avatarShadow, avatarGlow: false })}
                    className={`py-2.5 rounded-xl text-[11px] font-semibold border transition-all ${
                      avatarShadow ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}>
                    Shadow
                  </button>
                  <button onClick={() => commit({ avatarGlow: !avatarGlow, avatarShadow: false })}
                    className={`py-2.5 rounded-xl text-[11px] font-semibold border transition-all ${
                      avatarGlow ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}>
                    Glow
                  </button>
                </div>
              </Section>
              <Section title="Background">
                <div className="flex items-center gap-2">
                  <input type="color" value={avatarBackground === 'transparent' ? '#ffffff' : avatarBackground}
                    onChange={(e) => rt({ avatarBackground: e.target.value })}
                    className="w-10 h-8 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
                  <input type="text" value={avatarBackground}
                    onChange={(e) => rt({ avatarBackground: e.target.value })}
                    placeholder="transparent"
                    className="flex-1 px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 font-mono" />
                </div>
              </Section>
              <Section title="Opacity">
                <Slider label="Opacity" value={avatarOpacity} min={0} max={100} unit="%" onChange={(v) => rt({ avatarOpacity: v })} />
              </Section>
            </div>
          )}

          {/* ── POSITION ── */}
          {activeTab === 'position' && (
            <div className="space-y-5">
              <Section title="Transform">
                <Slider label="Scale" value={avatarScale} min={50} max={200} unit="%" onChange={(v) => rt({ avatarScale: v })} />
                <Slider label="Rotation" value={avatarRotation} min={0} max={360} unit="°" onChange={(v) => rt({ avatarRotation: v })} />
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => commit({ avatarFlipH: !avatarFlipH })}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-semibold border transition ${
                      avatarFlipH ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}>
                    <FlipHorizontal2 size={12} /> Flip H
                  </button>
                  <button onClick={() => commit({ avatarFlipV: !avatarFlipV })}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-semibold border transition ${
                      avatarFlipV ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}>
                    <FlipVertical2 size={12} /> Flip V
                  </button>
                </div>
              </Section>

              <Section title="Position Preset">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-2 space-y-1.5">
                  {POSITION_PRESETS.map((row, ri) => (
                    <div key={ri} className="grid grid-cols-3 gap-1.5">
                      {row.map((pos) => (
                        <button key={pos} onClick={() => commit({ avatarPosition: pos })}
                          className={`py-2.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${
                            avatarPosition === pos
                              ? 'bg-violet-500 text-white shadow-sm'
                              : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
                          }`}>
                          {pos.replace('-', ' ').replace('center', 'ctr')}
                        </button>
                      ))}
                    </div>
                  ))}
                  <button onClick={() => commit({ avatarPosition: 'custom' })}
                    className={`w-full py-2.5 rounded-lg text-[10px] font-bold transition-all ${
                      avatarPosition === 'custom'
                        ? 'bg-violet-500 text-white shadow-sm'
                        : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
                    }`}>
                    Custom Drag
                  </button>
                </div>
                {avatarPosition === 'custom' && (
                  <div className="space-y-2 pt-1">
                    <Slider label="Position X" value={avatarPositionX} min={-200} max={400} unit="px" onChange={(v) => rt({ avatarPositionX: v })} />
                    <Slider label="Position Y" value={avatarPositionY} min={-100} max={600} unit="px" onChange={(v) => rt({ avatarPositionY: v })} />
                  </div>
                )}
              </Section>
            </div>
          )}

          {/* ── LAYER ── */}
          {activeTab === 'layer' && (
            <Section title="Layer Order">
              <div className="space-y-2">
                {LAYER_OPTIONS.map((opt) => (
                  <button key={opt.id} onClick={() => commit({ avatarLayer: opt.id })}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-sm font-semibold text-left ${
                      avatarLayer === opt.id
                        ? 'border-violet-500 bg-violet-50 text-violet-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}>
                    <Layers size={14} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* Footer */}
        {avatarUrl && (
          <div className="p-4 border-t border-gray-100 shrink-0">
            <button onClick={() => commit({ avatarUrl: '', avatarScale: 100, avatarRotation: 0, avatarFlipH: false, avatarFlipV: false })}
              className="w-full py-2.5 flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 rounded-xl text-sm font-semibold transition">
              <Trash2 size={14} />
              Remove Profile Photo
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
