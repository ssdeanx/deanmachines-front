# Mastra AI Framework Reference Guide

## Overview

Mastra is a modern AI framework designed for building production-ready AI applications with a focus on agents, tools, and workflows. It provides a modular architecture that allows developers to create sophisticated AI solutions by combining different components. This document serves as a comprehensive reference guide to Mastra's capabilities, integration methods, and deployment options.

## Table of Contents

1. [Core Concepts](#core-concepts)
2. [Installation and Setup](#installation-and-setup)
3. [Static Export Support](#static-export-support)
4. [Components and APIs](#components-and-apis)
   - [Agents](#agents)
   - [Tools](#tools)
   - [Workflows](#workflows)
   - [Memory](#memory)
   - [Vectors and RAG](#vectors-and-rag)
   - [Voice and Speech](#voice-and-speech)
5. [Integration Methods](#integration-methods)
   - [Client-Side Integration](#client-side-integration)
   - [Server-Side Integration](#server-side-integration)
   - [Next.js Integration](#nextjs-integration)
   - [Firebase Integration](#firebase-integration)
6. [Advanced Features](#advanced-features)
   - [MCP (Model Context Protocol)](#mcp-model-context-protocol)
   - [Evaluation and Testing](#evaluation-and-testing)
7. [Deployment Options](#deployment-options)
8. [Troubleshooting and Best Practices](#troubleshooting-and-best-practices)
9. [References and Resources](#references-and-resources)

## Core Concepts

Mastra is built around several core concepts that work together to create a flexible AI framework:

- **Agents**: Autonomous AI assistants that perform tasks based on instructions
- **Tools**: Functional capabilities that agents can use to interact with external systems
- **Workflows**: Multi-step processes that orchestrate complex operations
- **Memory**: Persistence systems for maintaining context across interactions
- **MCP (Model Context Protocol)**: A protocol for communication between models and tools

The framework follows a modular design philosophy, allowing developers to use only the components they need and integrate them with other systems and frameworks.

## Installation and Setup

### Prerequisites

- Node.js v20.0 or higher
- Access to a supported large language model (LLM) such as OpenAI, Anthropic, or Google Gemini
- API keys for your chosen LLM provider

### Automatic Installation

Using the Mastra CLI:

```bash
# Using npx
npx create-mastra@latest

# Using npm
npm create mastra@latest

# Using yarn
yarn create mastra@latest

# Using pnpm
pnpm create mastra@latest
```

The interactive CLI will guide you through:

- Project naming
- Component selection (agents, tools, workflows)
- Default LLM provider selection
- Example code inclusion
- MCP server configuration for IDE integration

### Manual Installation

```bash
# Create project directory
mkdir my-mastra-project
cd my-mastra-project

# Initialize project with TypeScript
npm init -y
npm install typescript tsx @types/node mastra --save-dev
npm install @mastra/core zod @ai-sdk/openai
npx tsc --init

# Create basic project structure
mkdir -p src/mastra/{agents,tools,workflows}
touch src/mastra/index.ts
```

### Environment Configuration

Create a `.env` file in your project root:

```plaintext
OPENAI_API_KEY=your-openai-key
# Or for other providers:
# ANTHROPIC_API_KEY=your-anthropic-key
# GOOGLE_API_KEY=your-google-key
```

## Static Export Support

Mastra supports static exports for frameworks like Next.js, allowing AI functionality in environments without server-side capabilities.

### Client-Side Implementation

For static exports, Mastra functionality is moved from server to client:

1. **Client Wrapper**: Create a client-side wrapper using the `fetch` API
2. **External API Endpoints**: Configure external hosted API endpoints
3. **Environment Variables**: Use `NEXT_PUBLIC_*` prefix for client-side access

Example client-side wrapper:

```typescript
// lib/mastra.ts
export const clientMastra = {
  getWeatherInfo: async (city: string): Promise<any> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_WEATHER_API_URL || "https://api.example.com/weather"}?city=${encodeURIComponent(city)}`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Weather API error:", error);
      return { error: true, message: error instanceof Error ? error.message : "Failed to fetch weather data" };
    }
  },

  streamChat: async (prompt: string): Promise<ReadableStream> => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_CHAT_API_URL || "https://api.example.com/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        }
      );

      if (!response.ok) {
        throw new Error(`Chat API error: ${response.status}`);
      }

      return response.body as ReadableStream;
    } catch (error) {
      console.error("Chat API error:", error);
      // Create a stream with error message
      const encoder = new TextEncoder();
      return new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(JSON.stringify({
            error: true,
            message: error instanceof Error ? error.message : "Failed to connect"
          })));
          controller.close();
        }
      });
    }
  }
};
```

### Backend Server Requirements

Static exports require separate backend API services for Mastra functionality:

1. **External API Service**: Deploy Mastra agents and tools as serverless functions
2. **Firebase Functions**: Example implementation with Firebase Cloud Functions
3. **Environment Configuration**: Set API endpoints and authentication

Example Firebase Function setup:

```typescript
// Firebase function for Mastra agent
import * as functions from 'firebase-functions';
import { Mastra } from '@mastra/core';
import { openai } from '@ai-sdk/openai';

const mastra = new Mastra();

const weatherAgent = mastra.createAgent({
  name: "Weather Agent",
  model: openai('gpt-4o-mini'),
  instructions: "You provide weather information..."
});

export const weather = functions.https.onRequest(async (req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).send('');
    return;
  }

  try {
    const { city } = req.query;

    if (!city || typeof city !== 'string') {
      return res.status(400).json({ error: 'City parameter is required' });
    }

    const result = await weatherAgent.generate(`What's the weather like in ${city}?`);

    res.json(result);
  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});
```

## Components and APIs

### Agents

Agents are the central component of Mastra, providing an interface between LLMs and external tools.

#### Creating an Agent

```typescript
import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";

export const weatherAgent = new Agent({
  name: "Weather Agent",
  instructions: `You are a helpful weather assistant that provides accurate weather information.`,
  model: openai("gpt-4o-mini"),
  tools: { weatherTool },
});
```

#### Agent Methods

```typescript
// Generate a response
const response = await agent.generate("What's the weather in London?");

// Stream a response
const stream = await agent.stream("Tell me a story");

// Process the stream
stream.processDataStream({
  onTextPart: (text) => {
    process.stdout.write(text);
  },
  onFilePart: (file) => {
    console.log(file);
  }
});
```

### Tools

Tools extend agent capabilities by allowing interaction with external systems and APIs.

#### Creating a Tool

```typescript
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const weatherTool = createTool({
  id: "get-weather",
  description: "Get current weather for a location",
  inputSchema: z.object({
    location: z.string().describe("City name"),
  }),
  outputSchema: z.object({
    temperature: z.number(),
    humidity: z.number(),
    conditions: z.string(),
  }),
  execute: async ({ context }) => {
    return await getWeatherData(context.location);
  },
});
```

#### Tool Types

1. **Custom Tools**: Created with `createTool` for specific functionality
2. **Vector Query Tools**: For RAG applications using vector databases
3. **Document Chunker Tools**: For processing and chunking documents
4. **Graph RAG Tools**: For graph-based retrieval augmented generation
5. **MCP Tools**: For accessing Model Context Protocol capabilities

### Workflows

Workflows orchestrate complex processes involving multiple steps and agents.

#### Creating a Workflow

```typescript
import { createWorkflowFromSteps } from "@mastra/core/workflow";
import { z } from "zod";

// Define steps
const collectUserInfo = createStep({
  id: "collect-user-info",
  execution: async (context, { agent }) => {
    const result = await agent.generate("Collect user information...");
    return { userInfo: JSON.parse(result.text) };
  },
});

const generateRecommendation = createStep({
  id: "generate-recommendation",
  execution: async (context, { agent }) => {
    const userInfo = context.results.collectUserInfo.userInfo;
    const prompt = `Generate recommendations for ${userInfo.name}...`;
    return { recommendation: (await agent.generate(prompt)).text };
  },
});

// Create workflow from steps
export const recommendationWorkflow = createWorkflowFromSteps({
  name: "RecommendationWorkflow",
  steps: [collectUserInfo, generateRecommendation],
  inputSchema: z.object({
    userId: z.string(),
    preferences: z.array(z.string()),
  }),
});
```

#### Workflow Methods

```typescript
// Create a run instance
const { runId } = workflow.createRun();

// Start the workflow
const result = await workflow.startAsync({
  runId,
  triggerData: {
    userId: "user123",
    preferences: ["outdoor", "adventure"],
  },
});

// Watch workflow transitions
workflow.watch({ runId }, (record) => {
  console.log({
    activePaths: record.activePaths,
    results: record.results,
    timestamp: record.timestamp
  });
});
```

### Memory

Mastra provides memory systems for maintaining conversation context and history.

#### Memory Setup

```typescript
import { createMemoryAdapter } from "@mastra/memory";
import { Mastra } from "@mastra/core";

// Initialize memory
const memoryAdapter = createMemoryAdapter({
  provider: "mem0", // Could be upstash, postgres, etc.
  config: {
    url: process.env.MEMORY_URL,
  },
});

// Create Mastra instance with memory
const mastra = new Mastra({
  memory: memoryAdapter,
});
```

#### Memory Operations

```typescript
// Create a memory thread
const thread = await mastra.memory.createThread({
  title: "User Conversation",
  metadata: { userId: "user123" },
});

// Save messages to memory
await mastra.memory.saveMessages({
  messages: [
    {
      role: "user",
      content: "Hello!",
      threadId: thread.id,
    }
  ],
});

// Retrieve thread messages
const messages = await mastra.memory.getThreadMessages(thread.id);
```

### Vectors and RAG

Mastra supports Retrieval Augmented Generation (RAG) through vector stores and embedding models.

#### Vector Store Setup

```typescript
import { createVectorStore } from "@mastra/core/vector";
import { openai } from "@ai-sdk/openai";

// Initialize vector store
const vectorStore = createVectorStore({
  provider: "pinecone",
  indexName: "documents",
  dimensions: 1536,
});

// Create vector query tool
const queryTool = createVectorQueryTool({
  vectorStoreName: "pinecone",
  indexName: "documents",
  model: openai.embedding('text-embedding-3-small'),
});
```

#### RAG Operations

```typescript
// Add documents to vector store
await vectorStore.addDocuments([
  { content: "Document content...", metadata: { source: "article" } },
]);

// Query the vector store
const results = await vectorStore.similaritySearch(
  "What is Mastra?",
  { k: 5 }
);
```

### Voice and Speech

Mastra supports voice interfaces through various providers.

#### Voice Integration

```typescript
import { createSpeechToText, createTextToSpeech } from "@mastra/voice-google";

// Create speech-to-text service
const speechToText = createSpeechToText({
  apiKey: process.env.GOOGLE_API_KEY,
});

// Create text-to-speech service
const textToSpeech = createTextToSpeech({
  apiKey: process.env.GOOGLE_API_KEY,
  voice: "en-US-Standard-A",
});

// Speech-to-text conversion
const transcription = await speechToText.transcribe(audioBuffer);

// Text-to-speech conversion
const audio = await textToSpeech.synthesize("Hello, world!");
```

## Integration Methods

### Client-Side Integration

For frontend applications, Mastra provides the `@mastra/client-js` package:

```typescript
import { MastraClient } from "@mastra/client-js";

// Initialize client
const client = new MastraClient({
  baseUrl: "https://api.example.com/mastra",
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
});

// Use the client
const agent = client.getAgent("weatherAgent");
const response = await agent.generate("What's the weather in London?");
```

### Server-Side Integration

For server applications, use the core Mastra library:

```typescript
import { Mastra } from "@mastra/core";

// Initialize Mastra
const mastra = new Mastra({
  agents: { weatherAgent },
  tools: { weatherTool },
});

// Start the server
import { createServer } from "@mastra/server";

const server = createServer({
  mastra,
  port: 4111,
});

server.start();
```

### Next.js Integration

#### API Routes

```typescript
// app/api/chat/route.ts
import { mastra } from "@/mastra";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const agent = mastra.getAgent("chatAgent");

  const result = await agent.stream(prompt);
  return result.toDataStreamResponse();
}
```

#### Server Actions

```typescript
// app/actions.ts
"use server";

import { mastra } from "@/mastra";

export async function getWeatherInfo(city: string) {
  const agent = mastra.getAgent("weatherAgent");
  const result = await agent.generate(`What's the weather like in ${city}?`);
  return result;
}
```

### Firebase Integration

For static exports with Firebase:

1. **Firebase Functions**: Deploy Mastra backend as Firebase Functions
2. **Client Integration**: Use client-side wrappers to call Firebase Function endpoints
3. **Authentication**: Integrate with Firebase Authentication

## Advanced Features

### MCP (Model Context Protocol)

MCP enables communication between models and tools through a standardized protocol.

#### MCP Server Configuration

```json
// .cursor/mcp.json
{
  "mcpServers": {
    "mastra": {
      "command": "npx",
      "args": ["-y", "@mastra/mcp-docs-server@latest"]
    }
  }
}
```

#### Using MCP with Agents

```typescript
import { MCPConfiguration } from '@mastra/mcp';
import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';

// Configure MCP
const mcp = new MCPConfiguration({
  servers: {
    fetch: {
      command: "npx",
      args: ["tsx", "fetch-server.ts"],
    },
  },
});

// Create agent with MCP tools
const agent = new Agent({
  name: "Web Agent",
  instructions: "You can fetch data from websites",
  model: openai("gpt-4"),
  tools: await mcp.getTools(),
});
```

### Evaluation and Testing

Mastra provides evaluation tools for testing agent performance:

```typescript
import { createEval } from "@mastra/evals";

// Create evaluation
const weatherEval = createEval({
  name: "weather-accuracy",
  description: "Evaluates weather information accuracy",
  tests: [
    {
      input: "What's the weather in London?",
      assertion: (response) => {
        return response.includes("temperature") && response.includes("London");
      },
    },
  ],
});

// Run evaluation
const results = await weatherEval.run(weatherAgent);
console.log(results);
```

## Deployment Options

### Firebase Deployment

1. **Firebase Functions**: Deploy Mastra backend

   ```bash
   firebase deploy --only functions
   ```

2. **Firebase Hosting**: Deploy static frontend

   ```bash
   npm run build && firebase deploy --only hosting
   ```

### Vercel Deployment

For Next.js applications:

```bash
vercel deploy
```

### Docker Deployment

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## Troubleshooting and Best Practices

### Common Issues

1. **API Key Configuration**: Ensure API keys are properly set in environment variables
2. **Memory Persistence**: Use appropriate memory adapters for your deployment environment
3. **Static Export Limitations**: Be aware of client-side limitations in static exports

### Best Practices

1. **Modular Design**: Use separate files for agents, tools, and workflows
2. **Error Handling**: Implement comprehensive error handling in tool execution
3. **Input Validation**: Use Zod schemas to validate inputs and outputs
4. **Testing**: Create evaluation tests for agents to ensure reliability

## References and Resources

### Official Resources

- [Mastra Documentation](https://mastra.ai/docs)
- [Mastra GitHub Repository](https://github.com/mastra-ai/mastra)
- [Mastra Examples](https://github.com/mastra-ai/examples)

### Community Resources

- [Mastra Discord Community](https://discord.gg/mastra)
- [Mastra Blog](https://mastra.ai/blog)

### Related Technologies

- [Model Context Protocol](https://modelcontextprotocol.github.io/)
- [AI SDK](https://ai-sdk.dev)
- [LangChain](https://js.langchain.com)
