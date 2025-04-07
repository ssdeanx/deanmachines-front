import * as React from "react"
import { type Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/common/breadcrumb"
import { SearchInput } from "@/components/common/SearchInput"

export const metadata: Metadata = {
  title: "Blog - Mastra AI",
  description: "Latest news, updates, and insights about AI agents and the Mastra platform.",
}

interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  author: {
    name: string
    avatar: string
  }
  image: string
  tags: string[]
}

// In a real app, this would come from a CMS or API
const blogPosts: BlogPost[] = [
  {
    slug: "introducing-mastra-ai",
    title: "Introducing Mastra AI: The Future of AI Agents",
    description: "Today, we're excited to announce the launch of Mastra AI, a revolutionary platform for building and deploying intelligent AI agents.",
    date: "2025-04-01",
    author: {
      name: "Dr. Alexandra Wright",
      avatar: "/team/alexandra.jpg",
    },
    image: "/blog/launch.jpg",
    tags: ["Announcement", "Product"],
  },
  {
    slug: "memory-management-in-ai-agents",
    title: "Advanced Memory Management in AI Agents",
    description: "Deep dive into how Mastra AI implements sophisticated memory management to maintain context across interactions.",
    date: "2025-03-28",
    author: {
      name: "Dr. Maria Santos",
      avatar: "/team/maria.jpg",
    },
    image: "/blog/memory.jpg",
    tags: ["Technical", "AI"],
  },
  {
    slug: "scaling-ai-agents",
    title: "Scaling AI Agents: Best Practices and Insights",
    description: "Learn how to effectively scale your AI agents from development to production with Mastra's cloud-native infrastructure.",
    date: "2025-03-25",
    author: {
      name: "Marcus Chen",
      avatar: "/team/marcus.jpg",
    },
    image: "/blog/scaling.jpg",
    tags: ["Engineering", "Cloud"],
  },
]

export default function BlogPage() {
  return (
    <div className="container py-10">
      <Breadcrumb
        items={[{ title: "Blog" }]}
        className="mb-8"
      />

      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-heading text-4xl">Latest Updates</h1>
            <p className="mt-2 text-muted-foreground">
              Insights and news from the Mastra AI team
            </p>
          </div>
          <SearchInput
            className="md:w-64"
            placeholder="Search posts..."
          />
        </div>

        <div className="mt-8 space-y-4">
          <div className="flex gap-2">
            {["All", "Announcement", "Technical", "Engineering", "AI", "Cloud"].map((tag) => (
              <Badge
                key={tag}
                variant={tag === "All" ? "default" : "secondary"}
                className="cursor-pointer"
              >
                {tag}
              </Badge>
            ))}
          </div>
          <Separator />
        </div>

        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Card key={post.slug} className="group overflow-hidden">
              <Link href={`/blog/${post.slug}`}>
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h2 className="mt-4 text-xl font-semibold group-hover:text-primary">
                    {post.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {post.description}
                  </p>
                </CardContent>
                <CardFooter className="flex items-center gap-4 p-6 pt-0">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{post.author.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                </CardFooter>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
