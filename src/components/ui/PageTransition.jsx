"use client";

import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useSafeReducedMotion } from "@/hooks/useSafeReducedMotion.js";

export default function PageTransition({ children }) {
  const { scrollY } = useScroll();
  const shouldReduceMotion = useSafeReducedMotion();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isHoveringScrollBtn, setIsHoveringScrollBtn] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setShowScrollTop(v > 300));

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="relative min-h-screen flex flex-col w-full">
      {/* ── Page fade-in ─────────────────────────────────────── */}
      <motion.div
        initial={
          shouldReduceMotion
            ? { opacity: 0 }
            : { opacity: 0, y: 12, filter: "blur(4px)" }
        }
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 flex flex-col w-full"
      >
        {children}
      </motion.div>

      {/* ── Scroll-to-top button ─────────────────────────────── */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            whileHover={
              shouldReduceMotion
                ? {}
                : {
                    scale: 1.12,
                    y: -2,
                    boxShadow: "0 12px 32px rgba(37, 99, 235, 0.22)",
                    backgroundColor: "#2563EB",
                  }
            }
            whileTap={shouldReduceMotion ? {} : { scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 24 }}
            onHoverStart={() => setIsHoveringScrollBtn(true)}
            onHoverEnd={() => setIsHoveringScrollBtn(false)}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 w-11 h-11 bg-white border border-[#E2E8F0] hover:border-[#2563EB]/30 text-[#2563EB] hover:text-white rounded-full shadow-lg shadow-[#2563EB]/8 cursor-pointer flex items-center justify-center transition-colors duration-300 overflow-hidden"
            title="Scroll To Top"
          >
            {/* Gold bg fill animates in on hover */}
            <motion.span
              className="absolute inset-0 rounded-full bg-[#2563EB]"
              initial={{ scale: 0, opacity: 0 }}
              animate={
                isHoveringScrollBtn
                  ? { scale: 1, opacity: 1 }
                  : { scale: 0, opacity: 0 }
              }
              transition={{ type: "spring", stiffness: 380, damping: 25 }}
            />
            <motion.div
              animate={
                isHoveringScrollBtn && !shouldReduceMotion
                  ? { y: -2 }
                  : { y: 0 }
              }
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="relative z-10"
            >
              <ArrowUp size={16} strokeWidth={2.5} />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}


