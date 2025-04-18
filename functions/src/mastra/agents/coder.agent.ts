/**
 * Coder Agent Implementation
 *
 * This module implements the Coder Agent responsible for code generation,
 * analysis, and refactoring tasks within the DeanmachinesAI system.
 */

import { createAgentFromConfig } from "./base.agent";
import { coderAgentConfig } from "./config";
import { createLogger } from "@mastra/core/logger";
import { sharedMemory } from "../database";

// Configure logger for the coder agent
const logger = createLogger({ name: "coder-agent", level: "info" });

/**
 * Coder Agent
 * 
 * Specializes in code generation, analysis, and refactoring tasks.
 * 
 * @remarks
 * This agent can generate code based on requirements, analyze existing code,
 * and suggest refactoring improvements.
 */
export const coderAgent = createAgentFromConfig({
  config: coderAgentConfig,
  memory: sharedMemory, // Following RULE-MemoryInjection
  onError: async (error: Error) => {
    logger.error("Coder agent error:", error);
    return {
      text: "I encountered an error with code generation or analysis. Please provide more details or context.",
    };
  },
});

export default coderAgent;


