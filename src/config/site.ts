import { NavItem } from "@/types/nav";

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    linkedin: string;
    twitter: string;
    github: string;
    discord?: string;
    docs: string;
  };
  mainNav: NavItem[];
}

export const siteConfig: SiteConfig = {
  name: "Deanmachines AI",
  description:
    "Build and deploy intelligent AI agents that adapt to your needs.",
  url: "https://deanmachines.com",
  ogImage: "/og.jpg",
  links: {
    linkedin: "https://linkedin.com/in/deanmachinesai", // Add the missing linkedin link here
    twitter: "https://twitter.com/deanmachinesai",
    github: "https://github.com/ssdeanx",
    discord: "https://discord.gg/deanmachinesai",
    docs: "/docs",
  },
  mainNav: [
    {
      title: "Services",
      href: "/services",
    },
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "Blog",
      href: "/blog",
    },
    {
      title: "Pricing",
      href: "/pricing",
    },
    {
      title: "Contact",
      href: "/contact",
    },
    {
      title: "About",
      href: "/about",
    },
  ],
};
