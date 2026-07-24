"use client";

import React, { useState, useEffect } from "react";
import TopToolbar from "./TopToolbar";
import { BlockPickerModal } from "./BlockPickerModal";
import PhonePreview from "./PhonePreview";
import SetupWizard from "./SetupWizard";
import CustomizePanel from "./CustomizePanel";
import { ImageEditorPanels } from "./InspectorPanel";
import { AppearanceEditor } from "./AppearanceEditor";
import { useCardBuilderStore } from "@/store/cardBuilderStore";
import { Eye, Edit3 } from "lucide-react";
import { motion } from "framer-motion";

export const CardBuilderCanvas = () => {
  const { activeTab, wizardCompleted } = useCardBuilderStore();
  const [mobileView, setMobileView] = useState("editor"); // 'editor' | 'preview'

  // Reset any horizontal scroll position to zero
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ left: 0 });
      document.body.scrollLeft = 0;
      document.documentElement.scrollLeft = 0;
    }
  }, [mobileView, activeTab]);

  return (
    <div
      className="flex flex-col h-full min-h-[calc(100dvh-100px)] lg:h-[calc(100dvh-120px)] overflow-x-hidden max-w-full bg-[#f8f5f2] dark:bg-[#151215]!"
      style={{ touchAction: "pan-y", overscrollBehaviorX: "none" }}
      data-builder-ui="true"
    >
      {/* Top Toolbar */}
      <TopToolbar />

      {/* Mobile View Switcher (Editor vs Preview) */}
      <div className="lg:hidden flex items-center justify-center p-1.5 sm:p-2 bg-gray-100 dark:bg-zinc-900 border-b border-gray-200 dark:border-white/10 shrink-0 w-full max-w-full">
        <div className="flex relative bg-white dark:bg-zinc-950 p-1 rounded-xl border border-gray-200 dark:border-white/10 w-full max-w-[260px] sm:max-w-xs shadow-xs">
          {[
            { id: "editor", label: "Editor", icon: Edit3 },
            { id: "preview", label: "Preview", icon: Eye },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = mobileView === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMobileView(tab.id)}
                className="relative flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer z-10 focus-visible:outline-none transition-colors"
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-view-active-pill"
                    className="absolute inset-0 bg-blue-600 rounded-lg shadow-sm"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span
                  className={`relative flex items-center gap-1.5 ${
                    isActive ? "text-white" : "text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Icon size={13} />
                  <span>{tab.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Block Picker Modal */}
      <BlockPickerModal />

      {/* Floating image editor slide-in panels (Cover & Avatar) */}
      <ImageEditorPanels />

      {/* Layout Content */}
      {activeTab === "links" ? (
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
          {/* Editor Panel Column (Left on desktop, scrolls independently) */}
          <div
            className={`w-full lg:w-[560px] xl:w-[620px] h-full border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-white/10! bg-white dark:bg-[#181518]! shrink-0 flex flex-col z-10 relative overflow-y-auto ${
              mobileView === "editor" ? "flex" : "hidden lg:flex"
            }`}
          >
            {!wizardCompleted ? <SetupWizard /> : <CustomizePanel />}
          </div>

          {/* Phone Preview Column (Center/Right on desktop, fixed non-scrolling) */}
          <div
            className={`flex-1 h-full flex items-center justify-center overflow-hidden relative bg-[#f8f5f2] dark:bg-[#151215] ${
              mobileView === "preview" ? "flex" : "hidden lg:flex"
            }`}
          >
            <PhonePreview />
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative bg-[#0E1018]">
          {/* Appearance Editor Column (Left on desktop, scrolls independently) */}
          <div
            className={`w-full lg:w-[560px] xl:w-[620px] h-full border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-white/10! bg-white dark:bg-[#181518]! shrink-0 flex flex-col z-10 relative overflow-y-auto ${
              mobileView === "editor" ? "flex" : "hidden lg:flex"
            }`}
          >
            <AppearanceEditor />
          </div>

          {/* Design Canvas Live Preview Column (Center/Right on desktop, fixed non-scrolling) */}
          <div
            className={`flex-1 h-full flex items-center justify-center overflow-hidden relative bg-[#0E1018] ${
              mobileView === "preview" ? "flex" : "hidden lg:flex"
            }`}
          >
            <PhonePreview />
          </div>
        </div>
      )}

      {/* Floating Mobile Mode Toggle Button */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
        <button
          onClick={() => setMobileView(mobileView === "editor" ? "preview" : "editor")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xl shadow-blue-600/30 transition-all active:scale-95 cursor-pointer whitespace-nowrap border border-blue-400/30 backdrop-blur-md"
        >
          {mobileView === "editor" ? (
            <>
              <Eye size={14} />
              <span>Preview Card</span>
            </>
          ) : (
            <>
              <Edit3 size={14} />
              <span>Edit Card</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
