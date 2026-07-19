"use client";

import React from "react";
import TopToolbar from "./TopToolbar";
import { BlockPickerModal } from "./BlockPickerModal";
import PhonePreview from "./PhonePreview";
import { InspectorPanel } from "./InspectorPanel";
import { AppearanceEditor } from "./AppearanceEditor";
import { useCardBuilderStore } from "@/store/cardBuilderStore";

export const CardBuilderCanvas = () => {
  const { activeTab } = useCardBuilderStore();

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden bg-[#f8f5f2] dark:bg-[#151215]!">
      {/* Top Toolbar */}
      <TopToolbar />

      {/* Block Picker Modal */}
      <BlockPickerModal />

      {/* Layout Content */}
      {activeTab === "links" ? (
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
          {/* Center Column: Phone Preview (The Canvas) */}
          <PhonePreview />

          {/* Right Column: Inspector Panel */}
          <div className="w-full lg:w-[340px] h-[50vh] lg:h-full border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-white/10! bg-white dark:bg-[#181518]! shrink-0 flex flex-col shadow-[0_-4px_24px_rgba(0,0,0,0.05)] lg:shadow-[-4px_0_24px_rgba(0,0,0,0.02)] z-10 relative">
            <InspectorPanel />
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative bg-[#f8f5f2] dark:bg-[#151215]">
          {/* Left Column: Appearance Editor (Takes remaining space) */}
          <div className="flex-1 h-[50vh] lg:h-full flex flex-col relative z-10">
            <AppearanceEditor />
          </div>

          {/* Right Column: Phone Preview (Fixed width or pinned) */}
          <div className="w-full lg:w-[400px] xl:w-[500px] shrink-0 flex items-center justify-center border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-white/10 bg-[#f8f5f2] dark:bg-black/20">
            <PhonePreview />
          </div>
        </div>
      )}
    </div>
  );
};
