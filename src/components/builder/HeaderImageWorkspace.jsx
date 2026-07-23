'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCardBuilderStore } from '@/store/cardBuilderStore';
import { SectionRenderer } from './SectionRenderer';

const LIBRARY_TEMPLATES = [
  {
    name: 'Minimalist Abstract',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Earthy Forest',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Neon Gradient',
    url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Paint Splash',
    url: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Tech Desk',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Clean Marble',
    url: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80',
  }
];

export default function HeaderImageWorkspace() {
  const {
    isWorkspaceOpen,
    closeWorkspace,
    discardWorkspaceChanges,
    updateHeaderImage,
    updateHeaderImageRealTime,
    _workspaceBackup,
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
    sections,
    displayPreset,
    colorTheme,
    footerPreset,
    cardId
  } = useCardBuilderStore();

  const [activeTab, setActiveTab] = useState('placement'); // 'placement', 'style', 'effects'
  const [zoom, setZoom] = useState(1); // Canvas zoom
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [spacePressed, setSpacePressed] = useState(false);
  
  // Drag refs
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const dragStart = useRef(null);
  const panStart = useRef(null);

  // Undo/Redo stack for workspace session (local history)
  const [history, setHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  // Monitor Space Key for panning mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        setSpacePressed(true);
      }
      // Arrow Keys fine positioning
      const isShift = e.shiftKey;
      const step = isShift ? 1 : 5;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
        let dx = 0;
        let dy = 0;
        if (e.code === 'ArrowUp') dy = -step;
        if (e.code === 'ArrowDown') dy = step;
        if (e.code === 'ArrowLeft') dx = -step;
        if (e.code === 'ArrowRight') dx = step;
        
        updateHeaderImageRealTime({
          imagePositionX: (imagePositionX || 0) + dx,
          imagePositionY: (imagePositionY || 0) + dy
        });
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        setSpacePressed(false);
        setIsPanning(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [imagePositionX, imagePositionY, updateHeaderImageRealTime]);

  if (!isWorkspaceOpen) return null;

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateHeaderImage({
        imageUrl: ev.target.result,
        imageScale: 100,
        imagePositionX: 0,
        imagePositionY: 0,
        imageRotation: 0,
        imageOpacity: 80,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleStartDrag = (e) => {
    if (spacePressed) {
      // Pan canvas
      setIsPanning(true);
      const clientX = e.clientX !== undefined ? e.clientX : e.touches[0].clientX;
      const clientY = e.clientY !== undefined ? e.clientY : e.touches[0].clientY;
      panStart.current = { startX: clientX, startY: clientY, initX: panX, initY: panY };
    } else {
      // Drag image
      const clientX = e.clientX !== undefined ? e.clientX : e.touches[0].clientX;
      const clientY = e.clientY !== undefined ? e.clientY : e.touches[0].clientY;
      dragStart.current = {
        startX: clientX,
        startY: clientY,
        initX: imagePositionX || 0,
        initY: imagePositionY || 0
      };
    }
  };

  const handleMoveDrag = (e) => {
    if (isPanning && panStart.current) {
      const clientX = e.clientX !== undefined ? e.clientX : e.touches[0].clientX;
      const clientY = e.clientY !== undefined ? e.clientY : e.touches[0].clientY;
      const dx = clientX - panStart.current.startX;
      const dy = clientY - panStart.current.startY;
      setPanX(panStart.current.initX + dx);
      setPanY(panStart.current.initY + dy);
    } else if (dragStart.current) {
      const clientX = e.clientX !== undefined ? e.clientX : e.touches[0].clientX;
      const clientY = e.clientY !== undefined ? e.clientY : e.touches[0].clientY;
      const dx = clientX - dragStart.current.startX;
      const dy = clientY - dragStart.current.startY;
      
      let nextX = dragStart.current.initX + dx;
      let nextY = dragStart.current.initY + dy;

      // Smart snapping (snap to center if within 10px)
      if (Math.abs(nextX) < 10) nextX = 0;
      if (Math.abs(nextY) < 10) nextY = 0;

      // Mode 1: Clamped to header (if Placement is 'Inside Header')
      if (imagePlacement === 'Inside Header') {
        const headerEl = canvasRef.current;
        if (headerEl) {
          const rect = headerEl.getBoundingClientRect();
          const sv = (imageScale || 100) / 100;
          let maxDragX = Math.max(0, (rect.width * sv - rect.width) / 2);
          const maxDragY = Math.max(0, (rect.height * sv - rect.height) / 2);

          if (displayPreset?.headerStyle === 'Diagonal Split') {
            maxDragX = Math.max(maxDragX, rect.width * 0.4);
          }

          nextX = Math.max(-maxDragX, Math.min(maxDragX, nextX));
          nextY = Math.max(-maxDragY, Math.min(maxDragY, nextY));
        }
      }

      updateHeaderImageRealTime({
        imagePositionX: Math.round(nextX),
        imagePositionY: Math.round(nextY)
      });
    }
  };

  const handleEndDrag = () => {
    dragStart.current = null;
    panStart.current = null;
    setIsPanning(false);
  };

  const handleResetParameters = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
    updateHeaderImage({
      imageScale: 100,
      imagePositionX: 0,
      imagePositionY: 0,
      imageRotation: 0,
      imageOpacity: 80,
      overlayType: 'None',
      imagePlacement: 'Inside Header',
      containerStyle: 'None',
      containerSize: 100,
      containerBorder: false,
      containerShadow: false,
      containerPadding: 0,
      imageFit: 'Cover',
      imageBlur: 0,
      imageBrightness: 100,
      imageContrast: 100,
      imageSaturation: 100,
    });
  };

  const handleRevertChanges = () => {
    if (_workspaceBackup) {
      setZoom(1);
      setPanX(0);
      setPanY(0);
      updateHeaderImage({
        imageUrl: _workspaceBackup.imageUrl,
        imageScale: _workspaceBackup.imageScale,
        imagePositionX: _workspaceBackup.imagePositionX,
        imagePositionY: _workspaceBackup.imagePositionY,
        imageOpacity: _workspaceBackup.imageOpacity,
        overlayType: _workspaceBackup.overlayType,
        imageRotation: _workspaceBackup.imageRotation,
        imagePlacement: _workspaceBackup.imagePlacement,
        containerStyle: _workspaceBackup.containerStyle,
        containerSize: _workspaceBackup.containerSize,
        containerBorder: _workspaceBackup.containerBorder,
        containerShadow: _workspaceBackup.containerShadow,
        containerPadding: _workspaceBackup.containerPadding,
        imageFit: _workspaceBackup.imageFit,
        imageBlur: _workspaceBackup.imageBlur,
        imageBrightness: _workspaceBackup.imageBrightness,
        imageContrast: _workspaceBackup.imageContrast,
        imageSaturation: _workspaceBackup.imageSaturation,
      });
    }
  };

  const getCanvasStyle = () => {
    const base = {
      backgroundColor: '#18181b', // bg-zinc-900
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // shadow-2xl
      border: '1px solid rgba(59, 130, 246, 0.5)', // border border-blue-500/50
    };

    switch (containerStyle) {
      case 'Circle':
        return {
          ...base,
          width: '300px',
          height: '300px',
          borderRadius: '50%',
        };
      case 'Rounded Rectangle':
        return {
          ...base,
          width: '480px',
          height: '300px',
          borderRadius: '1.5rem', // rounded-2xl
        };
      case 'Square':
        return {
          ...base,
          width: '300px',
          height: '300px',
          borderRadius: '0px',
        };
      case 'Capsule':
        return {
          ...base,
          width: '600px',
          height: '300px',
          borderRadius: '9999px',
        };
      case 'Hexagon':
        return {
          ...base,
          width: '300px',
          height: '300px',
          borderRadius: '0px',
          border: 'none',
          clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
        };
      case 'Blob':
        return {
          ...base,
          width: '300px',
          height: '300px',
          borderRadius: '0px',
          border: 'none',
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
        };
      case 'Diamond':
        return {
          ...base,
          width: '300px',
          height: '300px',
          borderRadius: '0px',
          border: 'none',
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        };
      default: // 'None'
        return {
          ...base,
          width: '600px',
          height: '300px',
          borderRadius: '1rem', // rounded-2xl
        };
    }
  };

  const aboutSection = sections.find(s => s.type === 'about') || { sectionId: 'about', type: 'about' };

  return (
    <div 
      className="fixed inset-0 z-[100] flex bg-zinc-950 text-white select-none overflow-hidden font-sans"
      onMouseMove={handleMoveDrag}
      onMouseUp={handleEndDrag}
      onTouchMove={handleMoveDrag}
      onTouchEnd={handleEndDrag}
    >
      {/* ───────────────── LEFT SIDEBAR ───────────────── */}
      <div className="w-[280px] shrink-0 border-r border-zinc-800 bg-zinc-900 flex flex-col justify-between">
        <div className="p-5 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-bold tracking-wider uppercase text-zinc-400">Header Image</h3>
            <button onClick={closeWorkspace} className="text-zinc-500 hover:text-white transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer transition-colors text-xs font-bold shadow-md">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
              Upload Image
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            </label>

            {imageUrl && (
              <>
                <label className="flex items-center justify-center gap-2 w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl cursor-pointer transition-colors text-xs font-bold">
                  Replace Image
                  <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                </label>

                <button 
                  onClick={() => updateHeaderImage({ imageUrl: '', imageScale: 100, imagePositionX: 0, imagePositionY: 0, imageRotation: 0, imageOpacity: 80, overlayType: 'None' })}
                  className="w-full py-3 bg-red-950/40 hover:bg-red-950/60 text-red-400 rounded-xl transition-colors text-xs font-bold border border-red-900/30"
                >
                  Remove Image
                </button>

                <button 
                  onClick={handleResetParameters}
                  className="w-full py-3 bg-zinc-800/40 hover:bg-zinc-800 text-zinc-400 rounded-xl transition-colors text-xs font-semibold cursor-pointer"
                >
                  Reset Parameters
                </button>

                <button 
                  onClick={handleRevertChanges}
                  className="w-full py-3 bg-zinc-850 hover:bg-zinc-800 text-zinc-350 rounded-xl transition-colors text-xs font-bold cursor-pointer border border-zinc-800"
                >
                  Revert Changes
                </button>
              </>
            )}
          </div>

          {/* Image library templates */}
          <div className="border-t border-zinc-800/60 pt-4">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-3">Library Templates</span>
            <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {LIBRARY_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    updateHeaderImage({
                      imageUrl: tmpl.url,
                      imageScale: displayPreset?.defaultZoom || 100,
                      imagePositionX: displayPreset?.defaultPositionX || 0,
                      imagePositionY: displayPreset?.defaultPositionY || 0,
                      imageOpacity: 80,
                      overlayType: 'None',
                    });
                  }}
                  className="group relative h-16 rounded-xl overflow-hidden border border-zinc-800 hover:border-blue-500 transition-all cursor-pointer text-left"
                >
                  <img 
                    src={tmpl.url} 
                    alt={tmpl.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-end p-1.5">
                    <span className="text-[8px] font-bold text-white leading-tight truncate w-full">
                      {tmpl.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 flex justify-between gap-2">
          <button 
            onClick={discardWorkspaceChanges}
            className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-bold transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={closeWorkspace}
            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
          >
            Apply
          </button>
        </div>
      </div>

      {/* ───────────────── CENTER CANVAS ───────────────── */}
      <div className="flex-1 bg-zinc-950 relative flex flex-col items-center justify-center overflow-hidden">
        {/* Canvas Toolbar */}
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          <button 
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))} 
            className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800"
          >
            -
          </button>
          <span className="h-8 px-2 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-mono">
            {Math.round(zoom * 100)}%
          </span>
          <button 
            onClick={() => setZoom(Math.min(3, zoom + 0.1))} 
            className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800"
          >
            +
          </button>
          <button 
            onClick={() => { setZoom(1); setPanX(0); setPanY(0); }} 
            className="h-8 px-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs hover:bg-zinc-800"
          >
            Reset view
          </button>
        </div>

        <div className="absolute top-4 right-4 z-20 bg-zinc-900/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-zinc-400 flex items-center gap-1.5 border border-zinc-800/40">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
          <span>{spacePressed ? 'Hold drag to Pan Workspace' : 'Drag image to reposition. Double click to center.'}</span>
        </div>

        {/* Outer view bounds */}
        <div 
          className="relative transition-transform duration-100 ease-out select-none"
          style={{ 
            transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
            cursor: spacePressed ? (isPanning ? 'grabbing' : 'grab') : 'default'
          }}
        >
          {/* Main Workspace Frame - Phone Mockup */}
          <div 
            ref={canvasRef}
            className="w-[360px] h-[640px] rounded-[36px] border border-zinc-800 overflow-hidden relative shadow-2xl select-none pointer-events-auto"
            style={{
              backgroundColor: colorTheme?.background || '#ffffff',
              color: colorTheme?.text || '#1A1A1A'
            }}
            onMouseDown={handleStartDrag}
            onTouchStart={handleStartDrag}
            onDoubleClick={() => updateHeaderImageRealTime({ imagePositionX: 0, imagePositionY: 0, imageScale: 100, imageRotation: 0 })}
          >
            <SectionRenderer 
              section={{ ...aboutSection, cardId }} 
              theme={{
                colors: { primary: colorTheme?.primary || '#2563EB', text: colorTheme?.text || '#1A1A1A', background: colorTheme?.background || '#ffffff' },
                font: { heading: 'Inter', body: 'Inter' }
              }}
              displayPreset={displayPreset} 
              colorTheme={colorTheme} 
              previewMode={true} 
            />
          </div>
        </div>
      </div>

      {/* ───────────────── RIGHT SIDEBAR ───────────────── */}
      <div className="w-[300px] shrink-0 border-l border-zinc-800 bg-zinc-900 flex flex-col">
        {/* Sidebar tabs */}
        <div className="flex border-b border-zinc-800">
          {['placement', 'style', 'effects'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 text-center transition-all ${
                activeTab === tab 
                  ? 'border-blue-500 text-blue-500 bg-zinc-900' 
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {activeTab === 'placement' && (
            <>
              {/* Image Placement Mode */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide">Image Placement</label>
                <div className="grid grid-cols-1 gap-1.5">
                  {['Inside Header', 'Free Position'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => updateHeaderImageRealTime({ imagePlacement: mode })}
                      className={`px-3 py-2 text-xs font-bold rounded-xl transition-all text-left ${
                        imagePlacement === mode 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Fit dropdown */}
              <div className="space-y-2 pt-2 border-t border-zinc-800/60">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide">Image Fit Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Cover', 'Contain', 'Fill', 'Original'].map((fit) => (
                    <button
                      key={fit}
                      onClick={() => updateHeaderImageRealTime({ imageFit: fit })}
                      className={`px-2 py-1.5 text-[10px] font-bold rounded-lg transition-all text-center ${
                        imageFit === fit 
                          ? 'bg-zinc-700 text-white' 
                          : 'bg-zinc-800/40 text-zinc-400 hover:bg-zinc-800'
                      }`}
                    >
                      {fit}
                    </button>
                  ))}
                </div>
              </div>

              {/* Container Style (Mode 3) */}
              <div className="space-y-2 pt-2 border-t border-zinc-800/60">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide">Container Shape Mask</label>
                <div className="grid grid-cols-2 gap-2">
                  {['None', 'Circle', 'Rounded Rectangle', 'Square', 'Capsule', 'Hexagon', 'Blob', 'Diamond'].map((shape) => (
                    <button
                      key={shape}
                      onClick={() => updateHeaderImageRealTime({ containerStyle: shape })}
                      className={`px-2 py-1.5 text-[10px] font-semibold rounded-lg text-center transition-all ${
                        containerStyle === shape 
                          ? 'bg-zinc-700 text-white border border-blue-500/40' 
                          : 'bg-zinc-850 text-zinc-400 hover:bg-zinc-800'
                      }`}
                    >
                      {shape}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'style' && (
            <div className="space-y-4">
              {/* Image Transform Sliders */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[11px]">
                  <label className="font-semibold text-zinc-400">Scale Zoom</label>
                  <span className="text-zinc-500 font-mono">{imageScale || 100}%</span>
                </div>
                <input 
                  type="range" min="80" max="250" step="5"
                  value={imageScale || 100}
                  onChange={(e) => updateHeaderImageRealTime({ imageScale: parseInt(e.target.value) })}
                  className="w-full accent-blue-500 bg-zinc-800 h-1 rounded"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[11px]">
                  <label className="font-semibold text-zinc-400">Rotation Angle</label>
                  <span className="text-zinc-500 font-mono">{imageRotation || 0}°</span>
                </div>
                <input 
                  type="range" min="0" max="360" step="5"
                  value={imageRotation || 0}
                  onChange={(e) => updateHeaderImageRealTime({ imageRotation: parseInt(e.target.value) })}
                  className="w-full accent-blue-500 bg-zinc-800 h-1 rounded"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[11px]">
                  <label className="font-semibold text-zinc-400">Image Opacity</label>
                  <span className="text-zinc-500 font-mono">{imageOpacity !== undefined ? imageOpacity : 80}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" step="5"
                  value={imageOpacity !== undefined ? imageOpacity : 80}
                  onChange={(e) => updateHeaderImageRealTime({ imageOpacity: parseInt(e.target.value) })}
                  className="w-full accent-blue-500 bg-zinc-800 h-1 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <label className="font-semibold text-zinc-400">Position X</label>
                    <span className="text-zinc-500 font-mono">{imagePositionX || 0}px</span>
                  </div>
                  <input 
                    type="range" min="-300" max="300"
                    value={imagePositionX || 0}
                    onChange={(e) => updateHeaderImageRealTime({ imagePositionX: parseInt(e.target.value) })}
                    className="w-full accent-blue-500 bg-zinc-800 h-1 rounded"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <label className="font-semibold text-zinc-400">Position Y</label>
                    <span className="text-zinc-500 font-mono">{imagePositionY || 0}px</span>
                  </div>
                  <input 
                    type="range" min="-200" max="200"
                    value={imagePositionY || 0}
                    onChange={(e) => updateHeaderImageRealTime({ imagePositionY: parseInt(e.target.value) })}
                    className="w-full accent-blue-500 bg-zinc-800 h-1 rounded"
                  />
                </div>
              </div>

              {/* Container modifiers */}
              {containerStyle !== 'None' && (
                <div className="pt-4 border-t border-zinc-800 space-y-4">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide block">Container Styling</span>
                  
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11px]">
                      <label className="font-semibold text-zinc-400">Container Size</label>
                      <span className="text-zinc-500 font-mono">{containerSize || 100}%</span>
                    </div>
                    <input 
                      type="range" min="30" max="150" step="5"
                      value={containerSize || 100}
                      onChange={(e) => updateHeaderImageRealTime({ containerSize: parseInt(e.target.value) })}
                      className="w-full accent-blue-500 bg-zinc-800 h-1 rounded"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11px]">
                      <label className="font-semibold text-zinc-400">Padding Inside</label>
                      <span className="text-zinc-500 font-mono">{containerPadding || 0}px</span>
                    </div>
                    <input 
                      type="range" min="0" max="50" step="2"
                      value={containerPadding || 0}
                      onChange={(e) => updateHeaderImageRealTime({ containerPadding: parseInt(e.target.value) })}
                      className="w-full accent-blue-500 bg-zinc-800 h-1 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between py-1 border-t border-zinc-800/60">
                    <span className="text-xs font-semibold text-zinc-300">Container Border</span>
                    <button 
                      onClick={() => updateHeaderImageRealTime({ containerBorder: !containerBorder })}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-250 ease-in-out ${containerBorder ? 'bg-blue-600' : 'bg-zinc-800'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-250 ease-in-out ${containerBorder ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-1 border-t border-zinc-800/60">
                    <span className="text-xs font-semibold text-zinc-300">Container Shadow</span>
                    <button 
                      onClick={() => updateHeaderImageRealTime({ containerShadow: !containerShadow })}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-250 ease-in-out ${containerShadow ? 'bg-blue-600' : 'bg-zinc-800'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-250 ease-in-out ${containerShadow ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'effects' && (
            <div className="space-y-4">
              {/* Overlay Selector */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide">Overlay Type</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {['None', 'Dark Overlay', 'Light Overlay', 'Gradient Overlay', 'Vignette'].map((ov) => (
                    <button
                      key={ov}
                      onClick={() => updateHeaderImageRealTime({ overlayType: ov })}
                      className={`px-2 py-1.5 text-[9px] font-bold rounded-lg transition-all text-left ${
                        (overlayType || 'None') === ov
                          ? 'bg-blue-500 text-white shadow-sm'
                          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-800'
                      }`}
                    >
                      {ov === 'None' ? 'No Overlay' : ov.replace(' Overlay', '')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filters Section */}
              <div className="pt-3 border-t border-zinc-800 space-y-4">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide block">Filters</span>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <label className="font-semibold text-zinc-400">Blur</label>
                    <span className="text-zinc-500 font-mono">{imageBlur || 0}px</span>
                  </div>
                  <input 
                    type="range" min="0" max="25"
                    value={imageBlur || 0}
                    onChange={(e) => updateHeaderImageRealTime({ imageBlur: parseInt(e.target.value) })}
                    className="w-full accent-blue-500 bg-zinc-800 h-1 rounded"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <label className="font-semibold text-zinc-400">Brightness</label>
                    <span className="text-zinc-500 font-mono">{imageBrightness || 100}%</span>
                  </div>
                  <input 
                    type="range" min="50" max="150"
                    value={imageBrightness || 100}
                    onChange={(e) => updateHeaderImageRealTime({ imageBrightness: parseInt(e.target.value) })}
                    className="w-full accent-blue-500 bg-zinc-800 h-1 rounded"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <label className="font-semibold text-zinc-400">Contrast</label>
                    <span className="text-zinc-500 font-mono">{imageContrast || 100}%</span>
                  </div>
                  <input 
                    type="range" min="50" max="150"
                    value={imageContrast || 100}
                    onChange={(e) => updateHeaderImageRealTime({ imageContrast: parseInt(e.target.value) })}
                    className="w-full accent-blue-500 bg-zinc-800 h-1 rounded"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <label className="font-semibold text-zinc-400">Saturation</label>
                    <span className="text-zinc-500 font-mono">{imageSaturation || 100}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="200"
                    value={imageSaturation || 100}
                    onChange={(e) => updateHeaderImageRealTime({ imageSaturation: parseInt(e.target.value) })}
                    className="w-full accent-blue-500 bg-zinc-800 h-1 rounded"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
