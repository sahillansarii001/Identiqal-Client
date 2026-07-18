'use client';

import React from 'react';
import { LifeBuoy } from 'lucide-react';

export default function AdminSupportPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Support</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage user support tickets and help requests.</p>
      </div>
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl p-16 text-center shadow-sm">
        <LifeBuoy size={40} className="mx-auto mb-4 text-gray-300" />
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Support Tickets</h3>
        <p className="text-xs text-gray-500 mt-2 max-w-sm mx-auto">A ticketing system will be available here once a Support model is created. Admins will be able to view, respond to, and close user help requests directly from the dashboard.</p>
      </div>
    </div>
  );
}
