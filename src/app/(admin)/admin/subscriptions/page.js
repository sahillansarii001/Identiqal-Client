'use client';

import React from 'react';
import { CreditCard } from 'lucide-react';

export default function AdminSubscriptionsPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Subscriptions</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage user and organization subscription plans.</p>
      </div>
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl p-16 text-center shadow-sm">
        <CreditCard size={40} className="mx-auto mb-4 text-gray-300" />
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Subscription Management</h3>
        <p className="text-xs text-gray-500 mt-2 max-w-sm mx-auto">Subscription plans and billing management will be connected here once a payment gateway (Stripe) is integrated. Individual transaction history is available in the Payments tab.</p>
      </div>
    </div>
  );
}
