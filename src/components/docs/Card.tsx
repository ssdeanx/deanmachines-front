"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Card component for documentation links
 * Used in MDX files to create clickable card elements with title and content
 */
export const Card = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    href?: string;
    className?: string;
    children: React.ReactNode;
    image?: string;
    title?: string;
  }
>(({ href, className, children, image, title, ...props }, ref) => {
  const cardContent = (
    <div
      ref={ref}
      className={cn(
        "group relative rounded-lg border p-4 transition-all",
        href ? "hover:border-primary hover:shadow-sm hover:bg-accent/50 cursor-pointer" : "",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );

  return href ? (
    <Link href={href} passHref legacyBehavior>
      {cardContent}
    </Link>
  ) : (
    cardContent
  );
});

Card.displayName = "Card";

export default Card;
