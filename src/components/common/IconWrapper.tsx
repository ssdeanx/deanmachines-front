'use client';

import * as React from "react"
import { type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface IconWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon
  size?: "sm" | "md" | "lg"
  suppressHydrationWarning?: boolean
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
  suppressHydrationWarning = true,
  ...props
}: IconWrapperProps) {
  // Use React.useEffect to ensure this component only renders on the client
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Return null during SSR and initial client render
  if (!isMounted) {
    return <div className={cn(sizeClasses[size], className)} {...props} />;
  }

  return (
    <div {...props}>
      <Icon
        className={cn(sizeClasses[size], className)}
        aria-hidden="true"
        suppressHydrationWarning={suppressHydrationWarning}
      />
    </div>
  )
}
