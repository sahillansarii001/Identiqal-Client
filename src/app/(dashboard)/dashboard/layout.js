'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore.js';
import { Button } from '@/components/ui/Button.jsx';
import { authService } from '@/services/authService.js';
import {
  CreditCard,
  LayoutDashboard,
  Sparkles,
  Layers,
  Inbox,
  BarChart3,
  Users,
  Wallet,
  LogOut,
  User as UserIcon,
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, clearAuth } = useAuthStore();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      clearAuth();
      router.push('/login');
    } catch (e) {
      clearAuth();
      router.push('/login');
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex h-screen bg-slate-950 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500" />
      </div>
    );
  }

  const isOwner = user.role === 'owner' || !user.organizationId; // Individual/Owner see all tabs

  const menuItems = [
    { label: 'Overview', href: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'My Cards', href: '/dashboard/cards', icon: <Layers size={18} /> },
    { label: 'Captured Leads', href: '/dashboard/leads', icon: <Inbox size={18} /> },
    { label: 'Analytics', href: '/dashboard/analytics', icon: <BarChart3 size={18} /> },
  ];

  // Owner/Individual-only workspace tabs
  const ownerItems = [
    { label: 'Team Workspace', href: '/dashboard/team', icon: <Users size={18} /> },
    { label: 'Billing & Plan', href: '/dashboard/billing', icon: <Wallet size={18} /> },
  ];

  const activeClass = 'bg-slate-900 border-l-2 border-indigo-500 text-slate-100 font-semibold';
  const inactiveClass = 'text-slate-400 hover:bg-slate-900/40 hover:text-slate-200 border-l-2 border-transparent';

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-900 bg-slate-950/50 flex flex-col fixed inset-y-0 left-0">
        {/* Brand */}
        <div className="h-16 px-6 border-b border-slate-900 flex items-center">
          <Link href="/" className="flex items-center space-x-2 text-lg font-black tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            <CreditCard className="text-blue-500" size={20} />
            <span>Identiqal</span>
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">Main Menu</p>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-r-xl transition-all text-sm ${
                pathname === item.href ? activeClass : inactiveClass
              }`}
            >
              <span className={pathname === item.href ? 'text-indigo-400' : ''}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          ))}

          {isOwner && (
            <>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mt-6 mb-2">Organization</p>
              {ownerItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-r-xl transition-all text-sm ${
                    pathname === item.href ? activeClass : inactiveClass
                  }`}
                >
                  <span className={pathname === item.href ? 'text-indigo-400' : ''}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </>
          )}
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-900 space-y-3">
          <div className="flex items-center space-x-3 px-2 py-1.5 rounded-xl bg-slate-900/30 border border-slate-900">
            <div className="w-9 h-9 rounded-xl bg-indigo-650 flex items-center justify-center font-bold text-slate-100 text-sm shadow-md">
              {user.name[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-200 truncate">{user.name}</h4>
              <p className="text-[10px] text-slate-500 flex items-center space-x-1">
                <Sparkles size={10} className="text-indigo-400 shrink-0" />
                <span className="capitalize">{user.subscriptionTier} plan</span>
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-center text-slate-400 hover:text-white"
          >
            <LogOut size={14} className="mr-1.5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="pl-64 flex flex-col flex-1 min-w-0">
        <header className="h-16 border-b border-slate-900 bg-slate-950/20 flex items-center justify-between px-8 sticky top-0 backdrop-blur-sm z-30">
          <h2 className="text-sm font-bold text-slate-350">
            Dashboard &gt; {pathname.split('/').filter(Boolean).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' > ')}
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-[10px] bg-slate-900 text-slate-400 border border-slate-800 px-2.5 py-1 rounded-xl capitalize font-semibold tracking-wider">
              {user.role} workspace
            </span>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
