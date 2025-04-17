// RLBase.agent.ts
// Advanced RL Agent Factory: Extends base.agent.ts with RL feedback, reward, and policy optimization
import { createAgentFromConfig } from './base.agent';
import { calculateRewardTool, defineRewardFunctionTool, optimizePolicyTool } from '../tools/rlReward';
import { collectFeedbackTool, analyzeFeedbackTool, applyRLInsightsTool } from '../tools/rlFeedback';
import { createLogger } from '@mastra/core/logger';
import { BaseAgentConfig } from './config';
import { sharedMemory } from '../database';

export function createRLAgentFromConfig({
  config,
  memory,
  onError,
}: {
  config: BaseAgentConfig;
  memory: typeof sharedMemory;
  onError?: (error: Error) => Promise<{ text: string }>;
}) {
  // Set logger to debug for RL agent
  const logger = createLogger({ name: `rl-agent-${config.id}`, level: 'debug' });
  // Create the base agent instance
  const agent = createAgentFromConfig({ config, memory, onError });

  // RL step executor: wraps agent.generate with RL feedback/reward loop
  async function rlStepExecutor(messages: any, options: any = {}) {
    let step = 0;
    let done = false;
    let contextObj = options.context || [];
    let result: any = {};
    let episodeId = options.episodeId || `ep_${Date.now()}`;
    while (!done && step < (options.maxSteps || 8)) {
      // 1. Agent acts
      result = await agent.generate(messages, { ...options, context: contextObj });
      logger.debug('RL step result', { step, result });
      // 2. Collect feedback
      await collectFeedbackTool.execute({ context: { agentId: config.id, episodeId, stepNumber: step, ...options.feedbackContext } });
      // 3. Calculate reward
      const rewardResult = await calculateRewardTool.execute({ context: { agentId: config.id, episodeId, stepNumber: step, state: options.state || {}, action: options.action || '', ...options.rewardContext } });
      logger.debug('RL reward result', { step, rewardResult });
      // 4. Analyze feedback and apply RL insights
      if (rewardResult?.success) {
        await applyRLInsightsTool.execute({ context: { agentId: config.id, insights: options.insights || [], currentInstructions: config.instructions } });
        await optimizePolicyTool.execute({ context: { agentId: config.id, episodeIds: [episodeId], currentPolicy: config.instructions } });
      }
      if ((result as any).text || (result as any).object) done = true;
      step++;
      if (options.onStepFinish) await options.onStepFinish({ step, result });
    }
    return result;
  }

  // Attach RL step executor to agent instance
  (agent as any).rlStepExecutor = rlStepExecutor;
  return agent;
}
