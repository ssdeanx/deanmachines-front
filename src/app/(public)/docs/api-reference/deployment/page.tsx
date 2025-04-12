import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { type DocContent, SectionType } from "@/lib/content-data"
import { DocPage } from "@/components/docs/DocPage"
import { mockDocs } from "@/lib/mock-docs"

export const metadata: Metadata = {
  title: "Deployment API Reference - deanmachines AI",
  description: "Complete API reference for deployment and infrastructure management.",
}

export default async function DeploymentApiPage() {
  try {
    const doc: DocContent | undefined = mockDocs["api-reference/deployment"]

    if (!doc) {
      const fallbackDoc: DocContent = {
        id: "deployment-api-fallback",
        slug: "api-reference/deployment",
        slugAsParams: "api-reference/deployment",
        title: "Deployment API Reference",
        description: "Deployment API reference content could not be loaded.",
        contentType: "doc",
        sections: [
          {
            type: SectionType.Heading,
            level: 1,
            content: [{ text: "Deployment API Reference" }],
          },
          {
            type: SectionType.Paragraph,
            content: [
              {
                text: "The requested Deployment API reference content was not found. Please ensure it exists in the data source.",
              },
            ],
          },
        ],
        prev: { title: "Network API", slug: "api-reference/network" },
        next: { title: "CLI Reference", slug: "api-reference/cli" },
      }
      return (
          <DocPage doc={fallbackDoc} />
      )
    }

    return (
        <DocPage doc={doc} />
    )
  } catch (error) {
    console.error("Error loading DeploymentApiPage:", error)
    notFound()
  }
}
