import { Navbar } from '@/components/marketing/Navbar.jsx';
import { Hero } from '@/components/marketing/Hero.jsx';
import { LogoStrip } from '@/components/marketing/LogoStrip.jsx';
import { SectionShowcase } from '@/components/marketing/SectionShowcase.jsx';
import { HowItWorks } from '@/components/marketing/HowItWorks.jsx';
import { LivePreview } from '@/components/marketing/LivePreview.jsx';
import { ProblemFraming } from '@/components/marketing/ProblemFraming.jsx';
import { AIFeatures } from '@/components/marketing/AIFeatures.jsx';
import { Testimonials } from '@/components/marketing/Testimonials.jsx';
import { PricingTeaser } from '@/components/marketing/PricingTeaser.jsx';
import { FinalCTA } from '@/components/marketing/FinalCTA.jsx';
import { Footer } from '@/components/marketing/Footer.jsx';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F6] text-[#1F1F1F]">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <LogoStrip />
        <SectionShowcase />
        <HowItWorks />
        <LivePreview />
        <ProblemFraming />
        <AIFeatures />
        <Testimonials />
        <PricingTeaser />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
