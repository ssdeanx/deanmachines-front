import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { type DocContent, SectionType } from "@/lib/content-data"
import { DocPage } from "@/components/docs/DocPage"
import { mockDocs } from "@/lib/mock-docs"

export const metadata: Metadata = {
  title: "Monitoring & Observability - deanmachines AI",
  description: "Set up monitoring, logging, and observability for your AI applications.",
}

export default async function MonitoringGuidePage() {
  try {
    // --- Replace this section with your actual data fetching logic ---
    // Fetch the structured document content for 'guides/monitoring'
    // This example uses the mock data source.
    const doc: DocContent | undefined = mockDocs["guides/monitoring"]
    // --- End of data fetching section ---

    // If the specific document wasn't found in the data source, show a fallback or 404 page
    if (!doc) {
      // You can customize this fallback or simply call notFound()
      const fallbackDoc: DocContent = {
        id: "monitoring-guide-fallback",
        slug: "guides/monitoring",
        slugAsParams: "guides/monitoring", // Ensure this matches the expected slug format
        title: "Monitoring & Observability",
        description: "Monitoring & Observability content could not be loaded.",
        contentType: "doc",
        sections: [
          {
            type: SectionType.Heading,
            level: 1,
            content: [{ text: "Monitoring & Observability" }],
          },
          {
            type: SectionType.Paragraph,
            content: [
              {
                text: "The requested Monitoring & Observability content was not found. Please ensure it exists in the data source.",
              },
            ],
          },
        ],
        // Define prev/next if applicable for the fallback state
        prev: { title: "Security Best Practices", slug: "guides/security" }, // Example based on original code
        next: { title: "Scaling Strategies", slug: "guides/scaling" }, // Example based on original code
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
    console.error("Error loading MonitoringGuidePage:", error)
    // Optionally, render a specific error page or component
    notFound() // Or throw error;
  }
}
