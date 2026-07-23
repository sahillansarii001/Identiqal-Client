import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useCardBuilderStore } from '@/store/cardBuilderStore';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionRenderer } from './SectionRenderer';
import { 
  Smartphone, 
  Monitor, 
  Globe, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  ChevronDown
} from 'lucide-react';

/* ── Preset-driven style helpers ─────────────────────────────────────── */

function getCardRadius(cardShape) {
  const map = {
    'Rounded': '24px',
    'Sharp': '0px',
    'Glass': '24px',
    'Floating': '32px',
    'Soft Shadow': '20px',
    'Border': '16px',
    'Borderless': '0px',
  };
  return map[cardShape] || '24px';
}

function getCardShadow(cardShape, colorTheme) {
  if (cardShape === 'Floating') return '0 32px 80px -8px rgba(0,0,0,0.55), 0 0 0 1.5px rgba(255,255,255,0.18)';
  if (cardShape === 'Glass') return '0 8px 32px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.25)';
  if (cardShape === 'Soft Shadow') return '0 16px 48px rgba(0,0,0,0.20)';
  if (cardShape === 'Border') return `0 0 0 2px ${colorTheme?.border || 'rgba(0,0,0,0.12)'}`;
  if (cardShape === 'Borderless') return 'none';
  return '0 25px 70px -12px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.10)';
}

/* ── Footer Strip ────────────────────────────────────────────────────── */
function FooterStrip({ footerPreset, colorTheme }) {
  if (!footerPreset || !footerPreset.contentTemplate) return null;

  const text = footerPreset.contentTemplate === '{{custom}}'
    ? footerPreset.name
    : footerPreset.contentTemplate;

  return (
    <div
      data-section-id="footer"
      className="w-full py-3.5 text-center text-[10px] opacity-60 tracking-wide border-t shrink-0"
      style={{
        color: colorTheme?.text || '#555',
        borderColor: colorTheme?.border || (colorTheme?.background === '#121212' || colorTheme?.background === '#181518' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'),
      }}
    >
      {text}
    </div>
  );
}

/* ── Preview Section wrapper ─────────────────────────────────────────── */
const PreviewSection = ({ section, theme, displayPreset, colorTheme, activeSectionId, setActiveSection, cardId, isPublicMode, isHighlighted }) => {
  const isActive = activeSectionId === section.sectionId;

  if (!section.isVisible) return null;

  return (
    <div
      data-section-id={section.sectionId}
      onClick={() => !isPublicMode && setActiveSection(section.sectionId)}
      className={`relative transition-all duration-500 ${isPublicMode ? '' : 'cursor-pointer'} ${
        isHighlighted
          ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900 shadow-[0_0_24px_rgba(59,130,246,0.45)] z-20 rounded-xl'
          : ''
      }`}
    >
      <div className="w-full relative pointer-events-none [&_*]:pointer-events-auto">
        <SectionRenderer 
          section={{ ...section, cardId }} 
          theme={theme} 
          displayPreset={displayPreset} 
          colorTheme={colorTheme} 
          previewMode={true} 
        />
      </div>

      {/* Active section indicator line removed per request */}
    </div>
  );
};

/* ── Main Professional Fixed Live Preview Canvas ─────────────────────── */
export default function LiveCanvasPreview() {
  const { 
    cardId, 
    sections, 
    activeSectionId, 
    setActiveSection, 
    colorTheme, 
    displayPreset, 
    footerPreset,
    imageUrl,
  } = useCardBuilderStore();

  const [viewportMode, setViewportMode] = useState('mobile'); // 'mobile' | 'desktop' | 'public'
  const [zoomLevel, setZoomLevel]       = useState(100);      // 50 | 75 | 100 | 125 | 150 | 200
  const [computedScale, setComputedScale] = useState(1);
  const [zoomDropdownOpen, setZoomDropdownOpen] = useState(false);
  const [highlightedSectionId, setHighlightedSectionId] = useState(null);
  const [contentDimensions, setContentDimensions] = useState({ height: 0 });

  const canvasViewportRef = useRef(null);
  const cardContentRef    = useRef(null);
  const highlightTimerRef = useRef(null);

  // Apply layout theme overrides
  let activeColorTheme = colorTheme || {};
  if (displayPreset?.name === 'Luxury') {
    activeColorTheme = {
      ...colorTheme,
      background: '#121212',
      text: '#F3F4F6',
      primary: '#D4A45B',
      accent: '#D4A45B',
    };
  } else if (displayPreset?.name === 'Aurora') {
    activeColorTheme = {
      ...colorTheme,
      background: '#ffffff',
      text: '#0F172A',
      primary: '#2563EB',
      accent: '#4F46E5',
    };
  }

  // Map colorTheme → theme passed to SectionRenderer
  const theme = {
    colors: {
      primary: activeColorTheme?.primary || '#000000',
      text: activeColorTheme?.text || '#1A1A1A',
      background: activeColorTheme?.background || '#ffffff',
      accent: activeColorTheme?.accent || '#000000',
      secondary: activeColorTheme?.secondary || '#6c757d',
    },
    font: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
    },
  };

  const isStudioMode = typeof window !== 'undefined' && (window.location.pathname.includes('/studio') || window.location.pathname.includes('/admin/studio'));
  const previewSections = sections && sections.length > 0 
    ? [...sections].sort((a, b) => {
        if (a.type === 'about') return -1;
        if (b.type === 'about') return 1;
        return 0;
      }) 
    : [];
  const cardRadius = getCardRadius(displayPreset?.cardShape);
  const cardShadow = getCardShadow(displayPreset?.cardShape, activeColorTheme);

  // ── Always Reset Preview Scroll to TOP (top: 0 instant) ──────────────
  const resetScrollToTop = () => {
    if (canvasViewportRef.current) {
      canvasViewportRef.current.scrollTop = 0;
      canvasViewportRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  useEffect(() => {
    resetScrollToTop();
  }, [viewportMode, activeSectionId, sections, displayPreset, colorTheme, footerPreset, imageUrl]);

  // ── Auto-Fit Card Height (Dynamically scale card to fit preview container)
  useLayoutEffect(() => {
    const calculateScale = () => {
      if (!canvasViewportRef.current || !cardContentRef.current) return;

      const contentHeight  = cardContentRef.current.offsetHeight || cardContentRef.current.scrollHeight;
      const viewportHeight = canvasViewportRef.current.clientHeight;

      if (contentHeight > 0 && viewportHeight > 0) {
        setContentDimensions({ height: contentHeight });
        const availableHeight = viewportHeight - 80; // Leave extra padding top & bottom to ensure no clipping
        if (contentHeight > availableHeight && availableHeight > 100) {
          const ratio = availableHeight / contentHeight;
          setComputedScale(Math.max(0.1, Math.min(1, ratio)));
        } else {
          setComputedScale(1);
        }
      }
    };

    calculateScale();

    const observer = new ResizeObserver(calculateScale);
    if (cardContentRef.current)    observer.observe(cardContentRef.current);
    if (canvasViewportRef.current) observer.observe(canvasViewportRef.current);

    return () => observer.disconnect();
  }, [sections, displayPreset, colorTheme, footerPreset, imageUrl, viewportMode]);

  // ── Highlight Pulse on Section Change ────────────────────────────────
  useEffect(() => {
    if (!activeSectionId) return;
    setHighlightedSectionId(activeSectionId);
    if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    highlightTimerRef.current = setTimeout(() => {
      setHighlightedSectionId(null);
    }, 2000);
  }, [activeSectionId]);

  // Effective scale combining auto-fit scale and zoom level
  const effectiveScale = computedScale * (zoomLevel / 100);

  // Zoom preset options
  const ZOOM_OPTIONS = [50, 75, 100, 125, 150, 200];

  const handleZoomChange = (val) => {
    setZoomLevel(val);
    setZoomDropdownOpen(false);
  };

  const handleStepZoom = (delta) => {
    let idx = ZOOM_OPTIONS.findIndex(z => z >= zoomLevel);
    if (idx === -1) idx = 2;
    let nextIdx = Math.max(0, Math.min(ZOOM_OPTIONS.length - 1, idx + delta));
    setZoomLevel(ZOOM_OPTIONS[nextIdx]);
  };

  return (
    <div className="flex-1 w-full h-full flex flex-col overflow-hidden relative bg-[#0E1018] text-slate-100 select-none">
      
      {/* ─── CANVAS CONTROL TOOLBAR (Top) ─────────────────────────────────── */}
      <div className="h-12 border-b border-white/10 bg-[#121520]/90 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between gap-3 shrink-0 z-30 relative">
        
        {/* Left: Viewport Mode Switcher */}
        <div className="flex bg-[#0A0C12] p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setViewportMode('mobile')}
            className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewportMode === 'mobile'
                ? 'bg-blue-600 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone size={13} />
            <span>Mobile</span>
          </button>

          <button
            onClick={() => setViewportMode('desktop')}
            className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewportMode === 'desktop'
                ? 'bg-blue-600 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor size={13} />
            <span>Desktop</span>
          </button>

          <button
            onClick={() => setViewportMode('public')}
            className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewportMode === 'public'
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe size={13} />
            <span>Public Page</span>
          </button>
        </div>

        {/* Right: Zoom Controls (Hidden in Public Mode) */}
        {viewportMode !== 'public' && (
          <div className="flex items-center gap-2">
            {/* Zoom Stepper */}
            <div className="flex items-center bg-[#0A0C12] border border-white/10 rounded-xl p-0.5 text-xs text-slate-300">
              <button
                onClick={() => handleStepZoom(-1)}
                title="Zoom Out"
                className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-slate-400 hover:text-white"
              >
                <ZoomOut size={13} />
              </button>

              {/* Zoom Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setZoomDropdownOpen(!zoomDropdownOpen)}
                  className="px-2 py-1 flex items-center gap-1 font-mono text-[11px] font-bold text-slate-200 hover:text-white cursor-pointer"
                >
                  <span>{Math.round(effectiveScale * 100)}%</span>
                  <ChevronDown size={11} className="text-slate-400" />
                </button>

                {zoomDropdownOpen && (
                  <div className="absolute top-full right-0 mt-1.5 w-24 bg-[#181C2B] border border-white/15 rounded-xl shadow-2xl py-1 z-50 text-xs">
                    {ZOOM_OPTIONS.map((val) => (
                      <button
                        key={val}
                        onClick={() => handleZoomChange(val)}
                        className={`w-full px-3 py-1.5 text-left text-[11px] font-mono font-medium cursor-pointer ${
                          zoomLevel === val ? 'text-blue-400 bg-blue-500/10 font-bold' : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        {val}%
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleStepZoom(1)}
                title="Zoom In"
                className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-slate-400 hover:text-white"
              >
                <ZoomIn size={13} />
              </button>
            </div>

            {/* Fit to Screen Button */}
            <button
              onClick={() => { setZoomLevel(100); resetScrollToTop(); }}
              title="Reset Zoom & Fit to Screen"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0A0C12] hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer active:scale-95"
            >
              <Maximize2 size={13} />
              <span className="hidden sm:inline">Fit to Screen</span>
            </button>
          </div>
        )}
      </div>

      {/* ─── FIXED NON-SCROLLABLE DESIGN CANVAS VIEWPORT ─────────────────── */}
      <div
        ref={canvasViewportRef}
        onWheel={(e) => e.preventDefault()}
        onTouchMove={(e) => e.preventDefault()}
        className={`flex-1 w-full h-full relative flex items-start justify-center pt-6 sm:pt-8 pb-12 overflow-hidden select-none transition-colors duration-500 ${
          viewportMode === 'public'
            ? 'bg-[#F8F6F4] dark:bg-[#0A0A0A]'
            : ''
        }`}
        style={{
          touchAction: 'none',
          overscrollBehavior: 'none',
          ...(viewportMode !== 'public'
            ? { background: 'radial-gradient(circle at 50% 35%, #181C2B 0%, #0E1018 75%)' }
            : {})
        }}
      >
        {/* Soft Ambient Vignette Lighting */}
        {viewportMode !== 'public' && (
          <>
            <div className="absolute top-[15%] left-[25%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-indigo-500/8 rounded-full blur-[120px] pointer-events-none" />
          </>
        )}

        {/* ─── DYNAMICALLY AUTO-SCALED FLOATING CARD ─────────────────────── */}
        {/* Wrapper to hold the exact layout space of the scaled card so flexbox doesn't create extra scrolling space or clip it */}
        <div 
          className="relative mt-2" 
          style={{ 
            height: contentDimensions.height ? contentDimensions.height * effectiveScale : 'auto',
            width: viewportMode === 'public' ? '100%' : (viewportMode === 'desktop' ? '640px' : '360px'),
            maxWidth: viewportMode === 'public' ? '420px' : (viewportMode === 'desktop' ? '720px' : '380px'),
            flexShrink: 0
          }}
        >
          <div
            ref={cardContentRef}
            className={`absolute top-0 left-0 w-full transition-transform duration-300 ease-out origin-top overflow-hidden ${
              viewportMode === 'public'
                ? 'max-w-[420px]'
                : viewportMode === 'desktop'
                  ? 'sm:w-[720px]'
                  : 'sm:w-[380px]'
            }`}
            style={{
              transform: `scale(${effectiveScale})`,
              borderRadius: cardRadius,
              overflow: 'hidden',
              boxShadow: viewportMode === 'public' ? cardShadow : getCardShadow(displayPreset?.cardShape, activeColorTheme),
              backgroundColor: activeColorTheme?.background || '#ffffff',
              color: activeColorTheme?.text || '#1A1A1A',
              fontFamily: 'Inter, sans-serif',
            }}
            data-card-preview="true"
          >
          <AnimatePresence mode="popLayout">
            <div className="w-full min-h-[650px] flex flex-col overflow-hidden relative">
              <div className="flex-1 flex flex-col">
                {previewSections.map((section, idx) => (
                  <React.Fragment key={section.sectionId}>
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                      <PreviewSection
                        section={section}
                        theme={theme}
                        displayPreset={displayPreset}
                        colorTheme={colorTheme}
                        activeSectionId={activeSectionId}
                        setActiveSection={setActiveSection}
                        cardId={cardId}
                        isPublicMode={viewportMode === 'public'}
                        isHighlighted={highlightedSectionId === section.sectionId}
                      />
                    </motion.div>
                    {idx < previewSections.length - 1 && section.isVisible && (
                      <div className="w-full h-px shrink-0" style={{ backgroundColor: activeColorTheme?.border || (activeColorTheme?.background === '#121212' || activeColorTheme?.background === '#181518' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)') }} />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Footer strip (User selected) */}
              <div className="shrink-0 mt-auto">
                <FooterStrip footerPreset={footerPreset} colorTheme={activeColorTheme} />
              </div>
            </div>
          </AnimatePresence>
        </div>
        </div>
      </div>
    </div>
  );
}
