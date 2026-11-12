import { CtaBand } from "@/components/marketing/cta-band";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { ImpactSection } from "@/components/marketing/impact-section";
import { OrganizationsSection } from "@/components/marketing/organizations-section";
import { ProblemSection } from "@/components/marketing/problem-section";
import { StudentsSection } from "@/components/marketing/students-section";
import { WhyBridgeFund } from "@/components/marketing/why-bridgefund";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <HowItWorks />
      <WhyBridgeFund />
      <StudentsSection />
      <OrganizationsSection />
      <ImpactSection />
      <CtaBand />
    </>
  );
}
