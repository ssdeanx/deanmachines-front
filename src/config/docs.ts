import { NavSection } from "@/types/nav";

export interface DocsConfig {
  sidebarNav: NavSection[];
}

export const docsConfig: DocsConfig = {
  sidebarNav: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/docs",
          description: "Learn about Mastra AI and how to get started.",
        },
        {
          title: "Installation",
          href: "/docs/installation",
          description: "How to install and set up your first AI agent.",
        },
        {
          title: "Quick Start",
          href: "/docs/quick-start",
          description: "Create your first AI agent in minutes.",
        },
      ],
    },
    {
      title: "Core Concepts",
      items: [
        {
          title: "Agents",
          href: "/docs/core-concepts/agents",
          description: "Understanding AI agents and their capabilities.",
        },
        {
          title: "Memory Management",
          href: "/docs/core-concepts/memory",
          description:
            "How agents maintain context and learn from interactions.",
        },
        {
          title: "Deployment",
          href: "/docs/core-concepts/deployment",
          description: "Deploying agents to production environments.",
        },
      ],
    },
    {
      title: "API Reference",
      items: [
        {
          title: "Agent API",
          href: "/docs/api-reference/agent",
          description:
            "Complete API reference for agent creation and management.",
        },
        {
          title: "Memory API",
          href: "/docs/api-reference/memory",
          description: "API reference for memory systems and storage.",
        },
        {
          title: "Deployment API",
          href: "/docs/api-reference/deployment",
          description: "API reference for deployment and scaling.",
        },
      ],
    },
  ],
};
