import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { allDocs } from "contentlayer/generated"
import { Mdx } from "@/components/docs/mdx"
import { DocsPageLayout } from "@/components/docs/DocsPageLayout"
import { getTableOfContents } from "@/lib/toc"

export const metadata: Metadata = {
  title: "Documentation - Mastra AI",
  description: "Learn how to build and deploy AI agents with Mastra.",
}

export default async function DocsPage() {
  try {
    const doc = allDocs.find((doc) => doc.slugAsParams === "introduction")

    if (!doc) {
      notFound()
    }

    const toc = await getTableOfContents(doc.body.raw)

    return (
      <DocsPageLayout
        toc={toc}
        pagination={{
          next: {
            title: "Getting Started",
            href: "/docs/getting-started",
          },
        }}
      >
        <Mdx code={doc.body.code} />
      </DocsPageLayout>
    )
  } catch (error) {
    console.error("Error in DocsPage:", error)
    throw error
  }
}
