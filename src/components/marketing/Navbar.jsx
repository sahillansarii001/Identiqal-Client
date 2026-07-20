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

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const isAdmin = user?.role === "admin" || user?.role === "owner";
  const dashboardHref = isAdmin ? "/admin" : "/dashboard";

  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY: scrollMotion } = useScroll();

  useMotionValueEvent(scrollMotion, "change", (v) => setScrollY(v));
  const isScrolled = scrollY > 20;

  const handleLogout = () => {
    clearAuth();
    router.push("/");
  };

  return (
    <div className="sticky top-0 w-full z-50 flex justify-center items-start pt-6 px-4 -mb-24 h-24 pointer-events-none">
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`w-full max-w-4xl rounded-full transition-all duration-300 border backdrop-blur-xl pointer-events-auto ${
          isScrolled
            ? "bg-white/80 border-slate-200/50 shadow-lg shadow-slate-200/20 py-2.5 px-4"
            : "bg-white/60 border-transparent shadow-none py-3 px-4"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
              <span className="font-bold text-white text-sm tracking-wide">iQ</span>
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
              Identiqal
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <Link href={dashboardHref}>
                  <button className="flex items-center space-x-1.5 px-4 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
                    <LayoutDashboard size={14} />
                    <span>Dashboard</span>
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <LogOut size={14} />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Log in
                </Link>
                <Link href="/signup">
                  <button className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-sm transition-colors">
                    Start Free
                  </button>
                </Link>
              </>
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 inset-x-4 p-4 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl z-40 md:hidden"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-slate-100 my-2" />
              {isAuthenticated ? (
                <>
                  <Link href={dashboardHref} onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full text-left px-4 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                      Dashboard
                    </button>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
                      Log in
                    </button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full text-center px-4 py-3 mt-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors">
                      Get Started
                    </button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
