"use client";

import React, { useState } from "react";
import { ThemeCustomizer } from "./InspectorPanel";

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
            <div className="w-full max-w-3xl">
              <h4 className="text-[13px] font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6">
                Design Customizer
              </h4>
              <ThemeCustomizer />
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

