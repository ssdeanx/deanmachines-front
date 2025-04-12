import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { type DocContent, SectionType } from "@/lib/content-data"
import { DocPage } from "@/components/docs/DocPage"
import { mockDocs } from "@/lib/mock-docs"

export const metadata: Metadata = {
  title: "Network API Reference - deanmachines AI",
  description: "Complete API reference for agent networks and communication.",
}

export default async function NetworkApiPage() {
  try {
    const doc: DocContent | undefined = mockDocs["api-reference/network"]

    if (!doc) {
      const fallbackDoc: DocContent = {
        id: "network-api-fallback",
        slug: "api-reference/network",
        slugAsParams: "api-reference/network",
        title: "Network API Reference",
        description: "Network API reference content could not be loaded.",
        contentType: "doc",
        sections: [
          {
            type: SectionType.Heading,
            level: 1,
            content: [{ text: "Network API Reference" }],
          },
          {
            type: SectionType.Paragraph,
            content: [
              {
                text: "The requested Network API reference content was not found. Please ensure it exists in the data source.",
              },
            ],
          },
        ],
        prev: { title: "Memory API", slug: "api-reference/memory" },
        next: { title: "Deployment API", slug: "api-reference/deployment" },
      }
      return (
          <DocPage doc={fallbackDoc} />
      )
    }

    return (
        <DocPage doc={doc} />
    )
  } catch (error) {
    console.error("Error loading NetworkApiPage:", error)
    notFound()
  }
}
