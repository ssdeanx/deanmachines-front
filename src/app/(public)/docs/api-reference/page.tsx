import { type Metadata } from "next"
import { notFound } from "next/navigation"

// Import structured content types and components instead of MDX ones
import { type DocContent, SectionType } from "@/lib/content-data"
import { DocPage } from "@/components/docs/DocPage"
import { mockDocs } from "@/lib/mock-docs"

export const metadata: Metadata = {
  title: "API Reference - deanmachines AI",
  description: "Complete API reference documentation for deanmachines AI platform.",
}

export default async function ApiReferencePage() {
  try {
    // --- Replace this section with your actual data fetching logic ---
    // Fetch the structured document content for 'api-reference/overview'
    // This example uses the mock data source.
    const doc: DocContent | undefined = mockDocs["api-reference/overview"]
    // --- End of data fetching section ---

    // If the specific document wasn't found in the data source, show a fallback or 404 page
    if (!doc) {
      // You can customize this fallback or simply call notFound()
      const fallbackDoc: DocContent = {
        id: "api-reference-fallback",
        slug: "api-reference/overview",
        slugAsParams: "api-reference/overview", // Ensure this matches the expected slug format
        title: "API Reference Overview",
        description: "API reference content could not be loaded.",
        contentType: "doc",
        sections: [
          {
            type: SectionType.Heading,
            level: 1,
            content: [{ text: "API Reference Overview" }],
          },
          {
            type: SectionType.Paragraph,
            content: [
              {
                text: "The requested API reference content was not found. Please ensure it exists in the data source.",
              },
            ],
          },
        ],
        // Define prev/next if applicable for the fallback state
        prev: { title: "Guides", slug: "guides/overview" }, // Example prev link
        // next: { title: "Next Section", slug: "..." },
      }
      // Render the fallback page
      return (
          <DocPage doc={fallbackDoc} />
      )
      // Alternatively, uncomment the line below to show a standard 404 page
      // notFound();
    }

    // Render the DocPage component, passing the fetched structured content.
    // DocPage handles the layout, table of contents, and content rendering internally.
    return (
        <DocPage doc={doc} />
    )
  } catch (error) {
    console.error("Error loading ApiReferencePage:", error)
    // Optionally, render a specific error page or component
    notFound() // Or throw error;
  }
}
