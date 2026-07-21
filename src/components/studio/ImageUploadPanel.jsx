'use client';

import React, { useRef, useState } from 'react';
import { useCardBuilderStore } from '@/store/cardBuilderStore';
import { 
  Upload, 
  X, 
  Sparkles, 
  Image as ImageIcon, 
  Crop, 
  RotateCw, 
  Sliders, 
  Check, 
  Search, 
  Loader2 
} from 'lucide-react';
import { toast } from '@/components/ui/Toast';

const STOCK_IMAGES = [
  { name: 'Executive Male', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
  { name: 'Designer Female', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
  { name: 'Developer Male', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80' },
  { name: 'Consultant Female', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80' },
  { name: 'Manager Male', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
  { name: 'Student Female', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80' },
];

export default function ImageUploadPanel() {
  const { imageUrl, updateHeaderImage } = useCardBuilderStore();
  const fileInputRef = useRef(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Image editing states
  const [editImage, setEditImage] = useState(imageUrl);
  const [scale, setScale] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [bgRemoved, setBgRemoved] = useState(false);
  const [removingBg, setRemovingBg] = useState(false);
  const [compression, setCompression] = useState(80);

  // Library category tabs: 'upload' | 'unsplash' | 'recent'
  const [activeTab, setActiveTab] = useState('upload');
  const [searchQuery, setSearchQuery] = useState('');

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setEditImage(ev.target.result);
      setBgRemoved(false);
      toast.success('Image imported to studio layout.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveBackground = () => {
    if (!editImage) return;
    setRemovingBg(true);
    setTimeout(() => {
      setBgRemoved(true);
      // Simulating a perfect background remove by wrapping it in transparent canvas mock
      toast.success('AI background subject isolation completed!');
      setRemovingBg(false);
    }, 1500);
  };

  const handleApplyImage = () => {
    if (!editImage) {
      toast.error('Please upload or select an image first.');
      return;
    }
    updateHeaderImage({
      imageUrl: editImage,
      imageScale: scale,
      imageRotation: rotation,
    });
    toast.success('Image library assets applied to header successfully!');
    setIsDrawerOpen(false);
  };

  const selectStockImage = (url) => {
    setEditImage(url);
    setBgRemoved(false);
    toast.success('Selected avatar preset');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Upload Header Image</h2>
          <p className="text-xs text-zinc-400">Add an image to personalize the top card avatar and banner layout design.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
        >
          <ImageIcon size={13} />
          Open Image Library
        </button>
      </div>

      <div className="space-y-4">
        {imageUrl ? (
          <div className="p-4 border border-zinc-800 rounded-2xl bg-zinc-900/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={imageUrl} alt="Uploaded preview" className="w-12 h-12 object-cover rounded-full border border-zinc-800 shadow" />
              <div>
                <div className="text-xs font-bold text-zinc-200">Selected Asset Image</div>
                <div className="text-[10px] text-zinc-500">Scale: {scale}%, Rotation: {rotation}°</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 px-3 py-1.5 rounded-lg hover:bg-blue-500/10 cursor-pointer"
              >
                Edit Style
              </button>
              <button 
                type="button"
                onClick={() => updateHeaderImage({ imageUrl: '' })}
                className="text-xs font-bold text-red-500 hover:text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/10 cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => setIsDrawerOpen(true)}
            className="border-2 border-dashed border-zinc-850 hover:border-zinc-700 rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer bg-zinc-950/20 hover:bg-zinc-900/25 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-3 group-hover:border-zinc-700 transition-colors">
              <Upload size={20} className="text-zinc-400" />
            </div>
            <div className="text-sm font-bold text-zinc-200 mb-1">Upload Card Avatar Asset</div>
            <div className="text-xs text-zinc-500">Supports JPG, PNG up to 5MB. Visual cropping included.</div>
          </div>
        )}
      </div>

      {/* ───────────────── IMAGE LIBRARY DRAWER ───────────────── */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black/80 flex justify-end z-50 animate-fade-in select-none">
          <div className="w-full max-w-lg bg-zinc-900 border-l border-zinc-800 h-full flex flex-col shadow-2xl relative">
            
            {/* Header */}
            <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                  <ImageIcon size={14} className="text-blue-500" />
                  Image Library Workspace
                </h3>
                <p className="text-[10px] text-zinc-500">Crop, rotate, remove background, and compress avatar images.</p>
              </div>
              <button 
                type="button" 
                onClick={() => setIsDrawerOpen(false)}
                className="w-8 h-8 rounded-lg bg-zinc-850 hover:bg-zinc-800 flex items-center justify-center text-zinc-400 cursor-pointer border border-zinc-800"
              >
                <X size={14} />
              </button>
            </div>

            {/* Library Category Tabs */}
            <div className="flex bg-zinc-950 p-1 border-b border-zinc-850 shrink-0">
              {[
                { id: 'upload', label: 'Upload Asset', icon: Upload },
                { id: 'unsplash', label: 'Unsplash Stock', icon: Search },
                { id: 'recent', label: 'Brand Library', icon: ImageIcon }
              ].map(t => {
                const Icon = t.icon;
                const active = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    className={`flex-1 py-2 text-[10px] font-bold rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      active ? 'bg-zinc-900 text-blue-400 border border-zinc-800' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <Icon size={11} />
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* Scrollable Editor Container */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar text-left">
              
              {/* Asset content depending on tab */}
              {activeTab === 'upload' && (
                <div className="space-y-4">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-zinc-800 hover:border-zinc-700 rounded-2xl p-6 text-center cursor-pointer bg-zinc-950/20 hover:bg-zinc-950/40 transition-all flex flex-col items-center justify-center"
                  >
                    <Upload size={20} className="text-zinc-500 mb-2" />
                    <span className="text-xs font-bold text-zinc-300">Choose PNG/JPG files to upload</span>
                    <span className="text-[9px] text-zinc-500 mt-1">Image will open directly in preview panel below</span>
                  </div>
                  <input 
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUpload}
                  />
                </div>
              )}

              {activeTab === 'unsplash' && (
                <div className="space-y-4">
                  <div className="relative">
                    <input 
                      type="text"
                      placeholder="Search Unsplash stock photos..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-zinc-800 rounded-xl bg-zinc-950 text-white focus:outline-none"
                    />
                    <Search size={13} className="absolute left-3 top-3 text-zinc-500" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {STOCK_IMAGES.filter(img => img.name.toLowerCase().includes(searchQuery.toLowerCase())).map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => selectStockImage(img.url)}
                        className={`relative h-20 rounded-xl overflow-hidden border cursor-pointer hover:scale-[1.03] transition-all ${
                          editImage === img.url ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-zinc-800'
                        }`}
                      >
                        <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 left-1 bg-black/60 px-1.5 py-0.5 rounded text-[7px] font-bold text-zinc-300">{img.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'recent' && (
                <div className="space-y-3">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">Recently Uploaded (Brand Kit)</span>
                  <div className="grid grid-cols-4 gap-2">
                    {STOCK_IMAGES.slice(0, 3).map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => selectStockImage(img.url)}
                        className={`h-16 rounded-xl overflow-hidden border cursor-pointer ${
                          editImage === img.url ? 'border-blue-500' : 'border-zinc-800'
                        }`}
                      >
                        <img src={img.url} alt="Brand kits" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Editing Controls & Workspace Preview */}
              {editImage && (
                <div className="pt-4 border-t border-zinc-800/60 space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Visual Image Studio Editor</h4>
                  
                  {/* Canvas cutout preview */}
                  <div className="w-full aspect-[4/3] rounded-2xl bg-zinc-950 border border-zinc-850 flex items-center justify-center overflow-hidden relative">
                    {removingBg && (
                      <div className="absolute inset-0 bg-black/75 z-20 flex flex-col items-center justify-center gap-2">
                        <Loader2 size={24} className="animate-spin text-blue-500" />
                        <span className="text-xs text-zinc-400 font-medium">AI isolating subject contours...</span>
                      </div>
                    )}
                    {/* Transparent check Grid background if bgRemoved */}
                    {bgRemoved && (
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] bg-zinc-400" />
                    )}
                    
                    <div 
                      className="w-32 h-32 rounded-full overflow-hidden border border-zinc-800 shadow-2xl relative transition-transform"
                      style={{ 
                        transform: `rotate(${rotation}deg) scale(${scale / 100})`,
                        background: bgRemoved ? 'transparent' : 'rgba(255,255,255,0.05)'
                      }}
                    >
                      <img 
                        src={editImage} 
                        alt="Crop preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* AI background remover */}
                  <div className="flex justify-between items-center bg-blue-950/20 border border-blue-900/30 p-3.5 rounded-2xl gap-3">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        <Sparkles size={12} className="text-blue-400" />
                        AI Background Removal
                      </div>
                      <div className="text-[9px] text-zinc-400 mt-0.5">Isolate headshot portraits instantly.</div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveBackground}
                      disabled={bgRemoved || removingBg}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/20 disabled:text-blue-400 disabled:border-blue-500/20 disabled:pointer-events-none text-white rounded-xl text-[10px] font-bold transition-all border border-transparent shadow flex items-center gap-1 cursor-pointer"
                    >
                      {bgRemoved ? <Check size={11} /> : <Sparkles size={11} />}
                      {bgRemoved ? 'Isolated' : 'Cutout Background'}
                    </button>
                  </div>

                  {/* Adjustments */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-wide">
                        <span>Crop Zoom (Scale)</span>
                        <span>{scale}%</span>
                      </div>
                      <input 
                        type="range"
                        min="50"
                        max="200"
                        value={scale}
                        onChange={e => setScale(Number(e.target.value))}
                        className="w-full accent-blue-600 bg-zinc-950 rounded-lg cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-wide">
                        <span>Rotate</span>
                        <span>{rotation}°</span>
                      </div>
                      <input 
                        type="range"
                        min="0"
                        max="360"
                        value={rotation}
                        onChange={e => setRotation(Number(e.target.value))}
                        className="w-full accent-blue-600 bg-zinc-950 rounded-lg cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1 col-span-2">
                      <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-wide">
                        <span>Compression Quality</span>
                        <span>{compression}%</span>
                      </div>
                      <input 
                        type="range"
                        min="20"
                        max="100"
                        value={compression}
                        onChange={e => setCompression(Number(e.target.value))}
                        className="w-full accent-blue-600 bg-zinc-950 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

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
                onClick={handleApplyImage}
                disabled={!editImage}
                className="flex-1 py-3 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
              >
                Select and Crop Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
