import AboutBeneficiariesSection from "@/features/about/components/about-beneficiaries-section";
import AboutCoreValuesSection from "@/features/about/components/about-core-values-section";
import AboutValuesSection from "@/features/about/components/about-values-section";
import NumbersSection from "@/features/about/components/numbers-section";
import WhoWeAre from "@/features/about/components/who-we-are";
import SupportSection from "@/features/support/components/support-section";

export default function AboutPage() {
  return (
    <div>
      <WhoWeAre />
      <NumbersSection />
      <AboutValuesSection />
      <AboutBeneficiariesSection />
      <AboutCoreValuesSection />
      <SupportSection />
    </div>
  );
}
