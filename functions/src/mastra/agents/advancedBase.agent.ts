/**
 * Advanced Base Agent Implementation
 *
 * This module provides a factory for creating advanced agents with step-based execution,
 * multi-tool/multi-agent orchestration, advanced memory, streaming, and enhanced hooks.
 */
import { Agent } from '@mastra/core/agent';
import { createLogger } from '@mastra/core/logger';
import { Tool } from '@mastra/core/tools';
import { trace, context } from '@opentelemetry/api';
import { sharedMemory } from '../database';
import { createResponseHook } from '../hooks';
import { allToolsMap } from '../tools';
import sigNoz from '../services/signoz';
import { StreamResult } from '../types';
import {
  BaseAgentConfig,
  createModelInstance,
} from './config';
import { initializeDefaultTracing } from '../services/tracing';

const logger = createLogger({ name: "advanced-agent-initialization", level: "debug" });

function resolveTools(toolIds: string[]): Record<string, Tool<any, any>> {
  // ...same as base.agent.ts...
  const tools: Record<string, Tool<any, any>> = {};
  toolIds.forEach((id) => {
    const tool = allToolsMap.get(id);
    if (tool) {
      tools[id] = tool;
    } else {
      logger.warn(`Tool with id ${id} not found`);
    }
  });
  return tools;
}

/**
 * Creates an advanced agent instance with step-based execution, multi-agent/tool orchestration, and advanced hooks.
 *
 * @param params - Object containing configuration and agent options
 * @param params.config - The agent configuration object
 * @param params.memory - The memory instance to be injected into the agent
 * @param params.onError - Optional error handler callback function
 * @param params.delegateAgents - Optional map of delegate agents for sub-task delegation
 * @returns A configured advanced Agent instance
 */
export function createAdvancedAgentFromConfig({
  config,
  memory,
  onError,
  delegateAgents = {},
}: {
  config: BaseAgentConfig;
  memory: typeof sharedMemory;
  onError?: (error: Error) => Promise<{ text: string }>;
  delegateAgents?: Record<string, Agent>;
}): Agent {
  if (!config.id || !config.name || !config.instructions) {
    throw new Error(
      `Invalid agent configuration for ${config.id || "unknown agent"}`
    );
  }
  const tools = resolveTools(config.toolIds);
  const responseHook = config.responseValidation
    ? createResponseHook(config.responseValidation)
    : undefined;
  logger.info(
    `Creating advanced agent: ${config.id} with ${Object.keys(tools).length} tools`
  );
  try {
    // Initialize OpenTelemetry tracing for this agent if not already initialized
    initializeDefaultTracing();
    const model = createModelInstance(config.modelConfig);
    const streamLogger = createLogger({
      name: `advanced-agent-${config.id}-stream`,
      level: "debug",
    });
    // Step-based execution loop (ReACT-style) with delegateAgents support
    async function stepExecutor(messages: any, options: any = {}) {
      let step = 0;
      let done = false;
      let contextObj = options.context || [];
      let result: any = {};
      // Attach the current context to the span for distributed tracing
      const parentContext = context.active();
      while (!done && step < (options.maxSteps || 8)) {
        // Start a span for each step, propagating context
        const stepSpan = trace.getTracer('advanced-agent').startSpan(`step-${step}`, {
          attributes: {
            agentId: config.id,
            step,
            delegate: !!options.delegateAgentId,
          }
        }, parentContext);
        try {
          if (options.delegateAgentId && delegateAgents[options.delegateAgentId]) {
            streamLogger.debug(`Delegating step ${step} to agent: ${options.delegateAgentId}`);
            result = await delegateAgents[options.delegateAgentId].generate(messages, { ...options, context: contextObj });
          } else {
            result = await model.generate(messages, { ...options, context: contextObj });
          }
          if ((result as any).text || (result as any).object) done = true;
          step++;
          if (options.onStepFinish) await options.onStepFinish({ step, result });
          stepSpan.setStatus({ code: 1 }); // OK
        } catch (err) {
          stepSpan.setStatus({ code: 2, message: err instanceof Error ? err.message : String(err) });
          throw err;
        } finally {
          stepSpan.end();
        }
      }
      return result;
    }
    // Agent config with advanced hooks and stepExecutor
    const agentConfig: any = {
      model,
      memory,
      name: config.name,
      instructions: config.instructions,
      tools,
      hooks: {
        // Advanced tracing and observability with SigNoz
        onRequest: async (request: any) => {
          const agentSpan = sigNoz.createSpan('advanced-agent.execution', {
            'agent.id': config.id,
            'agent.name': config.name,
            'request.type': request.type || 'unknown',
            'messages.count': Array.isArray(request.messages) ? request.messages.length : 0
          });
          request.__monitoring = {
            span: agentSpan,
            startTime: performance.now()
          };
          return request;
        },
        beforeStream: async (messages: any, options: any) => {
          const streamSpan = sigNoz.createSpan('advanced-agent.stream', {
            'agent.id': config.id,
            'agent.name': config.name,
            'messages.count': Array.isArray(messages) ? messages.length : 1
          });
          options.__monitoring = {
            span: streamSpan,
            startTime: performance.now()
          };
          streamLogger.debug('Starting advanced stream operation', {
            messageCount: Array.isArray(messages) ? messages.length : 1,
            hasTools: Object.keys(tools).length > 0,
            hasOptions: !!options
          });
          return { messages, options };
        },
        afterStream: async (result: StreamResult) => {
          const hasTextStream = !!result && 'textStream' in result;
          const hasObjectStream = !!result && 'objectStream' in result;
          const hasPartialObjectStream = !!result && 'partialObjectStream' in result;
          const monitoring = result && (result as any).options?.__monitoring;
          if (monitoring) {
            const { span, startTime } = monitoring;
            const endTime = performance.now();
            sigNoz.recordMetrics(span, {
              latencyMs: endTime - startTime,
              status: 'success'
            });
            span.end();
          } else {
            streamLogger.debug('No monitoring information found in stream result');
          }
          streamLogger.debug('Advanced stream operation completed', {
            hasTextStream,
            hasObjectStream,
            hasPartialObjectStream
          });
          return result;
        },
        onError: async (error: Error, request: any) => {
          if (request.__monitoring) {
            const { span, startTime } = request.__monitoring;
            const endTime = performance.now();
            sigNoz.recordMetrics(span, {
              latencyMs: endTime - startTime,
              status: 'error',
              errorMessage: error.message
            });
            span.end();
          }
          if (onError) {
            return onError(error);
          }
          return {
            text: `Error: ${error.message}`
          };
        },
        // Step-based execution and streaming
        onStepFinish: async (stepDetails: any) => {
          streamLogger.debug('Advanced step finished', stepDetails);
        },
        // Response validation hook (if provided)
        ...(responseHook ? { onResponse: responseHook } : {}),
      },
      stepExecutor,
    };
    return new Agent(agentConfig);
  } catch (error) {
    logger.error(
      `Failed to create advanced agent ${config.id}: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    throw error;
  }
}