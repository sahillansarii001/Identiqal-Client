"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore.js";
import { Button } from "@/components/ui/Button.jsx";
import { authService } from "@/services/authService.js";
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
  Menu,
  X,
  Search,
  Bell,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import HeaderImageWorkspace from "@/components/builder/HeaderImageWorkspace";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, clearAuth, isCheckingAuth } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Dark mode — lifted from Navbar, persisted in localStorage ──────────────
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("iq-dark-mode") === "true";
    }
    return false;
  });

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("iq-dark-mode", String(next));
      return next;
    });
  };

  // Sync dark class to <html> element so CSS overrides can target html.dark
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    if (!isCheckingAuth && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, isCheckingAuth, router]);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (_) {}
    clearAuth();
    router.push("/login");
  };

  if (isCheckingAuth || !isAuthenticated || !user) {
    return (
      <div className="flex h-[100dvh] bg-[#F8FAFC] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#2563EB]" />
      </div>
    );
  }

  const isOwner = user.role === "owner" || !user.organizationId;

  const menuItems = [
    {
      label: "Overview",
      href: "/dashboard",
      icon: <LayoutDashboard size={16} />,
    },
    { label: "My Cards", href: "/dashboard/cards", icon: <Layers size={16} /> },
    {
      label: "Captured Leads",
      href: "/dashboard/leads",
      icon: <Inbox size={16} />,
    },
    {
      label: "Analytics",
      href: "/dashboard/analytics",
      icon: <BarChart3 size={16} />,
    },
  ];

  const ownerItems = [
    {
      label: "Team Workspace",
      href: "/dashboard/team",
      icon: <Users size={16} />,
    },
    {
      label: "Billing & Plan",
      href: "/dashboard/billing",
      icon: <Wallet size={16} />,
    },
  ];

  const activeCls = darkMode
    ? "bg-white/10 text-white font-semibold rounded-xl shadow-sm"
    : "bg-[#2563EB]/[0.06] text-[#2563EB] font-bold rounded-xl";

  const inactiveCls = darkMode
    ? "text-[#94A3B8] hover:bg-white/5 hover:text-white rounded-xl transition-colors"
    : "text-[#64748B] hover:bg-black/5 hover:text-[#222] rounded-xl transition-colors";

  return (
    <div
      data-dark={darkMode ? "true" : undefined}
      className={`flex min-h-[100dvh] font-sans relative transition-colors duration-300 ${
        darkMode ? "bg-[#0A0A0A] text-[#FAFAFA]" : "bg-[#F8FAFC] text-inherit"
      }`}
    >
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#3B82F6]/3 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#2563EB]/2 blur-[100px] pointer-events-none" />

      {/* Mobile backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ─────────────────────────────── */}
      <aside
        className={`fixed lg:sticky top-0 h-[100dvh] w-[260px] border-r flex flex-col z-50 transition-all duration-300 shrink-0 ${
          sidebarOpen ? "left-0" : "left-[-260px] lg:left-0"
        } ${
          darkMode
            ? "bg-[#111111] border-white/10"
            : "bg-[#FFFFFF] border-[rgba(0,0,0,0.06)]"
        }`}
      >
        {/* Brand */}
        <div
          className={`h-[72px] px-6 flex items-center justify-between border-b shrink-0 ${
            darkMode ? "border-white/10" : "border-[rgba(0,0,0,0.04)]"
          }`}
        >
          <Link
            href="/"
            className={`flex items-center space-x-3 text-[17px] font-black tracking-tight ${
              darkMode ? "text-white" : "text-brand-text"
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-[#2563EB] to-[#3B82F6] flex items-center justify-center text-white shadow-md shadow-[#2563EB]/20">
              <CreditCard size={15} strokeWidth={2.5} />
            </div>
            <span>Identiqal</span>
          </Link>
          <button
            className={`lg:hidden p-1.5 rounded-lg ${
              darkMode
                ? "hover:bg-white/8 text-[#94A3B8]"
                : "hover:bg-black/5 text-[#7A7A7A]"
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 min-h-0 py-6 overflow-y-auto no-scrollbar flex flex-col gap-1">
          <p
            className={`text-[10px] font-bold uppercase tracking-[0.15em] px-8 mb-2 ${
              darkMode ? "text-[#64748B]" : "text-[#94A3B8]"
            }`}
          >
            Main Menu
          </p>

          {menuItems.map((item) => {
            const active = pathname === item.href;
            return (
              <div key={item.href} className="px-4">
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3.5 px-4 py-2.5 text-[13px] group ${active ? activeCls : inactiveCls}`}
                >
                  <span
                    className={`transition-transform duration-200 group-hover:scale-110 ${
                      active
                        ? "text-[#3B82F6]"
                        : darkMode
                          ? "text-[#A3A3A3] group-hover:text-white"
                          : "text-[#94A3B8] group-hover:text-[#222]"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="font-semibold tracking-wide">
                    {item.label}
                  </span>
                </Link>
              </div>
            );
          })}

          {isOwner && (
            <>
              <p
                className={`text-[10px] font-bold uppercase tracking-[0.15em] px-8 mt-6 mb-2 ${
                  darkMode ? "text-[#64748B]" : "text-[#94A3B8]"
                }`}
              >
                Organization
              </p>
              {ownerItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <div key={item.href} className="px-4">
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center space-x-3.5 px-4 py-2.5 text-[13px] group ${active ? activeCls : inactiveCls}`}
                    >
                      <span
                        className={`transition-transform duration-200 group-hover:scale-110 ${
                          active
                            ? "text-[#3B82F6]"
                            : darkMode
                              ? "text-[#A3A3A3] group-hover:text-white"
                              : "text-[#94A3B8] group-hover:text-[#222]"
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span className="font-semibold tracking-wide">
                        {item.label}
                      </span>
                    </Link>
                  </div>
                );
              })}
            </>
          )}
        </nav>

        {/* User card */}
        <div
          className={`p-5 mt-auto border-t shrink-0 ${
            darkMode
              ? "border-white/10 bg-[#0A0A0A]"
              : "border-[rgba(0,0,0,0.04)] bg-[#FAF8F5]"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#2563EB] to-[#3B82F6] flex items-center justify-center font-black text-white text-sm shadow-inner shrink-0">
                {user.name[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <h4
                  className={`text-xs font-bold truncate ${
                    darkMode ? "text-white" : "text-brand-text"
                  }`}
                >
                  {user.name}
                </h4>
                <p
                  className={`text-[10px] font-semibold flex items-center space-x-1 mt-0.5 ${
                    darkMode ? "text-[#94A3B8]" : "text-[#64748B]"
                  }`}
                >
                  <Sparkles size={10} className="text-[#3B82F6]" />
                  <span className="capitalize">
                    {user.subscriptionTier || "Free Plan"}
                  </span>
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center transition-all ${
                darkMode
                  ? "hover:bg-white/10 text-[#94A3B8] hover:text-white"
                  : "hover:bg-black/5 text-[#94A3B8] hover:text-[#222]"
              }`}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────── */}
      <div className="p-4 lg:py-6 lg:pr-6 lg:pl-6 flex flex-col flex-1 min-w-0 relative z-10">
        {/* Premium Navbar */}
        <PremiumNavbar
          user={user}
          setSidebarOpen={setSidebarOpen}
          handleLogout={handleLogout}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />

        {/* Page content */}
        <main className="flex-1 pt-6 overflow-y-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
      <HeaderImageWorkspace />
    </div>
  );
}

/* ─────────────────────────────────────────────────
   Premium Navbar Component
───────────────────────────────────────────────── */
function PremiumNavbar({
  user,
  setSidebarOpen,
  handleLogout,
  darkMode,
  toggleDarkMode,
}) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const quickRef = useRef(null);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const emoji = hour < 12 ? "☀️" : hour < 17 ? "👋" : "🌙";
  const firstName = user?.name?.split(" ")[0] || "there";

  // Close on outside click
  useEffect(() => {
    const h = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target))
        setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
      if (quickRef.current && !quickRef.current.contains(e.target))
        setQuickOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const [notifications, setNotifications] = useState([
    {
      icon: "📬",
      title: "New lead captured",
      sub: "Alex Johnson submitted a form",
      time: "2m ago",
    },
    {
      icon: "👁️",
      title: "Card view spike",
      sub: "Your card got 24 views today",
      time: "18m ago",
    },
    {
      icon: "📲",
      title: "QR scan detected",
      sub: "Scanned in New York",
      time: "1h ago",
    },
    {
      icon: "✅",
      title: "Contact saved",
      sub: "Someone saved your contact",
      time: "3h ago",
    },
  ]);

  const quickActions = [
    { label: "New Digital Card", icon: "🪪", href: "/dashboard/cards" },
    { label: "View Analytics", icon: "📊", href: "/dashboard/analytics" },
    { label: "Check Leads", icon: "📬", href: "/dashboard/leads" },
    { label: "Upgrade Plan", icon: "⚡", href: "/dashboard/billing" },
  ];

  /* shared icon button style — dark-mode-aware */
  const iconBtn = darkMode
    ? "w-9 h-9 rounded-xl bg-white/6 border border-white/10 hover:border-[#3B82F6]/40 hover:bg-white/12 flex items-center justify-center text-[#A3A3A3] hover:text-[#3B82F6] transition-all"
    : "w-9 h-9 rounded-xl bg-[#F8FAFC] border border-[rgba(37,99,235,0.08)] hover:border-[#3B82F6]/40 hover:bg-white flex items-center justify-center text-[#7A7A7A] hover:text-[#2563EB] transition-all";

  return (
    <header className="w-full sticky top-4 z-30">
      <div
        className={`backdrop-blur-xl border rounded-[28px] shadow-sm px-3 sm:px-5 py-2.5 sm:py-3.5 flex items-center gap-2 sm:gap-4 transition-colors duration-300 ${
          darkMode
            ? "bg-[#111111]/85 border-white/8 shadow-black/20"
            : "bg-white/80 border-[rgba(37,99,235,0.09)] shadow-[#2563EB]/5"
        }`}
      >
        {/* ── LEFT ─── hamburger + greeting */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-[#F8FAFC] rounded-xl text-[#7A7A7A] hover:text-[#2563EB] transition-colors border border-transparent hover:border-[rgba(37,99,235,0.08)]"
          >
            <Menu size={17} />
          </button>
          <div className="hidden xl:block">
            <p
              className={`text-sm font-black leading-tight whitespace-nowrap ${
                darkMode ? "text-[#F1F5F9]" : "text-inherit"
              }`}
            >
              {greeting}, {firstName} {emoji}
            </p>
            <p
              className={`text-[10px] font-medium mt-0.5 whitespace-nowrap ${
                darkMode ? "text-[#A3A3A3]" : "text-slate-500"
              }`}
            >
              Welcome back! Here&apos;s what&apos;s happening today.
            </p>
          </div>
        </div>

        {/* ── CENTER ── search */}
        <div className="flex-1 max-w-xl mx-auto min-w-0">
          <motion.div
            animate={{ scale: searchFocused ? 1.01 : 1 }}
            transition={{ duration: 0.2 }}
            className={`relative flex items-center rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 transition-all duration-300 border min-w-0 ${
              darkMode
                ? searchFocused
                  ? "bg-white/10 border-[#3B82F6]/50 shadow-md shadow-[#3B82F6]/10"
                  : "bg-white/6 border-white/10 hover:border-white/20"
                : searchFocused
                  ? "border-[#3B82F6]/60 shadow-md shadow-[#3B82F6]/10 bg-white"
                  : "bg-[#F8FAFC] border-[rgba(37,99,235,0.08)] hover:border-[rgba(37,99,235,0.15)]"
            }`}
          >
            <Search
              size={14}
              className={`shrink-0 mr-2 sm:mr-3 transition-colors ${
                searchFocused
                  ? "text-[#3B82F6]"
                  : darkMode
                    ? "text-[#6A5A6A]"
                    : "text-[#B0A090]"
              }`}
            />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search..."
              className={`flex-1 w-full min-w-0 bg-transparent text-[10px] sm:text-xs font-medium focus:outline-none ${
                darkMode
                  ? "text-[#F1F5F9] placeholder-[#6A5A6A]"
                  : "text-inherit placeholder-[#B0A090]"
              }`}
            />
            {!searchFocused && !searchValue && (
              <span
                className={`hidden sm:flex shrink-0 ml-2 text-[9px] font-black border px-2 py-0.5 rounded-md tracking-wider ${
                  darkMode
                    ? "text-[#6A5A6A] bg-white/5 border-white/10"
                    : "text-[#B0A090] bg-[#F0E8DE] border-[#E0D0C0]"
                }`}
              >
                ⌘K
              </span>
            )}
            {searchValue && (
              <button
                onClick={() => setSearchValue("")}
                className={`shrink-0 ml-2 transition-colors ${
                  darkMode
                    ? "text-[#6A5A6A] hover:text-[#3B82F6]"
                    : "text-[#B0A090] hover:text-[#2563EB]"
                }`}
              >
                <X size={12} />
              </button>
            )}
          </motion.div>
        </div>

        {/* ── RIGHT ── action icons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick Create */}
          <div className="relative" ref={quickRef}>
            <motion.button
              onClick={() => setQuickOpen((v) => !v)}
              whileHover={{ scale: 1.08, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="w-9 h-9 rounded-xl bg-linear-to-br from-[#2563EB] to-[#3B82F6] text-white flex items-center justify-center shadow-md shadow-[#2563EB]/25 hover:shadow-lg hover:shadow-[#2563EB]/35 transition-shadow"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path
                  d="M7.5 1.5v12M1.5 7.5h12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </motion.button>
            <AnimatePresence>
              {quickOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-12 w-52 bg-white/95 backdrop-blur-xl border border-[rgba(37,99,235,0.1)] rounded-2xl shadow-xl shadow-[#2563EB]/10 p-2 z-50"
                >
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#B0A090] px-3 py-1.5">
                    Quick Actions
                  </p>
                  {quickActions.map((a) => (
                    <Link
                      key={a.href}
                      href={a.href}
                      onClick={() => setQuickOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-[#F8FAFC] transition-colors group"
                    >
                      <span className="text-base">{a.icon}</span>
                      <span className="text-xs font-semibold text-inherit group-hover:text-[#2563EB]">
                        {a.label}
                      </span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <motion.button
              onClick={() => {
                setNotifOpen((v) => !v);
                setProfileOpen(false);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${iconBtn} relative`}
            >
              <motion.div
                animate={{ rotate: notifOpen ? [0, -15, 15, -10, 10, 0] : 0 }}
                transition={{ duration: 0.5 }}
              >
                <Bell size={15} />
              </motion.div>
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#3B82F6] border border-white">
                  <span className="absolute inset-0 rounded-full bg-[#3B82F6] animate-ping opacity-75" />
                </span>
              )}
            </motion.button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.94, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-12 w-80 bg-white/95 backdrop-blur-xl border border-[rgba(37,99,235,0.1)] rounded-2xl shadow-xl shadow-[#2563EB]/10 p-3 z-50"
                >
                  <div className="flex items-center justify-between px-1 pb-2 border-b border-[#F0E8E0] mb-2">
                    <span className="text-xs font-black text-inherit">
                      Notifications
                    </span>
                    <div className="flex items-center gap-2">
                      {notifications.length > 0 && (
                        <button
                          onClick={() => setNotifications([])}
                          className="text-[9px] font-bold text-[#7A7A7A] hover:text-[#2563EB] underline transition-colors"
                        >
                          Mark all as read
                        </button>
                      )}
                      <span className="text-[9px] font-black text-[#3B82F6] bg-[#3B82F6]/10 px-2 py-0.5 rounded-full">
                        {notifications.length} new
                      </span>
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center">
                        <p className="text-xs font-bold text-[#A3A3A3]">
                          You're all caught up!
                        </p>
                        <p className="text-[10px] text-[#A3A3A3] mt-1">
                          No new notifications.
                        </p>
                      </div>
                    ) : (
                      notifications.map((n, i) => (
                        <div
                          key={i}
                          className="flex items-start space-x-3 p-2.5 rounded-xl hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
                        >
                          <span className="text-lg shrink-0 mt-0.5">
                            {n.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-inherit group-hover:text-[#2563EB] transition-colors">
                              {n.title}
                            </p>
                            <p className="text-[10px] text-[#A3A3A3] truncate">
                              {n.sub}
                            </p>
                          </div>
                          <span className="text-[9px] text-[#A3A3A3] shrink-0">
                            {n.time}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <motion.button
            onClick={toggleDarkMode}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`hidden sm:flex ${iconBtn}`}
            title={darkMode ? "Light mode" : "Dark mode"}
          >
            <motion.span
              key={darkMode ? "moon" : "sun"}
              initial={{ rotate: -30, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              {darkMode ? (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              ) : (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              )}
            </motion.span>
          </motion.button>

          {/* Workspace Switcher */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`hidden md:flex items-center space-x-2 px-3 py-2 rounded-xl cursor-pointer transition-all group ${
              darkMode
                ? "bg-white/6 border border-white/10 hover:border-[#3B82F6]/40 hover:bg-white/12"
                : "bg-[#F8FAFC] border border-[rgba(37,99,235,0.08)] hover:border-[#3B82F6]/40 hover:bg-white"
            }`}
          >
            <div className="w-5 h-5 rounded-md bg-linear-to-br from-[#2563EB] to-[#3B82F6] flex items-center justify-center text-white text-[8px] font-black shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <span
              className={`text-[10px] font-black max-w-[80px] truncate transition-colors ${
                darkMode
                  ? "text-[#F1F5F9] group-hover:text-[#3B82F6]"
                  : "text-inherit group-hover:text-[#2563EB]"
              }`}
            >
              {user?.organizationId ? "Team Workspace" : "Personal"}
            </span>
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              className={`shrink-0 ${darkMode ? "text-white/40" : "text-[#B0A090]"}`}
            >
              <path
                d="M2 4l3 3 3-3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>

          {/* Profile Avatar */}
          <div className="relative" ref={profileRef}>
            <motion.button
              onClick={() => {
                setProfileOpen((v) => !v);
                setNotifOpen(false);
              }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              className="relative w-9 h-9 rounded-xl bg-linear-to-br from-[#2563EB] to-[#3B82F6] flex items-center justify-center font-black text-white text-sm shadow-md shadow-[#2563EB]/20 hover:shadow-lg hover:shadow-[#2563EB]/30 transition-all cursor-pointer"
            >
              {user?.name?.[0]?.toUpperCase()}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-white" />
            </motion.button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.94, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-12 w-60 bg-white/95 backdrop-blur-xl border border-[rgba(37,99,235,0.1)] rounded-2xl shadow-xl shadow-[#2563EB]/10 overflow-hidden z-50"
                >
                  {/* Header */}
                  <div className="p-4 bg-linear-to-br from-slate-50 to-slate-100/40 dark:from-slate-900 dark:to-slate-950/40 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#2563EB] to-[#3B82F6] flex items-center justify-center font-black text-white shadow-md">
                        {user?.name?.[0]?.toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-inherit truncate">
                          {user?.name}
                        </p>
                        <p className="text-[9px] text-slate-500 dark:text-slate-400 truncate">
                          {user?.email}
                        </p>
                        <span className="inline-flex items-center space-x-1 mt-0.5 text-[8px] bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 px-2 py-0.5 rounded-full font-black capitalize">
                          <Sparkles size={7} />
                          <span>{user?.subscriptionTier || "free"} plan</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="p-2">
                    {[
                      {
                        label: "My Profile",
                        icon: "👤",
                        href: `/${user?.slug || ""}`,
                      },
                      {
                        label: "Settings",
                        icon: "⚙️",
                        href: "/dashboard/billing",
                      },
                      {
                        label: "Billing",
                        icon: "💳",
                        href: "/dashboard/billing",
                      },
                      { label: "Support", icon: "🛟", href: "/support" },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-[#F8FAFC] transition-colors group"
                      >
                        <span className="text-sm">{item.icon}</span>
                        <span className="text-xs font-semibold text-inherit group-hover:text-[#2563EB] transition-colors">
                          {item.label}
                        </span>
                      </Link>
                    ))}
                    <div className="border-t border-[#F0E8E0] mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors group cursor-pointer"
                      >
                        <span className="text-sm">🚪</span>
                        <span className="text-xs font-semibold text-[#6E6E6E] group-hover:text-red-600 transition-colors">
                          Sign Out
                        </span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

