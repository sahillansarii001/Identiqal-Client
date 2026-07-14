import { Navbar } from '../components/marketing/Navbar.jsx';
import { Hero } from '../components/marketing/Hero.jsx';
import { ProblemFraming } from '../components/marketing/ProblemFraming.jsx';
import { HowItWorks } from '../components/marketing/HowItWorks.jsx';
import { SectionShowcase } from '../components/marketing/SectionShowcase.jsx';
import { PricingTeaser } from '../components/marketing/PricingTeaser.jsx';
import { Footer } from '../components/marketing/Footer.jsx';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ProblemFraming />
        <HowItWorks />
        <SectionShowcase />
        <PricingTeaser />
      </main>
      <Footer />
    </div>
  );
}
