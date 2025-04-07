'use client';
import * as React from "react"
import { ArrowRight, Github } from "lucide-react"

import { CallToAction } from "@/components/common/CallToAction"

const highlights = [
  "Build AI agents that understand context",
  "Deploy to any cloud platform",
  "Scale with your needs",
  "Monitor performance in real-time",
]

export function HeroSection() {
  return (
    <section className="relative isolate pt-14">
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="py-24 sm:py-32 lg:pb-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-heading tracking-tight sm:text-6xl lg:text-7xl">
              <span className="inline-block animate-fade-in-up">Build AI Agents with</span>{" "}
              <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-600 bg-clip-text text-transparent">
                Mastra
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground animate-fade-in-up [animation-delay:200ms]">
              Create, deploy, and scale AI agents with our powerful platform. From simple
              automations to complex workflows, Mastra handles it all.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 animate-fade-in-up [animation-delay:400ms]">
              <CallToAction
                title="Get Started"
                href="/docs"
                className="rounded-full px-8"
              />
              <CallToAction
                title="View on GitHub"
                href="https://github.com/yourusername/mastra"
                variant="outline"
                icon={Github}
                external
                className="rounded-full px-8"
              />
            </div>
          </div>

          <div className="mt-16 flow-root animate-fade-in-up [animation-delay:600ms]">
            <div className="m-2 rounded-xl bg-background/5 p-2 ring-1 ring-inset ring-background/10 lg:m-4 lg:rounded-2xl lg:p-4">
              <div className="rounded-lg bg-background/80 backdrop-blur">
                <dl className="grid grid-cols-1 gap-x-8 gap-y-10 p-8 sm:grid-cols-2 lg:grid-cols-4">
                  {highlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="relative group pl-9"
                    >
                      <div className="flex items-center">
                        <div className="absolute left-0 flex h-6 w-6 items-center justify-center rounded-lg bg-primary group-hover:bg-primary/90">
                          <ArrowRight className="h-4 w-4 text-background" aria-hidden="true" />
                        </div>
                        <dt className="ml-2 text-sm font-semibold leading-6">
                          {highlight}
                        </dt>
                      </div>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </section>
  )
}
