'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore.js';
import { Button } from '@/components/ui/Button.jsx';
import { axiosInstance } from '@/services/axiosInstance.js';
import {
  Wallet,
  Check,
  Zap,
  ShieldCheck,
  Compass,
} from 'lucide-react';

export default function BillingPage() {
  const { user } = useAuthStore();
  const [loadingTier, setLoadingTier] = useState('');

  const handleUpgrade = async (tier) => {
    setLoadingTier(tier);
    try {
      // Create checkout session using axios directly or helper
      // Wait, we defined process.env.NEXT_PUBLIC_API_URL or defaults.
      // We can use axiosInstance we defined in services/axiosInstance.js:
      // Import axiosInstance and post:
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/billing/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${useAuthStore.getState().accessToken}`
        },
        body: JSON.stringify({ tier })
      });
      const resData = await response.json();
      
      if (resData.success && resData.data?.checkoutUrl) {
        // Redirect to checkout portal URL
        window.open(resData.data.checkoutUrl, '_blank');
      } else {
        alert(resData.message || 'Checkout failed');
      }
    } catch (e) {
      alert('Checkout failed: ' + e.message);
    } finally {
      setLoadingTier('');
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Free Starter',
      price: '$0',
      description: 'Standard networking features.',
      features: ['1 Active business card', 'Standard styling colors', 'Views/clicks logging'],
    },
    {
      id: 'pro',
      name: 'Professional Pro',
      price: '$9',
      period: '/mo',
      description: 'Personalized branding tools.',
      features: ['Unlimited digital cards', 'Full custom design controls', 'CSV log download support', 'Priority QR generation'],
    },
    {
      id: 'business',
      name: 'Corporate Business',
      price: '$29',
      period: '/mo',
      description: 'Organization workspaces.',
      features: ['Includes 10 user seats', 'Centralized theme locking', 'Invite member controllers', 'Aggregated team metrics'],
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-xl font-extrabold text-slate-900">Billing & Subscriptions</h1>
        <p className="text-xs text-slate-500">Upgrade your plan to unlock premium branding tools, team seats, and CSV downloads.</p>
      </div>

      {/* Active tier card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl z-0" />
        <div className="relative z-10 flex items-center space-x-4">
          <div className="w-12 h-12 bg-indigo-650 rounded-2xl flex items-center justify-center font-bold text-slate-100 text-lg shadow-md">
            <Zap size={22} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Active Plan Tier</h4>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-lg font-black text-slate-900 capitalize">{user?.subscriptionTier}</span>
              <span className="text-[10px] bg-green-50 border border-green-200 text-green-700 px-2 py-0.5 rounded-full font-bold flex items-center space-x-1">
                <ShieldCheck size={10} />
                <span>Active Account</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Plans comparison cards */}
      <div className="grid md:grid-cols-3 gap-6 pt-4">
        {plans.map((p) => {
          const isActive = user?.subscriptionTier === p.id;
          return (
            <div
              key={p.id}
              className={`p-6 border rounded-2xl flex flex-col justify-between space-y-6 relative transition-all duration-200 bg-white ${
                isActive
                  ? 'border-indigo-500 shadow-lg bg-indigo-50/10'
                  : 'border-slate-200 shadow-sm hover:border-slate-350'
              }`}
            >
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
                  <span>{p.name}</span>
                  {isActive && <span className="text-[9px] bg-indigo-50 border border-indigo-200 text-indigo-700 px-1.5 py-0.5 rounded-md font-bold uppercase">Current</span>}
                </h3>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-black text-slate-900">{p.price}</span>
                  {p.period && <span className="text-[10px] text-slate-500">{p.period}</span>}
                </div>
                <p className="text-[11px] text-slate-650">{p.description}</p>
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  {p.features.map((f, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-[10px] text-slate-600">
                      <Check size={12} className="text-indigo-600 mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {!isActive && p.id !== 'free' && (
                <Button
                  onClick={() => handleUpgrade(p.id)}
                  isLoading={loadingTier === p.id}
                  className="w-full justify-center text-xs py-2"
                >
                  Upgrade to {p.name.split(' ')[0]}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
