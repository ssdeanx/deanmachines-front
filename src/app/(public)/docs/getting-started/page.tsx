import { type Metadata } from "next"
import { notFound } from "next/navigation"

// Import structured content types and components instead of MDX ones
import { type DocContent, SectionType } from "@/lib/content-data"
import { DocPage } from "@/components/docs/DocPage"
// Temporarily use mockDocs. Replace this with your actual data source/fetching logic.
import { mockDocs } from "@/lib/mock-docs"

export const metadata: Metadata = {
  title: "Getting Started - deanmachines AI",
  description: "Get started with deanmachines AI and create your first project.",
}

export default async function GettingStartedPage() {
  try {
    // --- Replace this section with your actual data fetching logic ---
    // Fetch the structured document content for 'getting-started/overview'
    // This example uses the mock data source.
    const doc: DocContent | undefined = mockDocs["getting-started/overview"]
    // --- End of data fetching section ---

    // If the specific document wasn't found in the data source, show a fallback or 404 page
    if (!doc) {
      // You can customize this fallback or simply call notFound()
      const fallbackDoc: DocContent = {
        id: "getting-started-fallback",
        slug: "getting-started/overview",
        slugAsParams: "getting-started/overview", // Ensure this matches the expected slug format
        title: "Getting Started Overview",
        description: "Getting Started content could not be loaded.",
        contentType: "doc",
        sections: [
          {
            type: SectionType.Heading,
            level: 1,
            content: [{ text: "Getting Started Overview" }],
          },
          {
            type: SectionType.Paragraph,
            content: [
              {
                text: "The requested Getting Started content was not found. Please ensure it exists in the data source.",
              },
            ],
          },
        ],
        // Define prev/next if applicable for the fallback state
        prev: { title: "Introduction", slug: "index" }, // Adjusted slug based on original href "/docs"
        next: { title: "Installation", slug: "getting-started/installation" }, // Example based on original code
      }
      // Render the fallback page without DocsLayoutWrapper since it's already in layout.tsx
      return <DocPage doc={fallbackDoc} />
      // Alternatively, uncomment the line below to show a standard 404 page
      // notFound();
    }

    // Render the DocPage component, passing the fetched structured content.
    // DocPage handles the layout, table of contents, and content rendering internally.
    // DocsLayoutWrapper is already provided by the parent layout.tsx
    return <DocPage doc={doc} />
  } catch (error) {
    console.error("Error loading GettingStartedPage:", error)
    // Optionally, render a specific error page or component
    notFound() // Or throw error;
  }
}
