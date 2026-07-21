'use client';

import React, { useState } from 'react';
import { useCardBuilderStore } from '@/store/cardBuilderStore';
import { adminService } from '@/services/adminService';
import { useRouter } from 'next/navigation';
import { Loader2, Check } from 'lucide-react';
import { toast } from '@/components/ui/Toast';

export default function TemplateSummary() {
  const router = useRouter();
  const { displayPreset, colorTheme, footerPreset, sections } = useCardBuilderStore();
  
  const [name, setName] = useState('');
  const [category, setCategory] = useState('General');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [status, setStatus] = useState('draft');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Template name is required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        category,
        description,
        badge,
        isPremium,
        status,
        displayPresetId: displayPreset?._id || null,
        colorThemeId: colorTheme?._id || null,
        footerPresetId: footerPreset?._id || null,
        sections,
      };

      const res = await adminService.createCardTemplate(payload);
      if (res.success) {
        toast.success('Template composition saved successfully!');
        router.push('/admin/templates');
      } else {
        toast.error(res.message || 'Failed to save template');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while saving the template');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-5 text-left">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Save Template</h2>
        <p className="text-xs text-zinc-400">Finalize your template details and save it to the global templates catalog.</p>
      </div>

      <div className="space-y-4 bg-zinc-900/30 p-5 rounded-2xl border border-zinc-855">
        {/* Name */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Template Title *</label>
          <input 
            type="text" 
            required 
            value={name} 
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Minimalist developer profile"
            className="w-full px-3.5 py-2.5 text-xs border border-zinc-800 rounded-xl bg-zinc-950 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500" 
          />
        </div>

        {/* Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Category</label>
            <select 
              value={category} 
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-zinc-800 rounded-xl bg-zinc-950 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            >
              {['General', 'Developer', 'Designer', 'Freelancer', 'Startup', 'Agency', 'Healthcare', 'Real Estate', 'Photographer', 'Educator', 'Finance'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Badge</label>
            <select 
              value={badge} 
              onChange={e => setBadge(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-zinc-800 rounded-xl bg-zinc-950 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            >
              {['', 'NEW', 'PREMIUM', 'POPULAR', 'TRENDING', 'AI PICK'].map(b => (
                <option key={b} value={b}>{b || '— None —'}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Description</label>
          <textarea 
            rows={3} 
            value={description} 
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe this layout style..."
            className="w-full px-3.5 py-2.5 text-xs border border-zinc-800 rounded-xl bg-zinc-950 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-none" 
          />
        </div>

        {/* Premium & Status */}
        <div className="grid grid-cols-2 gap-4 items-center pt-2 border-t border-zinc-800/50">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={isPremium} 
              onChange={e => setIsPremium(e.target.checked)}
              className="rounded border-zinc-800 text-blue-600 focus:ring-blue-500/30 bg-zinc-950" 
            />
            <span className="text-xs text-zinc-300 font-semibold">Premium Template</span>
          </label>

          <div className="flex justify-end gap-1.5">
            {['draft', 'published'].map(s => (
              <button 
                key={s} 
                type="button" 
                onClick={() => setStatus(s)}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border capitalize transition-all ${
                  status === s
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-900'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={saving}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
        {saving ? 'Saving Template...' : 'Save Template Composition'}
      </button>
    </form>
  );
}
