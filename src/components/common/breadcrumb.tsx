import * as React from "react"
import Link from "next/link"
import { ChevronRight, Home, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { IconWrapper } from "./IconWrapper"

/**
 * Represents an item in the breadcrumb navigation
 *
 * @interface BreadcrumbItem
 * @property {string} title - The display text for the breadcrumb item
 * @property {string} [href] - The optional URL this breadcrumb links to
 * @property {LucideIcon} [icon] - Optional custom icon for the breadcrumb item
 */
interface BreadcrumbItem {
  title: string
  href?: string
  icon?: LucideIcon
}

/**
 * Props for the Breadcrumb component
 *
 * @interface BreadcrumbProps
 * @property {BreadcrumbItem[]} items - Array of breadcrumb items to display
 * @property {string} [className] - Optional additional CSS classes
 * @property {boolean} [showHomeIcon=true] - Whether to show the home icon in the first position
 * @property {string} [homeHref="/"] - URL for the home breadcrumb
 * @property {string} [separator="chevron"] - Type of separator to use between items
 */
interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
  showHomeIcon?: boolean
  homeHref?: string
  separator?: "chevron" | "slash" | "dot"
}

/**
 * Renders a breadcrumb navigation component following WAI-ARIA guidelines
 *
 * @param props - Component props
 * @returns A breadcrumb navigation component with responsive design and accessibility features
 */
export function Breadcrumb({
  items,
  className,
  showHomeIcon = true,
  homeHref = "/",
  separator = "chevron"
}: BreadcrumbProps) {
  // Memoize last index calculation to avoid recalculation on re-renders
  const lastIndex = React.useMemo(() => items.length - 1, [items]);

  // Memoize separator element to prevent unnecessary re-renders
  const separatorElement = React.useMemo(() => {
    switch (separator) {
      case "slash":
        return <span className="text-muted-foreground/60" aria-hidden="true">/</span>
      case "dot":
        return <span className="text-muted-foreground/60 mx-1" aria-hidden="true">•</span>
      case "chevron":
      default:
        return <ChevronRight className="size-4 text-muted-foreground/60" aria-hidden="true" />
    }
  }, [separator]);

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center text-sm text-muted-foreground @container",
        className
      )}
    >
      <ol
        className="flex items-center flex-wrap gap-x-2 gap-y-1 w-full"
        role="list"
      >
        {/* Home item */}
        {showHomeIcon && (
          <li className="flex items-center">
            <Link
              href={homeHref}
              className="flex items-center gap-1 hover:text-foreground transition-colors duration-300
                rounded-md p-0.5 hover:bg-accent/30 active:scale-95 motion-reduce:transform-none"
              aria-label="Home"
            >
              <IconWrapper
                icon={Home}
                size="sm"
                className="text-muted-foreground/70"
                withHoverEffect
              />
              <span className="sr-only">Home</span>
            </Link>
          </li>
        )}

        {/* Breadcrumb items */}
        {items.map((item, index) => (
          <li
            key={`breadcrumb-${item.title}-${index}`}
            className="flex items-center gap-2 truncate"
            aria-hidden={item.href ? undefined : "false"}
          >
            {/* Show separator except for the first item when home icon is hidden */}
            {index > 0 || showHomeIcon ? separatorElement : null}

            {/* Render as link if it has href and is not the last item */}
            {item.href && index !== lastIndex ? (
              <Link
                href={item.href}
                className="group inline-flex items-center gap-1.5 hover:text-foreground transition-all duration-300
                  truncate rounded-md py-0.5 px-1 hover:bg-accent/20 active:scale-95 motion-reduce:transform-none"
              >
                {item.icon && (
                  <IconWrapper
                    icon={item.icon}
                    size="sm"
                    className="text-muted-foreground/70 group-hover:text-muted-foreground transition-colors"
                  />
                )}
                <span className="truncate max-w-[180px] @md:max-w-[240px] @lg:max-w-none">
                  {item.title}
                </span>
              </Link>
            ) : (
              <span
                className="flex items-center gap-1.5 text-foreground font-medium truncate
                  py-0.5 px-1 max-w-[200px] @md:max-w-[300px] @lg:max-w-none"
                {...(index === lastIndex && { "aria-current": "page" })}
              >
                {item.icon && (
                  <IconWrapper
                    icon={item.icon}
                    size="sm"
                  />
                )}
                {item.title}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
