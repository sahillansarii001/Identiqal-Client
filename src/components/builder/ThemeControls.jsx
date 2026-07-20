"use client";

import React from "react";
import { useThemeBuilderStore } from "@/store/themeBuilderStore.js";
import { useAuthStore } from "@/store/authStore.js";
import { Input } from "@/components/ui/Input.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { cardService } from "@/services/cardService.js";
import { Palette, Layers, Type, Shield, Check } from "lucide-react";

export const ThemeControls = () => {
  const { user } = useAuthStore();
  const {
    themeId,
    colors,
    font,
    layoutStyle,
    buttonStyle,
    isLockedByOrg,
    updateColors,
    updateFont,
    setLayoutStyle,
    setButtonStyle,
    setIsLockedByOrg,
    setTheme,
  } = useThemeBuilderStore();

  const [isSaving, setIsSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const handleColorChange = (key, val) => {
    updateColors({ [key]: val });
  };

  const handleFontChange = (key, val) => {
    updateFont({ [key]: val });
  };

  const handleSaveTheme = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const response = await cardService.saveTheme({
        colors,
        font,
        layoutStyle,
        buttonStyle,
        isLockedByOrg: user.role === "owner" ? isLockedByOrg : false,
      });
      if (response.success) {
        setTheme(response.data);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      alert("Failed to save styling properties: " + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const fonts = ["Inter", "Roboto", "Outfit", "Poppins", "Playfair Display"];
  const layouts = [
    { id: "minimal", label: "Minimalist" },
    { id: "bold", label: "Bold Accent" },
    { id: "corporate", label: "Corporate Professional" },
    { id: "creative", label: "Creative Designer" },
  ];
  const buttons = [
    { id: "rounded", label: "Rounded Corners" },
    { id: "square", label: "Square Edges" },
    { id: "outline", label: "Outline Borders" },
  ];

  const isOwner = user?.role === "owner";

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
            <Palette size={16} className="text-indigo-655" />
            <span>Card Theme Controls</span>
          </h4>
          <p className="text-[10px] text-slate-500 mt-1">
            Configure layout styling and hex palettes.
          </p>
        </div>
      </div>

      {/* Hex Colors Pickers */}
      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
          <Palette size={12} className="text-slate-400" />
          <span>Hex Colors Palette</span>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <ColorPickerInput
            label="Primary"
            val={colors.primary}
            onChange={(val) => handleColorChange("primary", val)}
          />
          <ColorPickerInput
            label="Secondary"
            val={colors.secondary}
            onChange={(val) => handleColorChange("secondary", val)}
          />
          <ColorPickerInput
            label="Background"
            val={colors.background}
            onChange={(val) => handleColorChange("background", val)}
          />
          <ColorPickerInput
            label="Text"
            val={colors.text}
            onChange={(val) => handleColorChange("text", val)}
          />
          <div className="col-span-2">
            <ColorPickerInput
              label="Accent Highlights"
              val={colors.accent}
              onChange={(val) => handleColorChange("accent", val)}
            />
          </div>
        </div>
      </div>

      {/* Typography Fonts */}
      <div className="space-y-3 border-t border-slate-150 pt-5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center space-x-1.5">
          <Type size={12} className="text-slate-400" />
          <span>Typography Fonts</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">
              Headings
            </span>
            <select
              value={font.heading}
              onChange={(e) => handleFontChange("heading", e.target.value)}
              className="bg-white border border-slate-200 rounded-lg text-xs p-2 text-slate-700 focus:outline-none"
            >
              {fonts.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">
              Body Copy
            </span>
            <select
              value={font.body}
              onChange={(e) => handleFontChange("body", e.target.value)}
              className="bg-white border border-slate-200 rounded-lg text-xs p-2 text-slate-700 focus:outline-none"
            >
              {fonts.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Design Layout Style */}
      <div className="space-y-3 border-t border-slate-150 pt-5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-650 flex items-center space-x-1.5">
          <Layers size={12} className="text-slate-400" />
          <span>Layout Template</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {layouts.map((lay) => (
            <button
              key={lay.id}
              onClick={() => setLayoutStyle(lay.id)}
              className={`p-2.5 rounded-lg border text-center text-xs transition-all font-medium ${
                layoutStyle === lay.id
                  ? "bg-indigo-50 border-indigo-500 text-indigo-755 font-bold shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-350 hover:shadow-sm"
              }`}
            >
              {lay.label}
            </button>
          ))}
        </div>
      </div>

      {/* Button Style */}
      <div className="space-y-3 border-t border-slate-150 pt-5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-655">
          Interactive Button Edges
        </label>
        <div className="grid grid-cols-3 gap-2">
          {buttons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setButtonStyle(btn.id)}
              className={`p-2 rounded-lg border text-center text-[10px] transition-all font-semibold ${
                buttonStyle === btn.id
                  ? "bg-indigo-50 border-indigo-500 text-indigo-755 font-bold shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-350 hover:shadow-sm"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Org Locks */}
      {isOwner && (
        <div className="space-y-3 border-t border-slate-150 pt-5 flex items-center justify-between">
          <div className="space-y-1 pr-4">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-650 flex items-center space-x-1.5">
              <Shield size={12} className="text-indigo-650" />
              <span>Theme locking</span>
            </label>
            <p className="text-[9px] text-slate-500">
              Lock organization cards to apply this theme template universally.
            </p>
          </div>
          <input
            type="checkbox"
            checked={isLockedByOrg}
            onChange={(e) => setIsLockedByOrg(e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded border-slate-300 bg-white shrink-0 focus:ring-indigo-500"
          />
        </div>
      )}

      {/* Save Button */}
      <div className="border-t border-slate-150 pt-5 flex flex-col items-center space-y-3">
        {saveSuccess && (
          <span className="text-xs text-green-700 font-semibold flex items-center space-x-1.5 animate-bounce">
            <Check size={14} />
            <span>Theme saved successfully!</span>
          </span>
        )}
        <Button
          onClick={handleSaveTheme}
          className="w-full"
          isLoading={isSaving}
        >
          Save Theme Template
        </Button>
      </div>
    </div>
  );
};

// Helper hex-color picker row
const ColorPickerInput = ({ label, val, onChange }) => {
  return (
    <div className="flex flex-col space-y-1 w-full bg-slate-50 p-2 border border-slate-200 rounded-xl shadow-sm">
      <span className="text-[10px] font-bold text-slate-500 uppercase">
        {label}
      </span>
      <div className="flex items-center space-x-2">
        <input
          type="color"
          value={val}
          onChange={(e) => onChange(e.target.value)}
          className="w-6 h-6 rounded-md bg-transparent border-0 cursor-pointer overflow-hidden outline-none"
        />
        <input
          type="text"
          value={val.toUpperCase()}
          onChange={(e) => {
            let value = e.target.value;
            if (!value.startsWith("#")) value = "#" + value;
            if (value.length <= 7) onChange(value);
          }}
          className="w-20 bg-white border border-slate-250 rounded-lg text-xs p-1 text-slate-700 font-mono focus:outline-none"
        />
      </div>
    </div>
  );
};
