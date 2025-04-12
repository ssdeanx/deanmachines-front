# Mastra Documentation Reference

## Overview

Mastra is an opinionated TypeScript framework for building AI applications and features quickly. It provides a comprehensive set of primitives including workflows, agents, RAG (Retrieval Augmented Generation), integrations, and evals. Mastra applications can run locally or be deployed to serverless cloud environments.

## Key Components

### LLM Models

Mastra uses the Vercel AI SDK for model routing, providing a unified interface to interact with LLM providers:
- **OpenAI**: GPT-4, GPT-3.5-turbo
- **Anthropic**: Claude 3 Opus, Claude 3 Sonnet, Claude 3 Haiku
- **Google Gemini**: Gemini 1.5 Pro, Gemini 1.5 Flash, Vertex AI integration
- **Groq**: LLaMA 3-70B
- **Cerebras**: models supported

### Agents

Agents provide LLM models with tools, workflows, and synced data:

```typescript
import { Mastra } from "@mastra/core";
import { createTool } from "@mastra/core";

// Initialize Mastra
const mastra = new Mastra({
  apiKey: process.env.OPENAI_API_KEY,  // Required for OpenAI models
});

// Create an agent
const weatherAgent = mastra.createAgent({
  name: "weatherAgent",
  description: "Provides weather information",
  model: {
    provider: "google",  // Using Google's Vertex AI
    name: "gemini-1.5-pro",
  },
  tools: [myWeatherTool], // Custom tools for the agent
});

// Generate a response
const response = await weatherAgent.generate("What's the weather in San Francisco?");
```

### Tools

Tools are typed functions that can be executed by agents or workflows:

```typescript
import { createTool } from "@mastra/core";
import { z } from "zod";

// Define a weather tool
const weatherTool = createTool({
  name: "getWeather",
  description: "Get the current weather for a location",
  schema: z.object({
    location: z.string().describe("The location to get weather for"),
  }),
  execute: async ({ location }) => {
    // Fetch weather data from API
    const response = await fetch(`https://api.weather.com?location=${encodeURIComponent(location)}`);
    const data = await response.json();
    return data;
  },
});
```

### Workflows

Workflows are durable graph-based state machines that support:
- Loops and branching
- Human input
- Nested workflows
- Error handling and retries
- Parsing operations

```typescript
import { createWorkflow } from "@mastra/core";

// Define a workflow
const orderProcessingWorkflow = createWorkflow({
  name: "orderProcessing",
  steps: {
    validateOrder: {
      run: async (context) => {
        // Validation logic
        const { orderId } = context.input;
        // Return next step
        return { nextStep: "processPayment", output: { orderId, isValid: true } };
      },
    },
    processPayment: {
      run: async (context) => {
        // Payment processing logic
        // Return next step
        return { nextStep: "sendConfirmation" };
      },
    },
    sendConfirmation: {
      run: async (context) => {
        // Send confirmation logic
        return { nextStep: "end" };
      },
    },
  },
});

// Execute workflow
const result = await orderProcessingWorkflow.execute({
  input: { orderId: "123" },
});
```

### RAG (Retrieval Augmented Generation)

Retrieval-augmented generation lets you construct a knowledge base for agents:

```typescript
import { Mastra } from "@mastra/core";
import { createVectorStore } from "@mastra/pinecone";
import { createRAG } from "@mastra/rag";

// Initialize vector store
const vectorStore = createVectorStore({
  provider: "pinecone",
  apiKey: process.env.PINECONE_API_KEY,
  index: "my-index",
});

// Create RAG system
const rag = createRAG({
  vectorStore,
  embedModel: "openai:text-embedding-ada-002",
});

// Add documents to knowledge base
await rag.addDocuments([
  { id: "1", text: "Document content 1", metadata: { source: "file1.txt" } },
  { id: "2", text: "Document content 2", metadata: { source: "file2.txt" } },
]);

// Query the knowledge base
const results = await rag.query({
  text: "Query text",
  topK: 3,
});
```

### Memory and Storage

Mastra provides memory solutions for conversational AI:

```typescript
import { createMemory } from "@mastra/memory";

// Initialize memory
const memory = createMemory({
  provider: "upstash", // or "pinecone", "pg", "clickhouse", etc.
  connection: { /* connection details */ },
});

// Store conversation context
await memory.set("conversation-123", {
  history: [
    { role: "user", content: "Hello" },
    { role: "assistant", content: "Hi there! How can I help you today?" }
  ]
});

// Retrieve conversation context
const context = await memory.get("conversation-123");
```

#### ClickHouse Integration

Mastra provides integration with ClickHouse for high-performance analytics and storage:

```typescript
import { createMemory } from "@mastra/memory";
import { ClickHouseProvider } from "@mastra/clickhouse";

// Initialize ClickHouse provider
const clickhouseProvider = new ClickHouseProvider({
  host: process.env.CLICKHOUSE_HOST || "http://localhost:8123",
  username: process.env.CLICKHOUSE_USER || "default",
  password: process.env.CLICKHOUSE_PASSWORD || "",
  database: process.env.CLICKHOUSE_DB || "default",
});

// Create memory instance with ClickHouse
const memory = createMemory({
  provider: "clickhouse",
  connection: clickhouseProvider,
});

// Use memory for chat history and analytics
await memory.set("conversation-123", {
  history: [...messages],
  metadata: {
    userId: "user-123",
    sessionId: "session-456",
    analytics: { duration: 120, satisfaction: 0.95 }
  }
});

// Query analytics data with ClickHouse's powerful SQL capabilities
const analyticsData = await clickhouseProvider.executeQuery(`
  SELECT
    userId,
    AVG(metadata.analytics.satisfaction) as avgSatisfaction
  FROM conversations
  GROUP BY userId
  ORDER BY avgSatisfaction DESC
  LIMIT 10
`);
```

### Voice Integration

Mastra supports voice synthesis with multiple providers:

```typescript
import { createVoice } from "@mastra/voice-elevenlabs"; // or voice-google

// Initialize voice
const voice = createVoice({
  apiKey: process.env.ELEVENLABS_API_KEY,
  voiceId: "voice-id",
});

// Convert text to speech
const audio = await voice.textToSpeech("Hello, how can I help you today?");
```

## Static Export Implementation

For static exports in Next.js, server-side Mastra functionality needs to be moved to external API endpoints. Below is the implementation pattern used in this project:

### Client-Side Mastra Wrapper

```typescript
// src/lib/mastra.ts
export const clientMastra = {
  /**
   * Get weather information for a specific city
   */
  getWeatherInfo: async (city: string): Promise<any> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_WEATHER_API_URL}?city=${encodeURIComponent(city)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(process.env.NEXT_PUBLIC_API_KEY ? { "x-api-key": process.env.NEXT_PUBLIC_API_KEY } : {}),
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      return {
        error: true,
        message: error instanceof Error ? error.message : "Failed to fetch weather data"
      };
    }
  },

  /**
   * Stream chat completions
   */
  streamChat: async (prompt: string): Promise<ReadableStream> => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_CHAT_API_URL || "https://api.deanmachines.com/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(process.env.NEXT_PUBLIC_API_KEY ? { "x-api-key": process.env.NEXT_PUBLIC_API_KEY } : {}),
          },
          body: JSON.stringify({ prompt }),
        }
      );

      return response.body as ReadableStream;
    } catch (error) {
      // Create a stream that contains an error message
      const encoder = new TextEncoder();
      const message = error instanceof Error ? error.message : "Failed to connect to chat service";

      return new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(JSON.stringify({ error: true, message })));
          controller.close();
        }
      });
    }
  }
};
```

## Server & Deployment

### Mastra Server (@mastra/server)

The `@mastra/server` package allows you to create standalone API servers for your Mastra agents and workflows that can be deployed separately from your static Next.js application:

```typescript
import { createServer } from "@mastra/server";
import { Mastra } from "@mastra/core";
import { weatherAgent } from "./agents/weather";

// Initialize Mastra
const mastra = new Mastra({
  apiKey: process.env.OPENAI_API_KEY,
});

// Register your agents
mastra.registerAgent(weatherAgent);

// Create server with custom routes
const server = createServer({
  mastra,
  cors: {
    origin: ["https://deanmachines.com", "https://deanmachines-front.web.app"],
    methods: ["GET", "POST"],
  },
  routes: [
    {
      path: "/weather",
      method: "get",
      handler: async (req, res) => {
        try {
          const { city } = req.query;
          const agent = mastra.getAgent("weatherAgent");
          const result = await agent.generate(`What's the weather like in ${city}?`);
          res.json(result);
        } catch (error) {
          res.status(500).json({ error: "Failed to get weather data" });
        }
      },
    },
    {
      path: "/chat",
      method: "post",
      handler: async (req, res) => {
        try {
          const { prompt } = req.body;
          const agent = mastra.getAgent("writerAgent");

          // For streaming responses
          res.setHeader("Content-Type", "text/event-stream");
          res.setHeader("Cache-Control", "no-cache");
          res.setHeader("Connection", "keep-alive");

          const stream = await agent.stream(prompt);

          for await (const chunk of stream) {
            res.write(`data: ${JSON.stringify(chunk)}\n\n`);
          }

          res.end();
        } catch (error) {
          res.status(500).json({ error: "Chat error" });
        }
      },
    },
  ],
});

// Start server
server.listen(4111, () => {
  console.log("Mastra server running on http://localhost:4111");
});
```

### Mastra Deployer (@mastra/deployer) with Firebase/Google Cloud

Based on verified research, the `@mastra/deployer` package provides tools for deploying Mastra applications to Firebase and Google Cloud:

```typescript
import { createDeployer } from "@mastra/deployer";
import { firebase } from "@mastra/deployer/providers/firebase";
import * as dotenv from "dotenv";

/**
 * Deploy Mastra application to Firebase/Google Cloud Functions
 *
 * @returns {Promise<void>}
 */
async function deployToGoogleCloud(): Promise<void> {
  // Load environment variables
  dotenv.config();

  try {
    console.log("Initializing Mastra deployer for Google Cloud (Firebase)...");

    // Create deployer with Firebase provider
    const deployer = createDeployer({
      provider: firebase({
        projectId: process.env.FIREBASE_PROJECT_ID || "deanmachines-front",
        // Optional: path to service account credentials for CI/CD environments
        serviceAccountPath: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      }),

      // Deployment configuration
      config: {
        name: "mastra-api",
        // Main entry point for your Firebase Functions
        entrypoint: "./functions/src/index.ts",

        // Environment variables to be securely stored in Firebase Functions
        envVars: {
          // AI provider keys
          OPENAI_API_KEY: process.env.OPENAI_API_KEY,
          ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
          GOOGLE_GENERATIVE_AI_KEY: process.env.GOOGLE_GENERATIVE_AI_KEY,

          // Vertex AI configuration
          GOOGLE_PROJECT_ID: process.env.GOOGLE_PROJECT_ID,
          VERTEX_AI_LOCATION: process.env.VERTEX_AI_LOCATION || "us-central1",
          VERTEX_CREDENTIALS_FILE: "/path/to/vertex-credentials.json",

          // Vector store configuration
          PINECONE_API_KEY: process.env.PINECONE_API_KEY,
          PINECONE_ENVIRONMENT: process.env.PINECONE_ENVIRONMENT,

          // Frontend URLs for CORS
          ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || "https://deanmachines-front.web.app,https://deanmachines.com",
        },

        // Firebase-specific configuration
        firebase: {
          region: process.env.FIREBASE_REGION || "us-central1", // Default region for functions
          runtime: "nodejs20",                                 // Node.js runtime version
          memory: process.env.FUNCTION_MEMORY || "1GB",        // Memory allocation (LLM operations need more)
          timeoutSeconds: 540,                                 // Maximum execution time (9 minutes)
          minInstances: 0,                                     // Minimum instances to keep warm
          maxInstances: 10,                                    // Maximum instances for scaling
        },
      },
    });

    console.log("Starting deployment to Firebase/Google Cloud...");
    const deployment = await deployer.deploy();

    console.log(`Deployment successful!`);
    console.log(`Functions available at: ${deployment.url}`);

  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

// Run the deployment
deployToGoogleCloud().catch(console.error);
```

## Implementing Firebase/Google Cloud Functions with Mastra and Vertex AI

Based on verified research, the following implementation demonstrates how to use Firebase Functions with Mastra and Google Vertex AI for static exports:

### Firebase Functions Setup for Mastra

```typescript
// functions/src/index.ts
import * as functions from 'firebase-functions';
import { Mastra } from '@mastra/core';
import { createTool } from '@mastra/core';
import { z } from 'zod';

// Import Google AI SDK integration for Vertex AI
import { GoogleVertexAI } from '@ai-sdk/google-vertex';

/**
 * Initialize Mastra with Vertex AI integration
 *
 * @returns {Promise<Mastra>} Configured Mastra instance
 */
async function initMastra(): Promise<Mastra> {
  // Get authentication configuration from environment
  const projectId = process.env.GOOGLE_PROJECT_ID;
  const location = process.env.VERTEX_AI_LOCATION || 'us-central1';

  if (!projectId) {
    throw new Error("Missing required environment variable: GOOGLE_PROJECT_ID");
  }

  // Initialize Google Vertex AI provider
  const vertexAI = new GoogleVertexAI({
    projectId,
    location,
    // Defaults to Application Default Credentials when deployed to GCP
    // Can also use explicit credentials path for local development
    credentials: process.env.VERTEX_CREDENTIALS_FILE
      ? JSON.parse(require('fs').readFileSync(process.env.VERTEX_CREDENTIALS_FILE, 'utf8'))
      : undefined,
  });

  // Initialize Mastra with configured providers
  const mastra = new Mastra({
    // Configure AI providers
    providers: {
      google: vertexAI,
    },
    // Optional: Add logging for Firebase
    logger: {
      info: console.info,
      warn: console.warn,
      error: console.error,
      debug: process.env.NODE_ENV !== 'production' ? console.debug : () => {},
    },
  });

  // Register agents and tools
  await setupAgents(mastra);

  return mastra;
}

/**
 * Setup Mastra agents with Google Vertex AI models
 *
 * @param {Mastra} mastra - Mastra instance
 */
async function setupAgents(mastra: Mastra): Promise<void> {
  // Create a weather tool
  const weatherTool = createTool({
    name: 'getWeather',
    description: 'Get current weather information for a location',
    schema: z.object({
      location: z.string().describe('The city or location to get weather for'),
    }),
    execute: async ({ location }) => {
      // In production, you would call a weather API
      // Mock response for demonstration
      return {
        location,
        temperature: Math.round(10 + Math.random() * 20),
        condition: ['Sunny', 'Cloudy', 'Rainy', 'Snowy'][Math.floor(Math.random() * 4)],
        humidity: Math.round(30 + Math.random() * 50),
      };
    },
  });

  // Register a weather agent using Google Vertex AI
  mastra.createAgent({
    name: 'weatherAgent',
    description: 'Provides weather information',
    model: {
      provider: 'google', // Using Google's Vertex AI
      name: 'gemini-1.5-pro', // Or another supported model
    },
    tools: [weatherTool],
    // Additional configuration for the agent
    configuration: {
      temperature: 0.2,
      maxOutputTokens: 500,
    },
  });

  // Create a writing agent
  mastra.createAgent({
    name: 'writerAgent',
    description: 'Assists with creative writing and content generation',
    model: {
      provider: 'google',
      name: 'gemini-1.5-flash', // Using a faster model for content generation
    },
    // No specific tools needed for basic text generation
    configuration: {
      temperature: 0.7, // Higher creativity
      maxOutputTokens: 1000,
    },
  });
}

// Parse CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['https://deanmachines-front.web.app', 'https://deanmachines.com'];

// Helper for handling CORS
const handleCors = (req: functions.https.Request, res: functions.Response) => {
  // Check if the request origin is in our allowed origins
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.set('Access-Control-Allow-Origin', origin);
  } else {
    // Default when origin header is missing
    res.set('Access-Control-Allow-Origin', allowedOrigins[0]);
  }

  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');
  res.set('Access-Control-Max-Age', '3600');
};

// Weather endpoint using Mastra agent with Vertex AI
export const weather = functions
  .runWith({
    timeoutSeconds: 300,  // 5 minutes
    memory: '1GB',        // 1GB of memory
  })
  .https.onRequest(async (req, res) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      handleCors(req, res);
      res.status(204).send('');
      return;
    }

    handleCors(req, res);

    try {
      const mastra = await initMastra();
      const { city } = req.query;

      if (!city || typeof city !== 'string') {
        return res.status(400).json({ error: 'City parameter is required' });
      }

      const agent = mastra.getAgent('weatherAgent');
      const result = await agent.generate(`What's the weather like in ${city}?`);

      res.json(result);
    } catch (error) {
      console.error('Weather API error:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  });

// Chat streaming endpoint using Mastra agent with Vertex AI
export const chat = functions
  .runWith({
    timeoutSeconds: 540,  // 9 minutes (max allowed)
    memory: '1GB',        // 1GB of memory
  })
  .https.onRequest(async (req, res) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      handleCors(req, res);
      res.status(204).send('');
      return;
    }

    handleCors(req, res);

    try {
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      const mastra = await initMastra();
      const { prompt } = req.body;

      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Prompt parameter is required' });
      }

      const agent = mastra.getAgent('writerAgent');

      // Configure response for streaming
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // Stream the response using Vertex AI
      const stream = await agent.stream(prompt);

      // Process each chunk in the stream
      for await (const chunk of stream) {
        // Send the chunk as an SSE event
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      }

      // End the response
      res.end();
    } catch (error) {
      console.error('Chat API error:', error);

      if (!res.headersSent) {
        res.status(500).json({
          error: error instanceof Error ? error.message : 'Internal server error'
        });
      } else {
        // If streaming has started, send error as SSE event
        res.write(`data: ${JSON.stringify({ error: 'Stream error occurred' })}\n\n`);
        res.end();
      }
    }
  });
```

## Setting Up Google Cloud / Firebase for Mastra Deployment

### 1. Project Setup in Google Cloud Console

1. Create a new project or use an existing one in the [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the required APIs:
   - Cloud Functions API
   - Cloud Build API
   - Vertex AI API
   - Firebase Admin API
   - IAM API
   - Secret Manager API (for securely storing API keys)

### 2. Service Account Setup

1. Create a service account for deployment in the Google Cloud Console
2. Grant the following roles:
   - Cloud Functions Admin
   - Cloud Run Admin
   - Storage Admin
   - Service Account User
   - Vertex AI User
3. Generate and download a JSON key for the service account
4. Store the key securely and reference it in your deployment scripts

### 3. Firebase Project Setup

1. Create a new Firebase project or link your existing Google Cloud project
2. Enable Firebase Hosting
3. Configure your firebase.json file:

```json
{
  "hosting": {
    "public": "out",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "/api/weather",
        "function": "weather"
      },
      {
        "source": "/api/chat",
        "function": "chat"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css|jpg|jpeg|gif|png)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs20",
    "predeploy": [
      "npm --prefix \"$RESOURCE_DIR\" run build"
    ]
  },
  "emulators": {
    "functions": {
      "port": 5001
    },
    "hosting": {
      "port": 5000
    },
    "ui": {
      "enabled": true
    }
  }
}
```

### 4. Functions Directory Setup

1. Create a functions directory structure:

```
functions/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts          # Main entry point with Firebase Functions
│   ├── mastra.ts         # Mastra configuration
│   ├── agents/           # Agent definitions
│   │   ├── index.ts
│   │   ├── weather.ts
│   │   └── writer.ts
│   ├── tools/            # Custom tools
│   │   ├── index.ts
│   │   └── weather.ts
│   └── utils/            # Utility functions
│       └── index.ts
```

2. Configure `functions/package.json`:

```json
{
  "name": "deanmachines-mastra-functions",
  "version": "1.0.0",
  "description": "Firebase Functions for Mastra AI integration",
  "main": "lib/index.js",
  "scripts": {
    "build": "tsc",
    "deploy": "firebase deploy --only functions",
    "serve": "npm run build && firebase emulators:start --only functions",
    "logs": "firebase functions:log"
  },
  "engines": {
    "node": "20"
  },
  "dependencies": {
    "@ai-sdk/google": "^1.2.10",
    "@ai-sdk/google-vertex": "^2.2.14",
    "@ai-sdk/provider": "^1.1.2",
    "@mastra/core": "^0.8.2",
    "@mastra/memory": "^0.2.9",
    "@mastra/clickhouse": "^0.2.9",
    "firebase-admin": "^12.0.0",
    "firebase-functions": "^4.5.0",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "typescript": "^5.8.3",
    "firebase-functions-test": "^3.1.1",
    "@types/node": "^20.10.5"
  },
  "private": true
}
```

3. Configure TypeScript (`functions/tsconfig.json`):

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "outDir": "lib",
    "strict": true,
    "target": "es2020",
    "skipLibCheck": true,
    "esModuleInterop": true
  },
  "compileOnSave": true,
  "include": [
    "src"
  ]
}
```

### 5. Setting Environment Variables for Firebase Functions

To securely set environment variables for Firebase Functions:

```bash
# Set up Google API keys
firebase functions:config:set google.project_id="your-google-project-id"
firebase functions:config:set google.location="us-central1"

# Set up Vertex AI configuration
firebase functions:config:set vertexai.model="gemini-1.5-pro"

# Set up API keys for other providers (if used)
firebase functions:config:set openai.key="your-openai-api-key"
firebase functions:config:set anthropic.key="your-anthropic-api-key"

# Set up allowed origins for CORS
firebase functions:config:set cors.origins="https://deanmachines-front.web.app,https://deanmachines.com"
```

### 6. Automation Scripts for Deployment

Create a deployment script in your root directory:

```typescript
// scripts/deploy.ts
import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

// Load environment variables
dotenv.config();

/**
 * Deploy frontend and backend for static exports with Mastra
 */
async function deploy() {
  try {
    // Ensure we have the necessary environment variables
    const requiredEnvVars = [
      'GOOGLE_PROJECT_ID',
      'FIREBASE_PROJECT_ID'
    ];

    const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    // Build Next.js static export
    console.log('Building Next.js static export...');
    execSync('next build', { stdio: 'inherit' });

    // Deploy Firebase Functions
    console.log('Deploying Firebase Functions...');
    execSync('cd functions && npm run build && cd .. && firebase deploy --only functions', {
      stdio: 'inherit',
    });

    // Deploy Firebase Hosting (static files)
    console.log('Deploying Firebase Hosting...');
    execSync('firebase deploy --only hosting', { stdio: 'inherit' });

    console.log('Deployment completed successfully!');
  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
}

deploy().catch(console.error);
```

Add this to your package.json scripts:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "deploy": "ts-node scripts/deploy.ts",
  "deploy:functions": "cd functions && npm run deploy",
  "deploy:hosting": "next build && firebase deploy --only hosting"
}
```

## MCP (Model Context Protocol) Integration

Mastra provides an MCP documentation server that gives AI assistants and IDE's structured access to Mastra's knowledge base:

```bash
# Install with
pnpm create mastra@latest
# Select Cursor or Windsurf when prompted to install MCP server
```

## Environment Variables for Static Export

Configure the following environment variables for Mastra in static exports:

```
# Base URL of Mastra API
NEXT_PUBLIC_MASTRA_API_URL=https://us-central1-deanmachines-front.cloudfunctions.net/mastra

# API key for authentication
NEXT_PUBLIC_API_KEY=your-api-key-here

# Specific endpoint URLs
NEXT_PUBLIC_WEATHER_API_URL=https://us-central1-deanmachines-front.cloudfunctions.net/weather
NEXT_PUBLIC_CHAT_API_URL=https://us-central1-deanmachines-front.cloudfunctions.net/chat

# Site URL for SEO
NEXT_PUBLIC_SITE_URL=https://deanmachines-front.web.app
```

## Package Versions

Current versions of Mastra packages in this project:

| Package | Version |
| ------- | ------- |
| @mastra/client-js | 0.1.16 |
| @mastra/core | 0.8.2 |
| @mastra/loggers | 0.1.17 |
| @mastra/memory | 0.2.9 |
| @mastra/pinecone | 0.2.7 |
| @mastra/rag | 0.1.17 |
| @mastra/upstash | 0.2.4 |
| @mastra/vector-pinecone | 0.1.5 |
| @mastra/voice-elevenlabs | 0.1.12 |
| @mastra/voice-google | 0.1.12 |
| @mastra/clickhouse | 0.2.9 |
| @mastra/deployer | 0.2.8 |
| @agentic/mastra | 7.6.4 |
| @ai-sdk/google | 1.2.10 |
| @ai-sdk/google-vertex | 2.2.14 |

## Additional Resources

- [Official Mastra Documentation](https://docs.mastra.ai)
- [Google Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)
- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
