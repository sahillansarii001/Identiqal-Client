import React, { useState, useEffect, useCallback } from "react";
import { useCardBuilderStore } from "@/store/cardBuilderStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Undo,
  Redo,
  Smartphone,
  Globe,
  Eye,
  Share,
  Check,
  Loader2,
  X,
  Share2,
  QrCode,
  Contact,
  Maximize2,
  ExternalLink,
} from "lucide-react";
import { SectionRenderer } from "./SectionRenderer";
import { cardService } from "@/services/cardService.js";
import { useRouter } from "next/navigation";

/* ─── Preview mode definitions ────────────────────────────────── */
const PREVIEW_MODES = [
  { id: "card",   label: "Card Preview", icon: Smartphone },
  { id: "public", label: "Public Page",  icon: Globe },
  { id: "live",   label: "Live",         icon: Eye },
];

/* ─── Footer strip ────────────────────────────────────────────── */
function FooterStrip({ footerPreset, colorTheme }) {
  if (!footerPreset) return null;

  // Resolve the footer text from whichever field is populated
  const raw = footerPreset.contentTemplate || footerPreset.copyrightText || footerPreset.name || "";
  const text = raw === "{{custom}}" ? (footerPreset.copyrightText || footerPreset.name || "Powered by Identiqal") : (raw || "Powered by Identiqal");

  return (
    <div
      className="w-full py-3 text-center text-[10px] opacity-50 tracking-wide border-t"
      style={{
        color: colorTheme?.text || "#555",
        borderColor: colorTheme?.border || "rgba(0,0,0,0.06)",
        background: footerPreset.background || "transparent",
      }}
    >
      {text}
    </div>
  );
}

/* ─── Shared card content renderer ───────────────────────────── */
function CardContent({ sections, store, interactive = false }) {
  const { colorTheme, displayPreset, footerPreset, cardId } = store;
  const theme = {
    colors: {
      primary:    colorTheme?.primary    || "#2563EB",
      text:       colorTheme?.text       || "#1A1A1A",
      background: colorTheme?.background || "#ffffff",
      accent:     colorTheme?.accent     || "#2563EB",
    },
    font: { heading: "Inter, sans-serif", body: "Inter, sans-serif" },
  };
  return (
    <div style={{ pointerEvents: interactive ? "auto" : "none" }}>
      {sections.map((section) =>
        section.isVisible !== false ? (
          <SectionRenderer
            key={section.sectionId}
            section={{ ...section, cardId }}
            theme={theme}
            displayPreset={displayPreset}
            colorTheme={colorTheme}
            previewMode={false}
          />
        ) : null
      )}
      <FooterStrip footerPreset={footerPreset} colorTheme={colorTheme} />
    </div>
  );
}


/* ─── Phone shell ─────────────────────────────────────────────── */
function PhoneShell({ colorTheme, children }) {
  return (
    <div className="w-[300px] h-[560px] rounded-[38px] border-[7px] border-zinc-800 bg-white shadow-[0_32px_80px_rgba(0,0,0,0.55)] relative overflow-hidden flex flex-col shrink-0">
      {/* Notch */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-zinc-800 rounded-full z-30 flex items-center justify-center gap-1.5">
        <span className="w-1.5 h-1.5 bg-zinc-900 rounded-full" />
        <span className="w-7 h-1 bg-zinc-900 rounded-full" />
      </div>
      <div
        className="flex-1 overflow-y-auto scrollbar-none pt-6"
        style={{
          backgroundColor: colorTheme?.background || "#ffffff",
          color:           colorTheme?.text        || "#1A1A1A",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ─── Public Page Preview overlay ────────────────────────────── */
function PublicPageOverlay({ store, sections, onClose }) {
  const { colorTheme, title } = store;
  const mockUsername = (title || "yourname").toLowerCase().replace(/\s+/g, ".");

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 16 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="w-full max-w-[720px] h-[85vh] rounded-2xl border border-zinc-800 overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Browser chrome */}
        <div className="h-9 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 gap-2 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 cursor-pointer" onClick={onClose} />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
          <div className="flex-1 max-w-[280px] mx-auto h-5 bg-zinc-800 rounded-md flex items-center justify-center gap-1.5 px-2">
            <Globe size={8} className="text-zinc-500" />
            <span className="text-[9px] text-zinc-400 font-mono truncate">
              identiqal.com/{mockUsername}
            </span>
          </div>
          <ExternalLink size={10} className="text-zinc-600 ml-auto" />
        </div>

        {/* Page body */}
        <div
          className="flex-1 overflow-y-auto scrollbar-none relative"
          style={{ backgroundColor: colorTheme?.background || "#f1f5f9" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${colorTheme?.primary || "#2563EB"}14, transparent)`,
            }}
          />
          <div className="relative z-10 flex flex-col items-center px-6 py-10 gap-6">
            {/* Card wrapper */}
            <div
              className="w-full max-w-[440px] rounded-[24px] border shadow-[0_16px_48px_-8px_rgba(0,0,0,0.12)] overflow-hidden"
              style={{
                backgroundColor: colorTheme?.background || "#ffffff",
                borderColor: "rgba(0,0,0,0.06)",
              }}
            >
              <CardContent sections={sections} store={store} />
            </div>

            {/* Public action buttons */}
            <div className="flex items-center gap-3">
              {[
                { icon: Share2,  label: "Share",   color: "#2563EB" },
                { icon: QrCode,  label: "QR Code", color: "#7c3aed" },
                { icon: Contact, label: "Contact", color: "#059669" },
              ].map(({ icon: Icon, label, color }) => (
                <button
                  key={label}
                  type="button"
                  className="flex flex-col items-center gap-1.5 px-4 py-2.5 rounded-2xl border bg-white/90 backdrop-blur-sm shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  style={{ borderColor: `${color}22` }}
                >
                  <Icon size={15} style={{ color }} />
                  <span className="text-[9px] font-bold text-zinc-500">{label}</span>
                </button>
              ))}
            </div>

            <p
              className="text-[9px] font-semibold uppercase tracking-widest opacity-40"
              style={{ color: colorTheme?.text || "#64748b" }}
            >
              Powered by Identiqal
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Live Preview overlay ────────────────────────────────────── */
function LivePreviewOverlay({ store, sections, onClose }) {
  const { colorTheme } = store;

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: colorTheme?.background || "#090d16" }}
    >
      {/* Top bar */}
      <div className="h-12 shrink-0 flex items-center justify-between px-6 border-b border-white/10 bg-black/30 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-white/80 tracking-wide">Live Preview</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/50 font-mono border border-white/10">
            Interactive
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-xs font-bold transition-all cursor-pointer border border-white/10"
        >
          <X size={12} />
          Exit Preview <span className="opacity-40 ml-1 text-[10px]">Esc</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto flex flex-col items-center justify-start py-10 px-4 gap-3">
        <p className="text-[10px] text-white/30 font-medium tracking-wider">
          Interact with the card exactly as your visitors will
        </p>
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 26, delay: 0.08 }}
        >
          <PhoneShell colorTheme={colorTheme}>
            <CardContent sections={sections} store={store} interactive={true} />
          </PhoneShell>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─── Main TopToolbar ─────────────────────────────────────────── */
export default function TopToolbar() {
  const router = useRouter();
  const store = useCardBuilderStore();
  const {
    cardId, title, sections, seo, saveStatus, setSaveStatus, setCard,
    past, future, undo, redo,
    displayPreset, colorTheme, footerPreset,
    imageUrl, imageScale, imagePositionX, imagePositionY,
    imageOpacity, overlayType, imageRotation, imagePlacement,
    containerStyle, containerSize, containerBorder, containerShadow,
    containerPadding, imageFit, imageBlur, imageBrightness,
    imageContrast, imageSaturation,
  } = store;

  const [previewMode,  setPreviewMode]  = useState("card");
  const [publicOpen,   setPublicOpen]   = useState(false);
  const [liveOpen,     setLiveOpen]     = useState(false);

  // Active sections for overlays
  const activeSections = (sections && sections.length > 0)
    ? sections
    : [{
        sectionId: "about",
        type: "about",
        isVisible: true,
        data: {
          headline: "Alex Rivers",
          bio: "Senior Product Designer at Framer. Crafting premium user experiences.",
          avatarUrl: imageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
        },
      }];

  // Handle tab clicks — public/live open overlays, card is the default state
  const handleModeChange = useCallback((id) => {
    if (id === "public") { setPublicOpen(true); setPreviewMode("card"); return; }
    if (id === "live")   { setLiveOpen(true);   setPreviewMode("card"); return; }
    setPreviewMode(id);
  }, []);

  const handleSaveCard = async () => {
    if (!cardId) return;
    setSaveStatus("saving");
    try {
      const response = await cardService.updateCard(cardId, {
        title, sections, seo,
        displayPresetId: displayPreset?._id || null,
        colorThemeId:    colorTheme?._id    || null,
        footerPresetId:  footerPreset?._id  || null,
        imageUrl, imageScale, imagePositionX, imagePositionY,
        imageOpacity, overlayType, imageRotation, imagePlacement,
        containerStyle, containerSize, containerBorder, containerShadow,
        containerPadding, imageFit, imageBlur, imageBrightness,
        imageContrast, imageSaturation,
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
    <>
      {/* ─── TOOLBAR STRIP ──────────────────────────────────────── */}
      <div className="h-14 border-b border-gray-200 bg-white px-5 flex items-center gap-3 sticky top-0 z-20">

        {/* Brand */}
        <span className="font-bold text-lg text-primary select-none shrink-0">identiqal</span>
        <div className="h-5 w-px bg-gray-200 shrink-0" />

        {/* Card title */}
        <span className="text-sm font-medium text-gray-600 shrink-0 max-w-[100px] truncate">
          {title || "Untitled Card"}
        </span>
        <div className="h-5 w-px bg-gray-200 shrink-0" />

        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={undo}
            disabled={past.length === 0}
            title="Undo"
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-gray-500 hover:text-gray-800 transition-colors"
          >
            <Undo size={14} />
          </button>
          <button
            onClick={redo}
            disabled={future.length === 0}
            title="Redo"
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-gray-500 hover:text-gray-800 transition-colors"
          >
            <Redo size={14} />
          </button>
        </div>
        <div className="h-5 w-px bg-gray-200 shrink-0" />

        {/* Links / Appearance tabs */}
        <div className="flex bg-gray-100 p-1 rounded-full shrink-0">
          {["links", "appearance"].map((tab) => {
            const isActive = (store.activeTab || "links") === tab;
            return (
              <button
                key={tab}
                onClick={() => store.setActiveTab(tab)}
                className={`relative px-4 py-1.5 rounded-full text-sm font-semibold transition-all capitalize cursor-pointer ${
                  isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="toolbar-tab-pill"
                    className="absolute inset-0 bg-white rounded-full shadow-sm"
                    transition={{ type: "spring", stiffness: 440, damping: 34 }}
                  />
                )}
                <span className="relative capitalize">{tab}</span>
              </button>
            );
          })}
        </div>

        {/* Spacer — pushes everything after to the right */}
        <div className="flex-1" />

        {/* 3-Mode Preview Segmented Control */}
        <div className="flex relative bg-gray-100 p-1 rounded-xl border border-gray-200/80 shrink-0">
          {PREVIEW_MODES.map((mode) => {
            const Icon     = mode.icon;
            const isActive = previewMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => handleModeChange(mode.id)}
                className="relative px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer z-10 whitespace-nowrap focus-visible:outline-none"
              >
                {isActive && (
                  <motion.div
                    layoutId="builder-preview-tab"
                    className="absolute inset-0 bg-white rounded-lg shadow-sm border border-gray-200/70"
                    transition={{ type: "spring", stiffness: 440, damping: 34 }}
                  />
                )}
                <span className={`relative flex items-center gap-1.5 ${
                  isActive
                    ? mode.id === "live" ? "text-emerald-600" : "text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}>
                  {mode.id === "live" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  )}
                  <Icon size={12} />
                  <span>{mode.label}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="h-5 w-px bg-gray-200 shrink-0" />

        {/* Share */}
        <button
          onClick={() => alert("Share dialog coming soon!")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium text-sm transition-all shrink-0"
        >
          <Share size={14} />
          Share
        </button>

        {/* Save Layout */}
        <button
          onClick={handleSaveCard}
          disabled={saveStatus === "saving"}
          className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-gray-900 text-white hover:bg-black font-semibold text-sm transition-all shadow-sm active:scale-95 disabled:opacity-50 whitespace-nowrap shrink-0"
        >
          {saveStatus === "saving" ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Check size={14} />
          )}
          {saveStatus === "saving" ? "Saving..." : "Save Layout"}
        </button>
      </div>
      {/* ─── Public Page Overlay ─── */}
      <AnimatePresence>
        {publicOpen && (
          <PublicPageOverlay
            store={store}
            sections={activeSections}
            onClose={() => setPublicOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ─── Live Preview Overlay ─── */}
      <AnimatePresence>
        {liveOpen && (
          <LivePreviewOverlay
            store={store}
            sections={activeSections}
            onClose={() => setLiveOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

