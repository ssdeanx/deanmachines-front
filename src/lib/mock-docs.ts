/**
 * Mock documentation data using structured content
 *
 * This file provides sample document content for documentation pages
 * without requiring MDX or Contentlayer.
 */

import {
  DocContent,
  SectionType,
  ListType,
  CalloutType,
} from "@/lib/content-data";

/**
 * Collection of document content organized by slugAsParams path
 */
export const mockDocs: Record<string, DocContent> = {
  // Documentation index page
  index: {
    id: "documentation",
    slug: "index",
    slugAsParams: "index",
    title: "Documentation",
    description: "Documentation and guides for deanmachines AI platform.",
    contentType: "doc",
    sections: [
      {
        type: SectionType.Heading,
        level: 1,
        content: [{ text: "deanmachines AI Documentation" }],
      },
      {
        type: SectionType.Paragraph,
        content: [
          {
            text: "Welcome to the deanmachines AI documentation. Here you'll find everything you need to build and deploy intelligent AI solutions.",
          },
        ],
      },
      {
        type: SectionType.Heading,
        level: 2,
        content: [{ text: "Getting Started" }],
      },
      {
        type: SectionType.Paragraph,
        content: [
          {
            text: "Our platform provides powerful tools for creating, deploying, and managing AI agents. Follow our guides to get started quickly.",
          },
        ],
      },
      {
        type: SectionType.Heading,
        level: 2,
        content: [{ text: "Core Concepts" }],
      },
      {
        type: SectionType.Paragraph,
        content: [
          {
            text: "Understanding the key concepts behind deanmachines AI will help you build more effective solutions.",
          },
        ],
      },
      {
        type: SectionType.Heading,
        level: 2,
        content: [{ text: "Examples & Tutorials" }],
      },
      {
        type: SectionType.Paragraph,
        content: [
          {
            text: "Learn by example with our comprehensive tutorials and example projects.",
          },
        ],
      },
      {
        type: SectionType.Heading,
        level: 2,
        content: [{ text: "Popular Guides" }],
      },
      {
        type: SectionType.Paragraph,
        content: [
          {
            text: "Explore our most popular guides to solve common challenges and implement best practices.",
          },
        ],
      },
      {
        type: SectionType.Heading,
        level: 2,
        content: [{ text: "Additional Resources" }],
      },
      {
        type: SectionType.Paragraph,
        content: [
          {
            text: "Find more resources to help you make the most of the deanmachines AI platform.",
          },
        ],
      },
    ],
    next: {
      title: "Getting Started",
      slug: "getting-started",
    },
  },

  // Core Concepts Overview
  "core-concepts/overview": {
    id: "core-concepts-overview",
    slug: "core-concepts/overview",
    slugAsParams: "core-concepts/overview",
    title: "Core Concepts",
    description:
      "Understanding the fundamental concepts and architecture of deanmachines AI.",
    contentType: "doc",
    sections: [
      {
        type: SectionType.Heading,
        level: 1,
        content: [{ text: "Core Concepts" }],
      },
      {
        type: SectionType.Paragraph,
        content: [
          {
            text: "deanmachines AI is built on several key concepts that work together to create powerful AI applications.",
          },
        ],
      },
      {
        type: SectionType.Heading,
        level: 2,
        content: [{ text: "Architectural Overview" }],
      },
      {
        type: SectionType.Paragraph,
        content: [
          { text: "The platform is organized around a few central concepts:" },
        ],
      },
      {
        type: SectionType.List,
        listType: ListType.Unordered,
        items: [
          {
            content: [
              { text: "Agents", format: { bold: true } },
              { text: " - Autonomous AI entities that can perform tasks" },
            ],
          },
          {
            content: [
              { text: "Memory", format: { bold: true } },
              { text: " - Contextual storage for agents" },
            ],
          },
          {
            content: [
              { text: "Networks", format: { bold: true } },
              { text: " - Systems of interconnected agents" },
            ],
          },
          {
            content: [
              { text: "Tools", format: { bold: true } },
              {
                text: " - Capabilities that agents can use to interact with external systems",
              },
            ],
          },
          {
            content: [
              { text: "Workflows", format: { bold: true } },
              { text: " - Structured sequences of agent interactions" },
            ],
          },
        ],
      },
      {
        type: SectionType.Heading,
        level: 2,
        content: [{ text: "Components" }],
      },
      {
        type: SectionType.Callout,
        calloutType: CalloutType.Default,
        title: "Key Components",
        content: [
          {
            text: "Each deanmachines AI application consists of a Core Engine, Agent Framework, Memory Systems, and Integration Layer.",
          },
        ],
      },
      {
        type: SectionType.Heading,
        level: 3,
        content: [{ text: "Core Engine" }],
      },
      {
        type: SectionType.Paragraph,
        content: [
          { text: "The central system that orchestrates all AI activities." },
        ],
      },
      {
        type: SectionType.Code,
        language: "typescript",
        code: "import { Mastra } from '@deanmachines/core';\n\n// Initialize the core engine\nconst mastra = new Mastra({\n  apiKey: process.env.API_KEY,\n  projectId: 'my-project'\n});",
      },
      {
        type: SectionType.Heading,
        level: 3,
        content: [{ text: "Agent Framework" }],
      },
      {
        type: SectionType.Paragraph,
        content: [
          { text: "Tools and libraries for creating and managing agents." },
        ],
      },
      {
        type: SectionType.Heading,
        level: 3,
        content: [{ text: "Memory Systems" }],
      },
      {
        type: SectionType.Paragraph,
        content: [
          { text: "Storage mechanisms for maintaining context and knowledge." },
        ],
      },
      {
        type: SectionType.Heading,
        level: 3,
        content: [{ text: "Integration Layer" }],
      },
      {
        type: SectionType.Paragraph,
        content: [
          { text: "Connectors for external systems and data sources." },
        ],
      },
      {
        type: SectionType.Heading,
        level: 2,
        content: [{ text: "Interaction Patterns" }],
      },
      {
        type: SectionType.Paragraph,
        content: [
          { text: "The platform supports several interaction patterns:" },
        ],
      },
      {
        type: SectionType.List,
        listType: ListType.Ordered,
        items: [
          {
            content: [
              { text: "Direct Interaction", format: { bold: true } },
              { text: " - One-to-one conversations with agents" },
            ],
          },
          {
            content: [
              { text: "Workflow Execution", format: { bold: true } },
              { text: " - Structured processes with multiple steps" },
            ],
          },
          {
            content: [
              { text: "Agent Networks", format: { bold: true } },
              { text: " - Multiple agents collaborating on complex tasks" },
            ],
          },
          {
            content: [
              { text: "Hybrid Systems", format: { bold: true } },
              { text: " - Combinations of the above patterns" },
            ],
          },
        ],
      },
    ],
    prev: {
      title: "Documentation",
      slug: "index",
    },
    next: {
      title: "AI Agents",
      slug: "core-concepts/agents",
    },
  },

  // AI Agents
  "core-concepts/agents": {
    id: "core-concepts-agents",
    slug: "core-concepts/agents",
    slugAsParams: "core-concepts/agents",
    title: "AI Agents",
    description: "Understanding AI agents within the deanmachines AI platform.",
    contentType: "doc",
    sections: [
      {
        type: SectionType.Heading,
        level: 1,
        content: [{ text: "AI Agents" }],
      },
      {
        type: SectionType.Heading,
        level: 2,
        content: [{ text: "What are AI Agents?" }],
      },
      {
        type: SectionType.Paragraph,
        content: [
          {
            text: "AI agents are autonomous software entities that can perceive their environment, make decisions, and take actions to achieve specific goals. Within deanmachines AI, agents serve as the fundamental building blocks for creating intelligent systems.",
          },
        ],
      },
      {
        type: SectionType.Heading,
        level: 2,
        content: [{ text: "Agent Components" }],
      },
      {
        type: SectionType.List,
        listType: ListType.Unordered,
        items: [
          {
            content: [
              { text: "Perception", format: { bold: true } },
              { text: ": Processing and understanding inputs" },
            ],
          },
          {
            content: [
              { text: "Decision Making", format: { bold: true } },
              { text: ": Analyzing information and determining actions" },
            ],
          },
          {
            content: [
              { text: "Action", format: { bold: true } },
              { text: ": Executing operations based on decisions" },
            ],
          },
          {
            content: [
              { text: "Memory", format: { bold: true } },
              { text: ": Storing and retrieving information" },
            ],
          },
          {
            content: [
              { text: "Learning", format: { bold: true } },
              { text: ": Improving performance based on experience" },
            ],
          },
        ],
      },
      {
        type: SectionType.Heading,
        level: 2,
        content: [{ text: "Agent Types" }],
      },
      {
        type: SectionType.Heading,
        level: 3,
        content: [{ text: "Research Agent" }],
      },
      {
        type: SectionType.Paragraph,
        content: [
          {
            text: "Research agents specialize in information gathering and synthesis.",
          },
        ],
      },
      {
        type: SectionType.Heading,
        level: 3,
        content: [{ text: "Analyst Agent" }],
      },
      {
        type: SectionType.Paragraph,
        content: [
          {
            text: "Analyst agents focus on data processing and pattern recognition.",
          },
        ],
      },
      {
        type: SectionType.Heading,
        level: 3,
        content: [{ text: "Writer Agent" }],
      },
      {
        type: SectionType.Paragraph,
        content: [
          {
            text: "Writer agents generate natural language content based on inputs and requirements.",
          },
        ],
      },
      {
        type: SectionType.Code,
        language: "typescript",
        filename: "writer-agent-example.ts",
        code: "import { Agent } from '@deanmachines/core';\n\nconst writerAgent = new Agent({\n  name: 'ContentWriter',\n  description: 'Creates high-quality content based on outlines',\n  model: 'gemini-pro',\n  tools: ['web-search', 'document-retrieval']\n});\n\n// Use the writer agent\nconst content = await writerAgent.execute({\n  task: 'Write a blog post about AI agents',\n  tone: 'informative',\n  length: 'medium'\n});",
      },
    ],
    prev: {
      title: "Core Concepts",
      slug: "core-concepts/overview",
    },
    next: {
      title: "Memory Management",
      slug: "core-concepts/memory",
    },
  },

  // Memory Management
  "core-concepts/memory": {
    id: "core-concepts-memory",
    slug: "core-concepts/memory",
    slugAsParams: "core-concepts/memory",
    title: "Memory Management",
    description:
      "Understanding memory systems in the deanmachines AI platform.",
    contentType: "doc",
    sections: [
      {
        type: SectionType.Heading,
        level: 1,
        content: [{ text: "Memory Management" }],
      },
      {
        type: SectionType.Heading,
        level: 2,
        content: [{ text: "Overview" }],
      },
      {
        type: SectionType.Paragraph,
        content: [
          {
            text: "Memory management is a critical component of the deanmachines AI platform, allowing agents to maintain context, learn from experiences, and build knowledge over time.",
          },
        ],
      },
      {
        type: SectionType.Callout,
        calloutType: CalloutType.Warning,
        title: "Memory Configuration",
        content: [
          {
            text: "Proper memory configuration is essential for agent performance. Insufficient memory can lead to repetitive or inconsistent agent behavior.",
          },
        ],
      },
      {
        type: SectionType.Heading,
        level: 2,
        content: [{ text: "Memory Types" }],
      },
      {
        type: SectionType.Heading,
        level: 3,
        content: [{ text: "Short-Term Memory" }],
      },
      {
        type: SectionType.Paragraph,
        content: [
          {
            text: "Short-term memory provides temporary storage for recent interactions and immediate context. It typically includes:",
          },
        ],
      },
      {
        type: SectionType.List,
        listType: ListType.Unordered,
        items: [
          { content: [{ text: "Recent conversation history" }] },
          { content: [{ text: "Current task parameters" }] },
          { content: [{ text: "Active constraints and goals" }] },
        ],
      },
      {
        type: SectionType.Heading,
        level: 3,
        content: [{ text: "Long-Term Memory" }],
      },
      {
        type: SectionType.Paragraph,
        content: [
          {
            text: "Long-term memory stores persistent information that agents can access across sessions.",
          },
        ],
      },
      {
        type: SectionType.List,
        listType: ListType.Unordered,
        items: [
          { content: [{ text: "Historical interactions" }] },
          { content: [{ text: "Learned patterns and facts" }] },
          { content: [{ text: "User preferences and settings" }] },
          { content: [{ text: "Domain knowledge" }] },
        ],
      },
      {
        type: SectionType.Code,
        language: "typescript",
        code: "import { Memory } from '@deanmachines/core';\n\n// Initialize memory with persistence\nconst memory = new Memory({\n  storage: 'pinecone',\n  projectId: 'my-project',\n  namespace: 'agent-memory'\n});\n\n// Add information to memory\nawait memory.add({\n  type: 'fact',\n  content: 'The user prefers technical explanations',\n  source: 'user-interaction',\n  timestamp: Date.now()\n});",
      },
    ],
    prev: {
      title: "AI Agents",
      slug: "core-concepts/agents",
    },
    next: {
      title: "Agent Networks",
      slug: "core-concepts/networks",
    },
  },

  // Agent Networks
  "core-concepts/networks": {
    id: "core-concepts-networks",
    slug: "core-concepts/networks",
    slugAsParams: "core-concepts/networks",
    title: "Agent Networks",
    description:
      "Learn how to create and manage networks of cooperating AI agents.",
    contentType: "doc",
    sections: [
      {
        type: SectionType.Heading,
        level: 1,
        content: [{ text: "Agent Networks" }],
      },
      {
        type: SectionType.Heading,
        level: 2,
        content: [{ text: "What are Agent Networks?" }],
      },
      {
        type: SectionType.Paragraph,
        content: [
          {
            text: "Agent networks are interconnected systems of AI agents working together to solve complex problems. They enable division of labor, specialization, and collaborative problem-solving among multiple agents.",
          },
        ],
      },
      {
        type: SectionType.Image,
        src: "/images/agent-network-diagram.png",
        alt: "Diagram of an agent network showing multiple agents communicating",
        caption: "Example of an agent network with specialized roles",
      },
      {
        type: SectionType.Heading,
        level: 2,
        content: [{ text: "Network Topologies" }],
      },
      {
        type: SectionType.Heading,
        level: 3,
        content: [{ text: "Hub and Spoke" }],
      },
      {
        type: SectionType.Paragraph,
        content: [
          {
            text: "In a hub and spoke topology, a central coordinator agent delegates tasks to specialized agents and synthesizes their outputs.",
          },
        ],
      },
      {
        type: SectionType.Heading,
        level: 3,
        content: [{ text: "Mesh Network" }],
      },
      {
        type: SectionType.Paragraph,
        content: [
          {
            text: "In a mesh network, agents communicate directly with each other as needed, without a central coordinator.",
          },
        ],
      },
      {
        type: SectionType.Heading,
        level: 3,
        content: [{ text: "Hierarchical Network" }],
      },
      {
        type: SectionType.Paragraph,
        content: [
          {
            text: "In a hierarchical network, agents are organized in layers with specific responsibilities and reporting structures.",
          },
        ],
      },
      {
        type: SectionType.Code,
        language: "typescript",
        filename: "team-network-example.ts",
        code: "import { AgentNetwork } from '@deanmachines/core';\n\n// Create a team of specialized agents\nconst researchTeam = new AgentNetwork({\n  name: 'ResearchTeam',\n  agents: [\n    researchAgent,  // Finds information\n    analystAgent,   // Processes and analyzes data\n    writerAgent     // Creates final output\n  ],\n  topology: 'hierarchical',\n  coordinator: 'system'  // Platform handles coordination\n});\n\n// Execute a task with the network\nconst report = await researchTeam.execute({\n  task: 'Research emerging AI trends and create a summary report',\n  outputFormat: 'markdown',\n  depth: 'comprehensive'\n});",
      },
    ],
    prev: {
      title: "Memory Management",
      slug: "core-concepts/memory",
    },
  },

  // Getting Started
  "getting-started": {
    id: "getting-started",
    slug: "getting-started",
    slugAsParams: "getting-started",
    title: "Getting Started with deanmachines AI",
    description:
      "Learn how to create your first AI agent in just a few minutes.",
    contentType: "doc",
    sections: [
      {
        type: SectionType.Heading,
        level: 1,
        content: [{ text: "Getting Started with deanmachines AI" }],
      },
      {
        type: SectionType.Paragraph,
        content: [
          {
            text: "This guide will help you set up and deploy your first AI agent using the deanmachines platform.",
          },
        ],
      },
      {
        type: SectionType.Heading,
        level: 2,
        content: [{ text: "Prerequisites" }],
      },
      {
        type: SectionType.Paragraph,
        content: [{ text: "Before you begin, ensure you have the following:" }],
      },
      {
        type: SectionType.List,
        listType: ListType.Unordered,
        items: [
          { content: [{ text: "Node.js 20.0 or later" }] },
          {
            content: [
              { text: "npm 10.0 or later (or equivalent package manager)" },
            ],
          },
          {
            content: [
              {
                text: "deanmachines API key (sign up at dashboard.deanmachines.ai)",
              },
            ],
          },
          { content: [{ text: "Basic knowledge of JavaScript/TypeScript" }] },
        ],
      },
      {
        type: SectionType.Heading,
        level: 2,
        content: [{ text: "Installation" }],
      },
      {
        type: SectionType.Paragraph,
        content: [
          {
            text: "Install the deanmachines SDK using your preferred package manager:",
          },
        ],
      },
      {
        type: SectionType.Code,
        language: "bash",
        code: "npm install @deanmachines/sdk\n# or\nyarn add @deanmachines/sdk\n# or\npnpm add @deanmachines/sdk",
      },
      {
        type: SectionType.Callout,
        calloutType: CalloutType.Default,
        content: [
          {
            text: "Make sure to set up your environment variables with your API key before running the examples below.",
          },
        ],
      },
    ],
    prev: {
      title: "Documentation",
      slug: "index",
    },
    next: {
      title: "Core Concepts",
      slug: "core-concepts/overview",
    },
  },

  // API Reference Overview (Placeholder)
  "api-reference/overview": {
    id: "api-reference-overview",
    slug: "api-reference/overview",
    slugAsParams: "api-reference/overview",
    title: "API Reference Overview",
    description: "Overview of the deanmachines AI Platform API.",
    contentType: "doc",
    sections: [
      {
        type: SectionType.Heading,
        level: 1,
        content: [{ text: "API Reference Overview" }],
        id: "api-reference-overview"
      },
      {
        type: SectionType.Paragraph,
        content: [
          {
            text: "Welcome to the API reference for the deanmachines AI platform. Here you will find detailed information about available endpoints, parameters, and responses.",
          },
        ],
      },
      {
        type: SectionType.Heading,
        level: 2,
        content: [{ text: "Authentication" }],
        id: "authentication"
      },
      {
        type: SectionType.Paragraph,
        content: [
          { text: "Details about API authentication methods will go here." }
        ]
      },
       {
        type: SectionType.Heading,
        level: 2,
        content: [{ text: "Endpoints" }],
        id: "endpoints"
      },
      {
        type: SectionType.Paragraph,
        content: [
          { text: "A summary of the main API endpoints will be listed here." }
        ]
      }
    ],
    prev: {
      title: "Examples",
      slug: "examples/some-example",
    },
  },
};
