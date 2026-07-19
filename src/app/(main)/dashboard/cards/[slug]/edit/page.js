'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCardBuilderStore } from '@/store/cardBuilderStore.js';
import { useThemeBuilderStore } from '@/store/themeBuilderStore.js';
import { CardBuilderCanvas } from '@/components/builder/CardBuilderCanvas.jsx';
import { cardService } from '@/services/cardService.js';
import { Loader2 } from 'lucide-react';

export default function CardEditBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  const {
    setCard,
  } = useCardBuilderStore();

  const themeStore = useThemeBuilderStore();
  const [isLoading, setIsLoading] = useState(true);

  // Load card and theme details from API
  useEffect(() => {
    const fetchCardData = async () => {
      setIsLoading(true);
      try {
        const cardResponse = await cardService.getCards();
        const activeCard = cardResponse.data.find(c => c.slug === slug);
        if (!activeCard) {
          alert('Card not found');
          router.push('/dashboard/cards');
          return;
        }

        // Set card in builder store
        setCard(activeCard);

        // Fetch user theme (will check organization locks in service)
        const themeResponse = await cardService.getTheme();
        if (themeResponse.success) {
          themeStore.setTheme(themeResponse.data);
        }
      } catch (err) {
        console.error('Failed to load card builder workspace', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchCardData();
  }, [slug, setCard]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8f5f2]">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return <CardBuilderCanvas />;
}
