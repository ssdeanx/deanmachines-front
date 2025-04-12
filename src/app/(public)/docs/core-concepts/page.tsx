import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { type DocContent, SectionType } from "@/lib/content-data"
import { DocPage } from "@/components/docs/DocPage"
import { mockDocs } from "@/lib/mock-docs"

export const metadata: Metadata = {
  title: "Core Concepts - deanmachines AI",
  description: "Learn about the fundamental concepts and architecture of deanmachines AI.",
}

export default async function CoreConceptsPage() {
  try {
    // Fetch the structured document content for 'core-concepts/overview'
    // This example uses the mock data source.
    const doc: DocContent | undefined = mockDocs["core-concepts/overview"]

    // If the specific document wasn't found in the data source, show a fallback or 404 page
    if (!doc) {
      // You can customize this fallback or simply call notFound()
      const fallbackDoc: DocContent = {
        id: "core-concepts-fallback",
        slug: "core-concepts/overview",
        slugAsParams: "core-concepts/overview", // Ensure this matches the expected slug format
        title: "Core Concepts Overview",
        description: "Core Concepts content could not be loaded.",
        contentType: "doc",
        sections: [
          {
            type: SectionType.Heading,
            level: 1,
            content: [{ text: "Core Concepts Overview" }],
          },
          {
            type: SectionType.Paragraph,
            content: [
              {
                text: "The requested Core Concepts content was not found. Please ensure it exists in the data source.",
              },
            ],
          },
        ],
        // Define prev/next if applicable for the fallback state
        prev: { title: "Configuration", slug: "getting-started/configuration" }, // Example based on original code
        next: { title: "AI Agents", slug: "core-concepts/agents" }, // Example based on original code
      }
      // Render the fallback page
      return (
          <DocPage doc={fallbackDoc} />
      )
    }

    // Render the DocPage component, passing the fetched structured content.
    // DocPage handles the layout, table of contents, and content rendering internally.
    return (
        <DocPage doc={doc} />
    )
  } catch (error) {
    console.error("Error loading CoreConceptsPage:", error)
    // Optionally, render a specific error page or component
    notFound() // Or throw error;
  }
}
