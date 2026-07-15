'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore.js';
import { Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, clearAuth } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    try {
      clearAuth();
      router.push('/');
    } catch (e) {
      clearAuth();
      router.push('/');
    }
  };

  const navLinks = [
    { name: 'Home', href: '/home' },
    { name: 'Templates', href: '/templates' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
  ];

  return (
    <motion.nav
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF8F6]/85 backdrop-blur-md border-b border-[#5A3342]/5 py-3 shadow-[0_4px_30px_rgba(90,51,66,0.03)]'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                className="w-9 h-9 rounded-xl bg-[#5A3342] flex items-center justify-center shadow-md relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-[#C89B5B]/30 to-transparent" />
                <span className="font-sans font-black text-lg text-white tracking-wider">iQ</span>
              </motion.div>
              <span className="text-xl font-bold tracking-tight text-[#1F1F1F] font-sans group-hover:text-[#5A3342] transition-colors">
                Identiqal
              </span>
            </Link>
          </div>

          {/* Center: Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link, idx) => {
              const isActive = pathname === link.href;
              const isHovered = hoveredIndex === idx;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`text-sm font-semibold relative px-3 py-2 transition-colors rounded-lg duration-200 ${
                    isActive ? 'text-[#5A3342]' : 'text-[#6B6B6B] hover:text-[#1F1F1F]'
                  }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeUnderline"
                      className="absolute bottom-[-2px] left-3 right-3 h-[2px] bg-[#C89B5B] z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}

                  {isHovered && !shouldReduceMotion && (
                    <motion.div
                      layoutId="hoverPill"
                      className="absolute inset-0 bg-[#5A3342]/5 rounded-lg"
                      transition={{ type: 'spring', stiffness: 350, damping: 32 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right: Desktop Auth & CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <motion.button
                    whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 text-sm font-semibold text-[#5A3342] bg-[#5A3342]/5 hover:bg-[#5A3342]/10 rounded-xl transition-all duration-200"
                  >
                    <LayoutDashboard size={14} />
                    <span>Dashboard</span>
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                  onClick={handleLogout}
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
                  onMouseEnter={() => setHoveredIndex('login')}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="text-sm font-semibold text-[#6B6B6B] hover:text-[#1F1F1F] px-4 py-2 transition-colors relative rounded-lg"
                >
                  <span className="relative z-10">Login</span>
                  {hoveredIndex === 'login' && !shouldReduceMotion && (
                    <motion.div
                      layoutId="hoverPill"
                      className="absolute inset-0 bg-[#5A3342]/5 rounded-lg"
                      transition={{ type: 'spring', stiffness: 350, damping: 32 }}
                    />
                  )}
                </Link>
                <Link href="/signup">
                  <motion.button
                    whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -1 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                    className="relative group overflow-hidden bg-[#5A3342] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-[#5A3342]/5 transition-all duration-300 border border-[#5A3342]"
                  >
                    <div className="absolute inset-0 bg-[#C89B5B] translate-y-full group-hover:translate-y-0 transition-transform duration-300 -z-10" />
                    <span className="relative z-10">Get Started</span>
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#6B6B6B] hover:text-[#5A3342] p-2 rounded-xl hover:bg-[#5A3342]/5 transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden px-4 pt-3 pb-6 space-y-2 bg-[#FAF8F6] border-b border-[#5A3342]/5 shadow-lg"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block px-4 py-3 rounded-xl text-base font-semibold text-[#6B6B6B] hover:text-[#5A3342] hover:bg-[#5A3342]/5"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="border-t border-[#5A3342]/5 my-3 pt-3 space-y-2 px-2">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="block w-full" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full justify-center inline-flex items-center space-x-1.5 px-4 py-2.5 text-sm font-semibold text-[#5A3342] bg-[#5A3342]/5 hover:bg-[#5A3342]/10 rounded-xl transition-all">
                    Dashboard
                  </button>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
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
        </motion.div>
      )}
    </motion.nav>
  );
};
