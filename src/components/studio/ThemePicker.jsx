'use client';

import React, { useEffect, useState } from 'react';
import axiosInstance from '@/services/axiosInstance';
import { useCardBuilderStore } from '@/store/cardBuilderStore';
import { Plus, X, Sparkles, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/Toast';

export default function ThemePicker() {
  const { colorTheme, setDesignPreset } = useCardBuilderStore();
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // Theme builder form state
  const [themeForm, setThemeForm] = useState({
    name: '',
    category: 'General',
    status: 'published',
    primary: '#2563EB',
    secondary: '#1D4ED8',
    accent: '#3B82F6',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: '#111827',
    border: '#E5E7EB',
    button: '#2563EB',
    icon: '#495057'
  });

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const res = await axiosInstance.get('/presets/colors');
        setThemes(Array.isArray(res) ? res : (res.data || []));
      } catch (err) {
        console.error('Failed to fetch color themes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchThemes();
  }, []);

  const handleAIGenerate = () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setTimeout(() => {
      const prompt = aiPrompt.toLowerCase();
      let palette = {
        primary: '#2563EB',
        secondary: '#1E40AF',
        accent: '#3B82F6',
        background: '#ffffff',
        surface: '#F8FAFC',
        text: '#0F172A',
        border: '#E2E8F0',
        button: '#2563EB',
        icon: '#64748B'
      };

      if (prompt.includes('gold') || prompt.includes('luxury') || prompt.includes('black') || prompt.includes('dark')) {
        palette = {
          primary: '#D4A45B',
          secondary: '#AA803B',
          accent: '#F3E5AB',
          background: '#0A0A0A',
          surface: '#121212',
          text: '#F3F4F6',
          border: '#2A2A2A',
          button: '#D4A45B',
          icon: '#8A8A8A'
        };
      } else if (prompt.includes('ocean') || prompt.includes('blue') || prompt.includes('sea')) {
        palette = {
          primary: '#0ea5e9',
          secondary: '#0284c7',
          accent: '#38bdf8',
          background: '#0f172a',
          surface: '#1e293b',
          text: '#f8fafc',
          border: '#334155',
          button: '#0ea5e9',
          icon: '#94a3b8'
        };
      } else if (prompt.includes('minimal') || prompt.includes('white') || prompt.includes('clean')) {
        palette = {
          primary: '#18181b',
          secondary: '#27272a',
          accent: '#3f3f46',
          background: '#ffffff',
          surface: '#fafafa',
          text: '#09090b',
          border: '#e4e4e7',
          button: '#18181b',
          icon: '#71717a'
        };
      } else if (prompt.includes('purple') || prompt.includes('neon') || prompt.includes('cyber')) {
        palette = {
          primary: '#c084fc',
          secondary: '#a855f7',
          accent: '#e9d5ff',
          background: '#090514',
          surface: '#120b24',
          text: '#f3e8ff',
          border: '#2e1c4e',
          button: '#c084fc',
          icon: '#a78bfa'
        };
      } else if (prompt.includes('rose') || prompt.includes('pink') || prompt.includes('sunset')) {
        palette = {
          primary: '#f43f5e',
          secondary: '#e11d48',
          accent: '#fda4af',
          background: '#fdf2f8',
          surface: '#fce7f3',
          text: '#500724',
          border: '#fbcfe8',
          button: '#f43f5e',
          icon: '#db2777'
        };
      } else if (prompt.includes('forest') || prompt.includes('green') || prompt.includes('emerald') || prompt.includes('earth')) {
        palette = {
          primary: '#10b981',
          secondary: '#059669',
          accent: '#34d399',
          background: '#064e3b',
          surface: '#022c22',
          text: '#ecfdf5',
          border: '#065f46',
          button: '#10b981',
          icon: '#6ee7b7'
        };
      }

      setThemeForm(prev => ({
        ...prev,
        ...palette
      }));
      setAiLoading(false);
      toast.success('AI successfully generated theme palette parameters!');
    }, 1200);
  };

  const handlePublishTheme = async (e) => {
    e.preventDefault();
    if (!themeForm.name.trim()) {
      toast.error('Theme Name is required');
      return;
    }

    setPublishing(true);
    try {
      const res = await axiosInstance.post('/presets/colors', themeForm);
      const newTheme = res.data?.data || res.data || res;
      if (newTheme && newTheme._id) {
        setThemes(prev => [newTheme, ...prev]);
        setDesignPreset('colorTheme', newTheme);
        toast.success(`Published color theme "${newTheme.name}" successfully!`);
        setIsDrawerOpen(false);
      } else {
        toast.error('Failed to create color theme');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error occurred while publishing the theme preset');
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return <div className="text-zinc-400 text-sm animate-pulse">Loading color themes...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Select Color Theme</h2>
          <p className="text-xs text-zinc-400">Choose a color palette presets. Primary colors define buttons and highlights.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus size={13} />
          Add Color Theme
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {themes.map((theme) => {
          const isSelected = colorTheme?._id === theme._id;
          return (
            <button
              key={theme._id}
              type="button"
              className={`p-3.5 rounded-2xl flex flex-col items-stretch hover:shadow-md transition-all border text-left cursor-pointer group ${
                isSelected 
                  ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-600/10 shadow-[0_0_20px_rgba(59,130,246,0.15)] ring-2 ring-blue-500/20' 
                  : 'border-gray-200 dark:border-zinc-800 bg-gray-50/30 dark:bg-zinc-900/30 hover:bg-gray-100 dark:hover:bg-zinc-800/80 hover:border-gray-300 dark:hover:border-zinc-700'
              }`}
              onClick={() => setDesignPreset('colorTheme', theme)}
            >
              <div 
                className="w-full aspect-[2.5/1] mb-2.5 rounded-xl border p-2 flex flex-col justify-between overflow-hidden transition-colors"
                style={{ backgroundColor: theme.background || '#ffffff', borderColor: theme.border || 'rgba(0,0,0,0.06)' }}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: theme.primary || '#2563EB' }} />
                    <span className="text-[9px] font-bold truncate max-w-[80px]" style={{ color: theme.text || '#111827' }}>Preview</span>
                  </div>
                  <span className="w-5 h-3 rounded border border-black/5 shrink-0" style={{ backgroundColor: theme.secondary || '#6c757d' }} />
                </div>
                <div className="h-1.5 rounded" style={{ backgroundColor: theme.accent || '#0d6efd', width: '40%' }} />
              </div>
              <span className={`text-xs font-bold ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-zinc-200'}`}>{theme.name}</span>
            </button>
          );
        })}
      </div>

      {/* ───────────────── THEME BUILDER DRAWER ───────────────── */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black/80 flex justify-end z-50 animate-fade-in select-none">
          <div className="w-full max-w-md bg-zinc-900 border-l border-zinc-800 h-full flex flex-col shadow-2xl relative">
            
            {/* Header */}
            <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                  <Sparkles size={14} className="text-blue-500 animate-pulse" />
                  Color Theme Builder
                </h3>
                <p className="text-[10px] text-zinc-500">Design a premium palette visually or use AI prompt assistance.</p>
              </div>
              <button 
                type="button" 
                onClick={() => setIsDrawerOpen(false)}
                className="w-8 h-8 rounded-lg bg-zinc-850 hover:bg-zinc-800 flex items-center justify-center text-zinc-400 cursor-pointer border border-zinc-800"
              >
                <X size={14} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handlePublishTheme} className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar text-left">
              {/* Theme Name */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Theme Palette Name *</label>
                <input 
                  type="text" 
                  required
                  value={themeForm.name}
                  onChange={e => setThemeForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Midnight Royal Blue"
                  className="w-full px-3.5 py-2.5 text-xs border border-zinc-800 rounded-xl bg-zinc-950 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>

              {/* AI generator block */}
              <div className="p-4 bg-blue-950/20 border border-blue-900/30 rounded-2xl space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                  <Sparkles size={11} className="animate-spin" />
                  AI Generate Palette
                </label>
                <textarea 
                  rows={2}
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  placeholder='Describe mood: e.g. "Royal Blue", "Luxury black with gold accents"'
                  className="w-full px-3 py-2 text-xs border border-blue-900/20 rounded-xl bg-zinc-950 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none placeholder-zinc-600"
                />
                <button
                  type="button"
                  onClick={handleAIGenerate}
                  disabled={aiLoading || !aiPrompt.trim()}
                  className="w-full py-2 bg-blue-600/20 hover:bg-blue-600 text-blue-400 rounded-lg text-[10px] font-bold transition-all disabled:opacity-40 flex items-center justify-center gap-1.5 cursor-pointer border border-blue-500/20"
                >
                  {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={11} />}
                  {aiLoading ? 'Analyzing Prompt...' : 'Generate Palette'}
                </button>
              </div>

              {/* Grid palette pickers */}
              <div className="space-y-3 pt-3 border-t border-zinc-800/60">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Color Palette Config</h4>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'primary', label: 'Primary (Buttons)' },
                    { id: 'secondary', label: 'Secondary Accent' },
                    { id: 'accent', label: 'Highlights' },
                    { id: 'background', label: 'Page Background' },
                    { id: 'surface', label: 'Containers Surface' },
                    { id: 'text', label: 'Body Text' },
                    { id: 'border', label: 'Border Trim' },
                    { id: 'button', label: 'CTA Button background' },
                    { id: 'icon', label: 'Icon Highlight' },
                  ].map((field) => (
                    <div key={field.id} className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wide">{field.label}</label>
                      <div className="flex items-center gap-2">
                        <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-zinc-800 shrink-0">
                          <input 
                            type="color" 
                            value={themeForm[field.id]}
                            onChange={e => setThemeForm(prev => ({ ...prev, [field.id]: e.target.value }))}
                            className="absolute -inset-1 cursor-pointer w-10 h-10 border-none outline-none p-0"
                          />
                        </div>
                        <input 
                          type="text" 
                          value={themeForm[field.id]}
                          onChange={e => setThemeForm(prev => ({ ...prev, [field.id]: e.target.value }))}
                          className="w-full px-2.5 py-1.5 text-[10px] font-mono border border-zinc-800 rounded-lg bg-zinc-950 text-white uppercase focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual Palette Preview */}
              <div className="space-y-2 pt-3 border-t border-zinc-800/60">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Palette Mockup Preview</h4>
                <div 
                  className="p-4 rounded-2xl border flex flex-col justify-between h-28 relative overflow-hidden"
                  style={{ backgroundColor: themeForm.background, borderColor: themeForm.border, color: themeForm.text }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xs font-black">Alex Rivers</div>
                      <div className="text-[9px] mt-0.5 opacity-60">Senior Product Designer</div>
                    </div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: themeForm.primary, color: '#ffffff' }}>AR</div>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <button 
                      type="button" 
                      className="px-3 py-1 text-[9px] rounded-lg text-white font-bold pointer-events-none"
                      style={{ backgroundColor: themeForm.button }}
                    >
                      Connect
                    </button>
                    <span className="text-[8px] opacity-40 font-mono">Theme Mock</span>
                  </div>
                </div>
              </div>
            </form>

            {/* Footer buttons */}
            <div className="p-5 border-t border-zinc-800/80 flex gap-3 bg-zinc-900 shrink-0">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="flex-1 py-3 text-xs font-bold bg-zinc-800 hover:bg-zinc-750 text-zinc-350 rounded-xl transition-all cursor-pointer border border-zinc-750"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePublishTheme}
                disabled={publishing}
                className="flex-1 py-3 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
              >
                {publishing ? <Loader2 size={13} className="animate-spin" /> : null}
                {publishing ? 'Publishing...' : 'Publish Theme'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
