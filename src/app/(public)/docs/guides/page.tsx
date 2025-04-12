import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { type DocContent, SectionType } from "@/lib/content-data"
import { DocPage } from "@/components/docs/DocPage"
import { mockDocs } from "@/lib/mock-docs"

export const metadata: Metadata = {
  title: "Guides - deanmachines AI",
  description: "Comprehensive guides for building and deploying AI solutions with deanmachines.",
}

export default async function GuidesPage() {
  try {
    // --- Replace this section with your actual data fetching logic ---
    // Fetch the structured document content for 'guides/overview'
    // This example uses the mock data source.
    const doc: DocContent | undefined = mockDocs["guides/overview"]
    // --- End of data fetching section ---

    // If the specific document wasn't found in the data source, show a fallback or 404 page
    if (!doc) {
      // You can customize this fallback or simply call notFound()
      const fallbackDoc: DocContent = {
        id: "guides-fallback",
        slug: "guides/overview",
        slugAsParams: "guides/overview", // Ensure this matches the expected slug format if needed
        title: "Guides Overview",
        description: "Guide content could not be loaded.",
        contentType: "doc",
        sections: [
          {
            type: SectionType.Heading,
            level: 1,
            content: [{ text: "Guides Overview" }],
          },
          {
            type: SectionType.Paragraph,
            content: [
              {
                text: "The requested guide content was not found. Please ensure it exists in the data source.",
              },
            ],
          },
        ],
        // Define prev/next if applicable for the fallback state
        // prev: { title: "Previous Section", slug: "..." },
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
    console.error("Error loading GuidesPage:", error)
    // Optionally, render a specific error page or component
    // For now, just re-throwing or using notFound
    notFound() // Or throw error;
  }
}
