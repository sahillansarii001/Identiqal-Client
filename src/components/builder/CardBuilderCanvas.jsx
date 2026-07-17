'use client';

import React from 'react';
import TopToolbar from './TopToolbar';
import { BlockPickerModal } from './BlockPickerModal';
import PhonePreview from './PhonePreview';
import { InspectorPanel } from './InspectorPanel';
import { useCardBuilderStore } from '@/store/cardBuilderStore';

export const CardBuilderCanvas = () => {
  // In a real scenario we might need to fetch data here or initialize store, 
  // but assuming that's handled at the page level.

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f8f5f2]">
      {/* Top Toolbar */}
      <TopToolbar />

      {/* Block Picker Modal */}
      <BlockPickerModal />

      {/* 2-Column Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Center Column: Phone Preview (The Canvas) */}
        <PhonePreview />

        {/* Right Column: Inspector Panel */}
        <div className="w-[340px] border-l border-gray-200 bg-white flex-shrink-0 flex flex-col h-[calc(100vh-4rem)] shadow-[-4px_0_24px_rgba(0,0,0,0.02)] z-10 relative">
          <InspectorPanel />
        </div>

      </div>
    </div>
  );
};
