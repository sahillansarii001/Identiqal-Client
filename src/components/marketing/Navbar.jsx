"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore.js";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/features" },
  { name: "Pricing", href: "/pricing" },
  { name: "Templates", href: "/templates" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { y: -12, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 200, damping: 16 },
  },
};

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const isAdmin = user?.role === "admin" || user?.role === "owner";
  const dashboardHref = isAdmin ? "/admin" : "/dashboard";

  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { scrollY: scrollMotion } = useScroll();

  useMotionValueEvent(scrollMotion, "change", (v) => setScrollY(v));
  const isScrolled = scrollY > 20;

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    clearAuth();
    router.push("/");
  };

  return (
    <div className="sticky top-0 w-full z-50 flex justify-center items-start pt-6 px-6 -mb-24 h-24 pointer-events-none">
      <motion.nav
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
        className={`w-full max-w-5xl rounded-full transition-all duration-500 ease-out border pointer-events-auto ${
          isScrolled
            ? "bg-white/85 border-slate-200/60 backdrop-blur-xl shadow-[0_12px_40px_rgba(15,23,42,0.08)] py-3 px-8 scale-[0.98]"
            : "bg-white/70 border-slate-200/30 backdrop-blur-lg shadow-[0_4px_30px_rgba(15,23,42,0.03)] py-4.5 px-8"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div 
              whileHover={{ scale: 1.08, rotate: 6 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_2px_10px_rgba(37,99,235,0.25)] group-hover:shadow-[0_4px_16px_rgba(37,99,235,0.4)] transition-all duration-300"
            >
              <span className="font-bold text-white text-xs tracking-wider">iQ</span>
            </motion.div>
            <span className="text-lg font-extrabold bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 bg-clip-text text-transparent tracking-tight group-hover:from-blue-600 group-hover:to-indigo-600 transition-colors duration-300">
              Identiqal
            </span>
          </Link>

          {/* Desktop Links */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="hidden md:flex items-center space-x-1 relative"
          >
            {navLinks.map((link, idx) => {
              const isActive = pathname === link.href;
              return (
                <motion.div key={link.name} variants={itemVariants} className="relative">
                  <Link
                    href={link.href}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={`relative block px-4.5 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
                      isActive
                        ? "text-blue-600 z-10"
                        : "text-slate-600 hover:text-slate-900 z-10"
                    }`}
                  >
                    <motion.span
                      className="relative block"
                      whileHover={{ scale: 1.04, y: -0.5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 12 }}
                    >
                      {link.name}
                    </motion.span>
                    {isActive && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 bg-blue-50/80 rounded-full -z-10 border border-blue-100/30"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {hoveredIndex === idx && !isActive && (
                      <motion.div
                        layoutId="hover-pill"
                        className="absolute inset-0 bg-slate-100/60 rounded-full -z-10"
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link href={dashboardHref}>
                  <motion.button 
                    whileHover={{ scale: 1.04, y: -1 }}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center space-x-1.5 px-5 py-2.5 text-sm font-bold text-blue-600 bg-blue-50/80 hover:bg-blue-100 border border-blue-100/60 rounded-full shadow-sm transition-all duration-200 cursor-pointer"
                  >
                    <LayoutDashboard size={14} className="text-blue-500" />
                    <span>Dashboard</span>
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={handleLogout}
                  className="flex items-center justify-center w-9 h-9 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 cursor-pointer"
                  title="Log Out"
                >
                  <LogOut size={15} />
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors duration-200"
                >
                  Log in
                </Link>
                <Link href="/signup">
                  <motion.button 
                    whileHover={{ 
                      scale: 1.05, 
                      y: -2,
                      boxShadow: "0 10px 25px -5px rgba(37,99,235,0.4)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-full shadow-[0_4px_14px_rgba(37,99,235,0.2)] transition-all duration-300 cursor-pointer"
                  >
                    Start Free
                  </motion.button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="absolute top-24 inset-x-4 p-4.5 bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.12)] z-40 md:hidden overflow-hidden"
          >
            {/* Stagger container */}
            <motion.div
              className="flex flex-col space-y-1.5"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.055, delayChildren: 0.08 } },
              }}
            >
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.name}
                    variants={{
                      hidden: { opacity: 0, x: -18 },
                      visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 380, damping: 24 } },
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}

              {/* Divider */}
              <motion.div
                className="h-px bg-slate-100 my-2.5"
                variants={{
                  hidden: { opacity: 0, scaleX: 0 },
                  visible: { opacity: 1, scaleX: 1, transition: { duration: 0.25 } },
                }}
                style={{ originX: 0 }}
              />

              {isAuthenticated ? (
                <div className="flex flex-col space-y-2">
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 340, damping: 24 } },
                    }}
                  >
                    <Link href={dashboardHref} onClick={() => setMobileMenuOpen(false)}>
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100/80 rounded-xl border border-blue-100/50 transition-colors"
                      >
                        <LayoutDashboard size={15} />
                        <span>Dashboard</span>
                      </motion.button>
                    </Link>
                  </motion.div>
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 340, damping: 24 } },
                    }}
                  >
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <LogOut size={15} />
                      <span>Log out</span>
                    </motion.button>
                  </motion.div>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 340, damping: 24 } },
                    }}
                  >
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        className="w-full text-center px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                      >
                        Log in
                      </motion.button>
                    </Link>
                  </motion.div>
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 340, damping: 24 } },
                    }}
                  >
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full text-center px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-[0_4px_12px_rgba(37,99,235,0.15)] transition-colors"
                      >
                        Get Started Free
                      </motion.button>
                    </Link>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
