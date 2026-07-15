'use client';

import React from 'react';
import { SectionRenderer } from '@/components/builder/SectionRenderer.jsx';

export function LiveCardPreview({ card, className = "h-[280px]", scale = 0.31 }) {
  const sections = card.sections || [];
  const defaultTheme = {
    colors: {
      background: '#ffffff',
      text: '#212529',
      primary: '#000000'
    }
  };
  const theme = card.theme || defaultTheme;

  return (
    <div className={`w-full bg-slate-50 relative overflow-hidden flex justify-center pt-5 ${className}`}>
      {/* Subtle background glow for premium feel */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#D4A45B]/5 rounded-full blur-[40px] pointer-events-none" />
      
      <div 
        className="bg-white rounded-[44px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)] border-[8px] border-slate-900 absolute flex flex-col pointer-events-none"
        style={{
          width: '375px',
          height: '812px',
          transformOrigin: 'top center',
          transform: `scale(${scale})`,
          backgroundColor: theme.colors?.background || '#ffffff'
        }}
      >
        <div className="w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar">
          {sections.length === 0 ? (
            <div className="text-center py-20 text-slate-500 text-sm px-6 font-semibold">
              No content.
            </div>
          ) : (
            <div className="w-full flex flex-col">
              {sections.map((sec, idx) => (
                <React.Fragment key={sec.sectionId}>
                  <SectionRenderer
                    section={{ ...sec, cardId: card._id }}
                    theme={theme}
                    previewMode={true}
                  />
                  {idx < sections.length - 1 && sec.isVisible && (
                    <div className="w-full h-px" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
