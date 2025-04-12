import { type Metadata } from "next"
import { notFound } from "next/navigation"

// Import structured content types and components instead of MDX ones
import { type DocContent, SectionType } from "@/lib/content-data"
import { DocPage } from "@/components/docs/DocPage"

import { mockDocs } from "@/lib/mock-docs"

export const metadata: Metadata = {
  title: "Memory API Reference - deanmachines AI",
  description: "Complete API reference for memory management and storage.",
}

export default async function MemoryApiPage() {
  try {
    // --- Replace this section with your actual data fetching logic ---
    // Fetch the structured document content for 'api-reference/memory'
    // This example uses the mock data source.
    const doc: DocContent | undefined = mockDocs["api-reference/memory"]
    // --- End of data fetching section ---

    // If the specific document wasn't found in the data source, show a fallback or 404 page
    if (!doc) {
      // You can customize this fallback or simply call notFound()
      const fallbackDoc: DocContent = {
        id: "memory-api-fallback",
        slug: "api-reference/memory",
        slugAsParams: "api-reference/memory", // Ensure this matches the expected slug format
        title: "Memory API Reference",
        description: "Memory API reference content could not be loaded.",
        contentType: "doc",
        sections: [
          {
            type: SectionType.Heading,
            level: 1,
            content: [{ text: "Memory API Reference" }],
          },
          {
            type: SectionType.Paragraph,
            content: [
              {
                text: "The requested Memory API reference content was not found. Please ensure it exists in the data source.",
              },
            ],
          },
        ],
        // Define prev/next if applicable for the fallback state
        prev: { title: "Agent API", slug: "api-reference/agent" }, // Example based on original code
        next: { title: "Network API", slug: "api-reference/network" }, // Example based on original code
      }
      // Render the fallback page      return <DocPage doc={fallbackDoc} />
      // Alternatively, uncomment the line below to show a standard 404 page
      // notFound();
    }

      // Alternatively, uncomment the line below to show a standard 404 page
      // notFound();
    }

    // Render the DocPage component, passing the fetched structured content.
    // DocPage handles the layout, table of contents, and content rendering internally.
    // Render the DocPage component, passing the fetched structured content.
    // DocPage handles the layout, table of contents, and content rendering internally.    return <DocPage doc={doc} />
   catch (error) {
    console.error("Error loading MemoryApiPage:", error)
    // Optionally, render a specific error page or component
    notFound() // Or throw error;
  }
}
