import * as React from "react"
import { type Metadata } from "next"
import { Brain, Cloud, Code2, Lock, Settings, Users } from "lucide-react"

import { Breadcrumb } from "@/components/common/breadcrumb"
import { ServiceCard } from "@/components/sections/ServiceCard"
import { PricingTable } from "@/components/sections/PricingTable"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Services - Mastra AI",
  description: "Explore our AI agent development services and solutions for businesses of all sizes.",
}

const services = [
  {
    title: "Custom Agent Development",
    description: "Tailored AI agents designed specifically for your business needs",
    icon: Brain,
    features: [
      "Custom AI model training",
      "Domain-specific knowledge integration",
      "Workflow automation",
      "Performance optimization",
    ],
  },
  {
    title: "Cloud Deployment",
    description: "Seamless deployment and scaling of your AI agents",
    icon: Cloud,
    features: [
      "Multi-cloud support",
      "Auto-scaling configuration",
      "Load balancing",
      "Monitoring and alerts",
    ],
  },
  {
    title: "Enterprise Integration",
    description: "Integrate AI agents with your existing systems",
    icon: Settings,
    features: [
      "API development",
      "Legacy system integration",
      "Data migration",
      "Custom connectors",
    ],
  },
  {
    title: "Security Implementation",
    description: "Enterprise-grade security for your AI systems",
    icon: Lock,
    features: [
      "End-to-end encryption",
      "Access control",
      "Audit logging",
      "Compliance support",
    ],
  },
  {
    title: "Developer Support",
    description: "Comprehensive support for your development team",
    icon: Code2,
    features: [
      "Technical consultation",
      "Code reviews",
      "Best practices guidance",
      "Performance optimization",
    ],
  },
  {
    title: "Team Training",
    description: "Training and workshops for your team",
    icon: Users,
    features: [
      "Platform onboarding",
      "Best practices workshops",
      "Custom training sessions",
      "Ongoing support",
    ],
  },
]

export default function ServicesPage() {
  return (
    <div className="container py-10">
      <Breadcrumb
        items={[{ title: "Services" }]}
        className="mb-8"
      />

      <div className="mx-auto max-w-5xl">
        <h1 className="font-heading text-4xl">Our Services</h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Comprehensive solutions for AI agent development and deployment
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              icon={service.icon}
              features={service.features}
            />
          ))}
        </div>

        <Separator className="my-20" />

        <div className="text-center">
          <h2 className="font-heading text-3xl">Pricing Plans</h2>
          <p className="mt-4 text-muted-foreground">
            Choose the perfect plan for your business needs
          </p>
        </div>

        <div className="mt-12">
          <PricingTable />
        </div>

        <div className="mt-20 rounded-lg border bg-card p-8 text-card-foreground">
          <h3 className="text-2xl font-semibold">Need a Custom Solution?</h3>
          <p className="mt-2 text-muted-foreground">
            We work with enterprises to develop custom AI solutions tailored to specific needs.
            Our team will analyze your requirements and create a comprehensive proposal.
          </p>
          <div className="mt-6">
            <a
              href="/contact"
              className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/90"
            >
              Contact Our Sales Team
              <span aria-hidden="true" className="ml-2">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
