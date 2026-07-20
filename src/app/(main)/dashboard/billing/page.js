"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/store/authStore.js";
import {
  Check,
  Zap,
  ShieldCheck,
  Sparkles,
  Crown,
  Building2,
  ArrowUpRight,
  Star,
} from "lucide-react";

export default function BillingPage() {
  const { user } = useAuthStore();
  const [loadingTier, setLoadingTier] = useState("");

  const handleUpgrade = async (tier) => {
    setLoadingTier(tier);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/billing/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
          },
          body: JSON.stringify({ tier }),
        },
      );
      const resData = await response.json();
      if (resData.success && resData.data?.checkoutUrl) {
        window.open(resData.data.checkoutUrl, "_blank");
      } else {
        alert(resData.message || "Checkout failed");
      }
    } catch (e) {
      alert("Checkout failed: " + e.message);
    } finally {
      setLoadingTier("");
    }
  };

  const currentTier = user?.subscriptionTier || "free";

  const plans = [
    {
      id: "free",
      name: "Starter",
      price: "$0",
      tagline: "Get started for free",
      icon: Zap,
      features: [
        "1 active digital card",
        "Standard styling palette",
        "View & click tracking",
        "Basic QR code",
      ],
    },
    {
      id: "pro",
      name: "Professional",
      price: "$9",
      period: "/mo",
      tagline: "For serious networkers",
      icon: Sparkles,
      highlight: true,
      features: [
        "Unlimited digital cards",
        "Full custom design controls",
        "CSV lead export downloads",
        "Priority QR generation",
        "Advanced analytics",
      ],
    },
    {
      id: "business",
      name: "Business",
      price: "$29",
      period: "/mo",
      tagline: "For teams & organizations",
      icon: Building2,
      features: [
        "10 team member seats",
        "Centralized theme locking",
        "Invite & role controls",
        "Aggregated team analytics",
        "Priority support",
      ],
    },
  ];

  return (
    <div className="space-y-10 w-full pb-12">
      {/* Page Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
          Account
        </span>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
          Billing &amp; Subscriptions
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Upgrade to unlock premium branding tools, team seats, and CSV exports.
        </p>
      </div>

      {/* Active Plan Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 p-8 shadow-xl shadow-blue-900/30">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-400/20 blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-16 left-10 w-48 h-48 rounded-full bg-white/5 blur-[60px] pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <Crown size={28} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/60">
                Your Current Plan
              </p>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-2xl font-black text-white capitalize">
                  {currentTier === "free"
                    ? "Free Starter"
                    : currentTier === "pro"
                      ? "Professional"
                      : "Business"}
                </span>
                <span className="inline-flex items-center space-x-1 text-[9px] bg-green-400/20 border border-green-400/30 text-green-300 px-2.5 py-1 rounded-full font-black">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span>Active</span>
                </span>
              </div>
              <p className="text-[11px] text-white/60 mt-1">
                {currentTier === "free"
                  ? "Upgrade to unlock unlimited cards and full branding controls."
                  : "Your plan is active and all features are unlocked."}
              </p>
            </div>
          </div>

          {currentTier === "free" && (
            <button
              onClick={() => handleUpgrade("pro")}
              className="shrink-0 inline-flex items-center space-x-2 bg-white hover:bg-slate-100 text-blue-700 font-bold text-sm px-6 py-3 rounded-2xl transition-all cursor-pointer shadow-md"
            >
              <Sparkles size={15} />
              <span>Upgrade to Pro</span>
              <ArrowUpRight size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Plans Grid */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-5">
          Available Plans
        </p>

        <div className="grid md:grid-cols-3 gap-5">
          {plans.map((p) => {
            const isActive = currentTier === p.id;
            const Icon = p.icon;

            return (
              <div
                key={p.id}
                className={`relative flex flex-col rounded-3xl border p-6 transition-all duration-300 ${
                  p.highlight
                    ? "border-blue-500/50 shadow-xl shadow-blue-500/10 bg-white dark:bg-slate-900"
                    : isActive
                      ? "border-blue-400/30 shadow-md bg-white dark:bg-slate-900/80"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md"
                }`}
              >
                {/* Most popular badge */}
                {p.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md shadow-blue-600/30">
                      <Star size={8} fill="currentColor" />
                      <span>Most Popular</span>
                    </span>
                  </div>
                )}

                {/* Icon row */}
                <div className="flex items-start justify-between mb-5">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      p.highlight
                        ? "bg-blue-100 dark:bg-blue-500/20"
                        : p.id === "business"
                          ? "bg-indigo-100 dark:bg-indigo-500/15"
                          : "bg-slate-100 dark:bg-slate-800"
                    }`}
                  >
                    <Icon
                      size={20}
                      className={
                        p.highlight
                          ? "text-blue-600 dark:text-blue-400"
                          : p.id === "business"
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-slate-500 dark:text-slate-400"
                      }
                    />
                  </div>
                  {isActive && (
                    <span className="text-[9px] bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full font-black uppercase tracking-wider">
                      Current
                    </span>
                  )}
                </div>

                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {p.name}
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 mb-4">
                  {p.tagline}
                </p>

                {/* Price */}
                <div className="flex items-baseline space-x-1 mb-5">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">
                    {p.price}
                  </span>
                  {p.period && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                      {p.period}
                    </span>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-2.5 pb-6 border-b border-slate-100 dark:border-slate-800 flex-1">
                  {p.features.map((f, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-2.5 text-[11px] text-slate-700 dark:text-slate-300"
                    >
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                          p.highlight
                            ? "bg-blue-100 dark:bg-blue-500/20"
                            : "bg-slate-100 dark:bg-slate-800"
                        }`}
                      >
                        <Check
                          size={9}
                          className={
                            p.highlight
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-slate-500 dark:text-slate-400"
                          }
                        />
                      </div>
                      <span className="font-medium">{f}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="pt-5">
                  {isActive ? (
                    <div className="w-full py-2.5 rounded-xl text-xs font-bold text-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                      ✓ Your Current Plan
                    </div>
                  ) : p.id === "free" ? (
                    <div className="w-full py-2.5 rounded-xl text-xs font-bold text-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                      Free Forever
                    </div>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(p.id)}
                      disabled={loadingTier === p.id}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                        p.highlight
                          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20"
                          : "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-blue-600 hover:border-blue-600 hover:text-white text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {loadingTier === p.id ? (
                        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Upgrade to {p.name}</span>
                          <ArrowUpRight size={12} />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust strip */}
      <div className="flex flex-wrap items-center justify-center gap-6 py-6 border-t border-slate-200 dark:border-slate-800">
        {[
          {
            icon: ShieldCheck,
            label: "Secure Payments",
            sub: "SSL encrypted checkout",
          },
          {
            icon: Zap,
            label: "Instant Activation",
            sub: "Upgrade goes live immediately",
          },
          {
            icon: Crown,
            label: "Cancel Anytime",
            sub: "No long-term commitments",
          },
        ].map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex items-center space-x-3 text-left">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
              <Icon size={15} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">{label}</p>
              <p className="text-[9px] text-slate-500 dark:text-slate-400">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
