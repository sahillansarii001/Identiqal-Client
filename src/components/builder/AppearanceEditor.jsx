"use client";

import React, { useState } from "react";
import { ThemeSelector } from "./ThemeSelector";
import { useCardBuilderStore } from "@/store/cardBuilderStore";

export const AppearanceEditor = () => {
  const [activeInternalTab, setActiveInternalTab] = useState("customizable"); // 'customizable' or 'curated'

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#151215] w-full border-r border-gray-200 dark:border-white/10 overflow-y-auto">
      {/* Internal Tabs */}
      <div className="flex items-center gap-6 px-10 pt-8 pb-4 border-b border-gray-100 dark:border-white/5 sticky top-0 bg-white/90 dark:bg-[#151215]/90 backdrop-blur-sm z-10">
        <button
          onClick={() => setActiveInternalTab("customizable")}
          className={`text-lg font-bold transition-all relative pb-2 ${
            activeInternalTab === "customizable"
              ? "text-gray-900 dark:text-white"
              : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          Customizable
          {activeInternalTab === "customizable" && (
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gray-900 dark:bg-white rounded-t-full"></div>
          )}
        </button>

        <button
          onClick={() => setActiveInternalTab("curated")}
          className={`text-lg font-bold transition-all relative pb-2 ${
            activeInternalTab === "curated"
              ? "text-gray-900 dark:text-white"
              : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          Curated
          {activeInternalTab === "curated" && (
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gray-900 dark:bg-white rounded-t-full"></div>
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-10 pb-32">
        {activeInternalTab === "customizable" ? (
          <div className="space-y-12 max-w-[1200px] mx-auto">
            <ThemeSelector />

            {/* Extended Color Customization (placeholder for what was in the inspector) */}
            <div className="space-y-6 pt-12 border-t border-gray-100 dark:border-white/5 w-full max-w-3xl">
              <h4 className="text-[13px] font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6">
                Colors
              </h4>
              <ColorPaletteEditor />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <p className="font-semibold text-lg">Curated themes coming soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Extracted from original InspectorPanel
const ColorPaletteEditor = () => {
  const { themeConfig, updateThemeConfig } = useCardBuilderStore();
  const brandColors = [
    "#5A3045",
    "#000000",
    "#2563eb",
    "#16a34a",
    "#8a2be2",
    "#ea580c",
  ];
  const bgColors = [
    "#ffffff",
    "#f8f5f2",
    "#f0f4f8",
    "#1a1a1a",
    "#0D0B0D",
    "#151215",
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Brand / Accent Colors
        </label>
        <div className="flex flex-wrap gap-4">
          {brandColors.map((c) => (
            <button
              key={c}
              onClick={() => updateThemeConfig({ primaryColor: c })}
              className={`w-[48px] h-[48px] rounded-[16px] border transition-all duration-300 flex items-center justify-center ${themeConfig.primaryColor === c ? "border-gray-900 dark:border-white scale-110 shadow-md ring-2 ring-offset-2 ring-gray-200 dark:ring-gray-800" : "border-black/10 shadow-sm hover:scale-105"}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Background Colors
        </label>
        <div className="flex flex-wrap gap-4">
          {bgColors.map((c) => (
            <button
              key={c}
              onClick={() => updateThemeConfig({ backgroundColor: c })}
              className={`w-[48px] h-[48px] rounded-[16px] border transition-all duration-300 flex items-center justify-center ${themeConfig.backgroundColor === c ? "border-gray-900 dark:border-white scale-110 shadow-md ring-2 ring-offset-2 ring-gray-200 dark:ring-gray-800" : "border-black/10 shadow-sm hover:scale-105"}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
