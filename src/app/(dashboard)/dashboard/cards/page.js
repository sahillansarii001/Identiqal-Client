'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createCardSchema } from '@/validators/card.validator.js';
import { useCards } from '@/hooks/useCards.js';
import { Button } from '@/components/ui/Button.jsx';
import { Input } from '@/components/ui/Input.jsx';
import { Modal } from '@/components/ui/Modal.jsx';
import {
  Layers,
  Plus,
  Trash2,
  Edit,
  Globe,
  Lock,
  ExternalLink,
  QrCode,
  CheckCircle,
} from 'lucide-react';

export default function CardsPage() {
  const { cards, isLoading, createCard, publishCard, deleteCard } = useCards();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedCardSlug, setSelectedCardSlug] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
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

  const openQrModal = (slug) => {
    setSelectedCardSlug(slug);
    setQrModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between border-b border-slate-900 pb-5">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100">My Digital Cards</h1>
          <p className="text-xs text-slate-400">Design, update, and manage your active visual networking cards.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="space-x-1.5 py-2.5">
          <Plus size={16} />
          <span>New Card</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-44 bg-slate-900/40 rounded-2xl animate-pulse" />
          <div className="h-44 bg-slate-900/40 rounded-2xl animate-pulse" />
        </div>
      ) : cards.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/10 border border-dashed border-slate-800 rounded-3xl space-y-4">
          <Layers size={48} className="mx-auto text-slate-700" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-300">No cards created yet</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">Create a draft card to start composing sections and branding.</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>Create Your First Card</Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {cards.map((card) => {
            const publicUrl = `${window.location.origin}/${card.slug}`;
            return (
              <div
                key={card._id}
                className="bg-slate-900/30 border border-slate-900 hover:border-slate-850 rounded-2xl p-6 flex flex-col justify-between space-y-6 relative transition-all duration-200"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-100 text-base">{card.title}</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleTogglePublish(card._id, card.isPublished)}
                        className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors flex items-center space-x-1 font-semibold ${
                          card.isPublished
                            ? 'bg-green-500/10 border-green-500/25 text-green-400 hover:bg-green-500/20'
                            : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-400'
                        }`}
                      >
                        {card.isPublished ? (
                          <>
                            <Globe size={10} />
                            <span>Public</span>
                          </>
                        ) : (
                          <>
                            <Lock size={10} />
                            <span>Private</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-normal truncate">
                    Slug Link: <span className="text-indigo-400">/{card.slug}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-900 pt-4 mt-auto">
                  <div className="flex items-center space-x-2">
                    <Link href={`/dashboard/cards/${card._id}/edit`}>
                      <Button variant="secondary" size="sm" className="space-x-1">
                        <Edit size={12} />
                        <span>Edit</span>
                      </Button>
                    </Link>
                    {card.isPublished && (
                      <>
                        <a href={`/${card.slug}`} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="p-2">
                            <ExternalLink size={12} />
                          </Button>
                        </a>
                        <Button
                          variant="outline"
                          size="sm"
                          className="p-2"
                          onClick={() => openQrModal(card.slug)}
                        >
                          <QrCode size={12} />
                        </Button>
                      </>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-xl"
                    onClick={() => handleDelete(card._id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Creation Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Digital Card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errorMsg && <p className="text-xs text-red-500 font-semibold">{errorMsg}</p>}
          <Input
            label="Card Title"
            placeholder="John Doe — Professional Portfolio"
            error={errors.title?.message}
            {...register('title')}
          />
          <Input
            label="Card URL Slug"
            placeholder="jane-doe"
            description="Lowercase letters, numbers, hyphens, and underscores only."
            error={errors.slug?.message}
            {...register('slug')}
          />
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Card</Button>
          </div>
        </form>
      </Modal>

      {/* QR Code Modal */}
      <Modal isOpen={qrModalOpen} onClose={() => setQrModalOpen(false)} title="Share Card QR Code">
        <div className="flex flex-col items-center space-y-4 py-4 text-center">
          <p className="text-xs text-slate-400">Scan this QR Code to load the published digital card on mobile devices.</p>
          <div className="bg-white p-4 rounded-2xl">
            {/* Standard rendering of mock QR code, or dynamically build it using qrcode on client.
                Since qrcode package can generate dynamic URLs, we can just generate a client side Canvas or img here.
                Let's use google charts API or local URL to display QR image: */}
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                `${window.location.origin}/${selectedCardSlug}`
              )}`}
              alt="QR Code"
              className="w-48 h-48"
            />
          </div>
          <p className="text-xs font-bold text-slate-350">Link: <span className="text-indigo-400">/{selectedCardSlug}</span></p>
          <Button variant="secondary" onClick={() => setQrModalOpen(false)}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
}
