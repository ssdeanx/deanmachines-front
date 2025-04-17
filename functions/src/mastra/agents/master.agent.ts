/**
 * Master Agent Implementation
 *
 * This agent is an advanced orchestrator for research, synthesis, and decision support, using all proven research tools and advanced prompt engineering techniques.
 */

import { createAgentFromConfig } from "./base.agent";
import { masterAgentConfig } from "./config/master.config";
import { sharedMemory } from "../database";
import { createLogger } from "@mastra/core/logger";

const logger = createLogger({ name: "master-agent", level: "info" });

/**
 * Master Agent with advanced research and orchestration capabilities
 *
 * @remarks
 * This agent leverages all proven research tools and advanced prompt techniques for robust, reliable, and actionable outputs.
 */
export const masterAgent = createAgentFromConfig({
  config: masterAgentConfig,
  memory: sharedMemory, // Following RULE-MemoryInjection
  onError: async (error: Error) => {
    logger.error("Master agent error:", error);
    return {
      text: "I encountered an error while processing your advanced research request. Please refine your query or check the available sources.",
    };
  },
});

export type MasterAgent = typeof masterAgent;
export default masterAgent;
