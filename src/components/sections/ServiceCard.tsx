'use client'
import * as React from "react"
import { LucideIcon } from "lucide-react"
import * as icons from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IconWrapper } from "@/components/common/IconWrapper"

// Define the type for valid icon names based on the lucide-react export
type IconName = keyof typeof icons;

interface ServiceCardProps {
  title: string
  description: string
  iconName: IconName // Use the specific type for icon names
  features?: string[]
  className?: string
}

export function ServiceCard({
  title,
  description,
  iconName,
  features,
  className,
}: ServiceCardProps) {
  const Icon = icons[iconName] as LucideIcon

  return (
    <Card className={cn("transition-all hover:shadow-lg", className)}>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <IconWrapper
            icon={Icon}
            size="lg"
            className="rounded-lg border bg-muted p-2"
          />
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      {features && (
        <CardContent>
          <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
            {features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </CardContent>
      )}
    </Card>
  )
}
