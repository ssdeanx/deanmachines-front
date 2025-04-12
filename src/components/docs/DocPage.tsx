"use client";

import * as React from "react";
import { useMemo } from "react";
import { type DocContent, SectionType } from "@/lib/content-data";
import { DocsPageLayout } from "@/components/docs/DocsPageLayout";
import { ContentRenderer } from "@/components/docs/ContentRenderer";
import { type TableOfContents, type TableOfContentsItem } from "@/types/toc";

interface DocPageProps {
  /**
   * The documentation content to render
   */
  doc: DocContent;
}

/**
 * Generates a table of contents from the document's heading sections
 *
 * @param sections - The content sections of the document
 * @returns A structured table of contents object
 */
function generateTocFromSections(doc: DocContent): TableOfContents {
  const headings = doc.sections.filter(
    section => section.type === SectionType.Heading
  );

  const items: TableOfContentsItem[] = [];
  const levelMap: Record<number, TableOfContentsItem[]> = {};

  // Initialize the level map with the top level
  levelMap[1] = items;

  headings.forEach(section => {
    if (section.type !== SectionType.Heading) return;

    const level = section.level;
    const title = section.content.map(segment => segment.text).join("");

    // Use the section ID if provided, otherwise generate one from the title
    const id = section.id || title.toLowerCase().replace(/\s+/g, "-");
    const url = `#${id}`;

    const item: TableOfContentsItem = { title, url, items: [] };

    // Add this item to its parent level
    if (level === 1) {
      items.push(item);
    } else {
      // Find the closest parent level
      let parentLevel = level - 1;
      while (parentLevel >= 1) {
        const parentItems = levelMap[parentLevel];
        if (parentItems && parentItems.length > 0) {
          const parent = parentItems[parentItems.length - 1];
          if (!parent.items) parent.items = [];
          parent.items.push(item);
          break;
        }
        parentLevel--;
      }

      // If no parent found, add to top level
      if (parentLevel < 1) {
        items.push(item);
      }
    }

    // Update the level map for this level
    levelMap[level] = item.items || [];
  });

  return { items };
}

/**
 * Documentation page component that renders structured content
 * This component replaces the previous MDX-based documentation page
 */
export function DocPage({ doc }: DocPageProps) {
  // Generate table of contents from the document sections
  const toc = useMemo(() => generateTocFromSections(doc), [doc]);

  // Extract pagination links from the document
  const pagination = {
    ...(doc.prev && { prev: { title: doc.prev.title, href: `/docs/${doc.prev.slug}` } }),
    ...(doc.next && { next: { title: doc.next.title, href: `/docs/${doc.next.slug}` } })
  };

  return (
    <DocsPageLayout
      toc={toc}
      pagination={Object.keys(pagination).length > 0 ? pagination : undefined}
      sections={doc.sections}
    >
      {/* The sections are passed to DocsPageLayout and will be rendered by ContentRenderer */}
    </DocsPageLayout>
  );
}
