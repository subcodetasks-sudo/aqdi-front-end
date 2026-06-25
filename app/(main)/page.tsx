import AppSection from "@/features/app/components/app-section";
import AdvantagesSection from "@/features/advantages/components/advantages-section";
import FaqSectionBoundary from "@/features/faq/components/faq-section-boundary";
import HeroSection from "@/features/home/components/hero-section";
import TrustedEntitiesSection from "@/features/home/components/trusted-entities-section";
import PricingSection from "@/features/pricing/components/pricing-section";
import ServicesSection from "@/features/services/components/services-section";
import SupportSection from "@/features/support/components/support-section";


export default async function Home() {
  

  return (
<main >
  <HeroSection />
  <TrustedEntitiesSection />
  <ServicesSection />
  <AdvantagesSection />
  <PricingSection />
  <SupportSection />
  <AppSection />
  <FaqSectionBoundary />
</main>
  );
}
