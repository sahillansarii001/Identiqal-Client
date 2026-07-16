'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore.js';
import { Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion, useScroll, useMotionValueEvent } from 'framer-motion';

const navLinks = [
  { name: 'Home',      href: '/' },
  { name: 'Features',  href: '/features' },
  { name: 'Templates', href: '/templates' },
  { name: 'Pricing',   href: '/pricing' },
  { name: 'About',     href: '/about' },
];

export const Navbar = () => {
  const router        = useRouter();
  const pathname      = usePathname();
  const { isAuthenticated, clearAuth } = useAuthStore();
  const shouldReduceMotion = useReducedMotion();

  const [scrollY,          setScrollY]          = useState(0);
  const [mobileMenuOpen,   setMobileMenuOpen]   = useState(false);
  const [hoveredLink,      setHoveredLink]       = useState(null);

  const { scrollY: scrollMotion } = useScroll();
  useMotionValueEvent(scrollMotion, 'change', (v) => setScrollY(v));

  const isScrolled   = scrollY > 20;
  const blurAmount   = Math.min(20, 4 + scrollY * 0.08);   // 4px → 20px
  const bgOpacity    = Math.min(0.92, 0.4 + scrollY * 0.003);

  const handleLogout = () => {
    try   { clearAuth(); router.push('/'); }
    catch { clearAuth(); router.push('/'); }
  };

  return (
    <motion.nav
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
      style={{
        backdropFilter: `blur(${blurAmount}px) saturate(180%)`,
        WebkitBackdropFilter: `blur(${blurAmount}px) saturate(180%)`,
        backgroundColor: `rgba(250, 250, 248, ${bgOpacity})`,
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-[border-color,box-shadow,padding] duration-300 ${
        isScrolled
          ? 'border-b border-[#5A3342]/8 shadow-[0_4px_32px_rgba(90,51,66,0.05)] py-3'
          : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ─────────────────────────────────────────── */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.08, rotate: -3 }}
                whileTap={shouldReduceMotion   ? {} : { scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                className="w-9 h-9 rounded-xl bg-[#5A3342] flex items-center justify-center shadow-md shadow-[#5A3342]/20 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-[#C89B5B]/40 to-transparent" />
                <motion.span
                  className="font-sans font-black text-lg text-white tracking-wider relative z-10"
                >
                  iQ
                </motion.span>
              </motion.div>
              <span className="text-xl font-bold tracking-tight text-[#1F1F1F] font-sans group-hover:text-[#5A3342] transition-colors duration-200">
                Identiqal
              </span>
            </Link>
          </div>

          {/* ── Desktop Nav Links ─────────────────────────────── */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link, idx) => {
              const isActive  = pathname === link.href;
              const isHovered = hoveredLink === idx;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onMouseEnter={() => setHoveredLink(idx)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className={`relative text-sm font-semibold px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isActive ? 'text-[#5A3342]' : 'text-[#6B6B6B] hover:text-[#1F1F1F]'
                  }`}
                >
                  <span className="relative z-10">{link.name}</span>

                  {/* Hover background pill */}
                  <AnimatePresence>
                    {isHovered && !shouldReduceMotion && (
                      <motion.div
                        key="hoverPill"
                        layoutId="navHoverPill"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        className="absolute inset-0 bg-[#5A3342]/6 rounded-lg pointer-events-none"
                      />
                    )}
                  </AnimatePresence>

                  {/* Active underline indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-[-2px] left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-[#4A2C3A] to-[#C89B5B]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ── Desktop Auth / CTA ────────────────────────────── */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <motion.button
                    whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -1 }}
                    whileTap={shouldReduceMotion   ? {} : { scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 text-sm font-semibold text-[#5A3342] bg-[#5A3342]/6 hover:bg-[#5A3342]/12 rounded-xl transition-colors duration-200"
                  >
                    <LayoutDashboard size={14} />
                    <span>Dashboard</span>
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -1 }}
                  whileTap={shouldReduceMotion   ? {} : { scale: 0.97 }}
                  onClick={handleLogout}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 text-sm font-medium text-[#6B6B6B] hover:text-[#1F1F1F] transition-colors"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </motion.button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onMouseEnter={() => setHoveredLink('login')}
                  onMouseLeave={() => setHoveredLink(null)}
                  className="relative text-sm font-semibold text-[#6B6B6B] hover:text-[#1F1F1F] px-4 py-2 transition-colors rounded-lg"
                >
                  <span className="relative z-10">Login</span>
                  <AnimatePresence>
                    {hoveredLink === 'login' && !shouldReduceMotion && (
                      <motion.div
                        key="loginHover"
                        layoutId="navHoverPill"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        className="absolute inset-0 bg-[#5A3342]/6 rounded-lg pointer-events-none"
                      />
                    )}
                  </AnimatePresence>
                </Link>

                <Link href="/signup">
                  <motion.button
                    whileHover={shouldReduceMotion ? {} : {
                      scale: 1.04,
                      y: -2,
                      boxShadow: '0 8px 24px rgba(90, 51, 66, 0.22)',
                    }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="relative group overflow-hidden bg-[#5A3342] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-[#5A3342]/15 border border-[#5A3342]"
                  >
                    {/* Gold fill on hover */}
                    <span className="absolute inset-0 bg-gradient-to-r from-[#B88A44] to-[#C89B5B] translate-y-full group-hover:translate-y-0 transition-transform duration-300 -z-10 rounded-xl" />
                    <span className="relative z-10">Get Started</span>
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile Menu Button ────────────────────────────── */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#6B6B6B] hover:text-[#5A3342] p-2 rounded-xl hover:bg-[#5A3342]/6 transition-colors"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={20} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ──────────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobileMenu"
            initial={{ opacity: 0, height: 0, filter: 'blur(4px)' }}
            animate={{ opacity: 1, height: 'auto', filter: 'blur(0px)' }}
            exit={{ opacity: 0, height: 0, filter: 'blur(4px)' }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden border-b border-[#5A3342]/8"
            style={{
              backdropFilter: `blur(20px) saturate(180%)`,
              backgroundColor: `rgba(250, 250, 248, 0.95)`,
            }}
          >
            <div className="px-4 pt-3 pb-6 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={link.href}
                    className={`block px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                      pathname === link.href
                        ? 'text-[#5A3342] bg-[#5A3342]/6'
                        : 'text-[#6B6B6B] hover:text-[#5A3342] hover:bg-[#5A3342]/5'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <div className="border-t border-[#5A3342]/8 mt-3 pt-3 space-y-2 px-2">
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard" className="block w-full" onClick={() => setMobileMenuOpen(false)}>
                      <button className="w-full justify-center inline-flex items-center space-x-1.5 px-4 py-2.5 text-sm font-semibold text-[#5A3342] bg-[#5A3342]/6 hover:bg-[#5A3342]/12 rounded-xl transition-all">
                        Dashboard
                      </button>
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                      className="w-full justify-center inline-flex items-center space-x-1.5 px-4 py-2.5 text-sm font-medium text-[#6B6B6B] hover:text-[#1F1F1F] hover:bg-black/5 rounded-xl transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block w-full" onClick={() => setMobileMenuOpen(false)}>
                      <button className="w-full justify-center inline-flex items-center px-4 py-2.5 text-sm font-semibold text-[#6B6B6B] hover:text-[#5A3342] transition-colors">
                        Login
                      </button>
                    </Link>
                    <Link href="/signup" className="block w-full" onClick={() => setMobileMenuOpen(false)}>
                      <button className="w-full justify-center inline-flex items-center px-4 py-2.5 text-sm font-semibold bg-[#5A3342] text-white rounded-xl shadow-md border border-[#5A3342]">
                        Get Started
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
