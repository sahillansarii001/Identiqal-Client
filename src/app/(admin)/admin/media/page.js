'use client';

import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

export default function AdminMediaPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Media</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage platform media assets and uploads.</p>
      </div>
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl p-16 text-center shadow-sm">
        <ImageIcon size={40} className="mx-auto mb-4 text-gray-300" />
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Media Library</h3>
        <p className="text-xs text-gray-500 mt-2 max-w-sm mx-auto">A centralised media library will be available here once cloud storage (e.g., AWS S3, Cloudinary) is integrated into the platform for user profile photos and card assets.</p>
      </div>
    </div>
  );
}
