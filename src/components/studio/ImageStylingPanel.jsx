'use client';

import React, { useState } from 'react';
import { useCardBuilderStore } from '@/store/cardBuilderStore';
import { Sliders, X, Sparkles, Layout, Compass, ShieldAlert } from 'lucide-react';
import { toast } from '@/components/ui/Toast';

const SHAPES = [
  { id: 'Circle', label: 'Circle' },
  { id: 'Rounded Rectangle', label: 'Rounded Square' },
  { id: 'Square', label: 'Square' },
  { id: 'Capsule', label: 'Capsule' },
  { id: 'Diamond', label: 'Diamond' },
  { id: 'Hexagon', label: 'Hexagon' },
  { id: 'Blob', label: 'Organic Blob' },
  { id: 'Shield', label: 'Shield Frame' },
  { id: 'None', label: 'No Container' },
];

export default function ImageStylingPanel() {
  const store = useCardBuilderStore();
  const { 
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
    updateHeaderImageRealTime
  } = store;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleUpdate = (field, val) => {
    updateHeaderImageRealTime({ [field]: val });
  };

  const handleSaveStyle = () => {
    toast.success('Header image layout styling preset saved!');
    setIsDrawerOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Image Styling</h2>
          <p className="text-xs text-zinc-400">Configure layouts, container outlines, shadows, and color effects.</p>
        </div>
        {imageUrl ? (
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-1.5 cursor-pointer animate-pulse"
          >
            <Sliders size={13} />
            Add Image Style
          </button>
        ) : null}
      </div>

      {imageUrl ? (
        <div className="bg-zinc-900/30 border border-zinc-800 p-5 rounded-2xl space-y-4 text-left">
          <div className="flex justify-between text-xs text-zinc-400">
            <span>Placement Mode:</span>
            <span className="font-bold text-white">{imagePlacement}</span>
          </div>
          <div className="flex justify-between text-xs text-zinc-400">
            <span>Container Mask:</span>
            <span className="font-bold text-white">{containerStyle}</span>
          </div>
          <div className="flex justify-between text-xs text-zinc-400">
            <span>Brightness:</span>
            <span className="font-bold text-white">{imageBrightness}%</span>
          </div>
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="w-full py-2.5 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 rounded-xl text-xs font-bold transition-all border border-zinc-800 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sliders size={13} />
            Configure Styling Parameters
          </button>
        </div>
      ) : (
        <div className="p-10 border border-dashed border-zinc-850 rounded-2xl text-center text-zinc-500 text-xs flex flex-col items-center justify-center gap-2">
          <ShieldAlert size={20} className="text-zinc-600" />
          Please upload/select an avatar image first in the previous step.
        </div>
      )}

      {/* ───────────────── IMAGE STYLE BUILDER DRAWER ───────────────── */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black/80 flex justify-end z-50 animate-fade-in select-none">
          <div className="w-full max-w-lg bg-zinc-900 border-l border-zinc-800 h-full flex flex-col shadow-2xl relative">
            
            {/* Header */}
            <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                  <Sliders size={14} className="text-blue-500" />
                  Image Style Builder
                </h3>
                <p className="text-[10px] text-zinc-500">Configure visual borders, alignments, and scale positions.</p>
              </div>
              <button 
                type="button" 
                onClick={() => setIsDrawerOpen(false)}
                className="w-8 h-8 rounded-lg bg-zinc-850 hover:bg-zinc-800 flex items-center justify-center text-zinc-400 cursor-pointer border border-zinc-800"
              >
                <X size={14} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar text-left">
              
              {/* Image Placement Mode */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">Image Placement</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Inside Header', 'Free Position'].map(mode => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => handleUpdate('imagePlacement', mode)}
                      className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                        imagePlacement === mode ? 'bg-blue-600 text-white border-blue-500' : 'bg-zinc-950 text-zinc-400 border-zinc-850 hover:bg-zinc-900'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shapes Gallery */}
              <div className="space-y-3 pt-3 border-t border-zinc-800/60">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">Avatar Shapes Container</label>
                <div className="grid grid-cols-3 gap-2">
                  {SHAPES.map(s => {
                    const selected = containerStyle === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleUpdate('containerStyle', s.id)}
                        className={`py-2 px-3 text-[10px] font-bold rounded-lg border transition-all text-center cursor-pointer ${
                          selected ? 'bg-blue-600 text-white border-blue-500' : 'bg-zinc-950 text-zinc-400 border-zinc-850 hover:bg-zinc-900'
                        }`}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dimensions and borders */}
              <div className="space-y-4 pt-3 border-t border-zinc-800/60">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Avatar Dimensions</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-bold text-zinc-400 uppercase tracking-wide">
                      <span>Container Size</span>
                      <span>{containerSize}%</span>
                    </div>
                    <input 
                      type="range"
                      min="50"
                      max="150"
                      value={containerSize}
                      onChange={e => handleUpdate('containerSize', Number(e.target.value))}
                      className="w-full accent-blue-600 bg-zinc-950 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-bold text-zinc-400 uppercase tracking-wide">
                      <span>Inner Padding</span>
                      <span>{containerPadding}px</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="20"
                      value={containerPadding}
                      onChange={e => handleUpdate('containerPadding', Number(e.target.value))}
                      className="w-full accent-blue-600 bg-zinc-950 rounded-lg cursor-pointer"
                    />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={containerBorder}
                      onChange={e => handleUpdate('containerBorder', e.target.checked)}
                      className="rounded border-zinc-800 text-blue-600 focus:ring-blue-500/30 bg-zinc-950"
                    />
                    <span className="text-xs text-zinc-300 font-semibold">Avatar Border Outline</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={containerShadow}
                      onChange={e => handleUpdate('containerShadow', e.target.checked)}
                      className="rounded border-zinc-800 text-blue-600 focus:ring-blue-500/30 bg-zinc-950"
                    />
                    <span className="text-xs text-zinc-300 font-semibold">Avatar Drop Shadow</span>
                  </label>
                </div>
              </div>

              {/* Adjustments & Effects */}
              <div className="space-y-4 pt-3 border-t border-zinc-800/60">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Filters & Color Effects</h4>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'imageScale', label: 'Scale Zoom', min: 50, max: 200, unit: '%' },
                    { id: 'imageRotation', label: 'Rotation Align', min: 0, max: 360, unit: '°' },
                    { id: 'imageOpacity', label: 'Opacity Alpha', min: 10, max: 100, unit: '%' },
                    { id: 'imageBlur', label: 'Gaussian Blur', min: 0, max: 10, unit: 'px' },
                    { id: 'imageBrightness', label: 'Brightness Light', min: 50, max: 150, unit: '%' },
                    { id: 'imageContrast', label: 'Contrast Ratio', min: 50, max: 150, unit: '%' },
                    { id: 'imageSaturation', label: 'Color Saturation', min: 50, max: 150, unit: '%' },
                  ].map(adj => (
                    <div key={adj.id} className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold text-zinc-400 uppercase tracking-wide">
                        <span>{adj.label}</span>
                        <span>{store[adj.id] !== undefined ? store[adj.id] : adj.min}{adj.unit}</span>
                      </div>
                      <input 
                        type="range"
                        min={adj.min}
                        max={adj.max}
                        value={store[adj.id] !== undefined ? store[adj.id] : adj.min}
                        onChange={e => handleUpdate(adj.id, Number(e.target.value))}
                        className="w-full accent-blue-600 bg-zinc-950 rounded-lg cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-5 border-t border-zinc-800/80 flex gap-3 bg-zinc-900 shrink-0">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="flex-1 py-3 text-xs font-bold bg-zinc-800 hover:bg-zinc-750 text-zinc-350 rounded-xl transition-all border border-zinc-750 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveStyle}
                className="flex-1 py-3 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Apply Layout Style
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
