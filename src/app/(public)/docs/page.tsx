import { type Metadata } from "next"
import { DocPage } from "@/components/docs/DocPage"
import { mockDocs } from "@/lib/mock-docs"
import { SectionType, type DocContent } from "@/lib/content-data"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Documentation - deanmachines AI",
  description: "Learn how to build and deploy AI agents with deanmachines.",
}

export default async function DocsPage() {
  try {
    // Use the index document from our mockDocs
    const doc = mockDocs["index"]

    // If for some reason the index doc isn't found, create a basic placeholder
    if (!doc) {
      const fallbackDoc: DocContent = {
        id: "index-fallback",
        slug: "index",
        slugAsParams: "index",
        title: "Documentation",
        description: "Documentation and guides for deanmachines AI platform.",
        contentType: "doc",
        sections: [
          {
            type: SectionType.Heading,
            level: 1,
            content: [{ text: "Documentation" }]
          },
          {
            type: SectionType.Paragraph,
            content: [{ text: "Welcome to deanmachines AI documentation. Content could not be loaded." }]
          }
        ],
      }

      return <DocPage doc={fallbackDoc} />
    }

    return <DocPage doc={doc} />
  } catch (error) {
    console.error("Error loading DocsPage:", error)
    notFound()
  }
}
