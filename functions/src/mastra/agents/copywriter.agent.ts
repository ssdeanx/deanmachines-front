/**
 * Copywriter Agent Implementation
 *
 * This module implements the Copywriter Agent responsible for creating
 * marketing copy and content within the DeanmachinesAI system.
 */

import { createAgentFromConfig } from "./base.agent";
import { copywriterAgentConfig } from "./config"; // Corrected import name
import { createLogger } from "@mastra/core/logger";
import { sharedMemory } from "../database";

// Configure logger for the copywriter agent
const logger = createLogger({ name: "copywriter-agent", level: "info" });

/**
 * Copywriter Agent
 * 
 * Specializes in creating marketing copy, blog posts, social media content,
 * and other written materials.
 * 
 * @remarks
 * This agent leverages language models to generate creative and persuasive text
 * tailored to specific audiences and marketing goals.
 */
export const copywriterAgent = createAgentFromConfig({
  config: copywriterAgentConfig,
  memory: sharedMemory, // Following RULE-MemoryInjection
  onError: async (error: Error) => {
    logger.error("Copywriter agent error:", error);
    return {
      text: "I encountered an error while creating content. Please provide more specific requirements.",
    };
  },
});

// Export the agent instance as default and named export
export default copywriterAgent;
// Export the type for use elsewhere


