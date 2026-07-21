'use client';
import React, { useRef } from 'react';
import { useCardBuilderStore } from '@/store/cardBuilderStore';
import { Image as ImgIcon, User, Upload, Pencil, Trash2, RefreshCw } from 'lucide-react';

export default function ImageSystemPanel() {
  const {
    imageUrl, avatarUrl,
    updateHeaderImage, updateAvatarRealTime, updateAvatar,
    openCoverEditor, openAvatarEditor,
  } = useCardBuilderStore();

  const coverFileRef = useRef(null);
  const avatarFileRef = useRef(null);

  const handleCoverUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => updateHeaderImage({ imageUrl: ev.target.result, imageScale: 100, imagePositionX: 0, imagePositionY: 0, imageOpacity: 80, overlayType: 'None' });
    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => updateAvatar({ avatarUrl: ev.target.result });
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      {/* ── COVER IMAGE ─────────────────────────────────────────────── */}
      <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
        {/* Preview strip */}
        {imageUrl ? (
          <div className="relative h-20 bg-gray-100 overflow-hidden">
            <img src={imageUrl} alt="Cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute bottom-2 left-3 flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-white/90 flex items-center justify-center">
                <ImgIcon size={11} className="text-gray-700" />
              </div>
              <span className="text-[11px] font-bold text-white/90">Cover Image</span>
            </div>
          </div>
        ) : (
          <div className="h-14 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center px-4 gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
              <ImgIcon size={15} className="text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">Cover Image</p>
              <p className="text-[10px] text-gray-400">Header / background</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-3 flex items-center gap-2">
          {imageUrl ? (
            <>
              <label className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-[11px] font-semibold text-gray-700 cursor-pointer transition-all">
                <RefreshCw size={12} /> Replace
                <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
              </label>
              <button onClick={openCoverEditor}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-[11px] font-semibold transition-all shadow-sm">
                <Pencil size={12} /> Edit Cover
              </button>
              <button onClick={() => updateHeaderImage({ imageUrl: '', imageScale: 100, imagePositionX: 0, imagePositionY: 0, imageOpacity: 80, overlayType: 'None' })}
                className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition">
                <Trash2 size={13} />
              </button>
            </>
          ) : (
            <label className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-[12px] font-bold cursor-pointer transition-all shadow-sm">
              <Upload size={13} /> Upload Cover Image
              <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
            </label>
          )}
        </div>
      </div>

      {/* ── PROFILE PHOTO ────────────────────────────────────────────── */}
      <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
        <div className="h-14 bg-gradient-to-br from-violet-50 to-purple-50 flex items-center px-4 gap-3">
          {/* Avatar preview */}
          <div className="w-10 h-10 rounded-full bg-violet-100 overflow-hidden shrink-0 border-2 border-white shadow-sm">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User size={16} className="text-violet-400" />
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">Profile Photo</p>
            <p className="text-[10px] text-gray-400">Avatar / portrait</p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-3 flex items-center gap-2">
          {avatarUrl ? (
            <>
              <label className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-[11px] font-semibold text-gray-700 cursor-pointer transition-all">
                <RefreshCw size={12} /> Replace
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </label>
              <button onClick={openAvatarEditor}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-xl text-[11px] font-semibold transition-all shadow-sm">
                <Pencil size={12} /> Edit Avatar
              </button>
              <button onClick={() => updateAvatar({ avatarUrl: '' })}
                className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition">
                <Trash2 size={13} />
              </button>
            </>
          ) : (
            <label className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-violet-500 hover:bg-violet-600 text-white rounded-xl text-[12px] font-bold cursor-pointer transition-all shadow-sm">
              <Upload size={13} /> Upload Profile Photo
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
