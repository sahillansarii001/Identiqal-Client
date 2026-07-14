import React from 'react';
import Link from 'next/link';
import { CreditCard } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          {/* Logo & copyright */}
          <div className="flex items-center space-x-2 text-slate-400">
            <CreditCard className="text-blue-500" size={18} />
            <span className="text-sm font-semibold tracking-tight text-slate-350">Identiqal</span>
            <span className="text-xs text-slate-500">| © {new Date().getFullYear()} Identiqal Inc. All rights reserved.</span>
          </div>

          {/* Links */}
          <div className="flex space-x-6 text-xs text-slate-500">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="/support" className="hover:text-slate-300 transition-colors">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
