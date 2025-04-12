import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { type DocContent, SectionType } from "@/lib/content-data"
import { DocPage } from "@/components/docs/DocPage"
import { mockDocs } from "@/lib/mock-docs"

export const metadata: Metadata = {
  title: "Security Best Practices - deanmachines AI",
  description: "Learn how to secure your AI applications and protect sensitive data.",
}

export default async function SecurityGuidePage() {
  try {
    // --- Replace this section with your actual data fetching logic ---
    // Fetch the structured document content for 'guides/security'
    // This example uses the mock data source.
    const doc: DocContent | undefined = mockDocs["guides/security"]
    // --- End of data fetching section ---

    // If the specific document wasn't found in the data source, show a fallback or 404 page
    if (!doc) {
      // You can customize this fallback or simply call notFound()
      const fallbackDoc: DocContent = {
        id: "security-guide-fallback",
        slug: "guides/security",
        slugAsParams: "guides/security", // Ensure this matches the expected slug format
        title: "Security Best Practices",
        description: "Security Best Practices content could not be loaded.",
        contentType: "doc",
        sections: [
          {
            type: SectionType.Heading,
            level: 1,
            content: [{ text: "Security Best Practices" }],
          },
          {
            type: SectionType.Paragraph,
            content: [
              {
                text: "The requested Security Best Practices content was not found. Please ensure it exists in the data source.",
              },
            ],
          },
        ],
        // Define prev/next if applicable for the fallback state
        prev: { title: "Guides", slug: "guides/overview" }, // Adjusted slug based on original href
        next: { title: "Monitoring & Observability", slug: "guides/monitoring" }, // Example based on original code
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
    console.error("Error loading SecurityGuidePage:", error)
    // Optionally, render a specific error page or component
    notFound() // Or throw error;
  }
}
