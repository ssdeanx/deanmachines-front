import { type Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { allPosts } from "contentlayer/generated"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Breadcrumb } from "@/components/common/breadcrumb"
import { Mdx } from "@/components/docs/mdx"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

async function getPostFromParams(slug: string) {
  const post = allPosts.find((post) => post.slugAsParams === slug)

  if (!post) {
    null
  }

  return post
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = await getPostFromParams(params.slug)

  if (!post) {
    return {}
  }

  return {
    title: post.title,
    description: post.description,
    authors: post.author ? [{ name: post.author.name }] : [],
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `https://mastra.ai/blog/${post.slugAsParams}`,
      images: [
        {
          url: post.image ?? "/og-image.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.image ? [post.image] : ["/og-image.png"],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostFromParams(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="container relative max-w-3xl py-6 lg:py-10">
      <Breadcrumb
        items={[
          { title: "Blog", href: "/blog" },
          { title: post.title },
        ]}
        className="mb-4"
      />

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          {post.tags?.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl">
          {post.title}
        </h1>
        {post.description && (
          <p className="text-xl text-muted-foreground">{post.description}</p>
        )}
      </div>

      {post.image && (
        <div className="relative my-8 aspect-video overflow-hidden rounded-lg">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="mt-8 flex items-center space-x-4 border-y py-4">
        {post.author && (
          <Avatar>
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback>
              {post.author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        )}
        <div className="flex-1">
          {post.author?.name && (
            <p className="font-medium">{post.author.name}</p>
          )}
          {post.date && (
            <p className="text-sm text-muted-foreground">
              {formatDate(post.date)}
            </p>
          )}
        </div>
      </div>

      <div className="mdx mt-8">
        <Mdx code={post.body.code} />
      </div>
    </article>
  )
}
