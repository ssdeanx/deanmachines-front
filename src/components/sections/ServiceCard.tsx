'use client';
import * as React from "react"
import { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IconWrapper } from "@/components/common/IconWrapper"

interface ServiceCardProps {
  title: string
  description: string
  icon: LucideIcon
  features?: string[]
  className?: string
}

export function ServiceCard({
  title,
  description,
  icon,
  features,
  className,
}: ServiceCardProps) {
  return (
    <Card className={cn("transition-all hover:shadow-lg", className)}>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <IconWrapper
            icon={icon}
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
