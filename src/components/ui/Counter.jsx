"use client";

import React, { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
} from "framer-motion";

export default function Counter({ value, suffix = "" }) {
  const ref = useRef(null);

  // Extract number from string (e.g., "10M+" -> 10, "99.9%" -> 99.9)
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, "")) || 0;
  const motionValue = useMotionValue(0);

  const hasDecimals = value.includes(".");

  const rounded = useTransform(motionValue, (latest) => {
    if (hasDecimals) {
      return latest.toFixed(1);
    }
    return Math.floor(latest).toLocaleString();
  });

  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionValue, numericValue, {
        duration: 2,
        ease: "easeOut",
      });
      return () => controls.stop();
    }
  }, [isInView, numericValue, motionValue]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}
