import * as React from "react"
import Link from "next/link"
import { type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface CallToActionProps {
  title: string
  description?: string
  href: string
  icon?: LucideIcon
  className?: string
  variant?: "default" | "secondary" | "outline"
  external?: boolean
}

export function CallToAction({
  title,
  description,
  href,
  icon: Icon,
  className,
  variant = "default",
  external = false,
}: CallToActionProps) {
  const Comp = external ? "a" : Link
  return (
    <Comp
      href={href}
      className={cn(
        buttonVariants({ variant }),
        "inline-flex items-center gap-2",
        className
      )}
      {...(external && {
        target: "_blank",
        rel: "noopener noreferrer",
        "aria-label": `${title} (opens in new tab)`,
      })}
    >
      {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
      <div className="text-left">
        <div className="text-base font-semibold">{title}</div>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </Comp>
  )
}
