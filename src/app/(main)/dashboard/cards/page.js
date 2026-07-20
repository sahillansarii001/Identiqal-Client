'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createCardSchema } from '@/validators/card.validator.js';
import { useCards } from '@/hooks/useCards.js';
import { Button } from '@/components/ui/Button.jsx';
import { Input } from '@/components/ui/Input.jsx';
import { Modal } from '@/components/ui/Modal.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { LiveCardPreview } from '@/components/dashboard/LiveCardPreview.jsx';
import { QRCodeSVG } from 'qrcode.react';
import {
  Plus,
  Trash2,
  Edit,
  Globe,
  Lock,
  ExternalLink,
  QrCode,
  Copy,
  BarChart3,
  Sparkles,
  Share2,
  Download,
  CopyPlus,
  Check,
  ArrowRight
} from 'lucide-react';

const DashboardCard = ({ card, handleTogglePublish, handleDelete, handleDuplicate }) => {
  const router = useRouter();
  const [copiedLink, setCopiedLink] = useState(false);
  const [origin, setOrigin] = useState('');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const publicUrl = origin ? `${origin}/${card.slug}` : `https://identiqal.com/${card.slug}`;

  const copyToClipboard = async (text, setter) => {
    try {
      await navigator.clipboard.writeText(text);
      setter(true);
      setTimeout(() => setter(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const downloadQR = (e) => {
    e.preventDefault();
    e.stopPropagation();
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
    <motion.div
      onClick={() => router.push(`/dashboard/cards/${card.slug}`)}
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } }
      }}
      className="cursor-pointer bg-white border border-[rgba(37,99,235,0.08)] rounded-[32px] overflow-hidden group transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-[#2563EB]/10 flex flex-col relative"
    >
      {/* Top: Live Profile Preview */}
        <div className="relative border-b border-[rgba(37,99,235,0.06)]">
          <LiveCardPreview card={card} className="h-[280px]" scale={0.31} />
          
          {/* Status Badge */}
          <div className="absolute top-5 right-3 z-20">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleTogglePublish(card._id, card.isPublished); }}
              className={`px-3 py-1.5 rounded-full border shadow-lg backdrop-blur-md transition-all flex items-center space-x-1.5 text-[9px] font-black uppercase tracking-widest hover:scale-105 ${
                card.isPublished
                  ? 'bg-green-500/90 border-green-400 text-white shadow-green-500/20'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-800 shadow-black/5'
              }`}
            >
              {card.isPublished ? (
                <><Globe size={10} /><div>Published</div></>
              ) : (
                <><Lock size={10} /><div>Draft</div></>
              )}
            </button>
          </div>
        </div>

        {/* Card Details & CTA */}
        <div className="p-6 flex flex-col flex-1 h-[180px]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-black text-inherit text-xl truncate group-hover:text-[#2563EB] transition-colors">
                {name}
              </h3>
              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{card.isPublished ? 'Live Profile' : 'Draft Mode'}</p>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <Link href={`/dashboard/cards/${card.slug}/edit`} onClick={(e) => e.stopPropagation()} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:text-[#2563EB] hover:bg-[#F8FAFC] transition-colors border border-transparent hover:border-[#3B82F6]/30" title="Edit Card">
                <Edit size={14} />
              </Link>
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); copyToClipboard(publicUrl, setCopiedLink); }}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:text-[#2563EB] hover:bg-[#F8FAFC] transition-colors border border-transparent hover:border-[#3B82F6]/30"
                title="Copy Link"
              >
                {copiedLink ? <Check size={14} /> : <Share2 size={14} />}
              </button>
            </div>
          </div>
          
          {/* Mini Stats */}
          <div className="flex gap-5 mb-auto">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Sparkles size={12} className="text-[#3B82F6]" />
              <span className="text-xs font-bold">{stats[0].value} <span className="text-slate-400 font-semibold">Views</span></span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <QrCode size={12} className="text-[#3B82F6]" />
              <span className="text-xs font-bold">{stats[1].value} <span className="text-slate-400 font-semibold">Scans</span></span>
            </div>
          </div>

          <div className="mt-6">
            <button className="w-full h-11 bg-white text-[#2563EB] border border-[rgba(37,99,235,0.1)] shadow-sm font-bold flex items-center justify-between px-5 transition-all rounded-xl text-sm group-hover:bg-[#2563EB] group-hover:text-white group-hover:shadow-md">
              <span>Open Dashboard</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1 opacity-50 group-hover:opacity-100" />
            </button>
          </div>
        </div>
      </motion.div>
  );
};

export default function CardsPage() {
  const { cards, isLoading, createCard, publishCard, deleteCard } = useCards();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(createCardSchema),
  });

  const onSubmit = async (data) => {
    setErrorMsg('');
    try {
      await createCard({ slug: data.slug, title: data.title });
      setIsModalOpen(false);
      reset();
    } catch (err) {
      setErrorMsg(err.message || 'Slug already exists or creation failed');
    }
  };

  const handleTogglePublish = async (cardId, isPublished) => {
    try {
      await publishCard({ cardId, isPublished: !isPublished });
    } catch (e) {
      alert('Failed to update publish state: ' + e.message);
    }
  };

  const handleDelete = async (cardId) => {
    if (confirm('Are you sure you want to permanently delete this card?')) {
      try {
        await deleteCard(cardId);
      } catch (e) {
        alert('Failed to delete card: ' + e.message);
      }
    }
  };

  const handleDuplicate = () => {
    alert('Duplication feature coming soon!');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="space-y-8 w-full pb-16">
      <style>{`
        .action-btn {
          @apply h-10 w-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-800 transition-all border border-transparent hover:border-slate-200 hover:shadow-sm shrink-0;
        }
      `}</style>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[rgba(37,99,235,0.08)] pb-6 relative">
        <div className="space-y-1 z-10">
          <h1 className="text-3xl font-black text-inherit tracking-tight flex items-center gap-3">
            My Digital Cards
            <span className="text-[10px] bg-[#3B82F6]/10 text-[#3B82F6] px-2.5 py-1 rounded-full font-black uppercase tracking-widest border border-[#3B82F6]/20 shadow-sm shadow-[#3B82F6]/5">
              {cards?.length || 0} active
            </span>
          </h1>
          <p className="text-sm font-bold text-slate-500 max-w-lg mt-2 leading-relaxed">
            Design, update, and manage your premium visual networking cards. Share them seamlessly across any platform.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-[#3B82F6] hover:bg-[#2563EB] text-[#0F172A] shadow-lg shadow-[#3B82F6]/20 hover:shadow-xl transition-all space-x-2 py-3 px-6 rounded-2xl font-black z-10">
          <Plus size={18} />
          <span>New Card</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-[600px] bg-slate-50 rounded-[32px] border border-[rgba(37,99,235,0.06)] animate-pulse" />
          ))}
        </div>
      ) : cards.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 20 }}
          className="text-center py-32 bg-white border border-dashed border-[rgba(37,99,235,0.15)] rounded-[40px] space-y-6 relative overflow-hidden shadow-sm"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#3B82F6]/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="w-24 h-24 rounded-3xl bg-linear-to-tr from-[#2563EB]/10 to-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center mx-auto text-[#2563EB] shadow-inner relative z-10">
            <Sparkles size={40} />
          </div>
          <div className="space-y-3 relative z-10">
            <h3 className="text-2xl font-black text-inherit">No cards built yet</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto font-semibold leading-relaxed">
              Create your first responsive digital business profile to start capturing leads, sharing your QR code, and tracking powerful analytics.
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="bg-[#2563EB] hover:bg-primary text-white shadow-xl shadow-[#2563EB]/20 font-bold py-3 px-8 rounded-2xl relative z-10 mt-4">
            Create Your First Card
          </Button>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {cards.map((card) => (
            <DashboardCard
              key={card._id}
              card={card}
              handleTogglePublish={handleTogglePublish}
              handleDelete={handleDelete}
              handleDuplicate={handleDuplicate}
            />
          ))}
        </motion.div>
      )}

      {/* Creation Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Premium Digital Card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-2">
          {errorMsg && <p className="text-xs bg-red-50 text-red-600 border border-red-100 p-3 rounded-xl font-bold">{errorMsg}</p>}
          <Input
            label="Card Title"
            placeholder="e.g. John Doe — Executive Profile"
            error={errors.title?.message}
            {...register('title')}
          />
          <Input
            label="Public URL Slug"
            placeholder="e.g. john-doe"
            description="Lowercase letters, numbers, hyphens, and underscores. This becomes your permanent public link."
            error={errors.slug?.message}
            {...register('slug')}
          />
          <div className="flex justify-end space-x-3 pt-6 border-t border-[rgba(37,99,235,0.08)] mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-6">
              Cancel
            </Button>
            <Button type="submit" className="bg-[#2563EB] hover:bg-primary text-white font-bold px-8 shadow-lg shadow-[#2563EB]/20">
              Create Profile
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}


