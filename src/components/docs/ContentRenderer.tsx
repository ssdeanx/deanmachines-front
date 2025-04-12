"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { type ContentSection, SectionType, CalloutType, ListType } from "@/lib/content-data";
import { Card } from "./Card";
import { Callout } from "./Callout";
import { CodeBlockWrapper } from "./CodeBlockWrapper";
import { cn } from "@/lib/utils";

/**
 * Props for the ContentRenderer component
 *
 * @property sections - Array of content sections to render
 * @property className - Optional CSS class name to apply to the container
 * @property idPrefix - Optional prefix for section IDs to ensure uniqueness
 */
interface ContentRendererProps {
  sections: ContentSection[];
  className?: string;
  idPrefix?: string;
}

/**
 * Renders a formatted text span with optional styling
 *
 * @param span - The text span to render
 * @returns A React element with appropriate formatting
 */
const TextSpan = ({ span }: { span: { text: string; format?: { bold?: boolean; italic?: boolean; code?: boolean; link?: { href: string; title?: string } } } }) => {
  const { text, format } = span;

  if (!format) {
    return <>{text}</>;
  }

  let content = <>{text}</>;

  if (format.bold) {
    content = <strong>{content}</strong>;
  }

  if (format.italic) {
    content = <em>{content}</em>;
  }

  if (format.code) {
    content = <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">{content}</code>;
  }

  if (format.link) {
    return (
      <Link
        href={format.link.href}
        title={format.link.title}
        className="font-medium underline underline-offset-4"
        legacyBehavior>
        {content}
      </Link>
    );
  }

  return content;
};

/**
 * ContentRenderer component for displaying structured content
 * This component renders different section types from our content structure
 */
export function ContentRenderer({
  sections,
  className,
  idPrefix = "",
}: ContentRendererProps) {
  return (
    <div className={cn("content-wrapper", className)}>
      {sections.map((section, index) => {
        // Generate a stable ID based on the section content or provided ID
        const sectionId = section.id ||
          (section.type === SectionType.Heading &&
            section.content
              .map(c => c.text)
              .join(" ")
              .toLowerCase()
              .replace(/[^\w]+/g, "-"));

        // Add the prefix to the ID if provided and the section has an ID
        const id = sectionId ? `${idPrefix}${sectionId}` : undefined;

        // Apply any custom classes from the section
        const sectionClassName = cn(section.className);

        switch (section.type) {
          case SectionType.Heading: {
            const HeadingTag = `h${section.level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
            return (
              <HeadingTag
                key={`${section.type}-${index}`}
                id={id}
                className={cn(
                  {
                    "mt-12 scroll-m-20 text-3xl font-bold tracking-tight": section.level === 1,
                    "mt-10 scroll-m-20 text-2xl font-semibold tracking-tight": section.level === 2,
                    "mt-8 scroll-m-20 text-xl font-semibold tracking-tight": section.level === 3,
                    "mt-6 scroll-m-20 text-lg font-medium tracking-tight": section.level === 4,
                    "mt-4 scroll-m-20 text-base font-medium tracking-tight": section.level === 5,
                    "mt-4 scroll-m-20 text-base font-medium tracking-tight text-muted-foreground": section.level === 6,
                  },
                  sectionClassName
                )}
              >
                {section.content.map((span, i) => (
                  <TextSpan key={i} span={span} />
                ))}
              </HeadingTag>
            );
          }

          case SectionType.Paragraph: {
            return (
              <p
                key={`${section.type}-${index}`}
                className={cn("leading-7 [&:not(:first-child)]:mt-6", sectionClassName)}
              >
                {section.content.map((span, i) => (
                  <TextSpan key={i} span={span} />
                ))}
              </p>
            );
          }

          case SectionType.List: {
            const ListTag = section.listType === ListType.Ordered ? "ol" : "ul";
            return (
              <ListTag
                key={`${section.type}-${index}`}
                className={cn(
                  "mt-6 ml-6",
                  {
                    "list-disc": section.listType === ListType.Unordered,
                    "list-decimal": section.listType === ListType.Ordered,
                  },
                  sectionClassName
                )}
              >
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="mt-2">
                    {item.content.map((span, i) => (
                      <TextSpan key={i} span={span} />
                    ))}
                    {item.items && item.items.length > 0 && (
                      <ListTag
                        className={cn(
                          "mt-2 ml-6",
                          {
                            "list-disc": section.listType === ListType.Unordered,
                            "list-decimal": section.listType === ListType.Ordered,
                          }
                        )}
                      >
                        {item.items.map((nestedItem, nestedIndex) => (
                          <li key={nestedIndex} className="mt-2">
                            {nestedItem.content.map((span, i) => (
                              <TextSpan key={i} span={span} />
                            ))}
                          </li>
                        ))}
                      </ListTag>
                    )}
                  </li>
                ))}
              </ListTag>
            );
          }

          case SectionType.Code: {
            return (
              <div className={cn("my-6", sectionClassName)} key={`${section.type}-${index}`}>
                <CodeBlockWrapper
                  language={section.language}
                  filename={section.filename}
                  showLineNumbers={section.showLineNumbers}
                  highlightLines={section.highlightLines}
                >
                  {section.code}
                </CodeBlockWrapper>
              </div>
            );
          }

          case SectionType.Callout: {
            return (
              <div className={cn("my-6", sectionClassName)} key={`${section.type}-${index}`}>
                <Callout
                  type={section.calloutType}
                  title={section.title}
                >
                  {section.content.map((span, i) => (
                    <TextSpan key={i} span={span} />
                  ))}
                </Callout>
              </div>
            );
          }

          case SectionType.Image: {
            return (
              <figure key={`${section.type}-${index}`} className={cn("my-8", sectionClassName)}>
                <div className="overflow-hidden rounded-lg border">
                  <Image
                    src={section.src}
                    alt={section.alt}
                    width={section.width || 800}
                    height={section.height || 600}
                    className="w-full object-cover"
                  />
                </div>
                {section.caption && (
                  <figcaption className="mt-2 text-center text-sm text-muted-foreground">
                    {section.caption}
                  </figcaption>
                )}
              </figure>
            );
          }

          case SectionType.Table: {
            return (
              <div key={`${section.type}-${index}`} className={cn("my-6 w-full overflow-y-auto", sectionClassName)}>
                <table className="w-full caption-bottom text-sm">
                  {section.caption && (
                    <caption className="mt-4 text-sm text-muted-foreground">
                      {section.caption}
                    </caption>
                  )}
                  <thead>
                    {section.header.map((row, rowIndex) => (
                      <tr key={rowIndex} className="m-0 border-t p-0 even:bg-muted">
                        {row.cells.map((cell, cellIndex) => (
                          <th
                            key={cellIndex}
                            colSpan={cell.colSpan}
                            rowSpan={cell.rowSpan}
                            className={cn(
                              "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
                              {
                                "text-center": cell.align === "center",
                                "text-right": cell.align === "right",
                              }
                            )}
                          >
                            {cell.content.map((span, i) => (
                              <TextSpan key={i} span={span} />
                            ))}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {section.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="m-0 border-t p-0 even:bg-muted">
                        {row.cells.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            colSpan={cell.colSpan}
                            rowSpan={cell.rowSpan}
                            className={cn(
                              "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
                              {
                                "text-center": cell.align === "center",
                                "text-right": cell.align === "right",
                              }
                            )}
                          >
                            {cell.content.map((span, i) => (
                              <TextSpan key={i} span={span} />
                            ))}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }

          case SectionType.Quote: {
            return (
              <blockquote
                key={`${section.type}-${index}`}
                className={cn("mt-6 border-l-2 pl-6 italic", sectionClassName)}
              >
                <div>
                  {section.content.map((span, i) => (
                    <TextSpan key={i} span={span} />
                  ))}
                </div>
                {section.attribution && (
                  <footer className="mt-2 text-sm text-muted-foreground">
                    &mdash; {section.attribution}
                  </footer>
                )}
              </blockquote>
            );
          }

          case SectionType.Divider: {
            return <hr key={`${section.type}-${index}`} className={cn("my-8 border-muted-foreground/20", sectionClassName)} />;
          }

          case SectionType.Card: {
            return (
              <div className={cn("my-6", sectionClassName)} key={`${section.type}-${index}`}>
                <Card
                  title={section.title}
                  href={section.href}
                  image={section.image}
                >
                  {section.content.map((span, i) => (
                    <TextSpan key={i} span={span} />
                  ))}
                </Card>
              </div>
            );
          }

          default: {
            console.warn(`Unknown section type: ${(section as any).type}`);
            return null;
          }
        }
      })}
    </div>
  );
}
