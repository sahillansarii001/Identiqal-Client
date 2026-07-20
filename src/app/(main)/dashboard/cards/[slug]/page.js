'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCards } from '@/hooks/useCards.js';
import { LiveCardPreview } from '@/components/dashboard/LiveCardPreview.jsx';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import {
  Globe,
  Lock,
  ExternalLink,
  QrCode,
  Copy,
  BarChart3,
  Sparkles,
  Check,
  Download,
  CopyPlus,
  Trash2,
  Edit,
  ArrowLeft,
  Loader2,
  Share2,
  Smartphone,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button.jsx';
import { cardService } from '@/services/cardService.js';

export default function SingleCardDashboard() {
  const params = useParams();
  const router = useRouter();
  const { cards, togglePublishStatus, deleteCard } = useCards();
  const [copiedLink, setCopiedLink] = useState(false);
  const [showEmailOptions, setShowEmailOptions] = useState(false);
  const [origin, setOrigin] = useState('');
  
  const card = cards.find(c => c.slug === params.slug);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  if (!card) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#5A3045]" size={32} />
      </div>
    );
  }

  const publicUrl = origin ? `${origin}/${card.slug}` : `https://identiqal.com/${card.slug}`;
  const encodedShareText = encodeURIComponent(`Check out my professional profile here: ${publicUrl}`);
  const encodedEmailSubject = encodeURIComponent('My Digital Business Card');

  const copyToClipboard = async (text, setter) => {
    try {
      await navigator.clipboard.writeText(text);
      setter(true);
      setTimeout(() => setter(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleEmailShare = (e) => {
    e.preventDefault();
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = `mailto:?subject=${encodedEmailSubject}&body=${encodedShareText}`;
    } else {
      window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${encodedEmailSubject}&body=${encodedShareText}`, '_blank', 'noopener,noreferrer');
    }
  };

  const downloadQR = (e) => {
    e.preventDefault();
    const svg = document.getElementById(`qr-${card._id}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `${card.slug}-qr.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const handleDuplicate = async () => {
    try {
      await cardService.duplicateCard(card._id);
      window.location.reload();
    } catch (error) {
      console.error("Error duplicating:", error);
    }
  };

  const handleDelete = async () => {
    if(window.confirm('Are you sure you want to delete this card?')) {
      await deleteCard(card._id);
      router.push('/dashboard/cards');
    }
  };

  // Mock analytics
  const stats = [
    { label: 'Views', value: Math.floor(Math.random() * 500) + 50 },
    { label: 'Scans', value: Math.floor(Math.random() * 200) + 10 },
    { label: 'Saves', value: Math.floor(Math.random() * 100) + 5 },
    { label: 'Leads', value: Math.floor(Math.random() * 50) + 2 },
  ];

  const profileSection = card.sections?.find(s => s.type === 'profile');
  const name = profileSection?.data?.name || card.title;

  return (
    <div className="pb-16 w-full max-w-[1400px] mx-auto space-y-6">
      <style>{`
        .action-btn {
          @apply h-10 w-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-800 transition-all border border-transparent hover:border-slate-200 hover:shadow-sm shrink-0;
        }
        [data-dark="true"] .action-btn {
          @apply text-slate-400 hover:bg-white/10 hover:text-[#F0EBF0] hover:border-white/10;
        }
      `}</style>
      
      {/* Back button and Page Header */}
      <div className="flex items-center gap-4 mb-2">
        <Link href="/dashboard/cards" className="h-10 w-10 rounded-full border border-slate-200 dark:border-white/10 bg-white flex items-center justify-center text-slate-500 dark:text-[#9A8AA0] hover:text-slate-800 dark:hover:text-white hover:shadow-sm transition-all">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-[#251E2A] dark:text-[#F0EBF0] flex items-center gap-3">
            Card Control Center
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-[#9A8AA0] mt-1">Manage and monitor {name}</p>
        </div>
      </div>

      <div
        className="flex flex-col xl:flex-row gap-6 w-full items-start"
      >
        {/* Left Column: Live Profile Preview */}
        <div className="sticky top-6 relative bg-slate-50 border border-[rgba(90,48,69,0.08)] rounded-[32px] shadow-sm xl:w-[320px] shrink-0 flex flex-col pt-12 items-center overflow-hidden">
          <div className="absolute top-5 right-5 z-20">
            <button
              onClick={() => togglePublishStatus(card._id, card.isPublished)}
              className={`px-4 py-2 rounded-full border shadow-lg backdrop-blur-md transition-all flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest hover:scale-105 ${
                card.isPublished
                  ? 'bg-green-500/90 border-green-400 text-white shadow-green-500/20'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-800 shadow-black/5'
              }`}
            >
              {card.isPublished ? (
                <><Globe size={12} /><div>Published</div></>
              ) : (
                <><Lock size={12} /><div>Draft</div></>
              )}
            </button>
          </div>
          
          <LiveCardPreview card={card} className="h-[580px]" scale={0.65} />
        </div>

        {/* Right Column: Analytics & Sharing */}
        <div className="flex-1 bg-white border border-[rgba(90,48,69,0.08)] rounded-[32px] shadow-sm flex flex-col p-6 space-y-6 min-w-0 overflow-hidden">
          
          {/* Header: Title and Actions */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-[rgba(90,48,69,0.06)] pb-5">
            <h3 className="font-black text-inherit text-2xl xl:text-3xl truncate text-[#251E2A] dark:text-[#F0EBF0]">
              {name}
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={downloadQR} className="action-btn" title="Download QR">
                <Download size={18} />
              </button>
              <button onClick={handleDuplicate} className="action-btn" title="Duplicate">
                <CopyPlus size={18} />
              </button>
              <button onClick={handleDelete} className="action-btn text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100" title="Delete Card">
                <Trash2 size={18} />
              </button>
              <Link href={`/dashboard/cards/${card.slug}/edit`}>
                <Button className="h-10 bg-[#5A3045] hover:bg-[#4A2C3A] text-white border-none shadow-md shadow-[#5A3045]/20 font-bold space-x-2 transition-transform hover:scale-[1.02] rounded-lg text-sm px-5 ml-1">
                  <Edit size={16} />
                  <span>Edit</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Analytics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 rounded-2xl p-4 border border-[rgba(90,48,69,0.06)] flex flex-col justify-center transition-colors hover:border-[rgba(90,48,69,0.15)]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-0.5"><Sparkles size={12} className="text-[#D4A45B]"/> Total Views</p>
              <p className="text-2xl font-black text-[#5A3045] dark:text-[#D4A45B]">{stats[0].value}</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-[rgba(90,48,69,0.06)] flex flex-col justify-center transition-colors hover:border-[rgba(90,48,69,0.15)]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-0.5"><Copy size={12} className="text-[#D4A45B]"/> Total Saves</p>
              <p className="text-2xl font-black text-[#5A3045] dark:text-[#D4A45B]">{stats[2].value}</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-[rgba(90,48,69,0.06)] flex flex-col justify-center transition-colors hover:border-[rgba(90,48,69,0.15)]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-0.5"><QrCode size={12} className="text-[#D4A45B]"/> Total Scans</p>
              <p className="text-2xl font-black text-[#5A3045] dark:text-[#D4A45B]">{stats[1].value}</p>
            </div>
            <Link href={`/dashboard/analytics?card=${card._id}`} className="bg-[#FAF7F3] dark:bg-[#251E2A] rounded-2xl p-4 border border-[#D4A45B]/20 flex flex-col justify-center items-center text-center transition-colors hover:bg-[#D4A45B]/10 dark:hover:bg-[#D4A45B]/15 hover:border-[#D4A45B]/30 group">
              <BarChart3 size={20} className="text-[#D4A45B] mb-1.5 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold text-[#5A3045] dark:text-[#F0EBF0]">View all analytics</p>
            </Link>
          </div>

          {/* Share Center Box */}
          <div className="flex-1 bg-gradient-to-br from-[#5A3045]/5 to-[#D4A45B]/5 border border-[#5A3045]/10 rounded-[24px] p-6 flex flex-col xl:flex-row gap-6 items-center justify-between overflow-hidden">
            
            {/* QR Code Container (Left Side) */}
            <div className="w-[150px] h-[150px] rounded-3xl bg-white border border-white shadow-xl shadow-[#5A3045]/10 flex flex-col items-center justify-center p-3 shrink-0 relative overflow-hidden group-hover:border-[#D4A45B]/30 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-[#5A3045]/5 to-[#D4A45B]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <QRCodeSVG 
                id={`qr-${card._id}`}
                value={publicUrl}
                size={120}
                bgColor={"#ffffff"}
                fgColor={"#5A3045"}
                level={"Q"}
                className="relative z-10"
                imageSettings={{
                  src: "/favicon.ico",
                  x: undefined,
                  y: undefined,
                  height: 48,
                  width: 48,
                  excavate: true,
                }}
              />
            </div>
            
            {/* Share Links (Right Side) */}
            <div className="flex-1 space-y-6 w-full max-w-sm">
              <div>
                <h4 className="text-lg font-black text-[#251E2A] dark:text-[#F0EBF0] mb-3">Share your card</h4>
                <button 
                  onClick={() => copyToClipboard(publicUrl, setCopiedLink)}
                  className="w-full flex items-center justify-center gap-2 bg-white dark:bg-transparent border border-[rgba(90,48,69,0.1)] dark:border-white/10 hover:border-[#5A3045]/30 dark:hover:border-white/20 hover:shadow-md dark:hover:bg-white/5 transition-all rounded-xl p-3.5 font-bold text-[#5A3045] dark:text-[#F0EBF0] text-base cursor-pointer"
                >
                  {copiedLink ? <Check size={18} /> : <Copy size={18} />}
                  {copiedLink ? 'Link Copied!' : 'Copy Link'}
                </button>
              </div>
              
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">Or share by</p>
                <div className="flex gap-2">
                  <button 
                    onClick={handleEmailShare}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-white dark:bg-transparent border border-[rgba(90,48,69,0.1)] dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-all rounded-lg py-2.5 px-1 font-semibold text-xs text-slate-700 dark:text-[#F0EBF0] hover:border-[rgba(90,48,69,0.2)] dark:hover:border-white/20 cursor-pointer"
                  >
                    <Share2 size={14} /> Email
                  </button>
                  <a 
                    href={`https://wa.me/?text=${encodedShareText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 bg-white dark:bg-transparent border border-[rgba(90,48,69,0.1)] dark:border-white/10 hover:bg-green-50 dark:hover:bg-green-500/10 transition-all rounded-lg py-2.5 px-1 font-semibold text-xs text-slate-700 dark:text-[#F0EBF0] hover:border-green-200 dark:hover:border-green-500/20 hover:text-green-700 dark:hover:text-green-400 cursor-pointer"
                  >
                    <MessageCircle size={14} /> WhatsApp
                  </a>
                </div>
              </div>


            </div>
          </div>

          {/* Leads Placeholder */}
          <div className="border border-[rgba(90,48,69,0.06)] rounded-[24px] p-6 flex flex-col gap-4">
            <h4 className="text-lg font-black text-[#251E2A] dark:text-[#F0EBF0]">Recent Leads Captured</h4>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-8 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 text-slate-300">
                <CopyPlus size={20} />
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-[#F0EBF0]">No leads captured yet</p>
              <p className="text-xs text-slate-400 mt-1">When someone saves your contact info, they will appear here.</p>
            </div>
          </div>

          {/* Activity Placeholder */}
          <div className="border border-[rgba(90,48,69,0.06)] rounded-[24px] p-6 flex flex-col gap-4">
            <h4 className="text-lg font-black text-[#251E2A] dark:text-[#F0EBF0]">Recent Activity</h4>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-8 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 text-slate-300">
                <Sparkles size={20} />
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-[#F0EBF0]">No recent activity</p>
              <p className="text-xs text-slate-400 mt-1">Share your card to start seeing views and scans.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
