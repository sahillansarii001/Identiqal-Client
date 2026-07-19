import { Navbar } from "@/components/marketing/Navbar";
import { Hero } from "@/components/marketing/Hero";
import { LogoStrip } from "@/components/marketing/LogoStrip";

import { HowItWorks } from "@/components/marketing/HowItWorks";
import { LivePreview } from "@/components/marketing/LivePreview";

import { AIFeatures } from "@/components/marketing/AIFeatures";
import { Testimonials } from "@/components/marketing/Testimonials";
import { PricingTeaser } from "@/components/marketing/PricingTeaser";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { Footer } from "@/components/marketing/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <LogoStrip />

        <HowItWorks />
        <LivePreview />

        <AIFeatures />
        <Testimonials />
        <PricingTeaser />
        <FinalCTA />
        <Footer />
      </main>
    </div>
  );
}

