import * as React from "react";
import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

import { siteConfig } from "@/config/site";
import { IconWrapper } from "@/components/common/IconWrapper";

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
      { title: "About Us", href: "/about" },
      { title: "Careers", href: "/careers" },
      { title: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Support",
    items: [
      { title: "Help Center", href: "/help" },
      { title: "Terms of Service", href: "/terms" },
      { title: "Privacy Policy", href: "/privacy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto px-4 py-8">
        {/* Top Section: Copyright & Social Links */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-4 md:mb-0">
            {siteConfig.name} {new Date().getFullYear()}. All Rights Reserved.
          </p>
          <div className="flex space-x-4">
            <Link href={siteConfig.links.github} aria-label="GitHub" target="_blank" rel="noopener noreferrer">
              <IconWrapper icon={Github} className="w-5 h-5" />
            </Link>
            <Link href={siteConfig.links.twitter} aria-label="Twitter" target="_blank" rel="noopener noreferrer">
              <IconWrapper icon={Twitter} className="w-5 h-5" />
            </Link>
            <Link href={siteConfig.links.linkedin} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <IconWrapper icon={Linkedin} className="w-5 h-5" />
            </Link>
          </div>
        </div>
        <hr className="my-4 border-gray-700" />
        {/* Bottom Section: Navigation Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-2">{section.title}</h4>
              <ul className="space-y-1">
                {section.items.map((link, idx) => (
                  <li key={idx}>
                    <Link href={link.href} className="hover:text-white transition-colors">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}