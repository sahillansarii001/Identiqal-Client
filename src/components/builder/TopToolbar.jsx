import React from "react";
import { useCardBuilderStore } from "@/store/cardBuilderStore";
import {
  Undo,
  Redo,
  Monitor,
  Tablet,
  Smartphone,
  Share,
  Check,
  Loader2,
  Eye,
} from "lucide-react";
import { cardService } from "@/services/cardService.js";
import { useRouter } from "next/navigation";

export default function TopToolbar() {
  const router = useRouter();
  const {
    cardId,
    title,
    sections,
    seo,
    saveStatus,
    setSaveStatus,
    setCard,
    past,
    future,
    undo,
    redo,
    previewDevice,
    setPreviewDevice,
    activeTab,
    setActiveTab,
    displayPreset,
    colorTheme,
    footerPreset,
    imageUrl,
    imageScale,
    imagePositionX,
    imagePositionY,
    imageOpacity,
    overlayType,
    imageRotation,
    imagePlacement,
    containerStyle,
    containerSize,
    containerBorder,
    containerShadow,
    containerPadding,
    imageFit,
    imageBlur,
    imageBrightness,
    imageContrast,
    imageSaturation,
  } = useCardBuilderStore();

  const handleSaveCard = async () => {
    if (!cardId) return;
    setSaveStatus("saving");
    try {
      const response = await cardService.updateCard(cardId, {
        title,
        sections,
        seo,
        displayPresetId: displayPreset?._id || null,
        colorThemeId: colorTheme?._id || null,
        footerPresetId: footerPreset?._id || null,
        imageUrl,
        imageScale,
        imagePositionX,
        imagePositionY,
        imageOpacity,
        overlayType,
        imageRotation,
        imagePlacement,
        containerStyle,
        containerSize,
        containerBorder,
        containerShadow,
        containerPadding,
        imageFit,
        imageBlur,
        imageBrightness,
        imageContrast,
        imageSaturation,
      });
      if (response.success) {
        setCard(response.data);
        setSaveStatus("saved");
        router.push("/dashboard/cards");
      }
    } catch (e) {
      alert("Failed to save layout configuration: " + e.message);
      setSaveStatus("error");
    }
  };

  return (
    <div className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between sticky top-0 z-20 gap-4">
      {/* Left: Branding, Title & Navigation Tabs */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="font-bold text-xl text-primary shrink-0">identiqal</div>
        <div className="h-6 w-px bg-gray-300 dark:bg-white/10 shrink-0"></div>
        <input
          type="text"
          value={title || "Untitled Card"}
          className="font-medium text-gray-800 dark:text-gray-100 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-2 py-1 -ml-2 shrink-0"
          style={{ width: `${(title || "Untitled Card").length + 1}ch` }}
          placeholder="Card Name"
          readOnly
        />
        <div className="h-6 w-px bg-gray-300 dark:bg-white/10 shrink-0 hidden sm:block"></div>

        {/* Navigation Tabs */}
        <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-full shrink-0">
          <button
            onClick={() => setActiveTab("links")}
            className={`px-4 sm:px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === "links"
                ? "bg-white dark:bg-white/10 shadow-sm text-gray-900 dark:text-white"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Links
          </button>
          <button
            onClick={() => setActiveTab("appearance")}
            className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === "appearance"
                ? "bg-white dark:bg-white/10 shadow-sm text-gray-900 dark:text-white"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Appearance
          </button>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            disabled={past.length === 0}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-white transition-colors"
          >
            <Undo size={18} />
          </button>
          <button
            onClick={redo}
            disabled={future.length === 0}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-white transition-colors"
          >
            <Redo size={18} />
          </button>
        </div>

        <div className="h-6 w-px bg-gray-200"></div>

        {/* Device Previews (Hidden on small screens) */}
        <div className="hidden lg:flex items-center gap-1 bg-gray-100 dark:bg-transparent p-1 rounded-lg">
          <button
            onClick={() => setPreviewDevice("desktop")}
            className={`p-2 rounded-md transition-all ${previewDevice === "desktop" ? "bg-white dark:bg-white/10 shadow-sm text-primary" : "hover:bg-white/50 text-gray-500 hover:text-gray-900"}`}
          >
            <Monitor size={18} />
          </button>
          <button
            onClick={() => setPreviewDevice("tablet")}
            className={`p-2 rounded-md transition-all ${previewDevice === "tablet" ? "bg-white dark:bg-white/10 shadow-sm text-primary" : "hover:bg-white/50 text-gray-500 hover:text-gray-900"}`}
          >
            <Tablet size={18} />
          </button>
          <button
            onClick={() => setPreviewDevice("smartphone")}
            className={`p-2 rounded-md transition-all ${previewDevice === "smartphone" ? "bg-white dark:bg-white/10 shadow-sm text-primary" : "hover:bg-white/50 text-gray-500 hover:text-gray-900"}`}
          >
            <Smartphone size={18} />
          </button>
        </div>

        <div className="hidden lg:block h-6 w-px bg-gray-200"></div>

        {/* Share & Publish & Preview */}
        <button
          onClick={() => alert("Preview mode coming soon!")}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border border-gray-200 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 font-medium text-xs sm:text-sm transition-all shadow-sm"
        >
          <Eye size={16} />
          <span className="hidden sm:inline">Preview</span>
        </button>
        <button
          onClick={() => alert("Share dialog coming soon!")}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border border-gray-200 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 font-medium text-xs sm:text-sm transition-all shadow-sm"
        >
          <Share size={16} />
          <span className="hidden sm:inline">Share</span>
        </button>
        <button
          onClick={handleSaveCard}
          disabled={saveStatus === "saving"}
          className="flex items-center gap-2 px-4 sm:px-6 py-2 rounded-full bg-gray-900 text-white hover:bg-black dark:bg-white! dark:text-black! dark:hover:bg-gray-100 font-medium text-xs sm:text-sm transition-all shadow-md shadow-gray-900/20 active:scale-95 disabled:opacity-50 whitespace-nowrap shrink-0"
        >
          {saveStatus === "saving" ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Check size={16} />
          )}
          {saveStatus === "saving" ? "Saving..." : "Save Layout"}
        </button>
      </div>
    </div>
  );
}
