"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useSafeReducedMotion } from "@/hooks/useSafeReducedMotion.js";

/**
 * AnimatedSection — Viewport-triggered scroll reveal wrapper.
 * Every section on the homepage is wrapped with this for consistent
 * blur→fade→scale-up animations. Fires only once.
 *
 * Props:
 *   children — section content
 *   delay    — optional delay in seconds (default: 0)
 *   className — additional class names for the wrapper
 *   threshold — how much of the element must be visible (default: 0.12)
 */
export default function AnimatedSection({
  children,
  delay = 0,
  className = "",
  threshold = 0.12,
  as: Tag = "div",
}) {
  const ref = useRef(null);
  const shouldReduceMotion = useSafeReducedMotion();
  const isInView = useInView(ref, { once: true, amount: threshold });

  const variants = {
    hidden: shouldReduceMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 32, scale: 0.97, filter: "blur(8px)" },
    visible: shouldReduceMotion
      ? { opacity: 1 }
      : {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
        },
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
