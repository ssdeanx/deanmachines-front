'use client'
import * as React from "react"
import { TableOfContents } from "@/types/toc"
import { Toc } from "./Toc"
import { DocsPagination } from "./DocsPagination"
import { ContentRenderer } from "./ContentRenderer"
import { type ContentSection } from "@/lib/content-data"

interface DocsPageLayoutProps {
  /**
   * Content to display in the main area
   * Can be either structured content sections or React children for backward compatibility
   */
  children?: React.ReactNode
  /**
   * Table of contents for the page
   */
  toc: TableOfContents
  /**
   * Pagination links
   */
  pagination?: {
    prev?: { title: string; href: string }
    next?: { title: string; href: string }
  }  /**
   * Structured content sections (alternative to children)
   */
  sections?: ContentSection[]
}

export function DocsPageLayout({
  children,
  toc,
  pagination,
  sections
}: DocsPageLayoutProps) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="container flex-1">
        <div className="grid grid-cols-[1fr_300px] gap-12">
          <div>
            <article className="prose prose-slate dark:prose-invert max-w-none">
              {sections ? (
                <ContentRenderer sections={sections} />
              ) : (
                children
              )}
            </article>
            {pagination && (
              <nav className="mt-8">
                <DocsPagination
                  prev={pagination.prev}
                  next={pagination.next}
                  aria-label="Pagination navigation"
                />
              </nav>
            )}
          </div>
          <div className="hidden xl:block">
            <div className="sticky top-16 -mt-10 max-h-[calc(100vh-3.5rem)] overflow-y-auto pt-10">
              <Toc toc={toc} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
