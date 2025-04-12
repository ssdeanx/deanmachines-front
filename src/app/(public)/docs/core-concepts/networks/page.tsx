import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { type DocContent, SectionType } from "@/lib/content-data"
import { DocPage } from "@/components/docs/DocPage"
import { mockDocs } from "@/lib/mock-docs"

export const metadata: Metadata = {
  title: "Agent Networks - deanmachines AI",
  description: "Learn how to create and manage networks of cooperating AI agents.",
}

export default async function NetworksPage() {
  try {
    const doc: DocContent | undefined = mockDocs["core-concepts/networks"]

    if (!doc) {
      const fallbackDoc: DocContent = {
        id: "networks-fallback",
        slug: "core-concepts/networks",
        slugAsParams: "core-concepts/networks",
        title: "Agent Networks",
        description: "Agent Networks content could not be loaded.",
        contentType: "doc",
        sections: [
          {
            type: SectionType.Heading,
            level: 1,
            content: [{ text: "Agent Networks" }],
          },
          {
            type: SectionType.Paragraph,
            content: [
              {
                text: "The requested Agent Networks content was not found. Please ensure it exists in the data source.",
              },
            ],
          },
        ],
        prev: { title: "Memory Management", slug: "core-concepts/memory" },
        next: { title: "Deployment", slug: "core-concepts/deployment" },
      }
      return (

          <DocPage doc={fallbackDoc} />

      )
    }

    return (

        <DocPage doc={doc} />

    )
  } catch (error) {
    console.error("Error loading NetworksPage:", error)
    notFound()
  }
}
