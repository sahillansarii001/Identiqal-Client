'use client';
import React, { useRef, useState } from 'react';
import { useCardBuilderStore } from '@/store/cardBuilderStore';
import { Image as ImgIcon, User, Upload, Pencil, Trash2, RefreshCw, Video } from 'lucide-react';

export default function ImageSystemPanel() {
  const {
    imageUrl, avatarUrl, isVideo,
    updateHeaderImage, updateAvatarRealTime, updateAvatar,
    openCoverEditor, openAvatarEditor,
  } = useCardBuilderStore();

  const coverFileRef = useRef(null);
  const avatarFileRef = useRef(null);

  // URL upload states
  const [showCoverUrl, setShowCoverUrl] = useState(false);
  const [coverUrl, setCoverUrl] = useState('');
  const [showAvatarUrl, setShowAvatarUrl] = useState(false);
  const [avatarUrlText, setAvatarUrlText] = useState('');

  const handleCoverUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => updateHeaderImage({ imageUrl: ev.target.result, isVideo: false, imageScale: 100, imagePositionX: 0, imagePositionY: 0, imageOpacity: 80, overlayType: 'None' });
    reader.readAsDataURL(file);
  };

  const handleCoverVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => updateHeaderImage({ imageUrl: ev.target.result, isVideo: true, imageScale: 100, imagePositionX: 0, imagePositionY: 0, imageOpacity: 80, overlayType: 'None' });
    reader.readAsDataURL(file);
  };

  const handleCoverMediaUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVid = file.type.startsWith('video/');
    const reader = new FileReader();
    reader.onload = (ev) => updateHeaderImage({ imageUrl: ev.target.result, isVideo: isVid, imageScale: 100, imagePositionX: 0, imagePositionY: 0, imageOpacity: 80, overlayType: 'None' });
    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => updateAvatar({ avatarUrl: ev.target.result });
    reader.readAsDataURL(file);
  };

  const submitCoverUrl = () => {
    if (!coverUrl.trim()) return;
    const val = coverUrl.trim();
    const isVid = !!val.match(/\.(mp4|webm|ogg|mov|mkv)($|\?)/i);
    updateHeaderImage({ imageUrl: val, isVideo: isVid, imageScale: 100, imagePositionX: 0, imagePositionY: 0, imageOpacity: 80, overlayType: 'None' });
    setCoverUrl('');
    setShowCoverUrl(false);
  };

  const submitAvatarUrl = () => {
    if (!avatarUrlText.trim()) return;
    updateAvatar({ avatarUrl: avatarUrlText.trim() });
    setAvatarUrlText('');
    setShowAvatarUrl(false);
  };

  return (
    <div className="space-y-4">
      {/* ── COVER IMAGE ─────────────────────────────────────────────── */}
      <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
        {/* Preview strip */}
        {imageUrl ? (
          <div className="relative h-20 bg-gray-100 overflow-hidden">
            {isVideo ? (
              <video src={imageUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
            ) : (
              <img src={imageUrl} alt="Cover" className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute bottom-2 left-3 flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-white/90 flex items-center justify-center">
                <ImgIcon size={12} className="text-gray-700" />
              </div>
              <span className="text-[10px] font-bold text-white drop-shadow-sm">Cover</span>
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
        <div className="p-3 flex flex-col gap-2">
          {imageUrl ? (
            <div className="flex items-center gap-2">
              <label className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-[11px] font-semibold text-gray-700 cursor-pointer transition-all">
                <RefreshCw size={12} /> Replace
                <input type="file" accept="image/*,video/*" className="hidden" onChange={handleCoverMediaUpload} />
              </label>
              <button onClick={openCoverEditor}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-[11px] font-semibold transition-all shadow-sm">
                <Pencil size={12} /> Edit Cover
              </button>
              <button onClick={() => updateHeaderImage({ imageUrl: '', imageScale: 100, imagePositionX: 0, imagePositionY: 0, imageOpacity: 80, overlayType: 'None' })}
                className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition">
                <Trash2 size={13} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-stretch gap-1">
              <div className="flex gap-2">
                <label className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-[12px] font-bold cursor-pointer transition-all shadow-sm">
                  <Upload size={13} /> Upload Image
                  <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                </label>
                <label className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-[12px] font-bold cursor-pointer transition-all shadow-sm">
                  <Video size={13} /> Upload Video
                  <input type="file" accept="video/*" className="hidden" onChange={handleCoverVideoUpload} />
                </label>
              </div>
              <button 
                type="button"
                onClick={() => setShowCoverUrl(!showCoverUrl)}
                className="text-[10px] text-gray-400 hover:text-blue-500 transition-colors py-1 cursor-pointer font-semibold text-center w-full"
              >
                {showCoverUrl ? 'Cancel URL load' : 'or load from image/video URL'}
              </button>
              {showCoverUrl && (
                <div className="flex gap-2 animate-fade-in pt-1">
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button 
                    onClick={submitCoverUrl}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    Load
                  </button>
                </div>
              )}
            </div>
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
        <div className="p-3 flex flex-col gap-2">
          {avatarUrl ? (
            <div className="flex items-center gap-2">
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
            </div>
          ) : (
            <div className="flex flex-col items-stretch gap-1">
              <label className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-violet-500 hover:bg-violet-600 text-white rounded-xl text-[12px] font-bold cursor-pointer transition-all shadow-sm">
                <Upload size={13} /> Upload Profile Photo
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </label>
              <button 
                type="button"
                onClick={() => setShowAvatarUrl(!showAvatarUrl)}
                className="text-[10px] text-gray-400 hover:text-violet-500 transition-colors py-1 cursor-pointer font-semibold text-center w-full"
              >
                {showAvatarUrl ? 'Cancel URL load' : 'or load from photo URL'}
              </button>
              {showAvatarUrl && (
                <div className="flex gap-2 animate-fade-in pt-1">
                  <input
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    value={avatarUrlText}
                    onChange={(e) => setAvatarUrlText(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button 
                    onClick={submitAvatarUrl}
                    className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    Load
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
