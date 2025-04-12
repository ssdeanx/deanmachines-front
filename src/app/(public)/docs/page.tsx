import { type Metadata } from "next"
import { DocsPageLayout } from "@/components/docs/DocsPageLayout"
import { DocsLayoutWrapper } from "@/components/docs/DocsLayoutWrapper"
import { DocPage } from "@/components/docs/DocPage"
import { mockDocs } from "@/lib/mock-docs"
import { SectionType } from "@/lib/content-data"

export const metadata: Metadata = {
  title: "Documentation - deanmachines AI",
  description: "Learn how to build and deploy AI agents with deanmachines.",
}

export default async function DocsPage() {
  // Use the index document from our mockDocs
  const doc = mockDocs["index"]

  // If for some reason the index doc isn't found, create a basic placeholder
  if (!doc) {
    const fallbackDoc = {
      id: "index",
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
          content: [{ text: "Welcome to deanmachines AI documentation. This is a temporary placeholder." }]
        }
      ],
      next: {
        title: "Installation",
        slug: "getting-started/installation"
      }
    }

    return (
      <DocsLayoutWrapper>
        <DocPage doc={fallbackDoc} />
      </DocsLayoutWrapper>
    )
  }

  // Add next page link
  const docWithPagination = {
    ...doc,
    next: {
      title: "Installation",
      slug: "getting-started/installation"
    }
  }

  return (
    <DocsLayoutWrapper>
      <DocPage doc={docWithPagination} />
    </DocsLayoutWrapper>
  )
}
