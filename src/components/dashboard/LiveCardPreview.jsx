'use client';

import React from 'react';
import { SectionRenderer } from '@/components/builder/SectionRenderer.jsx';

export function LiveCardPreview({ card }) {
  const sections = card.sections || [];
  const theme = card.theme || { colors: { background: '#090d16', text: '#212529' } };

  return (
    <div className="w-full h-[280px] bg-slate-50 relative overflow-hidden flex justify-center pt-5 border-b border-[rgba(90,48,69,0.04)]">
      {/* Subtle background glow for premium feel */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#D4A45B]/5 rounded-full blur-[40px] pointer-events-none" />
      
      <div 
        className="bg-white rounded-[44px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)] border-[8px] border-slate-900 absolute flex flex-col pointer-events-none"
        style={{
          width: '375px',
          height: '812px',
          transformOrigin: 'top center',
          transform: 'scale(0.31)',
          backgroundColor: theme.colors?.background || '#090d16'
        }}
      >
        <div className="w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar">
          {sections.length === 0 ? (
            <div className="text-center py-20 text-slate-500 text-sm px-6 font-semibold">
              No content.
            </div>
          ) : (
            sections.map((sec) => (
              <SectionRenderer
                key={sec.sectionId}
                section={{ ...sec, cardId: card._id }}
                theme={theme}
                previewMode={true}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
