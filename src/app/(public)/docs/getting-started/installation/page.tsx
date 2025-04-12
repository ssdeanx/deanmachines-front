import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { type DocContent, SectionType } from "@/lib/content-data"
import { DocPage } from "@/components/docs/DocPage"
import { mockDocs } from "@/lib/mock-docs"

export const metadata: Metadata = {
  title: "Installation - deanmachines AI",
  description: "Install and set up your development environment for deanmachines AI.",
}

export default async function InstallationPage() {
  try {
    // --- Replace this section with your actual data fetching logic ---
    // Fetch the structured document content for 'getting-started/installation'
    // This example uses the mock data source.
    const doc: DocContent | undefined = mockDocs["getting-started/installation"]
    // --- End of data fetching section ---

    // If the specific document wasn't found in the data source, show a fallback or 404 page
    if (!doc) {
      // You can customize this fallback or simply call notFound()
      const fallbackDoc: DocContent = {
        id: "installation-fallback",
        slug: "getting-started/installation",
        slugAsParams: "getting-started/installation", // Ensure this matches the expected slug format
        title: "Installation",
        description: "Installation content could not be loaded.",
        contentType: "doc",
        sections: [
          {
            type: SectionType.Heading,
            level: 1,
            content: [{ text: "Installation" }],
          },
          {
            type: SectionType.Paragraph,
            content: [
              {
                text: "The requested Installation content was not found. Please ensure it exists in the data source.",
              },
            ],
          },
        ],
        // Define prev/next if applicable for the fallback state
        prev: { title: "Getting Started", slug: "getting-started/overview" }, // Adjusted slug based on original href
        next: { title: "Configuration", slug: "getting-started/configuration" }, // Example based on original code
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
    console.error("Error loading InstallationPage:", error)
    // Optionally, render a specific error page or component
    notFound() // Or throw error;
  }
}
