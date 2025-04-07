import * as React from "react"
import { type Metadata } from "next"
import { ArrowRight } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { TeamSection } from "@/components/sections/TeamSection"
import { Breadcrumb } from "@/components/common/breadcrumb"

export const metadata: Metadata = {
  title: "About - Mastra AI",
  description: "Learn about our mission to revolutionize AI agent development and meet the team behind Mastra AI.",
}

export default function AboutPage() {
  return (
    <>
      <div className="container py-10">
        <Breadcrumb
          items={[{ title: "About" }]}
          className="mb-8"
        />

        <div className="mx-auto max-w-4xl">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl">
            Building the Future of AI Agents
          </h1>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold">Our Mission</h2>
              <p className="mt-4 text-muted-foreground">
                At Mastra AI, we&apos;re revolutionizing how businesses interact with artificial intelligence.
                Our platform empowers developers and companies to build, deploy, and scale intelligent
                AI agents that understand context and adapt to specific needs.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Our Vision</h2>
              <p className="mt-4 text-muted-foreground">
                We envision a future where AI agents are seamlessly integrated into every business workflow,
                making complex tasks simple and enabling human-AI collaboration that drives innovation and growth.
              </p>
            </div>
          </div>

          <Separator className="my-12" />

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border p-6">
              <div className="text-4xl font-bold text-primary">50K+</div>
              <p className="mt-2 text-muted-foreground">Active Agents</p>
            </div>
            <div className="rounded-lg border p-6">
              <div className="text-4xl font-bold text-primary">1M+</div>
              <p className="mt-2 text-muted-foreground">API Requests Daily</p>
            </div>
            <div className="rounded-lg border p-6">
              <div className="text-4xl font-bold text-primary">500+</div>
              <p className="mt-2 text-muted-foreground">Enterprise Clients</p>
            </div>
          </div>

          <Separator className="my-12" />

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Our Values</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  title: "Innovation First",
                  description: "We push the boundaries of what's possible with AI technology.",
                },
                {
                  title: "Security & Privacy",
                  description: "We prioritize the protection of our clients' data and systems.",
                },
                {
                  title: "User-Centric Design",
                  description: "We build solutions that are powerful yet intuitive to use.",
                },
                {
                  title: "Continuous Learning",
                  description: "We evolve with the rapidly changing AI landscape.",
                },
              ].map((value) => (
                <div key={value.title} className="flex items-start space-x-4">
                  <ArrowRight className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                  <div>
                    <h3 className="font-semibold">{value.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <TeamSection />
    </>
  )
}
