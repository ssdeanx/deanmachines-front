import * as React from "react"
import {
  Brain,
  Cloud,
  Code2,
  Command,
  Database,
  LineChart,
  Shield,
  Zap,
  type LucideIcon,
} from "lucide-react"

import { IconWrapper } from "@/components/common/IconWrapper"

interface Feature {
  title: string
  description: string
  icon: LucideIcon
}

const features: Feature[] = [
  {
    title: "AI-Powered Agents",
    description: "Build intelligent agents that learn and adapt using state-of-the-art machine learning models.",
    icon: Brain,
  },
  {
    title: "Cloud Native",
    description: "Deploy anywhere with our cloud-agnostic infrastructure and seamless scaling capabilities.",
    icon: Cloud,
  },
  {
    title: "Developer Experience",
    description: "Comprehensive APIs and SDKs make integration and customization straightforward.",
    icon: Code2,
  },
  {
    title: "Command Center",
    description: "Manage all your AI agents from a single, intuitive dashboard with real-time monitoring.",
    icon: Command,
  },
  {
    title: "Persistent Memory",
    description: "Agents maintain context and learn from interactions with built-in memory management.",
    icon: Database,
  },
  {
    title: "Advanced Analytics",
    description: "Track agent performance and behavior with detailed analytics and insights.",
    icon: LineChart,
  },
  {
    title: "Enterprise Security",
    description: "Bank-grade security with end-to-end encryption and comprehensive audit logs.",
    icon: Shield,
  },
  {
    title: "High Performance",
    description: "Optimized for speed and efficiency with distributed processing capabilities.",
    icon: Zap,
  },
]

export function FeatureGrid() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="bg-background py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="features-heading"
            className="font-heading text-3xl tracking-tight sm:text-4xl"
          >
            Everything you need to build AI Agents
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            A comprehensive platform for creating, deploying, and scaling intelligent AI agents
            that deliver real value.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative transition-all hover:scale-105"
              >
                <dt className="text-base font-semibold leading-7">
                  <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <IconWrapper
                      icon={feature.icon}
                      className="h-6 w-6 text-background"
                      aria-hidden="true"
                    />
                  </div>
                  {feature.title}
                </dt>
                <dd className="mt-2 text-base leading-7 text-muted-foreground">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
