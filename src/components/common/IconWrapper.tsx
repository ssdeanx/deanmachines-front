import * as React from "react"
import { type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface IconWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon
  size?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
} as const

export function IconWrapper({
  icon: Icon,
  size = "md",
  className,
  ...props
}: IconWrapperProps) {
  return (
    <div {...props}>
      <Icon className={cn(sizeClasses[size], className)} aria-hidden="true" />
    </div>
  )
}
