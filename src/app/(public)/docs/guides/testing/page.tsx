import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { type DocContent, SectionType } from "@/lib/content-data"
import { DocPage } from "@/components/docs/DocPage"
import { mockDocs } from "@/lib/mock-docs"

export const metadata: Metadata = {
  title: "Testing & Validation - deanmachines AI",
  description: "Learn how to test and validate your AI agents effectively.",
}

export default async function TestingGuidePage() {
  try {
    // --- Replace this section with your actual data fetching logic ---
    // Fetch the structured document content for 'guides/testing'
    // This example uses the mock data source.
    const doc: DocContent | undefined = mockDocs["guides/testing"]
    // --- End of data fetching section ---

    // If the specific document wasn't found in the data source, show a fallback or 404 page
    if (!doc) {
      // You can customize this fallback or simply call notFound()
      const fallbackDoc: DocContent = {
        id: "testing-guide-fallback",
        slug: "guides/testing",
        slugAsParams: "guides/testing", // Ensure this matches the expected slug format
        title: "Testing & Validation",
        description: "Testing & Validation content could not be loaded.",
        contentType: "doc",
        sections: [
          {
            type: SectionType.Heading,
            level: 1,
            content: [{ text: "Testing & Validation" }],
          },
          {
            type: SectionType.Paragraph,
            content: [
              {
                text: "The requested Testing & Validation content was not found. Please ensure it exists in the data source.",
              },
            ],
          },
        ],
        // Define prev/next if applicable for the fallback state
        prev: { title: "Scaling Strategies", slug: "guides/scaling" }, // Example based on original code
        next: { title: "API Reference", slug: "api-reference/overview" }, // Adjusted slug based on original href
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
    console.error("Error loading TestingGuidePage:", error)
    // Optionally, render a specific error page or component
    notFound() // Or throw error;
  }
}
