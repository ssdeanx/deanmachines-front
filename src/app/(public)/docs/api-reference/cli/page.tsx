import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { type DocContent, SectionType } from "@/lib/content-data"
import { DocPage } from "@/components/docs/DocPage"
import { mockDocs } from "@/lib/mock-docs"

export const metadata: Metadata = {
  title: "CLI Reference - deanmachines AI",
  description: "Complete reference for the deanmachines AI command-line interface.",
}

export default async function CliReferencePage() {
  try {
    const doc: DocContent | undefined = mockDocs["api-reference/cli"]

    if (!doc) {
      const fallbackDoc: DocContent = {
        id: "cli-reference-fallback",
        slug: "api-reference/cli",
        slugAsParams: "api-reference/cli",
        title: "CLI Reference",
        description: "CLI reference content could not be loaded.",
        contentType: "doc",
        sections: [
          {
            type: SectionType.Heading,
            level: 1,
            content: [{ text: "CLI Reference" }],
          },
          {
            type: SectionType.Paragraph,
            content: [
              {
                text: "The requested CLI reference content was not found. Please ensure it exists in the data source.",
              },
            ],
          },
        ],
        prev: { title: "Deployment API", slug: "api-reference/deployment" },
      }
      return (
          <DocPage doc={fallbackDoc} />
      )
    }

    return (
        <DocPage doc={doc} />

    )
  } catch (error) {
    console.error("Error loading CliReferencePage:", error)
    notFound()
  }
}
