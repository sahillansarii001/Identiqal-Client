import { Inter } from 'next/font/google';
import Providers from './providers.js';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata = {
  title: 'Identiqal — Configurable Smart Business Cards',
  description: 'Design and share professional, interactive, digital business cards with contact forms, custom themes, and deep visitor analytics.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full font-sans bg-zinc-50 text-slate-900 flex flex-col">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
