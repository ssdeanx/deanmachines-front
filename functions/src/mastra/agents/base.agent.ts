/**
 * Base Agent Implementation
 *
 * This module provides utility functions to create agents from configurations,
 * ensuring consistent agent creation patterns across the application.
 */
import { Agent } from '@mastra/core/agent';
import { createLogger } from '@mastra/core/logger';
import { Tool } from '@mastra/core/tools';
import { trace, context } from '@opentelemetry/api';

import { sharedMemory } from '../database';
import { createResponseHook } from '../hooks';
import { allToolsMap } from '../tools';
// Import SigNoz service for performance monitoring
import sigNoz from '../services/signoz';
import {
  BaseAgentConfig,
  createModelInstance,
} from './config';

// This is test
import { StreamResult } from '../types';

// Configure logger for agent initialization
const logger = createLogger({ name: "agent-initialization", level: "info" });

// Refactor tool resolution into a utility function
function resolveTools(toolIds: string[]): Record<string, Tool<any, any>> {
  const tools: Record<string, Tool<any, any>> = {};
  const missingTools: string[] = [];

  for (const toolId of toolIds) {
    const tool = allToolsMap.get(toolId);
    if (tool) {
      tools[tool.id || toolId] = tool;
    } else {
      missingTools.push(toolId);
    }
  }

  if (missingTools.length > 0) {
    const errorMsg = `Missing required tools: ${missingTools.join(', ')}`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  return tools;
}

// Add telemetry integration to hooks
const telemetryHook = {
  beforeStream: async (messages: any, options: any) => {
    const span = trace.getSpan(context.active());
    const traceId = span?.spanContext().traceId;
    const spanId = span?.spanContext().spanId;
    logger.debug('Telemetry Hook - Before Stream', { traceId, spanId });
    return { messages, options };
  },
  afterStream: async (result: StreamResult) => {
    const span = trace.getSpan(context.active());
    const traceId = span?.spanContext().traceId;
    const spanId = span?.spanContext().spanId;
    logger.debug('Telemetry Hook - After Stream', { traceId, spanId });
    return result;
  },
};

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

  // Resolve tools using the utility function
  const tools = resolveTools(config.toolIds);

  // Create response hook if validation options are provided
  const responseHook = config.responseValidation
    ? createResponseHook(config.responseValidation)
    : undefined;
  
  // Create and return the agent instance
  logger.info(
    `Creating agent: ${config.id} with ${Object.keys(tools).length} tools`
  );
  
  try {
    // Create model instance using the new modelConfig property
    const model = createModelInstance(config.modelConfig);

    // Create debug logger specifically for streaming operations
    const streamLogger = createLogger({
      name: `agent-${config.id}-stream`,
      level: "debug",
    });

    // Agent configuration with stream handling via hooks
    const agentConfig: any = {
      model,
      memory, // Using injected memory instead of global reference
      name: config.name,
      instructions: config.instructions,
      tools,
      hooks: {
        // Telemetry hooks
        ...telemetryHook,
        // Response validation hook (This is the one from hooks/index.ts)
        ...(responseHook ? { onResponse: responseHook } : {}),
        // Error handling hook
        ...(onError ? { onError } : {}),

        // Enhanced hooks with SigNoz performance monitoring
        onRequest: async (request: any) => {
          // Create a span for the entire agent execution
          const agentSpan = sigNoz.createSpan('agent.execution', {
            'agent.id': config.id,
            'agent.name': config.name,
            'request.type': request.type || 'unknown',
            'messages.count': Array.isArray(request.messages) ? request.messages.length : 0
          });
          
          // Store the span and start time in the request for later use
          request.__monitoring = {
            span: agentSpan,
            startTime: performance.now()
          };
          
          return request;
        },

        // Stream hooks for better debugging and error handling
        beforeStream: async (messages: any, options: any) => {
          try {
            // Create a span specifically for streaming operations
            const streamSpan = sigNoz.createSpan('agent.stream', {
              'agent.id': config.id,
              'agent.name': config.name,
              'messages.count': Array.isArray(messages) ? messages.length : 1
            });
            
            // Store monitoring info in options for later retrieval
            options.__monitoring = {
              span: streamSpan,
              startTime: performance.now()
            };
            
            streamLogger.debug('Starting stream operation', {
              messageCount: Array.isArray(messages) ? messages.length : 1,
              hasTools: Object.keys(tools).length > 0,
              hasOptions: !!options
            });
            
            // Return messages and options to continue with streaming
            return { messages, options };
          } catch (error) {
            streamLogger.error('Error in beforeStream hook', {
              error: error instanceof Error ? error.message : String(error)
            });
            // Return unchanged to continue with streaming despite the error
            return { messages, options };
          }
        },

        afterStream: async (result: StreamResult) => {
          try {
            // Safely check for stream properties
            const hasTextStream = !!result && 'textStream' in result;
            const hasObjectStream = !!result && 'objectStream' in result;
            const hasPartialObjectStream = !!result && 'partialObjectStream' in result;
            
            // Get monitoring info from options if available
            // Modified to handle the case where result.options is undefined
            const monitoring = result && (result as any).options?.__monitoring;
            if (monitoring) {
              const { span, startTime } = monitoring;
              const endTime = performance.now();
              
              // Record metrics for the stream operation
              sigNoz.recordMetrics(span, {
                latencyMs: endTime - startTime,
                status: 'success'
              });
              
              // End the stream span
              span.end();
            } else {
              // Log that monitoring info wasn't found
              streamLogger.debug('No monitoring information found in stream result');
            }
            
            streamLogger.debug('Stream operation completed successfully', {
              hasTextStream,
              hasObjectStream,
              hasPartialObjectStream
            });
            
            return result;
          } catch (streamError) {
            // Record error metrics if monitoring is available
            // Modified to handle the case where result.options is undefined
            const monitoring = result && (result as any).options?.__monitoring;
            if (monitoring) {
              const { span, startTime } = monitoring;
              const endTime = performance.now();
              
              sigNoz.recordMetrics(span, {
                latencyMs: endTime - startTime,
                status: 'error',
                errorMessage: streamError instanceof Error ? streamError.message : String(streamError)
              });
              
              // End the span even on error
              span.end();
            }
            
            streamLogger.error('Error in afterStream hook', {
              error: streamError instanceof Error ? streamError.message : String(streamError),
              stack: streamError instanceof Error ? streamError.stack : 'No stack trace'
            });
            throw streamError; // Re-throw error after logging
          }
        },
        
        // Enhanced error handling with SigNoz monitoring
        onError: async (error: Error, request: any) => {
          // Record error metrics if monitoring was started
          if (request.__monitoring) {
            const { span, startTime } = request.__monitoring;
            const endTime = performance.now();
            
            sigNoz.recordMetrics(span, {
              latencyMs: endTime - startTime,
              status: 'error',
              errorMessage: error.message
            });
            
            // End the monitoring span
            span.end();
          }
          
          // Call the provided error handler if available
          if (onError) {
            return onError(error);
          }
          
          // Default error handling
          return {
            text: `Error: ${error.message}`
          };
        }
      }
    };

    return new Agent(agentConfig);
  } catch (error) {
    logger.error(
      `Failed to create agent ${config.id}: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    throw error;
  }
}
