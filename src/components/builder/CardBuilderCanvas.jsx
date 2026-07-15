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
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden bg-[#f8f5f2] dark:!bg-[#151215]">
      {/* Top Toolbar */}
      <TopToolbar />

      {/* Block Picker Modal */}
      <BlockPickerModal />

      {/* 2-Column Layout */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
        
        {/* Center Column: Phone Preview (The Canvas) */}
        <PhonePreview />

        {/* Right Column: Inspector Panel */}
        <div className="w-full lg:w-[340px] h-[50vh] lg:h-full border-t lg:border-t-0 lg:border-l border-gray-200 dark:!border-white/10 bg-white dark:!bg-[#181518] flex-shrink-0 flex flex-col shadow-[0_-4px_24px_rgba(0,0,0,0.05)] lg:shadow-[-4px_0_24px_rgba(0,0,0,0.02)] z-10 relative">
          <InspectorPanel />
        </div>

      </div>
    </div>
  );
};
