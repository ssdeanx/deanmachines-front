import { type Metadata } from "next"
import { notFound } from "next/navigation"

// Import structured content types and components instead of MDX ones
import { type DocContent, SectionType } from "@/lib/content-data"
import { DocPage } from "@/components/docs/DocPage"
// Temporarily use mockDocs. Replace this with your actual data source/fetching logic
import { mockDocs } from "@/lib/mock-docs"

export const metadata: Metadata = {
  title: "Memory Management - deanmachines AI",
  description: "Learn how AI agents maintain context and learn from interactions using the memory system.",
}

export default async function MemoryPage() {
  try {
    // --- Replace this section with your actual data fetching logic ---
    // Fetch the structured document content for 'core-concepts/memory'
    // This example uses the mock data source.
    const doc: DocContent | undefined = mockDocs["core-concepts/memory"]
    // --- End of data fetching section ---

    // If the specific document wasn't found in the data source, show a fallback or 404 page
    if (!doc) {
      // You can customize this fallback or simply call notFound()
      const fallbackDoc: DocContent = {
        id: "memory-fallback",
        slug: "core-concepts/memory",
        slugAsParams: "core-concepts/memory", // Ensure this matches the expected slug format
        title: "Memory Management",
        description: "Memory Management content could not be loaded.",
        contentType: "doc",
        sections: [
          {
            type: SectionType.Heading,
            level: 1,
            content: [{ text: "Memory Management" }],
          },
          {
            type: SectionType.Paragraph,
            content: [
              {
                text: "The requested Memory Management content was not found. Please ensure it exists in the data source.",
              },
            ],
          },
        ],
        // Define prev/next if applicable for the fallback state
        prev: { title: "AI Agents", slug: "core-concepts/agents" }, // Example based on original code
        next: { title: "Agent Networks", slug: "core-concepts/networks" }, // Example based on original code
      }
      // Render the fallback page without DocsLayoutWrapper since it's already in layout.tsx
      return <DocPage doc={fallbackDoc} />
    }

    // Render the DocPage component, passing the fetched structured content.
    // DocPage handles the layout, table of contents, and content rendering internally.
    // DocsLayoutWrapper is already provided by the parent layout.tsx
    return <DocPage doc={doc} />
  } catch (error) {
    console.error("Error loading MemoryPage:", error)
    // Optionally, render a specific error page or component
    notFound() // Or throw error;
  }
}
