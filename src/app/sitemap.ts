import { MetadataRoute } from "next";
import { mockDocs } from "@/lib/mock-docs";

/**
 * Generate sitemap for all public pages
 * Compatible with static exports and Firebase hosting
 * @returns Sitemap configuration for the website
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // For Firebase static hosting (update with your Firebase project domain or custom domain)
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://deanmachines-front.web.app";

  // Main pages
  const routes = [
    "",
    "/about",
    "/blog",
    "/contact",
    "/docs",
    "/features",
    "/login",
    "/pricing",
    "/privacy",
    "/services",
    "/signup",
    "/solutions",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Blog posts - in a real app, these would be dynamically generated
  const blogPosts = [
    "/blog/my-first-post",
    // Add more blog posts here as they're created
  ].map((post) => ({
    url: `${baseUrl}${post}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Documentation pages - dynamically generated from mockDocs
  const docsSections = Object.keys(mockDocs).map((slug) => ({
    url: `${baseUrl}/docs/${slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...routes, ...blogPosts, ...docsSections];
}
