'use client';
import * as React from "react"
import Link from "next/link"
import { Menu, Home } from "lucide-react"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { SearchInput } from "@/components/common/SearchInput"
import { ThemeToggle } from "@/components/common/ThemeToggle"

interface NavItem {
  title: string
  href: string
  disabled?: boolean
  external?: boolean
}

interface MainNavProps {
  items?: NavItem[]
}

export function MainNav({ items }: MainNavProps) {
  return (
    <div className="flex items-center gap-6 md:gap-10">
      <Link href="/" className="ml-4 flex items-center space-x-2 hover:opacity-80 transition-opacity">
        <span className="hidden font-bold text-xl md:inline-block">{siteConfig.name}</span>
        <span className="md:hidden font-bold text-xl">dm</span>
      </Link>
      {items?.length ? (
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/" className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          {items?.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors",
                item.disabled && "cursor-not-allowed opacity-80"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  )
}

export function NavBar() {
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-lg shadow-md">
      <div className="container flex h-16 items-center">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex items-center ml-auto space-x-4">
          <nav className="flex items-center space-x-2">
            <SearchInput />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden transition-transform hover:scale-110"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
