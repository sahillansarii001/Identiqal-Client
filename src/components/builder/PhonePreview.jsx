import React, { useState, useEffect } from "react";
import { useCardBuilderStore } from "@/store/cardBuilderStore";
import { motion, AnimatePresence } from "framer-motion";
import { SectionRenderer } from "./SectionRenderer";

const PreviewSection = ({ section, activeSectionId, setActiveSection }) => {
  const isActive = activeSectionId === section.sectionId;

  if (!section.isVisible) return null;

  return (
    <div
      onClick={() => setActiveSection(section.sectionId)}
      className={`relative transition-all duration-300 cursor-pointer overflow-visible ${
        isActive
          ? "z-10 bg-primary/4"
          : "opacity-95 hover:opacity-100 z-0 hover:bg-black/2 dark:hover:bg-white/2"
      }`}
    >
      <div className="w-full relative pointer-events-none **:pointer-events-auto">
        <SectionRenderer section={section} previewMode={true} />
      </div>

      {/* Active overlay indicator */}
      {isActive && (
        <div className="absolute inset-y-0 left-0 w-1 bg-primary rounded-r-full"></div>
      )}
    </div>
  );
};

export default function PhonePreview() {
  const {
    sections,
    activeSectionId,
    setActiveSection,
    setBlockPickerOpen,
    themeConfig,
  } = useCardBuilderStore();

  return (
    <div
      className="flex-1 min-w-0 bg-[#F8F6F4] dark:bg-[#0D0B0D]! flex overflow-auto relative justify-center items-start pt-[40px] px-4 sm:px-8 lg:px-12 pb-[120px] scroll-smooth"
      style={{ height: "calc(100dvh - 120px)" }}
    >
      {/* Background Decorative Ambient Glow */}
      <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-[#D4A45B]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-[#5A3045]/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Floating Card Canvas Wrapper */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="relative shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.03)] overflow-hidden shrink-0 z-10 transition-all duration-300 rounded-[24px] bg-white dark:bg-[#151215] w-full max-w-[400px] h-fit min-h-[560px]"
      >
        {/* Card Content Area */}
        <div
          className="w-full h-full relative"
          style={{
            backgroundColor: themeConfig?.backgroundColor || "#ffffff",
            color: themeConfig?.darkMode ? "#ffffff" : "#1A1A1A",
            fontFamily: themeConfig?.fontFamily || "Inter, sans-serif",
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
                {/* Premium Empty State Illustration */}
                <div className="relative w-32 h-32 mb-8">
                  <div className="absolute inset-0 bg-primary/5 dark:bg-white/5 rounded-full blur-2xl"></div>
                  <div className="relative w-full h-full border-[3px] border-dashed border-gray-200 dark:border-white/10 rounded-3xl flex items-center justify-center bg-white dark:bg-[#181518] shadow-sm transform rotate-[-4deg] transition-transform hover:rotate-0 duration-300">
                    <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center shadow-inner">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary/60 dark:text-white/60"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-8 w-full">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                    Start Building
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-[240px] mx-auto">
                    Drag blocks from the right panel or choose a ready-made
                    template.
                  </p>
                </div>

                <div className="w-full space-y-3">
                  <button
                    onClick={() => setBlockPickerOpen(true)}
                    className="w-full py-3.5 px-6 text-sm text-white rounded-xl font-semibold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: themeConfig?.primaryColor || "#5A3045",
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
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
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                    >
                      <PreviewSection
                        section={section}
                        activeSectionId={activeSectionId}
                        setActiveSection={setActiveSection}
                      />
                    </motion.div>
                    {idx < sections.length - 1 && section.isVisible && (
                      <div
                        className="w-full h-px"
                        style={{ backgroundColor: "rgba(0,0,0,0.06)" }}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
