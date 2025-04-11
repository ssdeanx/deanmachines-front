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

import { Mastra } from "@mastra/core";
import { createLogger } from "@mastra/core/logger";
import agents from "./agents"; // Central agent registry map
import { ragWorkflow } from "./workflows";
// Import agent networks from the networks file
import { networks } from "./workflows/Networks/agentNetwork";

// Configure logger with appropriate level based on environment
const logger = createLogger({
  name: "DeanMachinesAI-MastraCore",
  level: process.env.LOG_LEVEL === "debug" ? "debug" : "info",
});

logger.info("Initializing Mastra instance...");

// Initialize the central Mastra instance with all registered components
export const mastra = new Mastra({
  agents: agents, // All registered agents
  networks: networks, // All registered agent networks
  workflows: { ragWorkflow }, // Workflows from workflows/index.ts
  logger: logger, // Configured logger
  // Add other global configs as needed (storage, vectors, telemetry, etc.)
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
