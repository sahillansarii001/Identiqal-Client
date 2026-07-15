'use client';

import { useState, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * A hydration-safe wrapper around Framer Motion's useReducedMotion.
 * It always returns false during SSR and the initial client hydration
 * to ensure the DOM matches exactly. After mount, it returns the actual
 * user preference.
 */
export function useSafeReducedMotion() {
  const shouldReduceMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? shouldReduceMotion : false;
}
