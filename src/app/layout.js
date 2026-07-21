import Providers from "./providers.js";
import "./globals.css";

import PageTransition from "@/components/ui/PageTransition.jsx";

export const metadata = {
  title: "Identiqal — Configurable Smart Business Cards",
  description:
    "Design and share professional, interactive, digital business cards with contact forms, custom themes, and deep visitor analytics.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full font-sans bg-zinc-50 text-slate-900 flex flex-col">
        <Providers>
          <PageTransition>{children}</PageTransition>
        </Providers>
      </body>
    </html>
  );
}
