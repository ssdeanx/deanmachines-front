# Mastra with Firebase/Google Cloud Integration Guide

## Overview

This document provides a comprehensive guide for integrating Mastra AI framework with Firebase/Google Cloud for static Next.js exports. It includes detailed instructions for setting up Firebase Functions with Google Vertex AI, structuring your codebase, handling authentication, and deploying both frontend and backend components.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Setting Up Firebase Project](#setting-up-firebase-project)
- [Firebase Functions Implementation](#firebase-functions-implementation)
- [Google Vertex AI Integration](#google-vertex-ai-integration)
- [Next.js Static Export Configuration](#nextjs-static-export-configuration)
- [Deployment Process](#deployment-process)
- [Environment Variables](#environment-variables)
- [Authentication Integration](#authentication-integration)
- [Testing and Debugging](#testing-and-debugging)
- [Performance Optimization](#performance-optimization)

## Architecture Overview

The architecture consists of two main components:

1. **Static Frontend (Next.js)**:
   - Built with `next build` (static export)
   - Deployed to Firebase Hosting
   - Uses client-side wrappers to communicate with backend APIs
   - Handles authentication via Firebase Auth client SDK

2. **Serverless Backend (Firebase Functions)**:
   - Implements Mastra AI functionality
   - Uses Google Vertex AI for model inference
   - Exposes REST APIs for the frontend
   - Handles complex processing, streaming responses, and security

This separation allows the frontend to be hosted as static files while maintaining the dynamic capabilities provided by Mastra AI through Firebase Functions.

## Project Structure

```
deanmachines-front/
├── src/                          # Frontend source code
│   ├── lib/
│   │   ├── mastra.ts             # Client-side wrapper for Mastra APIs
│   │   ├── auth-client.ts        # Client-side authentication utilities
│   │   └── firebase/
│   │       └── client.ts         # Firebase client initialization
│   ├── components/
│   │   ├── stream-chat.tsx       # Streaming chat UI component
│   │   └── ...
│   └── app/
│       ├── actions.ts            # Client actions for Mastra APIs
│       └── ...
├── functions/                    # Firebase Functions backend
│   ├── src/
│   │   ├── index.ts              # Main entry point for Firebase Functions
│   │   ├── mastra/               # Mastra implementation
│   │   │   ├── index.ts          # Mastra initialization
│   │   │   ├── agents/           # Agent definitions
│   │   │   ├── tools/            # Custom tools
│   │   │   └── workflows/        # Workflows definitions
│   │   ├── api/                  # API routes
│   │   │   ├── weather.ts        # Weather endpoint
│   │   │   └── chat.ts           # Chat streaming endpoint
│   │   └── utils/                # Utility functions
│   │       ├── cors.ts           # CORS handling
│   │       └── vertex.ts         # Vertex AI setup
│   ├── package.json              # Functions dependencies
│   └── tsconfig.json             # TypeScript configuration
├── firebase.json                 # Firebase configuration
├── .firebaserc                   # Firebase project configuration
└── next.config.ts                # Next.js configuration
```

## Setting Up Firebase Project

### 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard to create your project
4. Enable Google Analytics if needed

### 2. Enable Required APIs

In the Google Cloud Console for your project:

1. Navigate to "APIs & Services" > "Library"
2. Enable the following APIs:
   - Cloud Functions API
   - Cloud Build API
   - Vertex AI API
   - Firebase Admin API
   - Secret Manager API

### 3. Configure Firebase CLI

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Select the following features:
# - Firebase Hosting
# - Firebase Functions
# - Emulators (optional but recommended for development)
```

### 4. Configure Firebase Functions

Create or update your `firebase.json` file:

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
        "source": "/api/**",
        "function": "api"
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

## Firebase Functions Implementation

### 1. Set Up Functions Directory

Create a `functions` directory with the necessary configuration:

```bash
mkdir -p functions/src
cd functions
npm init -y
```

### 2. Configure Functions Package.json

Create `functions/package.json`:

```json
{
  "name": "deanmachines-mastra-functions",
  "version": "1.0.0",
  "description": "Firebase Functions for Mastra AI integration",
  "main": "lib/index.js",
  "scripts": {
    "build": "tsc",
    "serve": "npm run build && firebase emulators:start",
    "deploy": "firebase deploy --only functions",
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
    "@mastra/loggers": "^0.1.17",
    "@mastra/pinecone": "^0.2.7",
    "@mastra/rag": "^0.1.17",
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

### 3. Configure TypeScript

Create `functions/tsconfig.json`:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "outDir": "lib",
    "sourceMap": true,
    "strict": true,
    "target": "es2020",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "compileOnSave": true,
  "include": [
    "src"
  ]
}
```

### 4. Create Firebase Functions Entry Point

Create `functions/src/index.ts`:

```typescript
import * as functions from 'firebase-functions';
import { initMastra } from './mastra';
import { handleCors } from './utils/cors';

// Parse CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['https://deanmachines-front.web.app', 'https://deanmachines.com'];

/**
 * Weather endpoint using Mastra agent with Vertex AI
 */
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

/**
 * Chat streaming endpoint using Mastra agent with Vertex AI
 */
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

### 5. Implement CORS Utility

Create `functions/src/utils/cors.ts`:

```typescript
import * as functions from 'firebase-functions';

/**
 * Parse allowed origins from environment variable
 */
export const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['https://deanmachines-front.web.app', 'https://deanmachines.com'];

/**
 * Handle CORS headers for API requests
 *
 * @param req - Firebase Functions HTTP request object
 * @param res - Firebase Functions HTTP response object
 */
export const handleCors = (req: functions.https.Request, res: functions.Response): void => {
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
```

## Google Vertex AI Integration

### 1. Implement Mastra with Vertex AI

Create `functions/src/mastra/index.ts`:

```typescript
import { Mastra } from '@mastra/core';
import { setupWeatherAgent } from './agents/weather';
import { setupWriterAgent } from './agents/writer';
import { GoogleVertexAI } from '@ai-sdk/google-vertex';

/**
 * Initialize Mastra with Google Vertex AI integration
 *
 * @returns {Promise<Mastra>} Initialized Mastra instance
 */
export async function initMastra(): Promise<Mastra> {
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
  });

  // Initialize Mastra with Google provider
  const mastra = new Mastra({
    providers: {
      google: vertexAI,
    },
    logger: {
      info: console.info,
      warn: console.warn,
      error: console.error,
      debug: process.env.NODE_ENV !== 'production' ? console.debug : () => {},
    },
  });

  // Register agents
  await setupWeatherAgent(mastra);
  await setupWriterAgent(mastra);

  return mastra;
}
```

### 2. Implement Weather Agent

Create `functions/src/mastra/agents/weather.ts`:

```typescript
import { Mastra } from '@mastra/core';
import { weatherTool } from '../tools/weather';

/**
 * Configure the Weather Agent with Google Vertex AI
 *
 * @param {Mastra} mastra - Mastra instance
 */
export async function setupWeatherAgent(mastra: Mastra): Promise<void> {
  mastra.createAgent({
    name: 'weatherAgent',
    description: 'Provides detailed weather information',
    model: {
      provider: 'google',  // Using Google's Vertex AI
      name: 'gemini-1.5-pro', // Or another supported model
    },
    tools: [weatherTool],
    // Additional configuration for the agent
    configuration: {
      temperature: 0.2,
      maxOutputTokens: 500,
    },
    // Instruction for weather responses
    instructions: `
      You are a helpful weather assistant. When asked about the weather in a location,
      use the weatherTool to fetch accurate, current weather data.

      Format your responses clearly with:
      - Current temperature (in both Celsius and Fahrenheit)
      - Weather condition (sunny, cloudy, rainy, etc.)
      - Humidity percentage
      - Wind speed and direction
      - Any relevant weather advisories

      Keep responses concise but informative. If the location is ambiguous,
      ask for clarification. If the weather tool returns an error, explain
      the issue clearly to the user.
    `,
  });
}
```

### 3. Implement Writer Agent

Create `functions/src/mastra/agents/writer.ts`:

```typescript
import { Mastra } from '@mastra/core';

/**
 * Configure the Writer Agent with Google Vertex AI
 *
 * @param {Mastra} mastra - Mastra instance
 */
export async function setupWriterAgent(mastra: Mastra): Promise<void> {
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
    instructions: `
      You are a helpful writing assistant. Your goal is to help users with various
      writing tasks including:

      - Creative writing prompts and suggestions
      - Content editing and improvement
      - Grammar and style checking
      - Blog post and article ideas
      - Marketing copy suggestions

      Be creative, helpful, and responsive to user requests. When providing
      feedback on writing, be constructive and specific. For creative tasks,
      offer diverse and original ideas. Always respect user preferences and
      writing goals.
    `,
  });
}
```

### 4. Implement Weather Tool

Create `functions/src/mastra/tools/weather.ts`:

```typescript
import { createTool } from '@mastra/core';
import { z } from 'zod';

/**
 * Create a weather tool for retrieving weather data
 */
export const weatherTool = createTool({
  name: 'getWeather',
  description: 'Get current weather information for a location',
  schema: z.object({
    location: z.string().describe('The city or location to get weather for'),
  }),
  execute: async ({ location }) => {
    try {
      // In a real implementation, call a weather API
      // This is a mock implementation for demonstration

      // First, geocode the location to get coordinates
      const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`;
      const geocodeResponse = await fetch(geocodeUrl);
      const geocodeData = await geocodeResponse.json();

      if (!geocodeData.results || geocodeData.results.length === 0) {
        throw new Error(`Location not found: ${location}`);
      }

      const { latitude, longitude, name, country } = geocodeData.results[0];

      // Then get weather data using those coordinates
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m&temperature_unit=celsius`;
      const weatherResponse = await fetch(weatherUrl);
      const weatherData = await weatherResponse.json();

      // Process weather codes to readable conditions
      const weatherCodes: Record<number, string> = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        56: 'Light freezing drizzle',
        57: 'Dense freezing drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        66: 'Light freezing rain',
        67: 'Heavy freezing rain',
        71: 'Slight snow fall',
        73: 'Moderate snow fall',
        75: 'Heavy snow fall',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail',
      };

      const current = weatherData.current;
      const weatherCode = current.weather_code;
      const weatherCondition = weatherCodes[weatherCode] || 'Unknown';

      // Convert temperature to Fahrenheit
      const tempC = current.temperature_2m;
      const tempF = (tempC * 9/5) + 32;

      // Convert wind direction to cardinal direction
      const windDirection = current.wind_direction_10m;
      const cardinalDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
      const cardinalIndex = Math.round(windDirection / 45) % 8;
      const cardinalDirection = cardinalDirections[cardinalIndex];

      return {
        location: `${name}, ${country}`,
        temperature: {
          celsius: tempC,
          fahrenheit: tempF.toFixed(1),
        },
        condition: weatherCondition,
        humidity: current.relative_humidity_2m,
        wind: {
          speed: current.wind_speed_10m,
          direction: cardinalDirection,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`Weather tool error:`, error);
      return {
        error: true,
        message: error instanceof Error ? error.message : 'Failed to fetch weather data',
      };
    }
  },
});
```

### 5. Export Agents from Index

Create `functions/src/mastra/agents/index.ts`:

```typescript
export { setupWeatherAgent } from './weather';
export { setupWriterAgent } from './writer';
```

### 6. Export Tools from Index

Create `functions/src/mastra/tools/index.ts`:

```typescript
export { weatherTool } from './weather';
```

## Next.js Static Export Configuration

### 1. Configure Next.js for Static Export

Update `next.config.ts`:

```typescript
import { defineConfig } from 'next';

export default defineConfig({
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,  // Required for static export
  },
  // Environment variables for client-side
  env: {
    NEXT_PUBLIC_MASTRA_API_URL: process.env.NEXT_PUBLIC_MASTRA_API_URL,
    NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY,
    NEXT_PUBLIC_WEATHER_API_URL: process.env.NEXT_PUBLIC_WEATHER_API_URL,
    NEXT_PUBLIC_CHAT_API_URL: process.env.NEXT_PUBLIC_CHAT_API_URL,
  },
});
```

### 2. Create Client-Side Mastra Wrapper

This file already exists in your project at `src/lib/mastra.ts`:

```typescript
import { MastraClient } from "@mastra/client-js";

/**
 * Mastra client configuration for static exports
 *
 * This setup uses @mastra/client-js to interact with a hosted Mastra API endpoint
 * instead of running a local server (which isn't available in static exports).
 *
 * For production, configure NEXT_PUBLIC_MASTRA_API_URL to point to your hosted Mastra API.
 */
export const mastraClient = new MastraClient({
  baseUrl: process.env.NEXT_PUBLIC_MASTRA_API_URL || "https://api.deanmachines.com/mastra",
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
});

/**
 * Creates a client-side compatible wrapper for Mastra functionality
 * that can be used in static exports.
 *
 * @returns {Object} Mastra client-side API
 */
export const clientMastra = {
  /**
   * Get weather information for a specific city
   *
   * @param {string} city - The city to get weather for
   * @returns {Promise<any>} The weather response
   */
  getWeatherInfo: async (city: string): Promise<any> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_WEATHER_API_URL || "https://api.deanmachines.com/weather"}?city=${encodeURIComponent(city)}`,
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
      console.error("Weather API error:", error);
      return {
        error: true,
        message: error instanceof Error ? error.message : "Failed to fetch weather data"
      };
    }
  },

  /**
   * Stream chat completions for a given prompt
   *
   * @param {string} prompt - The user's prompt
   * @returns {Promise<ReadableStream>} A stream of completion chunks
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

      if (!response.ok) {
        throw new Error(`Chat API error: ${response.status}`);
      }

      return response.body as ReadableStream;
    } catch (error) {
      console.error("Chat API error:", error);
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

### 3. Update Client Actions

This file already exists in your project at `src/app/actions.ts`:

```typescript
"use client";

import { clientMastra } from "@/lib/mastra";

/**
 * Client-side function to get weather information
 * Compatible with static exports
 *
 * @param city - The city to get weather for
 * @returns The weather data response
 */
export async function getWeatherInfo(city: string) {
  return await clientMastra.getWeatherInfo(city);
}
```

## Deployment Process

### 1. Setting Up Environment Variables

Configure your environment variables in Firebase:

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

### 2. Local Development Setup

For local development with Firebase emulators:

```bash
# Start Firebase emulators
cd functions
npm run build
cd ..
firebase emulators:start

# In another terminal, start Next.js development server
npm run dev
```

### 3. Build and Deploy

Create a deployment script at `scripts/deploy.ts`:

```typescript
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

    // Deploy Firebase Hosting
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

### 4. Running Deployment

```bash
# Deploy everything
npm run deploy

# Or deploy functions only
npm run deploy:functions

# Or deploy hosting only
npm run deploy:hosting
```

## Authentication Integration

Your project already has a client-side authentication implementation for static exports in `src/lib/auth-client.ts`. This integrates with Firebase Authentication directly from the client side, providing:

- User registration with email/password
- Social login with Google and GitHub
- Client-side session management with localStorage
- Role-based access control (admin/user)

For Firebase Functions authentication:

1. Add authentication middleware in your Firebase Functions:

```typescript
// functions/src/middleware/auth.ts
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

/**
 * Middleware to verify Firebase Auth tokens
 *
 * @param req - Firebase Functions HTTP request
 * @param res - Firebase Functions HTTP response
 * @param next - Callback for next middleware
 */
export const verifyAuthToken = async (
  req: functions.https.Request,
  res: functions.Response,
  next: () => void
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: No token provided' });
    return;
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req['user'] = decodedToken;
    next();
  } catch (error) {
    console.error('Auth token verification failed:', error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

/**
 * Middleware to check if user has admin role
 *
 * @param req - Firebase Functions HTTP request
 * @param res - Firebase Functions HTTP response
 * @param next - Callback for next middleware
 */
export const isAdmin = async (
  req: functions.https.Request,
  res: functions.Response,
  next: () => void
): Promise<void> => {
  const user = req['user'];

  if (!user) {
    res.status(401).json({ error: 'Unauthorized: No user found' });
    return;
  }

  if (user.role !== 'admin') {
    res.status(403).json({ error: 'Forbidden: Requires admin role' });
    return;
  }

  next();
};
```

2. Use the middleware in your functions:

```typescript
import * as functions from 'firebase-functions';
import { verifyAuthToken, isAdmin } from './middleware/auth';

/**
 * Protected endpoint example
 */
export const protectedFunction = functions.https.onRequest(async (req, res) => {
  // Apply middleware
  await new Promise<void>((resolve) => {
    verifyAuthToken(req, res, () => resolve());
  });

  // If middleware didn't end the request, proceed with the function
  if (!res.headersSent) {
    // Function implementation for authenticated users
    res.json({ message: 'This is a protected endpoint', user: req['user'] });
  }
});

/**
 * Admin-only endpoint example
 */
export const adminFunction = functions.https.onRequest(async (req, res) => {
  // Apply auth middleware
  await new Promise<void>((resolve) => {
    verifyAuthToken(req, res, () => resolve());
  });

  // If still going, check admin role
  if (!res.headersSent) {
    await new Promise<void>((resolve) => {
      isAdmin(req, res, () => resolve());
    });
  }

  // If middleware didn't end the request, proceed with the function
  if (!res.headersSent) {
    // Function implementation for admin users
    res.json({ message: 'This is an admin endpoint', user: req['user'] });
  }
});
```

## Testing and Debugging

### Local Testing with Firebase Emulators

Firebase Emulators provide a local environment for testing before deployment:

```bash
# Start emulators
firebase emulators:start
```

This starts:
- Functions emulator (default: http://localhost:5001)
- Hosting emulator (default: http://localhost:5000)
- Emulator UI (default: http://localhost:4000)

### Debugging Functions

For debugging Firebase Functions during development:

1. Add debug logging:

```typescript
// Add this to your functions
console.debug('Debug data:', { requestData, someVariable });
```

2. View logs in the Firebase console or locally:

```bash
# View logs from deployed functions
firebase functions:log

# View logs in terminal with emulators running
# (Logs appear directly in the terminal)
```

3. Using VS Code debugger:

Create a `.vscode/launch.json` file:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Attach to Firebase Emulator",
      "port": 9229,
      "restart": true,
      "skipFiles": [
        "<node_internals>/**"
      ]
    }
  ]
}
```

Then run the emulator with debugging enabled:

```bash
cd functions
node --inspect-brk node_modules/.bin/firebase emulators:start
```

### Testing API Endpoints

Use tools like curl, Postman, or browser-based utilities:

```bash
# Test weather endpoint
curl "http://localhost:5001/deanmachines-front/us-central1/weather?city=London"

# Test chat endpoint
curl -X POST "http://localhost:5001/deanmachines-front/us-central1/chat" \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Tell me about climate change"}'
```

## Performance Optimization

### 1. Function Cold Starts

Firebase Functions experience cold starts when they haven't been used recently:

**Optimization strategies:**

- Use minimum instances (paid tier):
  ```javascript
  export const weather = functions
    .runWith({
      minInstances: 1, // Keep at least one instance warm
    })
    .https.onRequest(async (req, res) => {
      // Function implementation
    });
  ```

- Optimize initialization code:
  - Move initialization code outside the function handler
  - Use lazy-loading for rarely used dependencies
  - Cache expensive operations

### 2. Memory Management

LLM operations can be memory intensive:

**Optimization strategies:**

- Increase memory allocation for functions:
  ```javascript
  export const chat = functions
    .runWith({
      memory: '2GB',  // Increase memory for LLM operations
    })
    .https.onRequest(/* ... */);
  ```

- Use explicit garbage collection where appropriate:
  ```javascript
  // After large operations
  if (global.gc) {
    global.gc();
  }
  ```

### 3. Vertex AI Cost Optimization

Google Vertex AI usage incurs costs:

**Optimization strategies:**

- Use different model tiers for different tasks:
  ```javascript
  // Use cheaper model for simple tasks
  mastra.createAgent({
    name: 'simpleAgent',
    model: {
      provider: 'google',
      name: 'gemini-1.5-flash',
    },
  });

  // Use premium model only for complex tasks
  mastra.createAgent({
    name: 'complexAgent',
    model: {
      provider: 'google',
      name: 'gemini-1.5-pro',
    },
  });
  ```

- Implement caching for common queries:
  ```javascript
  // Simple in-memory cache (use Redis or similar in production)
  const cache = new Map();
  const TTL = 60 * 60 * 1000; // 1 hour in milliseconds

  async function getCachedWeather(city: string) {
    const cacheKey = `weather:${city.toLowerCase()}`;
    const now = Date.now();

    // Check cache
    if (cache.has(cacheKey)) {
      const cachedItem = cache.get(cacheKey);
      if (now - cachedItem.timestamp < TTL) {
        return cachedItem.data;
      }
    }

    // Fetch fresh data
    const weatherAgent = mastra.getAgent('weatherAgent');
    const result = await weatherAgent.generate(`What's the weather like in ${city}?`);

    // Update cache
    cache.set(cacheKey, {
      data: result,
      timestamp: now
    });

    return result;
  }
  ```

- Set token limits appropriately:
  ```javascript
  mastra.createAgent({
    name: 'weatherAgent',
    model: {
      provider: 'google',
      name: 'gemini-1.5-pro',
    },
    configuration: {
      maxOutputTokens: 500, // Limit output size for cost control
    },
  });
  ```

### 4. Firebase Hosting CDN Optimization

Optimize your static assets:

- Configure Firebase CDN caching:
  ```json
  {
    "hosting": {
      "headers": [
        {
          "source": "**/*.@(js|css|jpg|jpeg|gif|png)",
          "headers": [
            {
              "key": "Cache-Control",
              "value": "public, max-age=31536000, immutable"
            }
          ]
        },
        {
          "source": "**/*.@(html|json)",
          "headers": [
            {
              "key": "Cache-Control",
              "value": "public, max-age=600"
            }
          ]
        }
      ]
    }
  }
  ```

- Use compression in your Next.js build:
  ```javascript
  // next.config.ts
  export default defineConfig({
    compress: true,
    // other configuration...
  });
  ```

This comprehensive guide should help you successfully implement Mastra AI with Firebase Functions and Google Vertex AI for your static Next.js export.
