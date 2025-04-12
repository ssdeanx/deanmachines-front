'use client'
import * as React from "react"

import { TableOfContents } from "@/types/toc"
import { cn } from "@/lib/utils"
import { useTocHighlighting } from "@/hooks/use-toc-highlighting"

interface TocProps {
  toc: TableOfContents
}

export function Toc({ toc }: TocProps) {
  const itemIds = React.useMemo(
    () => toc.items?.map((item) => item.url.slice(1)) ?? [],
    [toc]
  )
  const activeHeading = useTocHighlighting(itemIds)

  if (!toc?.items) {
    return null
  }

  return (    <nav className="space-y-3 sticky top-20 max-h-[calc(100vh-5rem)] overflow-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent pr-2" aria-label="Table of contents">
      <div className="flex items-center gap-2">
        <div className="h-4 w-1 rounded-full bg-primary"></div>
        <p className="font-medium text-sm">On This Page</p>
      </div>
      <Tree tree={toc} activeItem={activeHeading} />
    </nav>
  )
}

interface TreeProps {
  tree: TableOfContents
  level?: number
  activeItem?: string | null
}

function Tree({ tree, level = 1, activeItem }: TreeProps) {
  return tree?.items?.length ? (
    <ul className={cn("m-0 list-none", { "pl-4": level !== 1 })}>
      {tree.items.map((item, index) => {
        return (
          <li key={index} className={cn("mt-0 pt-2")}>            <a
              href={item.url}
              className={cn(
                "inline-flex items-center gap-1.5 no-underline transition-all duration-300 hover:text-foreground relative px-2 py-1 rounded-md hover:bg-primary/5",
                item.url.slice(1) === activeItem
                  ? "font-medium text-primary before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2 before:h-3 before:w-1 before:bg-primary before:rounded-full"
                  : "text-muted-foreground"
              )}
              onClick={(e) => {
                e.preventDefault()
                document.querySelector(item.url)?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                  inline: "nearest",
                })
              }}
            >
              {item.url.slice(1) === activeItem && (
                <span className="h-1.5 w-1.5 rounded-full bg-primary/80 animate-pulse" aria-hidden="true" />
              )}
              {item.title}
            </a>
            {item.items?.length ? (
              <Tree tree={item} level={level + 1} activeItem={activeItem} />
            ) : null}
          </li>
        )
      })}
    </ul>
  ) : null
}
