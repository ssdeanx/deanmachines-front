/**
 * DeanMachines AI Platform - Mastra Core Instance
 *
 * This file initializes the central Mastra instance that powers the AI capabilities
 * of the DeanMachines platform. It registers all agents, workflows, networks, and
 * configures shared services like logging.
 *
 * Note: After updating this file with new agents or networks, you can generate
 * an updated OpenAPI specification by running the Mastra CLI command:
 * `npx mastra openapi --output ./api.json`
 */
import { Mastra } from '@mastra/core';
import { createLogger } from '@mastra/core/logger';
import { ServerOptions, StreamingOptions } from '@mastra/core/types';

import agents from './agents';
import { ragWorkflow } from './workflows';
import { networks } from './workflows/Networks/agentNetwork';


// Import agent networks from the networks file
// Configure logger with appropriate level based on environment
const logger = createLogger({
  name: "DeanMachinesAI-MastraCore",
  level: process.env.LOG_LEVEL === "debug" ? "debug" : "info",
});

logger.info("Initializing Mastra instance...");

// Configure streaming for proper text chunking and delivery
const streamingConfig: StreamingOptions = {
  chunkSize: 20, // Characters per chunk for smooth streaming
  eventThrottleMs: 50, // Time between stream events (ms)
  includeMetadata: true, // Include metadata with chunks
  errorHandling: {
    retryAttempts: 3,
    retryDelayMs: 1000,
    fallbackToNonStreaming: true, // Fall back to non-streaming if streaming fails
  },
};

// Configure server options with streaming-friendly settings
const serverOptions: ServerOptions = {
  cors: {
    origin: "*", // Allow all origins or specify your frontend origin
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Type"],
    credentials: true,
  },
  timeout: 120000, // Longer timeout for streaming operations (2 minutes)
  port: process.env.MASTRA_PORT ? parseInt(process.env.MASTRA_PORT) : 4111,
};

// Initialize the central Mastra instance with all registered components
export const mastra = new Mastra({
  agents: agents, // All registered agents
  networks: networks, // All registered agent networks
  workflows: { ragWorkflow }, // Workflows from workflows/index.ts
  logger: logger, // Configured logger
  streaming: streamingConfig, // Add streaming configuration
  server: serverOptions, // Add server configuration
  // Add server middleware for streaming headers
  serverMiddleware: [
    {
      handler: async (c, next) => {
        // Apply headers for streaming endpoints
        if (c.req.url.includes('/stream') || c.req.url.includes('/chat')) {
          c.header("Content-Type", "text/event-stream");
          c.header("Cache-Control", "no-cache, no-transform");
          c.header("Connection", "keep-alive");

          logger.debug('Processing streaming request', {
            url: c.req.url,
            method: c.req.method,
          });
        }
        await next();
      },
    },
  ],
});

// Log initialization status for monitoring
const agentCount = Object.keys(agents).length;
const networkCount = Object.keys(networks).length;
logger.info(
  `Mastra instance initialized successfully with ${agentCount} agents and ${networkCount} networks.`
);
if (agentCount > 0) {
  logger.debug(`Registered Agent IDs: ${Object.keys(agents).join(", ")}`);
}
if (networkCount > 0) {
  logger.debug(`Registered Network IDs: ${Object.keys(networks).join(", ")}`);
}

/**
 * Creates a properly formatted streaming response with the appropriate headers
 *
 * @param stream - The raw text stream from a Mastra agent
 * @returns A Response object with proper streaming headers
 */
export const createStreamResponse = (stream: ReadableStream): Response => {
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
};
