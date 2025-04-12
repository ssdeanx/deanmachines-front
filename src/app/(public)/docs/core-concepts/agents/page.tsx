import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { type DocContent, SectionType } from "@/lib/content-data"
import { DocPage } from "@/components/docs/DocPage"
import { mockDocs } from "@/lib/mock-docs"

export const metadata: Metadata = {
  title: "AI Agents - deanmachines AI",
  description: "Understanding AI agents, their capabilities, and how to build them effectively.",
}

export default async function AgentsPage() {
  try {
    // Fetch the structured document content for 'core-concepts/agents'
    // This example uses the mock data source.
    const doc: DocContent | undefined = mockDocs["core-concepts/agents"]

    // If the specific document wasn't found in the data source, show a fallback or 404 page
    if (!doc) {
      // You can customize this fallback or simply call notFound()
      const fallbackDoc: DocContent = {
        id: "agents-fallback",
        slug: "core-concepts/agents",
        slugAsParams: "core-concepts/agents", // Ensure this matches the expected slug format
        title: "AI Agents",
        description: "AI Agents content could not be loaded.",
        contentType: "doc",
        sections: [
          {
            type: SectionType.Heading,
            level: 1,
            content: [{ text: "AI Agents" }],
          },
          {
            type: SectionType.Paragraph,
            content: [
              {
                text: "The requested AI Agents content was not found. Please ensure it exists in the data source.",
              },
            ],
          },
        ],
        // Define prev/next if applicable for the fallback state
        prev: { title: "Core Concepts", slug: "core-concepts/overview" }, // Adjusted slug based on original href
        next: { title: "Memory Management", slug: "core-concepts/memory" }, // Example based on original code
      }
      // Render the fallback page
      return (
          <DocPage doc={fallbackDoc} />
      )
      // Alternatively, uncomment the line below to show a standard 404 page
      // notFound()
    }

    // Render the DocPage component, passing the fetched structured content.
    // DocPage handles the layout, table of contents, and content rendering internally.
    return (
        <DocPage doc={doc} />
    )
  } catch (error) {
    console.error("Error loading AgentsPage:", error)
    // Optionally, render a specific error page or component
    notFound() // Or throw error
  }
}
