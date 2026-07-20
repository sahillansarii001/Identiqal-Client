'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore.js';
import { Button } from '@/components/ui/Button.jsx';
import { authService } from '@/services/authService.js';
import { ToastContainer } from '@/components/ui/Toast.jsx';
import {
  LayoutDashboard,
  Users,
  Layers,
  Sparkles,
  LayoutTemplate,
  CreditCard,
  DollarSign,
  BarChart3,
  FileText,
  Image as ImageIcon,
  Megaphone,
  LifeBuoy,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  CheckCircle2,
  Moon,
  Sun
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, clearAuth, isCheckingAuth } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('iq-dark-mode') === 'true';
    }
    return false;
  });

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('iq-dark-mode', String(next));
      return next;
    });
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (!isCheckingAuth && !isAuthenticated) {
      router.push('/login');
    } else if (!isCheckingAuth && user && user.role !== 'admin' && user.role !== 'owner') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isCheckingAuth, router, user]);

  const handleLogout = async () => {
    try { await authService.logout(); } catch (_) {}
    clearAuth();
    router.push('/login');
  };

  if (isCheckingAuth || !isAuthenticated || !user || (user.role !== 'admin' && user.role !== 'owner')) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-[#0A0A0A] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#5A3045]" />
      </div>
    );
  }

  // Grouped Menu Items
  const navGroups = [
    {
      title: 'Overview',
      items: [
        { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={16} /> }
      ]
    },
    {
      title: 'Management',
      items: [
        { label: 'Users', href: '/admin/users', icon: <Users size={16} /> },
        { label: 'Organizations', href: '/admin/organizations', icon: <Layers size={16} /> },
        { label: 'Display Presets', href: '/admin/display-presets', icon: <LayoutTemplate size={16} /> },
        { label: 'Color Themes', href: '/admin/color-themes', icon: <Sparkles size={16} /> },
        { label: 'Footer Presets', href: '/admin/footer-presets', icon: <FileText size={16} /> },
        { label: 'Templates', href: '/admin/templates', icon: <LayoutTemplate size={16} /> }
      ]
    },
    {
      title: 'Financials',
      items: [
        { label: 'Subscriptions', href: '/admin/subscriptions', icon: <CreditCard size={16} /> },
        { label: 'Payments', href: '/admin/payments', icon: <DollarSign size={16} /> }
      ]
    },
    {
      title: 'Insights',
      items: [
        { label: 'Analytics', href: '/admin/analytics', icon: <BarChart3 size={16} /> },
        { label: 'Reports', href: '/admin/reports', icon: <FileText size={16} /> }
      ]
    },
    {
      title: 'System',
      items: [
        { label: 'Media', href: '/admin/media', icon: <ImageIcon size={16} /> },
        { label: 'Announcements', href: '/admin/announcements', icon: <Megaphone size={16} /> },
        { label: 'Support', href: '/admin/support', icon: <LifeBuoy size={16} /> },
        { label: 'Settings', href: '/admin/settings', icon: <Settings size={16} /> }
      ]
    }
  ];

  const activeCls = 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white font-medium rounded-lg';
  const inactiveCls = 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white rounded-lg';

  return (
    <div className={`flex min-h-[100dvh] font-sans bg-white dark:bg-[#0A0A0A] transition-colors duration-200`}>
      <ToastContainer />
      
      {/* Mobile backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar (Enterprise Flat Design) ─────────────────────────────── */}
      <aside className={`fixed lg:sticky top-0 left-0 h-[100dvh] w-[260px] shrink-0 border-r flex flex-col bg-gray-50/50 dark:bg-[#111111] border-gray-200 dark:border-white/10 z-50 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>

        {/* Brand */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-gray-200 dark:border-white/10 shrink-0">
          <Link href="/admin" className="flex items-center space-x-2 text-sm font-semibold text-gray-900 dark:text-white">
            <div className="w-6 h-6 rounded bg-[#5A3045] flex items-center justify-center text-white">
              <span className="text-[10px] font-black">I</span>
            </div>
            <span>Identiqal Admin</span>
          </Link>
          <button className="lg:hidden text-gray-400 hover:text-gray-600 dark:hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={16} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 min-h-0 px-3 py-4 space-y-6 overflow-y-auto custom-scrollbar">
          {navGroups.map((group, idx) => (
            <div key={idx}>
              <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 px-3 mb-2 uppercase tracking-wider">{group.title}</p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-2 text-[13px] transition-colors ${active ? activeCls : inactiveCls}`}>
                      <span className={`${active ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-white/10 bg-white/50 dark:bg-transparent shrink-0 mt-auto">
          <div className="flex items-center space-x-3 px-2 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center text-gray-600 dark:text-white font-medium text-xs">
              {user.name[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-[13px] font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Enterprise Topbar */}
        <header className="h-16 px-6 border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-900 dark:hover:text-white">
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center bg-gray-100 dark:bg-white/5 rounded-md px-3 py-1.5 w-64 border border-transparent focus-within:border-gray-300 dark:focus-within:border-white/20 focus-within:bg-white dark:focus-within:bg-[#111] transition-colors">
              <Search size={14} className="text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search resources... (⌘K)" 
                className="bg-transparent border-none text-[13px] w-full focus:outline-none text-gray-900 dark:text-white placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D4A45B] rounded-full"></span>
            </button>
            <button onClick={toggleDarkMode} className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link href="/dashboard" className="ml-2 px-3 py-1.5 rounded-md bg-[#5A3045] hover:bg-[#7A4055] text-white text-[12px] font-medium transition-colors">
              User App
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
