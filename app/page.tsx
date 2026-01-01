import { LandingHeader } from "@/components/landing/LandingHeader"
import { HeroSection } from "@/components/landing/HeroSection"
import { FeaturesSection } from "@/components/landing/FeaturesSection"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { PricingSection } from "@/components/landing/PricingSection"
import { LandingFooter } from "@/components/landing/LandingFooter"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <PricingSection />
      </main>
      <LandingFooter />
    </div>
  )
}
