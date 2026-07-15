'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function PageTransition({ children }) {
  const { scrollY } = useScroll();
  const shouldReduceMotion = useReducedMotion();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      if (latest > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    });
    return () => unsubscribe();
  }, [scrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen flex flex-col w-full">
      {/* Main content fade transition */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex-1 flex flex-col w-full"
      >
        {children}
      </motion.div>

      {/* Scroll To Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 p-3 bg-white border border-[#E9E2DC] hover:border-[#5A3342]/30 text-[#5A3342] rounded-full shadow-lg shadow-[#5A3342]/5 cursor-pointer flex items-center justify-center transition-all duration-300"
            title="Scroll To Top"
          >
            <ArrowUp size={16} strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
