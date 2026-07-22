'use client';

import React, { useState } from 'react';
import { useCardBuilderStore } from '@/store/cardBuilderStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, Layout, Image as ImgIcon, User, Link as LinkIcon,
  Palette, FileText, Settings, Sparkles, ChevronRight
} from 'lucide-react';
import CoverEditorPanel from './editors/CoverEditorPanel';
import AvatarEditorPanel from './editors/AvatarEditorPanel';
import { InspectorPanel } from './InspectorPanel';

const SECTIONS = [
  { id: 'header', label: 'Header Layout', icon: Layout, desc: 'Layout & wave designs' },
  { id: 'cover', label: 'Cover Image', icon: ImgIcon, desc: 'Position, zoom & overlay' },
  { id: 'profile', label: 'Profile Photo', icon: User, desc: 'Shape, border & scale' },
  { id: 'links', label: 'Links', icon: LinkIcon, desc: 'Social & custom URLs' },
  { id: 'footer', label: 'Footer Style', icon: FileText, desc: 'Footer templates' },
  { id: 'theme', label: 'Card Theme', icon: Palette, desc: 'Color palette & dark mode' },
  { id: 'advanced', label: 'Advanced Blocks', icon: Settings, desc: 'Reorder & manage all blocks' },
];

export default function CustomizePanel() {
  const [activeSection, setActiveSection] = useState(null); // null means menu view
  const { resetWizard, openCoverEditor, openAvatarEditor, setActiveSection: setStoreActiveSection, setBlockPickerOpen } = useCardBuilderStore();

  const handleOpenSection = (sectionId) => {
    if (sectionId === 'cover') {
      openCoverEditor();
    } else if (sectionId === 'profile') {
      openAvatarEditor();
    } else {
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#181518] relative z-10 w-full overflow-hidden">
      <AnimatePresence mode="wait">
        {!activeSection ? (
          /* ── MENU VIEW ──────────────────────────────────────────────────── */
          <motion.div
            key="menu"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col h-full overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-100 dark:border-white/10 bg-white/90 dark:bg-[#181518]/90 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">
                  Customize Card
                </h3>
                <p className="text-[11px] text-gray-400">Select any section to edit</p>
              </div>

              <button
                onClick={resetWizard}
                className="px-2.5 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 rounded-xl text-[11px] font-bold transition-colors flex items-center gap-1"
                title="Restart 8-step setup wizard"
              >
                <Sparkles size={12} /> Wizard
              </button>
            </div>

            {/* Menu List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
              {SECTIONS.map((sec) => {
                const Icon = sec.icon;
                return (
                  <button
                    key={sec.id}
                    onClick={() => handleOpenSection(sec.id)}
                    className="w-full p-3.5 bg-white dark:bg-[#1C191D] hover:bg-gray-50 dark:hover:bg-white/5 border border-gray-150 dark:border-white/10 rounded-2xl flex items-center justify-between transition-all duration-200 group text-left shadow-sm hover:shadow-md hover:border-blue-400/40"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">
                          {sec.label}
                        </h4>
                        <p className="text-[10px] text-gray-400 font-medium">
                          {sec.desc}
                        </p>
                      </div>
                    </div>

                    <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* ── SUB-EDITOR VIEW ────────────────────────────────────────────── */
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col h-full overflow-hidden"
          >
            {/* Header with back button */}
            <div className="p-4 border-b border-gray-100 dark:border-white/10 bg-white/90 dark:bg-[#181518]/90 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveSection(null)}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors text-gray-500 dark:text-gray-300 -ml-1"
                >
                  <ChevronLeft size={18} />
                </button>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm capitalize">
                  {SECTIONS.find((s) => s.id === activeSection)?.label || activeSection}
                </h3>
              </div>
            </div>

            {/* Render selected editor */}
            <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
              {activeSection === 'advanced' ? (
                <InspectorPanel />
              ) : (
                <SectionEditorContent type={activeSection} onClose={() => setActiveSection(null)} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Sub-editor container mapping */
function SectionEditorContent({ type }) {
  const { displayPreset, colorTheme, footerPreset, setDesignPreset, sections, updateSection } = useCardBuilderStore();
  const [displayPresets, setDisplayPresets] = React.useState([]);
  const [colorThemes, setColorThemes] = React.useState([]);
  const [footerPresets, setFooterPresets] = React.useState([]);

  React.useEffect(() => {
    const load = async () => {
      try {
        const [dRes, cRes, fRes] = await Promise.all([
          axiosInstance.get('/presets/display'),
          axiosInstance.get('/presets/colors'),
          axiosInstance.get('/presets/footers')
        ]);
        setDisplayPresets(Array.isArray(dRes) ? dRes : (dRes.data || []));
        setColorThemes(Array.isArray(cRes) ? cRes : (cRes.data || []));
        setFooterPresets(Array.isArray(fRes) ? fRes : (fRes.data || []));
      } catch (err) {}
    };
    load();
  }, []);

  if (type === 'header') {
    return (
      <div className="space-y-4">
        <p className="text-xs text-gray-400">Choose header layout style:</p>
        <div className="grid grid-cols-2 gap-3">
          {displayPresets.map((preset) => (
            <button
              key={preset._id}
              onClick={() => setDesignPreset('displayPreset', preset)}
              className={`p-2.5 rounded-2xl border text-center transition-all ${
                displayPreset?._id === preset._id ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 font-bold' : 'border-gray-200 dark:border-white/10'
              }`}
            >
              <span className="text-xs text-gray-800 dark:text-gray-200 capitalize">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'theme') {
    return (
      <div className="space-y-4">
        <p className="text-xs text-gray-400">Select color palette theme:</p>
        <div className="grid grid-cols-2 gap-3">
          {colorThemes.map((theme) => (
            <button
              key={theme._id}
              onClick={() => setDesignPreset('colorTheme', theme)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                colorTheme?._id === theme._id ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-200 dark:border-white/10'
              }`}
              style={{ backgroundColor: theme.background }}
            >
              <span className="text-xs font-bold block" style={{ color: theme.text }}>{theme.name}</span>
              <div className="flex gap-1 mt-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.primary }} />
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.secondary }} />
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.accent }} />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'footer') {
    return (
      <div className="space-y-3">
        <p className="text-xs text-gray-400">Select footer preset:</p>
        {footerPresets.map((f) => (
          <button
            key={f._id}
            onClick={() => setDesignPreset('footerPreset', f)}
            className={`w-full p-3 text-left rounded-xl border text-xs transition-all ${
              footerPreset?._id === f._id ? 'border-blue-500 bg-blue-50/50 text-blue-600 font-bold' : 'border-gray-200 dark:border-white/10'
            }`}
          >
            {f.name}
          </button>
        ))}
      </div>
    );
  }

  if (type === 'links') {
    const linksSection = sections.find((s) => s.type === 'links');
    const links = linksSection?.data?.links || [];
    return (
      <div className="space-y-3">
        <p className="text-xs text-gray-400">Links ({links.length}):</p>
        {links.map((link, idx) => (
          <div key={idx} className="p-3 border border-gray-200 dark:border-white/10 rounded-xl space-y-1.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Link {idx + 1}</span>
            <input
              type="text"
              value={link.label || ''}
              onChange={(e) => {
                const newLinks = [...links];
                newLinks[idx] = { ...newLinks[idx], label: e.target.value };
                updateSection(linksSection.sectionId, { links: newLinks });
              }}
              className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-xs"
              placeholder="Label"
            />
            <input
              type="text"
              value={link.url || ''}
              onChange={(e) => {
                const newLinks = [...links];
                newLinks[idx] = { ...newLinks[idx], url: e.target.value };
                updateSection(linksSection.sectionId, { links: newLinks });
              }}
              className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-xs font-mono"
              placeholder="URL"
            />
          </div>
        ))}
      </div>
    );
  }

  return null;
}
