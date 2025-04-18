// RLBase Agent Implementation
// This is a standalone RL-enabled agent base (not dependent on base.agent.ts)
import { Agent } from '@mastra/core/agent';
import { createLogger } from '@mastra/core/logger';
import { Tool } from '@mastra/core/tools';
import { trace, context } from '@opentelemetry/api';
import { sharedMemory } from '../database';
import { createResponseHook } from '../hooks';
import { allToolsMap } from '../tools';
import sigNoz from '../services/signoz';
import { StreamResult } from '../types';
import { BaseAgentConfig, createModelInstance } from './config';
import { calculateRewardTool, defineRewardFunctionTool, optimizePolicyTool } from '../tools/rlReward';
import { collectFeedbackTool, analyzeFeedbackTool, applyRLInsightsTool } from '../tools/rlFeedback';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const logger = createLogger({ name: "rl-agent-initialization", level: "debug" });

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

export function createRLAgentFromConfig({
  config,
  memory,
  onError,
}: {
  config: BaseAgentConfig;
  memory: typeof sharedMemory;
  onError?: (error: Error) => Promise<{ text: string }>;
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
    `Creating RL agent: ${config.id} with ${Object.keys(tools).length} tools`
  );
  try {
    const model = createModelInstance(config.modelConfig);
    const streamLogger = createLogger({
      name: `rl-agent-${config.id}-stream`,
      level: "debug",
    });
    // RL step executor: wraps model.generate with RL feedback/reward loop and Zod validation
    async function rlStepExecutor(messages: any, options: any = {}) {
      let step = 0;
      let done = false;
      let contextObj = options.context || [];
      let result: any = {};
      let episodeId = options.episodeId || `ep_${Date.now()}`;
      // Attach the current context to the span for distributed tracing
      const parentContext = context.active();
      // 0. Define reward function at the start of the episode (if needed)
      if (step === 0 && options.rewardFunctionDefinition) {
        const rewardDefInput = options.rewardFunctionDefinition;
        if (typeof defineRewardFunctionTool.execute === 'function') {
          await defineRewardFunctionTool.execute({
            container: model,
            context: rewardDefInput
          });
          logger.debug('Defined/updated reward function', rewardDefInput);
        }
      }
      while (!done && step < (options.maxSteps || 8)) {
        // Start a span for each RL step, propagating context
        const stepSpan = trace.getTracer('rl-agent').startSpan(`rl-step-${step}`, {
          attributes: {
            agentId: config.id,
            step,
            episodeId,
          }
        }, parentContext);
        try {
          // 1. Agent acts
          result = await model.generate(messages, { ...options, context: contextObj });
          logger.debug('RL step result', { step, result });
          // 2. Collect feedback (container required)
          const interactionId = uuidv4();
          // Zod validation for feedbackInput
          const feedbackInput = {
            agentId: config.id,
            interactionId,
            feedback: {
              type: options.feedbackType || "self_critique",
              metrics: options.metrics || { quality: 7 },
              inputContext: JSON.stringify(messages),
              outputResponse: typeof result.text === "string" ? result.text : JSON.stringify(result)
            }
          };
          const feedbackSchema = z.object({
            agentId: z.string(),
            interactionId: z.string(),
            feedback: z.object({
              type: z.string(),
              metrics: z.object({ quality: z.number() }),
              inputContext: z.string().optional(),
              outputResponse: z.string().optional(),
            })
          });
          const feedbackParse = feedbackSchema.safeParse(feedbackInput);
          if (!feedbackParse.success) {
            logger.error('Feedback input validation failed', feedbackParse.error);
            throw new Error('Invalid feedback input');
          }
          if (typeof collectFeedbackTool.execute === 'function') {
            await collectFeedbackTool.execute({
              container: model,
              context: feedbackInput
            });
          } else {
            logger.warn('collectFeedbackTool.execute is not a function');
          }
          // 3. Calculate reward (container required)
          const rewardInput = {
            agentId: config.id,
            episodeId,
            state: options.state || {},
            action: options.action || '',
            stepNumber: step,
            isTerminal: done,
          };
          // Zod validation for rewardInput
          const rewardSchema = z.object({
            agentId: z.string(),
            episodeId: z.string(),
            state: z.record(z.unknown()),
            action: z.string(),
            stepNumber: z.number(),
            isTerminal: z.boolean(),
          });
          const rewardParse = rewardSchema.safeParse(rewardInput);
          if (!rewardParse.success) {
            logger.error('Reward input validation failed', rewardParse.error);
            throw new Error('Invalid reward input');
          }
          let rewardResult: any = undefined;
          if (typeof calculateRewardTool.execute === 'function') {
            rewardResult = await calculateRewardTool.execute({
              container: model,
              context: rewardInput
            });
            logger.debug('RL reward result', { step, rewardResult });
          } else {
            logger.warn('calculateRewardTool.execute is not a function');
          }
          // 4. Analyze feedback (container required)
          if (typeof analyzeFeedbackTool.execute === 'function') {
            await analyzeFeedbackTool.execute({
              container: model,
              context: { agentId: config.id, limit: 10 }
            });
          } else {
            logger.warn('analyzeFeedbackTool.execute is not a function');
          }
          // 5. Apply RL insights and optimize policy (container required)
          if (rewardResult?.success) {
            if (typeof applyRLInsightsTool.execute === 'function') {
              await applyRLInsightsTool.execute({
                container: model,
                context: { agentId: config.id, insights: options.insights || [], currentInstructions: config.instructions }
              });
            } else {
              logger.warn('applyRLInsightsTool.execute is not a function');
            }
            if (typeof optimizePolicyTool.execute === 'function') {
              await optimizePolicyTool.execute({
                container: model,
                context: { agentId: config.id, episodeIds: [episodeId], currentPolicy: config.instructions }
              });
            } else {
              logger.warn('optimizePolicyTool.execute is not a function');
            }
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
    // Agent config with RL hooks and rlStepExecutor
    const agentConfig: any = {
      model,
      memory,
      name: config.name,
      instructions: config.instructions,
      tools,
      hooks: {
        onRequest: async (request: any) => {
          const agentSpan = sigNoz.createSpan('rl-agent.execution', {
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
          const streamSpan = sigNoz.createSpan('rl-agent.stream', {
            'agent.id': config.id,
            'agent.name': config.name,
            'messages.count': Array.isArray(messages) ? messages.length : 1
          });
          options.__monitoring = {
            span: streamSpan,
            startTime: performance.now()
          };
          streamLogger.debug('Starting RL stream operation', {
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
          streamLogger.debug('RL stream operation completed', {
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
        onStepFinish: async (stepDetails: any) => {
          streamLogger.debug('RL step finished', stepDetails);
        },
        ...(responseHook ? { onResponse: responseHook } : {}),
      },
      rlStepExecutor,
    };
    return new Agent(agentConfig);
  } catch (error) {
    logger.error(
      `Failed to create RL agent ${config.id}: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    throw error;
  }
}
