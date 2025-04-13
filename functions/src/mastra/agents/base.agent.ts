/**
 * Base Agent Implementation
 *
 * This module provides utility functions to create agents from configurations,
 * ensuring consistent agent creation patterns across the application.
 */
import { StreamResult } from '@mastra/core';
import { Agent } from '@mastra/core/agent';
import { createLogger } from '@mastra/core/logger';
import { Tool } from '@mastra/core/tools';

import { sharedMemory } from '../database';
import { createResponseHook } from '../hooks';
import { allToolsMap } from '../tools';
import {
  BaseAgentConfig,
  createModelInstance,
  DEFAULT_MAX_CONTEXT_TOKENS,
  DEFAULT_MAX_TOKENS,
  DEFAULT_MODEL_ID,
  defaultErrorHandler,
  defaultResponseValidation,
  ResponseHookOptions,
} from './config';


// Configure logger for agent initialization
const logger = createLogger({ name: "agent-initialization", level: "info" });

/**
 * Creates an agent instance from a configuration object and options
 *
 * @param params - Object containing configuration and agent options
 * @param params.config - The agent configuration object
 * @param params.memory - The memory instance to be injected into the agent (following RULE-MemoryInjection)
 * @param params.onError - Optional error handler callback function
 * @returns A configured Agent instance
 * @throws Error if required tools are not available
 */
export function createAgentFromConfig({
  config,
  memory,
  onError,
}: {
  config: BaseAgentConfig;
  memory: typeof sharedMemory;
  onError?: (error: Error) => Promise<{ text: string }>;
}): Agent {
  // Validate configuration
  if (!config.id || !config.name || !config.instructions) {
    throw new Error(
      `Invalid agent configuration for ${config.id || "unknown agent"}`
    );
  }

  // Resolve tools from toolIds
  const tools: Record<string, Tool<any, any>> = {};
  const missingTools: string[] = [];

  for (const toolId of config.toolIds) {
    const tool = allToolsMap.get(toolId);
    if (tool) {
      const key = tool.id || toolId;
      tools[key] = tool;
    } else {
      missingTools.push(toolId);
    }
  }

  // Log and throw error for missing tools
  if (missingTools.length > 0) {
    const errorMsg = `Missing required tools for agent ${
      config.id
    }: ${missingTools.join(", ")}`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  // Create response hook if validation options are provided
  const responseHook = config.responseValidation
    ? createResponseHook(config.responseValidation)
    : undefined;
  // Create and return the agent instance
  logger.info(
    `Creating agent: ${config.id} with ${Object.keys(tools).length} tools`
  );  try {
    // Create model instance using the new modelConfig property
    const model = createModelInstance(config.modelConfig);

    // Create debug logger specifically for streaming operations
    // Assuming createLogger can take additional context or a modified name
    const streamLogger = createLogger({
      name: `agent-${config.id}-stream`, // Incorporate context into the name
      level: "info", // Set level explicitly, e.g., 'info' or 'debug'
      // Pass additional context if the logger supports it, e.g.:
      // defaultMeta: { component: `${config.id}-stream`, agentId: config.id }
    });


    return new Agent({
      model,
      memory, // Using injected memory instead of global reference
      name: config.name,
      instructions: config.instructions,
      tools,
      ...(responseHook ? { onResponse: responseHook } : {}),
      ...(onError ? { onError } : {}), // Add error handler if provided


        hooks: { // Group hooks under a 'hooks' property
          ...(responseHook ? { onResponse: responseHook } : {}),
          ...(onError ? { onError } : {}), // Add error handler if provided

          // Before stream hook - logs attempt to start streaming
          beforeStream: async (messages: unknown, options: unknown) => {
            streamLogger.debug('Starting stream operation', {
          messageCount: Array.isArray(messages) ? messages.length : 1,
          hasTools: Object.keys(tools).length > 0,
          options: JSON.stringify(options, null, 2) // Consider security/verbosity of logging options
            });
            // Ensure the return value matches what Mastra expects for this hook
            // This might need adjustment based on the actual Mastra API.
            return { messages, options };
          },

          // After stream hook - logs successful stream creation
          // Ensure StreamResult type is imported, e.g., from '@mastra/core' or similar
          afterStream: async (result: StreamResult) => {
            try {
          streamLogger.debug('Stream operation completed successfully', {
            // Adjust property access based on actual StreamResult structure
            hasTextStream: !!result.textStream
          });
          return result;
            } catch (streamError) {
          streamLogger.error('Error in afterStream hook', {
            error: streamError instanceof Error ? streamError.message : String(streamError)
          });
            throw streamError; // Re-throw error after logging
            }
          }
        } // Closing brace for the 'hooks' object
    }); // Closing parenthesis for the new Agent call
  } catch (error) {
    logger.error(
      `Failed to create agent ${config.id}: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    throw error;
  }
}
