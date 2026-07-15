/**
 * animations.js — Identiqal Shared Animation Presets
 * All animations are GPU-accelerated (opacity, transform only).
 * Consumers should check useReducedMotion() and disable where needed.
 */

// ─── Spring Configs ──────────────────────────────────────────────────────────

export const springs = {
  snappy: { type: 'spring', stiffness: 400, damping: 28 },
  smooth: { type: 'spring', stiffness: 280, damping: 30 },
  gentle: { type: 'spring', stiffness: 180, damping: 25 },
  bouncy: { type: 'spring', stiffness: 350, damping: 20 },
  ultraSmooth: { type: 'spring', stiffness: 120, damping: 22 },
};

// ─── Easing Presets ───────────────────────────────────────────────────────────

export const easings = {
  premium: [0.16, 1, 0.3, 1],       // expo out — feels expensive
  smooth: [0.4, 0, 0.2, 1],         // material — clean
  snappy: [0.25, 0.46, 0.45, 0.94], // ease-out-quart
};

// ─── Scroll Section Reveal ────────────────────────────────────────────────────

export const sectionReveal = {
  hidden: {
    opacity: 0,
    y: 32,
    scale: 0.97,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.7,
      ease: easings.premium,
    },
  },
};

// ─── Stagger Container ────────────────────────────────────────────────────────

export const staggerContainer = (stagger = 0.08, delayChildren = 0) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: stagger, delayChildren },
  },
});

// ─── Fade Up Item (for use inside stagger containers) ─────────────────────────

export const fadeUpItem = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: easings.premium },
  },
};

// ─── Hero Word Reveal ─────────────────────────────────────────────────────────

export const wordRevealItem = {
  hidden: { opacity: 0, y: 18, filter: 'blur(3px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.45, ease: easings.premium },
  },
};

// ─── Card Hover ───────────────────────────────────────────────────────────────

export const cardHover = {
  rest: {
    y: 0,
    scale: 1,
    rotate: 0,
    boxShadow: '0 4px 20px -8px rgba(74, 44, 58, 0.06)',
    transition: { duration: 0.3, ease: easings.smooth },
  },
  hover: {
    y: -8,
    scale: 1.02,
    rotate: 1,
    boxShadow: '0 24px 48px -16px rgba(74, 44, 58, 0.14)',
    transition: springs.smooth,
  },
};

// ─── Button Hover ─────────────────────────────────────────────────────────────

export const buttonHover = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.03,
    y: -2,
    transition: springs.snappy,
  },
  tap: {
    scale: 0.96,
    y: 0,
    transition: springs.bouncy,
  },
};

// ─── Navbar Slide Down ────────────────────────────────────────────────────────

export const navbarEntry = {
  hidden: { opacity: 0, y: -16, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: easings.premium, delay: 0.1 },
  },
};

// ─── Mobile Menu ─────────────────────────────────────────────────────────────

export const mobileMenuVariants = {
  hidden: {
    opacity: 0,
    height: 0,
    filter: 'blur(4px)',
    transition: { duration: 0.25, ease: 'easeIn' },
  },
  visible: {
    opacity: 1,
    height: 'auto',
    filter: 'blur(0px)',
    transition: { duration: 0.35, ease: easings.premium },
  },
};

// ─── Page Transition ─────────────────────────────────────────────────────────

export const pageVariants = {
  initial: { opacity: 0, y: 12, filter: 'blur(4px)' },
  enter: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.4, ease: easings.premium },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: 'blur(4px)',
    transition: { duration: 0.25, ease: 'easeIn' },
  },
};

// ─── Phone Float Animation ────────────────────────────────────────────────────

export const phoneFloat = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 5.5,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
};

// ─── Icon Hover ───────────────────────────────────────────────────────────────

export const iconHover = {
  rest: { rotate: 0, scale: 1 },
  hover: {
    rotate: 12,
    scale: 1.15,
    transition: springs.snappy,
  },
};

// ─── Badge Pulse ─────────────────────────────────────────────────────────────

export const badgePulse = {
  animate: {
    scale: [1, 1.025, 1],
    transition: {
      duration: 3,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
};
