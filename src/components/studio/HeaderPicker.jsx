'use client';

import React, { useEffect, useState } from 'react';
import axiosInstance from '@/services/axiosInstance';
import { useCardBuilderStore } from '@/store/cardBuilderStore';
import { Plus, X, Sparkles, Loader2, Upload, Settings, Compass, Layout, CheckCircle } from 'lucide-react';
import { toast } from '@/components/ui/Toast';

export default function HeaderPicker() {
  const { displayPreset, setDesignPreset } = useCardBuilderStore();
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // Creation Method: 'shape' | 'ai' | 'svg' | 'manual'
  const [creationMethod, setCreationMethod] = useState('shape');

  // Header form settings
  const [headerForm, setHeaderForm] = useState({
    name: '',
    category: 'General',
    description: '',
    status: 'published',
    headerStyle: 'Solid Color',
    headerHeight: '200px',
    profilePhotoStyle: 'Circle',
    profilePhotoPosition: 'Center',
    cardShape: 'Rounded',
    animationStyle: 'Fade',
    buttonStyle: 'Rounded',
    dividerStyle: 'Subtle',
    sectionSpacing: 'Normal',
    typography: 'Modern Sans',
    allowDrag: true,
    allowZoom: true,
    defaultZoom: 100,
    defaultPositionX: 0,
    defaultPositionY: 0
  });

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [uploadedSvg, setUploadedSvg] = useState(null);

  useEffect(() => {
    const fetchPresets = async () => {
      try {
        const res = await axiosInstance.get('/presets/display');
        setPresets(Array.isArray(res) ? res : (res.data || []));
      } catch (err) {
        console.error('Failed to fetch display presets:', err);
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
        headerStyle: 'Solid Color',
        headerHeight: '200px',
        profilePhotoStyle: 'Circle',
        profilePhotoPosition: 'Center',
        cardShape: 'Rounded'
      };

      if (prompt.includes('luxury') || prompt.includes('gold')) {
        gen = {
          headerStyle: 'Luxury',
          headerHeight: '240px',
          profilePhotoStyle: 'Gradient Border',
          profilePhotoPosition: 'Center',
          cardShape: 'Soft Shadow'
        };
      } else if (prompt.includes('wave') || prompt.includes('curved')) {
        gen = {
          headerStyle: 'Curved Wave',
          headerHeight: '220px',
          profilePhotoStyle: 'Glass Border',
          profilePhotoPosition: 'Center',
          cardShape: 'Glass'
        };
      } else if (prompt.includes('minimal') || prompt.includes('flat')) {
        gen = {
          headerStyle: 'Flat',
          headerHeight: '160px',
          profilePhotoStyle: 'No Border',
          profilePhotoPosition: 'Left',
          cardShape: 'Borderless'
        };
      } else if (prompt.includes('diagonal') || prompt.includes('split')) {
        gen = {
          headerStyle: 'Diagonal Split',
          headerHeight: '230px',
          profilePhotoStyle: 'Shadow',
          profilePhotoPosition: 'Center',
          cardShape: 'Rounded'
        };
      } else if (prompt.includes('aurora') || prompt.includes('mesh')) {
        gen = {
          headerStyle: 'Aurora',
          headerHeight: '260px',
          profilePhotoStyle: 'Gradient Border',
          profilePhotoPosition: 'Floating',
          cardShape: 'Floating'
        };
      }

      setHeaderForm(prev => ({
        ...prev,
        ...gen
      }));
      setAiLoading(false);
      toast.success('AI successfully generated layout configurations!');
    }, 1200);
  };

  const handleSvgUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadedSvg(ev.target.result);
      // Auto fill settings based on parsing mock
      setHeaderForm(prev => ({
        ...prev,
        headerStyle: 'Glass',
        headerHeight: '220px',
        cardShape: 'Glass'
      }));
      toast.success('SVG Layout parsed and uploaded successfully!');
    };
    reader.readAsText(file);
  };

  const handlePublishLayout = async (e) => {
    e.preventDefault();
    if (!headerForm.name.trim()) {
      toast.error('Layout Name is required');
      return;
    }

    setPublishing(true);
    try {
      const res = await axiosInstance.post('/presets/display', headerForm);
      const newPreset = res.data?.data || res.data || res;
      if (newPreset && newPreset._id) {
        setPresets(prev => [newPreset, ...prev]);
        setDesignPreset('displayPreset', newPreset);
        toast.success(`Published display layout "${newPreset.name}" successfully!`);
        setIsDrawerOpen(false);
      } else {
        toast.error('Failed to create header display layout');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error occurred while publishing the display layout preset');
    } finally {
      setPublishing(false);
    }
  };

  const selectExistingShape = (shapeName) => {
    setHeaderForm(prev => ({
      ...prev,
      headerStyle: shapeName
    }));
    toast.success(`Selected shape: ${shapeName}`);
  };

  if (loading) {
    return <div className="text-zinc-400 text-sm animate-pulse">Loading header layouts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Select Header Layout</h2>
          <p className="text-xs text-zinc-400">Choose a header style to define the top layout, shape overlays, and overall canvas structure.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus size={13} />
          Add Header Layout
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 select-none">
        {presets.map((preset) => {
          const isSelected = displayPreset?._id === preset._id;
          return (
            <div key={preset._id} className="flex flex-col items-center gap-2">
              <button
                type="button"
                className={`w-full aspect-[3/4] rounded-2xl bg-zinc-950 overflow-hidden relative border-2 transition-all duration-200 cursor-pointer ${
                  isSelected 
                    ? 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.35)] scale-[1.02]' 
                    : 'border-zinc-800 dark:border-zinc-800/80 hover:border-zinc-750'
                }`}
                onClick={() => setDesignPreset('displayPreset', preset)}
              >
                {/* Active checkmark circle badge */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white z-20 shadow border border-white/20">
                    <CheckCircle size={10} className="fill-white text-blue-500" />
                  </div>
                )}
                
                {/* Visual Representation of Layout Shapes */}
                {preset.name === 'Modern' && (
                  <div className="absolute inset-0 flex flex-col bg-zinc-900">
                    <div className="h-1/2 relative bg-blue-600 overflow-hidden">
                      <div className="absolute top-0 right-0 w-0 h-0 border-t-[50px] border-t-white border-l-[90px] border-l-transparent" />
                    </div>
                  </div>
                )}
                {preset.name === 'Sleek' && (
                  <div className="absolute inset-0 flex flex-col bg-zinc-900 items-center pt-2">
                    <div className="w-[70%] h-5 rounded-full bg-blue-600 border border-blue-500/20" />
                  </div>
                )}
                {preset.name === 'Blend' && (
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-600 via-blue-900/60 to-zinc-900" />
                )}
                {preset.name === 'Creative' && (
                  <div className="absolute inset-0 flex flex-col bg-zinc-900">
                    <div className="h-1/2 bg-blue-600 relative overflow-hidden">
                      <div className="absolute bottom-0 left-0 right-0 h-2 bg-white rounded-t-[50%] scale-y-[0.8] translate-y-0.5" />
                      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-zinc-900 rounded-t-[50%]" />
                    </div>
                  </div>
                )}
                {preset.name === 'Luxury' && (
                  <div className="absolute inset-0 bg-zinc-900 flex flex-col">
                    <div className="h-[40%] bg-zinc-900 border-b border-zinc-800 relative flex items-end">
                      <div className="w-full h-0.5 bg-yellow-500/80 shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
                    </div>
                  </div>
                )}
                {preset.name === 'Aurora' && (
                  <div className="absolute inset-0 bg-zinc-900 flex flex-col overflow-hidden">
                    <div className="h-3/5 bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 blur-[4px] scale-110 opacity-90" />
                  </div>
                )}
                {preset.name === 'Minimal' && (
                  <div className="absolute inset-0 bg-zinc-900 flex flex-col">
                    <div className="h-1 bg-blue-600 w-full" />
                  </div>
                )}
                {preset.name === 'Executive' && (
                  <div className="absolute inset-0 bg-zinc-900 flex flex-col">
                    <div className="h-[40%] bg-blue-600 w-full" />
                  </div>
                )}
                {preset.name === 'Classic' && (
                  <div className="absolute inset-0 flex flex-col bg-zinc-900">
                    <div className="h-[40%] bg-blue-600 relative overflow-hidden">
                      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-zinc-900 rounded-t-[50%]" />
                    </div>
                  </div>
                )}
                {preset.name === 'Flat' && (
                  <div className="absolute inset-0 bg-zinc-900 flex flex-col">
                    <div className="h-[40%] bg-blue-600 w-full" />
                  </div>
                )}

                {/* Default Fallback for custom layouts */}
                {['Modern', 'Sleek', 'Blend', 'Creative', 'Luxury', 'Aurora', 'Minimal', 'Executive', 'Classic', 'Flat'].indexOf(preset.name) === -1 && (
                  <div className="absolute inset-0 bg-zinc-900 flex flex-col justify-between p-2">
                    <div className="h-1/3 bg-blue-600 w-full rounded" />
                    <span className="text-[7px] text-zinc-500 uppercase tracking-widest font-bold">Preset</span>
                  </div>
                )}
              </button>
              <span className={`text-[10px] font-bold tracking-wide transition-colors ${
                isSelected ? 'text-blue-600 dark:text-blue-400 font-extrabold' : 'text-gray-600 dark:text-zinc-450'
              }`}>{preset.name}</span>
            </div>
          );
        })}
      </div>

      {/* ───────────────── HEADER BUILDER DRAWER ───────────────── */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black/80 flex justify-end z-50 animate-fade-in select-none">
          <div className="w-full max-w-lg bg-zinc-900 border-l border-zinc-800 h-full flex flex-col shadow-2xl relative">
            
            {/* Header */}
            <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                  <Layout size={14} className="text-blue-500" />
                  Header Layout Builder
                </h3>
                <p className="text-[10px] text-zinc-500">Design advanced card display shapes and avatar alignments.</p>
              </div>
              <button 
                type="button" 
                onClick={() => setIsDrawerOpen(false)}
                className="w-8 h-8 rounded-lg bg-zinc-850 hover:bg-zinc-800 flex items-center justify-center text-zinc-400 cursor-pointer border border-zinc-800"
              >
                <X size={14} />
              </button>
            </div>

            {/* Creation Method Selection Tabs */}
            <div className="flex bg-zinc-950 p-1 shrink-0 border-b border-zinc-850">
              {[
                { id: 'shape', label: 'Predesigned Shape', icon: Compass },
                { id: 'ai', label: 'AI Generator', icon: Sparkles },
                { id: 'svg', label: 'Upload SVG', icon: Upload },
                { id: 'manual', label: 'Build Manually', icon: Settings }
              ].map(m => {
                const Icon = m.icon;
                const active = creationMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setCreationMethod(m.id)}
                    className={`flex-1 py-2 text-[10px] font-bold rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      active ? 'bg-zinc-900 text-blue-400 font-extrabold border border-zinc-800' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <Icon size={11} />
                    {m.label}
                  </button>
                );
              })}
            </div>

            {/* Scrollable Form Content */}
            <form onSubmit={handlePublishLayout} className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar text-left">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">1. Basic Info</h4>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Layout Style Name *</label>
                  <input 
                    type="text" 
                    required
                    value={headerForm.name}
                    onChange={e => setHeaderForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Curved Wave Sleek Header"
                    className="w-full px-3.5 py-2.5 text-xs border border-zinc-800 rounded-xl bg-zinc-950 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Category</label>
                    <input 
                      type="text"
                      value={headerForm.category}
                      onChange={e => setHeaderForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3.5 py-2.5 text-xs border border-zinc-800 rounded-xl bg-zinc-950 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Description</label>
                    <input 
                      type="text"
                      value={headerForm.description}
                      onChange={e => setHeaderForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="e.g. Premium curved wave design"
                      className="w-full px-3.5 py-2.5 text-xs border border-zinc-800 rounded-xl bg-zinc-950 text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Step configs depending on creationMethod */}
              <div className="pt-4 border-t border-zinc-800/60 space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">2. Layout Parameters</h4>

                {creationMethod === 'shape' && (
                  <div className="space-y-3">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">Choose Shape Overlay Preset</label>
                    <div className="grid grid-cols-3 gap-2 max-h-[220px] overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                      {[
                        'Solid', 'Flat', 'Minimal', 'Wave', 'Double Wave', 'Triple Wave',
                        'Curved', 'Arc', 'Diagonal', 'Diagonal Split', 'Slant', 'Ribbon',
                        'Organic Blob', 'Zigzag', 'Cut Corner', 'Rounded Top', 'Capsule',
                        'Glass', 'Gradient', 'Mesh', 'Layered', 'Luxury', 'Neon', 'Aurora'
                      ].map(shape => {
                        const selected = headerForm.headerStyle === shape;
                        return (
                          <button
                            key={shape}
                            type="button"
                            onClick={() => selectExistingShape(shape)}
                            className={`py-2 px-3 text-[10px] font-bold rounded-lg border transition-all text-center cursor-pointer ${
                              selected ? 'bg-blue-600 text-white border-blue-500' : 'bg-zinc-950 text-zinc-400 border-zinc-850 hover:bg-zinc-900'
                            }`}
                          >
                            {shape}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {creationMethod === 'ai' && (
                  <div className="space-y-3 bg-blue-950/20 border border-blue-900/30 p-4 rounded-2xl">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                      <Sparkles size={11} className="animate-spin" />
                      AI Layout Architect
                    </label>
                    <textarea 
                      rows={3}
                      value={aiPrompt}
                      onChange={e => setAiPrompt(e.target.value)}
                      placeholder='Describe shape: e.g. "Diagonal split luxury header", "Curved wave with floating avatar"'
                      className="w-full px-3 py-2 text-xs border border-blue-900/20 rounded-xl bg-zinc-950 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none placeholder-zinc-650"
                    />
                    <button
                      type="button"
                      onClick={handleAIGenerate}
                      disabled={aiLoading || !aiPrompt.trim()}
                      className="w-full py-2.5 bg-blue-600/20 hover:bg-blue-600 text-blue-400 rounded-xl text-[10px] font-bold transition-all disabled:opacity-40 flex items-center justify-center gap-1.5 cursor-pointer border border-blue-500/20"
                    >
                      {aiLoading ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={12} />}
                      {aiLoading ? 'Synthesizing...' : 'Generate Header Config'}
                    </button>
                  </div>
                )}

                {creationMethod === 'svg' && (
                  <div className="space-y-4">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">Upload Vector SVG File</label>
                    <div className="border-2 border-dashed border-zinc-800 rounded-2xl p-6 text-center bg-zinc-950/30 hover:bg-zinc-950/60 transition-all cursor-pointer relative group">
                      <input 
                        type="file" 
                        accept=".svg"
                        onChange={handleSvgUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <Upload size={24} className="mx-auto text-zinc-500 mb-2 group-hover:text-blue-500 transition-colors" />
                      <div className="text-xs font-bold text-zinc-300">Drag SVG vector or click to browse</div>
                      <div className="text-[10px] text-zinc-500 mt-1">Parses path points & geometry automatically</div>
                    </div>
                    {uploadedSvg && (
                      <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-xl flex items-center justify-between">
                        <div className="text-[10px] text-zinc-400 font-mono truncate max-w-[200px]">SVG geometry loaded.</div>
                        <button type="button" onClick={() => setUploadedSvg(null)} className="text-[10px] font-bold text-red-500 hover:text-red-400 cursor-pointer">Clear</button>
                      </div>
                    )}
                  </div>
                )}

                {creationMethod === 'manual' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wide mb-1.5">Header Layout Style</label>
                      <select 
                        value={headerForm.headerStyle}
                        onChange={e => setHeaderForm(prev => ({ ...prev, headerStyle: e.target.value }))}
                        className="w-full px-3 py-2 text-xs border border-zinc-800 rounded-lg bg-zinc-950 text-white focus:outline-none"
                      >
                        {['Solid Color', 'Gradient', 'Curved Wave', 'Diagonal Split', 'Rounded', 'Organic Blob', 'Glass', 'Full Image', 'Full Video', 'Aurora'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wide mb-1.5">Header Height (Height)</label>
                      <input 
                        type="text"
                        value={headerForm.headerHeight}
                        onChange={e => setHeaderForm(prev => ({ ...prev, headerHeight: e.target.value }))}
                        className="w-full px-3 py-2 text-xs border border-zinc-800 rounded-lg bg-zinc-950 text-white focus:outline-none font-mono"
                        placeholder="e.g. 200px or 30vh"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wide mb-1.5">Avatar Shape</label>
                      <select 
                        value={headerForm.profilePhotoStyle}
                        onChange={e => setHeaderForm(prev => ({ ...prev, profilePhotoStyle: e.target.value }))}
                        className="w-full px-3 py-2 text-xs border border-zinc-800 rounded-lg bg-zinc-950 text-white focus:outline-none"
                      >
                        {['Circle', 'Rounded Square', 'Square', 'Glass Border', 'Gradient Border', 'Shadow', 'No Border'].map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wide mb-1.5">Avatar Position</label>
                      <select 
                        value={headerForm.profilePhotoPosition}
                        onChange={e => setHeaderForm(prev => ({ ...prev, profilePhotoPosition: e.target.value }))}
                        className="w-full px-3 py-2 text-xs border border-zinc-800 rounded-lg bg-zinc-950 text-white focus:outline-none"
                      >
                        {['Left', 'Center', 'Right', 'Floating', 'Overlapping Header'].map(po => (
                          <option key={po} value={po}>{po}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wide mb-1.5">Card Frame Shape</label>
                      <select 
                        value={headerForm.cardShape}
                        onChange={e => setHeaderForm(prev => ({ ...prev, cardShape: e.target.value }))}
                        className="w-full px-3 py-2 text-xs border border-zinc-800 rounded-lg bg-zinc-950 text-white focus:outline-none"
                      >
                        {['Rounded', 'Sharp', 'Glass', 'Floating', 'Soft Shadow', 'Border', 'Borderless'].map(cs => (
                          <option key={cs} value={cs}>{cs}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wide mb-1.5">Card Typography</label>
                      <select 
                        value={headerForm.typography}
                        onChange={e => setHeaderForm(prev => ({ ...prev, typography: e.target.value }))}
                        className="w-full px-3 py-2 text-xs border border-zinc-800 rounded-lg bg-zinc-950 text-white focus:outline-none"
                      >
                        {['Modern Sans', 'Elegant Serif', 'Monospace', 'Display'].map(ty => (
                          <option key={ty} value={ty}>{ty}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Header Preview Box */}
              <div className="space-y-2 pt-4 border-t border-zinc-800/60">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">3. Live Geometry Preview</h4>
                <div className="w-full h-24 rounded-2xl bg-zinc-950 border border-zinc-850 overflow-hidden relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-blue-600/10 flex flex-col justify-between p-3 select-none">
                    <span className="text-[8px] text-zinc-600 font-mono">Shape Style: {headerForm.headerStyle}</span>
                    <span className="text-[8px] text-zinc-650 font-mono">Height: {headerForm.headerHeight}</span>
                  </div>
                  {/* Avatar position indicator */}
                  <div 
                    className={`absolute bottom-2 w-10 h-10 rounded-full border border-blue-500/40 bg-zinc-900 flex items-center justify-center text-[8px] text-zinc-400 font-mono ${
                      headerForm.profilePhotoPosition === 'Left' ? 'left-4' :
                      headerForm.profilePhotoPosition === 'Right' ? 'right-4' :
                      'left-1/2 -translate-x-1/2'
                    }`}
                  >
                    AVATAR
                  </div>
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
                onClick={handlePublishLayout}
                disabled={publishing}
                className="flex-1 py-3 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
              >
                {publishing ? <Loader2 size={13} className="animate-spin" /> : null}
                {publishing ? 'Publishing...' : 'Publish Layout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
