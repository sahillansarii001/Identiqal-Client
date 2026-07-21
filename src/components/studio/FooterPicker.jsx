'use client';

import React, { useEffect, useState } from 'react';
import axiosInstance from '@/services/axiosInstance';
import { useCardBuilderStore } from '@/store/cardBuilderStore';
import { Plus, X, Sparkles, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/Toast';

export default function FooterPicker() {
  const { footerPreset, setDesignPreset } = useCardBuilderStore();
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // Footer builder form state
  const [footerForm, setFooterForm] = useState({
    name: '',
    status: 'published',
    style: 'Minimal',
    footerHeight: '56px',
    padding: '16px 24px',
    borderRadius: '0px',
    backgroundType: 'Solid',
    background: '#F8FAFC',
    backgroundEnd: '#E2E8F0',
    gradientDirection: 'to right',
    divider: true,
    dividerColor: '#E2E8F0',
    ctaEnabled: false,
    ctaText: 'Save Contact',
    ctaColor: '#2563EB',
    ctaTextColor: '#FFFFFF',
    ctaStyle: 'Pill',
    socialLayout: 'Row',
    socialIconStyle: 'Circle',
    qrPosition: 'Hidden',
    copyright: true,
    copyrightText: 'Powered by Identiqal',
    contentTemplate: 'Powered by Identiqal'
  });

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const fetchPresets = async () => {
      try {
        const res = await axiosInstance.get('/presets/footers');
        setPresets(Array.isArray(res) ? res : (res.data || []));
      } catch (err) {
        console.error('Failed to fetch footer presets:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPresets();
  }, []);

  const handleAIGenerate = () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setTimeout(() => {
      const prompt = aiPrompt.toLowerCase();
      let gen = {
        style: 'Minimal',
        backgroundType: 'Solid',
        background: '#18181b',
        copyrightText: 'Powered by Identiqal'
      };

      if (prompt.includes('luxury') || prompt.includes('gold') || prompt.includes('black')) {
        gen = {
          style: 'Corporate',
          backgroundType: 'Gradient',
          background: '#09090b',
          backgroundEnd: '#1e1b15',
          copyrightText: '✨ Premium Executive Card'
        };
      } else if (prompt.includes('glass') || prompt.includes('translucent')) {
        gen = {
          style: 'Glass',
          backgroundType: 'Glass',
          background: 'rgba(255,255,255,0.05)',
          copyrightText: 'Glassmorphism signature footer'
        };
      } else if (prompt.includes('gradient') || prompt.includes('colorful')) {
        gen = {
          style: 'Gradient',
          backgroundType: 'Gradient',
          background: '#3b82f6',
          backgroundEnd: '#8b5cf6',
          copyrightText: 'Creative Gradient Signature'
        };
      }

      setFooterForm(prev => ({
        ...prev,
        ...gen
      }));
      setAiLoading(false);
      toast.success('AI successfully generated footer styling parameters!');
    }, 1200);
  };

  const handlePublishFooter = async (e) => {
    e.preventDefault();
    if (!footerForm.name.trim()) {
      toast.error('Footer Name is required');
      return;
    }

    setPublishing(true);
    try {
      const res = await axiosInstance.post('/presets/footers', footerForm);
      const newPreset = res.data?.data || res.data || res;
      if (newPreset && newPreset._id) {
        setPresets(prev => [newPreset, ...prev]);
        setDesignPreset('footerPreset', newPreset);
        toast.success(`Published footer style "${newPreset.name}" successfully!`);
        setIsDrawerOpen(false);
      } else {
        toast.error('Failed to create footer style preset');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error occurred while publishing the footer preset');
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return <div className="text-zinc-400 text-sm animate-pulse">Loading footer styles...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Select Footer Preset</h2>
          <p className="text-xs text-zinc-400">Configure signature, brand watermark alignment, and copyright disclaimers at the bottom.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus size={13} />
          Add Footer Preset
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {presets.map((preset) => {
          const isSelected = footerPreset?._id === preset._id;
          return (
            <button
              key={preset._id}
              type="button"
              className={`p-3.5 rounded-2xl flex flex-col items-stretch hover:shadow-md transition-all border text-left cursor-pointer group ${
                isSelected 
                  ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-600/10 shadow-[0_0_20px_rgba(59,130,246,0.15)] ring-2 ring-blue-500/20' 
                  : 'border-gray-200 dark:border-zinc-800 bg-gray-50/30 dark:bg-zinc-900/30 hover:bg-gray-100 dark:hover:bg-zinc-800/80 hover:border-gray-300 dark:hover:border-zinc-700'
              }`}
              onClick={() => setDesignPreset('footerPreset', preset)}
            >
              <div className="w-full aspect-[21/9] bg-gray-100 dark:bg-zinc-950/60 rounded-xl mb-3 flex items-end justify-center border border-gray-200 dark:border-zinc-800 overflow-hidden relative group-hover:border-gray-300 dark:group-hover:border-zinc-700 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Visual representation of footer preset shapes */}
                <div 
                  className="w-full h-8 flex items-center justify-center text-[7px] font-mono border-t border-gray-200 dark:border-zinc-800/50 text-gray-550 dark:text-zinc-400 shadow-inner px-2 truncate"
                  style={{
                    borderRadius: preset.borderRadius || '0px',
                    background: preset.background || '#18181b',
                  }}
                >
                  {preset.copyrightText || preset.contentTemplate || 'Watermark'}
                </div>
              </div>
              <span className={`text-xs font-bold text-center ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-zinc-200'}`}>{preset.name}</span>
            </button>
          );
        })}
      </div>

      {/* ───────────────── FOOTER BUILDER DRAWER ───────────────── */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black/80 flex justify-end z-50 animate-fade-in select-none">
          <div className="w-full max-w-lg bg-zinc-900 border-l border-zinc-800 h-full flex flex-col shadow-2xl relative">
            
            {/* Header */}
            <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                  <Sparkles size={14} className="text-blue-500 animate-pulse" />
                  Footer Preset Builder
                </h3>
                <p className="text-[10px] text-zinc-500">Configure visual footer heights, shapes, and branding watermark templates.</p>
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
            <form onSubmit={handlePublishFooter} className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar text-left">
              {/* Preset Name */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Preset Name *</label>
                <input 
                  type="text" 
                  required
                  value={footerForm.name}
                  onChange={e => setFooterForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Executive Gold Signature"
                  className="w-full px-3.5 py-2.5 text-xs border border-zinc-800 rounded-xl bg-zinc-950 text-white focus:outline-none"
                />
              </div>

              {/* AI generator block */}
              <div className="p-4 bg-blue-950/20 border border-blue-900/30 rounded-2xl space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                  <Sparkles size={11} className="animate-spin" />
                  AI Footer Architect
                </label>
                <textarea 
                  rows={2}
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  placeholder='Describe: e.g. "Luxury black with gold copyright logo", "Transparent glassmorphism"'
                  className="w-full px-3 py-2 text-xs border border-blue-900/20 rounded-xl bg-zinc-950 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none placeholder-zinc-650"
                />
                <button
                  type="button"
                  onClick={handleAIGenerate}
                  disabled={aiLoading || !aiPrompt.trim()}
                  className="w-full py-2 bg-blue-600/20 hover:bg-blue-600 text-blue-400 rounded-lg text-[10px] font-bold transition-all disabled:opacity-40 flex items-center justify-center gap-1.5 cursor-pointer border border-blue-500/20"
                >
                  {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={11} />}
                  {aiLoading ? 'Synthesizing...' : 'Generate Footer Preset'}
                </button>
              </div>

              {/* Style Selection Options */}
              <div className="space-y-4 pt-3 border-t border-zinc-800/60">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Footer Shape & Height</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wide mb-1.5">Footer Shape Preset</label>
                    <select 
                      value={footerForm.style}
                      onChange={e => setFooterForm(prev => ({ ...prev, style: e.target.value }))}
                      className="w-full px-3 py-2 text-xs border border-zinc-800 rounded-lg bg-zinc-950 text-white focus:outline-none"
                    >
                      {['Minimal', 'Glass', 'Gradient', 'Corporate', 'CTA', 'Social', 'Custom'].map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wide mb-1.5">Footer Height (Height)</label>
                    <input 
                      type="text"
                      value={footerForm.footerHeight}
                      onChange={e => setFooterForm(prev => ({ ...prev, footerHeight: e.target.value }))}
                      className="w-full px-3 py-2 text-xs border border-zinc-800 rounded-lg bg-zinc-950 text-white focus:outline-none font-mono"
                      placeholder="e.g. 56px"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wide mb-1.5">Padding Offset</label>
                    <input 
                      type="text"
                      value={footerForm.padding}
                      onChange={e => setFooterForm(prev => ({ ...prev, padding: e.target.value }))}
                      className="w-full px-3 py-2 text-xs border border-zinc-800 rounded-lg bg-zinc-950 text-white focus:outline-none font-mono"
                      placeholder="e.g. 16px 24px"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wide mb-1.5">Background Type</label>
                    <select 
                      value={footerForm.backgroundType}
                      onChange={e => setFooterForm(prev => ({ ...prev, backgroundType: e.target.value }))}
                      className="w-full px-3 py-2 text-xs border border-zinc-800 rounded-lg bg-zinc-950 text-white focus:outline-none"
                    >
                      {['Solid', 'Gradient', 'Glass', 'Transparent'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Color configurations */}
              <div className="space-y-4 pt-3 border-t border-zinc-800/60">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Color Palette Settings</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wide">Background Color</label>
                    <div className="flex items-center gap-2">
                      <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-zinc-800 shrink-0">
                        <input 
                          type="color" 
                          value={footerForm.background.startsWith('#') ? footerForm.background : '#F8FAFC'}
                          onChange={e => setFooterForm(prev => ({ ...prev, background: e.target.value }))}
                          className="absolute -inset-1 cursor-pointer w-10 h-10 border-none outline-none p-0"
                        />
                      </div>
                      <input 
                        type="text" 
                        value={footerForm.background}
                        onChange={e => setFooterForm(prev => ({ ...prev, background: e.target.value }))}
                        className="w-full px-2.5 py-1.5 text-[10px] font-mono border border-zinc-800 rounded-lg bg-zinc-950 text-white uppercase focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wide">Background End (Gradient)</label>
                    <div className="flex items-center gap-2">
                      <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-zinc-800 shrink-0">
                        <input 
                          type="color" 
                          value={footerForm.backgroundEnd.startsWith('#') ? footerForm.backgroundEnd : '#E2E8F0'}
                          onChange={e => setFooterForm(prev => ({ ...prev, backgroundEnd: e.target.value }))}
                          className="absolute -inset-1 cursor-pointer w-10 h-10 border-none outline-none p-0"
                        />
                      </div>
                      <input 
                        type="text" 
                        value={footerForm.backgroundEnd}
                        onChange={e => setFooterForm(prev => ({ ...prev, backgroundEnd: e.target.value }))}
                        className="w-full px-2.5 py-1.5 text-[10px] font-mono border border-zinc-800 rounded-lg bg-zinc-950 text-white uppercase focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Branding copyright */}
              <div className="space-y-4 pt-3 border-t border-zinc-800/60 font-sans">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Watermark copyright logo</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={footerForm.copyright}
                      onChange={e => setFooterForm(prev => ({ ...prev, copyright: e.target.checked }))}
                      className="rounded border-zinc-800 text-blue-600 focus:ring-blue-500/30 bg-zinc-950"
                    />
                    <span className="text-xs text-zinc-300 font-semibold">Enable Branding Watermark</span>
                  </label>

                  <div>
                    <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wide mb-1.5">Copyright Signature Content</label>
                    <input 
                      type="text" 
                      value={footerForm.copyrightText}
                      onChange={e => setFooterForm(prev => ({ ...prev, copyrightText: e.target.value, contentTemplate: e.target.value }))}
                      className="w-full px-3.5 py-2.5 text-xs border border-zinc-800 rounded-xl bg-zinc-950 text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Visual Preview */}
              <div className="space-y-2 pt-3 border-t border-zinc-800/60">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Footer Shape Preview</h4>
                <div 
                  className="h-14 rounded-xl border border-zinc-850 flex items-center justify-center text-xs font-mono font-bold select-none relative overflow-hidden"
                  style={{
                    background: footerForm.backgroundType === 'Gradient' 
                      ? `linear-gradient(${footerForm.gradientDirection}, ${footerForm.background}, ${footerForm.backgroundEnd})`
                      : footerForm.backgroundType === 'Glass'
                        ? 'rgba(255,255,255,0.08)'
                        : footerForm.background,
                    color: '#94a3b8',
                    borderTopColor: footerForm.divider ? footerForm.dividerColor : 'transparent'
                  }}
                >
                  {footerForm.copyright ? footerForm.copyrightText : 'Watermark Disabled'}
                </div>
              </div>
            </form>

            {/* Footer Buttons */}
            <div className="p-5 border-t border-zinc-800/80 flex gap-3 bg-zinc-900 shrink-0">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="flex-1 py-3 text-xs font-bold bg-zinc-800 hover:bg-zinc-750 text-zinc-350 rounded-xl transition-all border border-zinc-750 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePublishFooter}
                disabled={publishing}
                className="flex-1 py-3 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
              >
                {publishing ? <Loader2 size={13} className="animate-spin" /> : null}
                {publishing ? 'Publishing...' : 'Publish Footer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
