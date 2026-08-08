import { Footer } from "@/components/layout/Footer";
import { LandingHeader } from "@/components/layout/LandingHeader";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingProcess } from "@/components/landing/LandingProcess";
import { LandingProviders } from "@/components/landing/LandingProviders";
import { LandingFaq } from "@/components/landing/LandingFaq";
import { LandingCta } from "@/components/landing/LandingCta";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingProcess />
        <LandingProviders />
        <LandingFaq />
        <LandingCta />
      </main>
      <Footer />
    </div>
  );
}
