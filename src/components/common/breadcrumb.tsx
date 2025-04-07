import * as React from "react"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

import { cn } from "@/lib/utils"
import { IconWrapper } from "./IconWrapper"

interface BreadcrumbItem {
  title: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  const lastIndex = items.length - 1

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center text-sm text-muted-foreground",
        className
      )}
    >
      <ol className="flex items-center space-x-2" role="list">
        <li>
          <Link
            href="/"
            className="flex items-center hover:text-foreground transition-colors"
            aria-label="Home"
          >
            <IconWrapper icon={Home} size="sm" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={item.title} className="flex items-center space-x-2">
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            {item.href && index !== lastIndex ? (
              <Link
                href={item.href}
                className="hover:text-foreground transition-colors"
              >
                {item.title}
              </Link>
            ) : (
              <span
                className="text-foreground"
                {...(index === lastIndex && { "aria-current": "page" })}
              >
                {item.title}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
