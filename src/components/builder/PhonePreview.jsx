import React, { useState, useEffect } from 'react';
import { useCardBuilderStore } from '@/store/cardBuilderStore';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionRenderer } from './SectionRenderer';

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
  if (cardShape === 'Floating') return '0 32px 80px -8px rgba(0,0,0,0.45), 0 0 0 1.5px rgba(255,255,255,0.18)';
  if (cardShape === 'Glass') return '0 8px 32px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(255,255,255,0.25)';
  if (cardShape === 'Soft Shadow') return '0 12px 40px rgba(0,0,0,0.15)';
  if (cardShape === 'Border') return `0 0 0 2px ${colorTheme?.border || 'rgba(0,0,0,0.12)'}`;
  if (cardShape === 'Borderless') return 'none';
  return '0 0 0 1.5px rgba(255,255,255,0.22), 0 24px 64px -12px rgba(0,0,0,0.55)';
}

function getAvatarShape(profilePhotoStyle) {
  const map = {
    'Circle': '50%',
    'Rounded Square': '20%',
    'Square': '0px',
    'Glass Border': '50%',
    'Gradient Border': '50%',
    'Shadow': '50%',
    'No Border': '50%',
  };
  return map[profilePhotoStyle] || '50%';
}

function getAvatarBorderStyle(profilePhotoStyle, colorTheme) {
  if (profilePhotoStyle === 'Gradient Border') {
    return {
      border: '3px solid transparent',
      backgroundClip: 'padding-box',
      outline: `3px solid ${colorTheme?.accent || colorTheme?.primary || '#000'}`,
    };
  }
  if (profilePhotoStyle === 'Glass Border') {
    return {
      border: '3px solid rgba(255,255,255,0.5)',
      backdropFilter: 'blur(8px)',
    };
  }
  if (profilePhotoStyle === 'Shadow') {
    return {
      border: '3px solid rgba(255,255,255,0.9)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
    };
  }
  if (profilePhotoStyle === 'No Border') {
    return { border: 'none' };
  }
  return { border: `3px solid ${colorTheme?.background || '#fff'}` };
}

function getHeaderHeight(displayPreset) {
  // Use explicit headerHeight if set, otherwise derive from style
  if (displayPreset?.headerHeight) return displayPreset.headerHeight;
  const style = displayPreset?.headerStyle;
  if (style === 'Full Image' || style === 'Full Video') return '300px';
  return '200px';
}

function getProfilePosition(position) {
  // Returns alignment class for the profile block
  const map = {
    'Left': 'items-start text-left',
    'Center': 'items-center text-center',
    'Right': 'items-end text-right',
    'Floating': 'items-center text-center',
    'Overlapping Header': 'items-center text-center',
  };
  return map[position] || 'items-center text-center';
}

/* ── Footer Strip ────────────────────────────────────────────────────── */
function FooterStrip({ footerPreset, colorTheme }) {
  if (!footerPreset || !footerPreset.contentTemplate) return null;

  const text = footerPreset.contentTemplate === '{{custom}}'
    ? footerPreset.name
    : footerPreset.contentTemplate;

  return (
    <div
      className="w-full py-3 text-center text-[10px] opacity-50 tracking-wide border-t"
      style={{
        color: colorTheme?.text || '#555',
        borderColor: colorTheme?.border || 'rgba(0,0,0,0.06)',
      }}
    >
      {text}
    </div>
  );
}

/* ── Preview Section wrapper ─────────────────────────────────────────── */
const PreviewSection = ({ section, theme, displayPreset, colorTheme, activeSectionId, setActiveSection }) => {
  const isActive = activeSectionId === section.sectionId;

  if (!section.isVisible) return null;

  return (
    <div
      onClick={() => setActiveSection(section.sectionId)}
      className={`relative transition-all duration-300 cursor-pointer overflow-visible ${
        isActive
          ? 'z-10 bg-primary/[0.04]'
          : 'opacity-95 hover:opacity-100 z-0 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
      }`}
    >
      <div className="w-full relative pointer-events-none [&_*]:pointer-events-auto">
        <SectionRenderer 
          section={section} 
          theme={theme} 
          displayPreset={displayPreset} 
          colorTheme={colorTheme} 
          previewMode={true} 
        />
      </div>

      {/* Active indicator */}
      {isActive && (
        <div className="absolute inset-y-0 left-0 w-1 bg-primary rounded-r-full" />
      )}
    </div>
  );
};

/* ── Main PhonePreview ───────────────────────────────────────────────── */
export default function PhonePreview() {
  const { sections, activeSectionId, setActiveSection, setBlockPickerOpen, colorTheme, displayPreset, footerPreset } = useCardBuilderStore();

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
  } else if (displayPreset?.name === 'Neon') {
    activeColorTheme = {
      ...colorTheme,
      background: '#08070A',
      text: '#E2E8F0',
      primary: '#D946EF',
      accent: '#06B6D4',
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

  const cardRadius = getCardRadius(displayPreset?.cardShape);
  const cardShadow = getCardShadow(displayPreset?.cardShape, activeColorTheme);

  return (
    <div
      className="flex-1 min-w-0 bg-[#F8F6F4] dark:!bg-[#0D0B0D] flex overflow-auto relative justify-center items-start pt-[40px] px-4 sm:px-8 lg:px-12 pb-[120px] scroll-smooth"
      style={{ height: 'calc(100vh - 120px)' }}
    >
      {/* Ambient glows */}
      <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-[#D4A45B]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-[#5A3045]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Card Canvas */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className="relative overflow-hidden flex-shrink-0 z-10 transition-all duration-500 w-full max-w-[400px] h-fit min-h-[560px]"
        style={{
          borderRadius: cardRadius,
          boxShadow: cardShadow,
        }}
        data-card-preview="true"
      >
        {/* Card Background */}
        <div
          className="w-full h-full relative"
          style={{
            backgroundColor: activeColorTheme?.background || '#ffffff',
            color: activeColorTheme?.text || '#1A1A1A',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          <AnimatePresence mode="popLayout">
            {sections.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center min-h-[560px] text-center px-8 py-12 bg-white/50 dark:bg-[#151215]/50 backdrop-blur-sm"
              >
                <div className="relative w-32 h-32 mb-8">
                  <div className="absolute inset-0 bg-primary/5 dark:bg-white/5 rounded-full blur-2xl" />
                  <div className="relative w-full h-full border-[3px] border-dashed border-gray-200 dark:border-white/10 rounded-3xl flex items-center justify-center bg-white dark:bg-[#181518] shadow-sm transform rotate-[-4deg] transition-transform hover:rotate-0 duration-300">
                    <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center shadow-inner">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/60 dark:text-white/60">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-8 w-full">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Start Building</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-[240px] mx-auto">
                    Drag blocks from the right panel or choose a ready-made template.
                  </p>
                </div>

                <div className="w-full space-y-3">
                  <button
                    onClick={() => setBlockPickerOpen(true)}
                    className="w-full py-3.5 px-6 text-sm text-white rounded-xl font-semibold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
                    style={{ backgroundColor: colorTheme?.primary || '#5A3045' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add First Block
                  </button>
                  <button className="w-full py-3.5 px-6 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all active:scale-95">
                    Browse Templates
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="w-full flex flex-col">
                {sections.map((section, idx) => (
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
                      />
                    </motion.div>
                    {idx < sections.length - 1 && section.isVisible && (
                      <div className="w-full h-px" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }} />
                    )}
                  </React.Fragment>
                ))}

                {/* Footer strip */}
                <FooterStrip footerPreset={footerPreset} colorTheme={colorTheme} />
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
