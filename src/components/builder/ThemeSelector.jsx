"use client";

import React, { useEffect, useState } from "react";
import { useCardBuilderStore } from "@/store/cardBuilderStore";
import { Star, Loader2 } from "lucide-react";
import axios from "axios";

// Create an axios instance for public API calls if not present
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
});

export const ThemeSelector = () => {
  const { themeConfig, updateThemeConfig } = useCardBuilderStore();
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        setLoading(true);
        const res = await api.get("/themes/public");
        if (res.data.success) {
          setThemes(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch themes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchThemes();
  }, []);

  const handleSelectTemplate = (t) => {
    if (t.id === "custom") {
      updateThemeConfig({ template: "custom" });
      return;
    }

    updateThemeConfig({
      template: t._id,
      primaryColor: t.colors?.primary,
      secondaryColor: t.colors?.secondary,
      backgroundColor: t.colors?.background,
      textColor: t.colors?.text,
      accentColor: t.colors?.accent,
      fontFamily: t.font?.family,
      layoutStyle: t.layoutStyle,
      buttonStyle: t.buttonStyle,
    });
  };

  const renderThumbnail = (t, isCustom = false) => {
    const isSelected = isCustom
      ? themeConfig.template === "custom"
      : themeConfig.template === t._id;

    return (
      <button
        key={isCustom ? "custom" : t._id}
        onClick={() => handleSelectTemplate(isCustom ? { id: "custom" } : t)}
        className={`relative flex flex-col items-center gap-2 transition-all group`}
      >
        <div
          className={`w-[110px] h-[220px] rounded-[24px] border-[3px] overflow-hidden flex flex-col shadow-sm transition-all relative ${
            isSelected
              ? "border-gray-900 dark:border-white scale-[1.05] shadow-md"
              : "border-gray-100 dark:border-white/10 hover:border-gray-300 dark:hover:border-gray-600 scale-100"
          }`}
          style={{
            backgroundColor: isCustom
              ? "#f0f0f0"
              : t.colors?.background || "#ffffff",
          }}
        >
          {isCustom ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-[20px] m-[2px]">
              <span className="text-gray-400 dark:text-gray-500 text-sm font-semibold">
                Custom
              </span>
            </div>
          ) : (
            <>
              {/* Premium Badge (Lightning Bolt) */}
              {t.isPremium && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-linear-to-tr from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white shadow-sm z-20">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                  </svg>
                </div>
              )}

              {/* Theme Mini Layout */}
              <div className="relative w-full h-full flex flex-col z-10" style={{ fontFamily: t.font?.family || "Inter" }}>
                {/* Header Band */}
                <div 
                  className="h-10 w-full shrink-0" 
                  style={{ backgroundColor: t.colors?.primary || "#000" }} 
                />
                
                {/* Avatar */}
                <div className="px-3 pb-2 -mt-5 flex flex-col items-center">
                  <div 
                    className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-[10px] font-black shadow-sm"
                    style={{ 
                      backgroundColor: t.colors?.secondary || "#ccc", 
                      borderColor: t.colors?.background || "#fff",
                      color: "#fff" 
                    }}
                  >
                    JD
                  </div>
                  
                  {/* Name and Bio */}
                  <div 
                    className="w-16 h-2 rounded mt-2 opacity-90"
                    style={{ backgroundColor: t.colors?.text || "#333" }}
                  />
                  <div 
                    className="w-10 h-1.5 rounded mt-1 opacity-50"
                    style={{ backgroundColor: t.colors?.text || "#333" }}
                  />
                </div>

                {/* Links */}
                <div className="px-2 pb-2 mt-auto space-y-1.5 w-full flex flex-col items-center">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className="w-[90%] h-5 flex items-center justify-center shadow-sm"
                      style={{
                        backgroundColor:
                          t.buttonStyle === "outline"
                            ? "transparent"
                            : t.colors?.primary || "#000",
                        border:
                          t.buttonStyle === "outline"
                            ? `1.5px solid ${t.colors?.primary || "#000"}`
                            : "none",
                        borderRadius: t.buttonStyle === "square" ? "4px" : "999px",
                      }}
                    >
                      <div
                        className="w-1/2 h-1 rounded-full opacity-60"
                        style={{
                          backgroundColor:
                            t.buttonStyle === "outline"
                              ? t.colors?.primary
                              : "#fff",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        <span className="text-[13px] font-medium text-gray-700 dark:text-gray-300 tracking-wide mt-1">
          {isCustom ? "Custom" : t.name}
        </span>
      </button>
    );
  };

  return (
    <div className="space-y-6 w-full">
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="animate-spin text-gray-400" size={24} />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10 justify-items-center">
          {renderThumbnail(null, true)}
          {themes.map((t) => renderThumbnail(t, false))}
        </div>
      )}
    </div>
  );
};
