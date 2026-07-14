'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '../../store/authStore.js';
import { CreditCard, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { authService } from '../../services/authService.js';

export const Navbar = () => {
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
      clearAuth();
    } catch (e) {
      clearAuth();
    }
  };

  return (
    <nav className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 text-xl font-black tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              <CreditCard className="text-blue-500" />
              <span>Identiqal</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/pricing" className="text-sm text-slate-300 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/#how-it-works" className="text-sm text-slate-300 hover:text-white transition-colors">
              How it Works
            </Link>
            <Link href="/#showcase" className="text-sm text-slate-300 hover:text-white transition-colors">
              Features
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="secondary" size="sm" className="space-x-1.5">
                    <LayoutDashboard size={14} />
                    <span>Dashboard</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-400 hover:text-white">
                  <LogOut size={14} className="mr-1.5" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-slate-300">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="sm">
                    Get Started Free
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-900 transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-2 pt-2 pb-4 space-y-1 bg-slate-950 border-b border-slate-900">
          <Link
            href="/pricing"
            className="block px-3 py-2.5 rounded-xl text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900"
            onClick={() => setMobileMenuOpen(false)}
          >
            Pricing
          </Link>
          <Link
            href="/#how-it-works"
            className="block px-3 py-2.5 rounded-xl text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900"
            onClick={() => setMobileMenuOpen(false)}
          >
            How it Works
          </Link>
          <Link
            href="/#showcase"
            className="block px-3 py-2.5 rounded-xl text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900"
            onClick={() => setMobileMenuOpen(false)}
          >
            Features
          </Link>
          <div className="border-t border-slate-900 my-2 pt-2 space-y-2 px-3">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="block w-full">
                  <Button variant="secondary" className="w-full justify-center">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" onClick={handleLogout} className="w-full justify-center text-slate-400">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="block w-full">
                  <Button variant="ghost" className="w-full justify-center text-slate-300">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" className="block w-full">
                  <Button variant="primary" className="w-full justify-center">
                    Get Started Free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
