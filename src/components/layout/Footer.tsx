'use client';
import * as React from "react"
import Link from "next/link"
import { Github, Twitter, Linkedin } from "lucide-react"

import { siteConfig } from "@/config/site"
import { IconWrapper } from "../common/IconWrapper"

const footerLinks = [
  {
    title: "Product",
    items: [
      { title: "Features", href: "/features" },
      { title: "Pricing", href: "/pricing" },
      { title: "Documentation", href: "/docs" },
    ],
  },
  {
    title: "Company",
    items: [
      { title: "About", href: "/about" },
      { title: "Blog", href: "/blog" },
      { title: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    items: [
      { title: "Privacy", href: "/privacy" },
      { title: "Terms", href: "/terms" },
    ],
  },
]

const socialLinks = [
  { title: "GitHub", href: siteConfig.links.github, icon: Github },
  { title: "Twitter", href: siteConfig.links.twitter, icon: Twitter },
  { title: "LinkedIn", href: siteConfig.links.linkedin, icon: Linkedin },
]

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-12 md:py-16 lg:py-20">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <span className="font-bold text-xl">{siteConfig.name}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              {siteConfig.description}
            </p>
          </div>
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-3">
              <h4 className="text-base font-medium">{section.title}</h4>
              <ul className="space-y-3">
                {section.items.map((item) => (
                  <li key={item.title}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between space-y-4 border-t pt-8 sm:flex-row sm:space-y-0">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            {socialLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="text-muted-foreground hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconWrapper icon={link.icon} className="h-5 w-5" />
                <span className="sr-only">{link.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
