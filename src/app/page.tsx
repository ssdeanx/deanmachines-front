import Link from "next/link"
import { HeroSection } from "@/components/sections/HeroSection"
import { FeatureGrid } from "@/components/sections/FeatureGrid"
import { PricingTable } from "@/components/sections/PricingTable"
import { TestimonialSlider } from "@/components/sections/TestimonialSlider"
import { TeamSection } from "@/components/sections/TeamSection"
import { FaqAccordion } from "@/components/sections/FaqAccordion"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeatureGrid />
      <TestimonialSlider />
      <PricingTable />
      <TeamSection />
      <FaqAccordion />

      {/* CTA Section */}
      <section className="bg-primary/5 py-24 sm:py-32">
        <div className="container">
          <div className="relative isolate overflow-hidden rounded-3xl bg-primary px-6 py-24 text-center shadow-2xl sm:px-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-background sm:text-4xl">
              Start Building with Mastra AI Today
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-background/80">
              Join thousands of developers creating the next generation of AI-powered applications.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/docs"
                className={cn(
                  buttonVariants(),
                  "bg-background text-primary hover:bg-background/90"
                )}
              >
                Get Started
              </Link>
              <Link
                href="/contact"
                className="text-sm font-semibold leading-6 text-background hover:text-background/90"
              >
                Contact Sales <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
