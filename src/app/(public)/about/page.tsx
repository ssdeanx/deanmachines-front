import { Metadata } from "next"
import { GraduationCap, Users, Heart, Target } from "lucide-react"

import { siteConfig } from "@/config/site"
import { TeamSection } from "@/components/sections/TeamSection"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: `About Us - ${siteConfig.name}`,
  description: "Learn more about our mission, values, and the team behind deanmachines.",
}

const values = [
  {
    icon: Target,
    title: "Mission",
    description: "To democratize AI development by providing powerful, accessible tools for builders and creators.",
  },
  {
    icon: Heart,
    title: "Values",
    description: "We believe in transparency, ethical AI development, and putting our community first.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Building a diverse, inclusive community of developers and innovators shaping the future of AI.",
  },
  {
    icon: GraduationCap,
    title: "Innovation",
    description: "Continuously pushing boundaries while ensuring responsible AI development practices.",
  },
]

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 text-center space-y-12 bg-gray-900 text-gray-100">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto py-12 md:py-20">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-5xl lg:text-6xl">
          Building the Future of AI
        </h1>
        <p className="mt-6 text-lg text-gray-300 md:text-xl">
          {siteConfig.description}
        </p>
      </section>

      <Separator className="my-8 bg-gray-700" />

      {/* Values Section */}
      <section className="py-12 md:py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold md:text-3xl">Our Values</h2>
          <p className="mt-4 text-gray-400">
            The principles that guide everything we do.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => (
            <Card key={index} className="bg-gray-800 shadow-lg transition hover:shadow-2xl">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="rounded-lg bg-primary/10 p-3">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold">{value.title}</h3>
                <p className="mt-2 text-sm text-gray-400">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-8 bg-gray-700" />

      {/* Team Section */}
      <TeamSection />
    </div>
  )
}