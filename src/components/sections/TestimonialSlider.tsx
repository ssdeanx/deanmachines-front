'use client';
import * as React from "react"
import { type CarouselApi } from "@/components/ui/carousel"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Testimonial {
  quote: string
  author: string
  title: string
  avatar: string
  company?: string
}

const testimonials: Testimonial[] = [
  {
    quote: "Mastra AI has transformed how we handle customer support. Our agents now understand context and provide more accurate responses.",
    author: "Sarah Chen",
    title: "CTO",
    company: "TechCorp",
    avatar: "/avatars/sarah.jpg",
  },
  {
    quote: "The ability to deploy agents anywhere has made scaling our AI operations effortless. Their platform is a game-changer.",
    author: "Michael Rodriguez",
    title: "Head of AI",
    company: "DataFlow",
    avatar: "/avatars/michael.jpg",
  },
  {
    quote: "Integration was smooth, and the documentation is excellent. Our dev team was able to get started quickly.",
    author: "Emma Thompson",
    title: "Lead Developer",
    company: "AI Solutions",
    avatar: "/avatars/emma.jpg",
  },
  {
    quote: "The memory management system is incredible. Our agents maintain context across sessions, making interactions feel natural.",
    author: "David Park",
    title: "AI Architect",
    company: "Innovation Labs",
    avatar: "/avatars/david.jpg",
  },
]

export function TestimonialSlider() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="bg-background py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2
            id="testimonials-heading"
            className="text-3xl font-heading tracking-tight sm:text-4xl"
          >
            Trusted by Innovators
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            See what our customers are saying about Mastra AI
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem
                  key={index}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <Card>
                    <CardContent className="p-6">
                      <blockquote className="space-y-6">
                        <p className="text-muted-foreground">
                          &ldquo;{testimonial.quote}&rdquo;
                        </p>
                        <footer className="flex items-center gap-x-4">
                          <Avatar>
                            <AvatarImage
                              src={testimonial.avatar}
                              alt={testimonial.author}
                            />
                            <AvatarFallback>
                              {testimonial.author
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <cite className="not-italic font-semibold">
                              {testimonial.author}
                            </cite>
                            <div className="text-sm text-muted-foreground">
                              {testimonial.title}
                              {testimonial.company && (
                                <>, {testimonial.company}</>
                              )}
                            </div>
                          </div>
                        </footer>
                      </blockquote>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === current
                    ? "bg-primary"
                    : "bg-muted-foreground/20"
                }`}
                onClick={() => api?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
