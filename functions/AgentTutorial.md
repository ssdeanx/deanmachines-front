# Agent Tutorial

This tutorial will guide you through creating, configuring, and testing agents in the DeanMachines Mastra AI workspace. It covers agent patterns, configuration, advanced and RL agent bases, model/provider setup, and best practices for observability, error handling, and production readiness.

---

## 1. Agent Patterns & Structure

- **Agent files live in:** `src/mastra/agents/`
- **Config files live in:** `src/mastra/agents/config/`
- **Each agent has:**
  - A config file (e.g., `analyst.config.ts`) exporting a `BaseAgentConfig` object (see `config.types.ts` for schema)
  - An agent implementation (e.g., `analyst.agent.ts`) that imports the config and uses a factory (e.g., `createAgentFromConfig`, `createAdvancedAgentFromConfig`, or `createRLAgentFromConfig`)
  - Registration in the agent barrel (`src/mastra/agents/index.ts`) for discoverability

### Example Directory Structure

```bash
src/mastra/agents/
  analyst.agent.ts
  RLBase.agent.ts
  advancedBase.agent.ts
  base.agent.ts
  master.agent.ts
  ...
  config/
    analyst.config.ts
    research.config.ts
    ...
```

---

## 2. Agent Configs & Model Setup

- **Config files** export a `BaseAgentConfig` object with:
  - `id`, `name`, `description`, `modelConfig`, `instructions`, `toolIds`, and optional `responseValidation`.
  - `modelConfig` uses the schema in `config.types.ts` and can be built with helpers from `model.utils.ts`.
  - Use `DEFAULT_MODELS` (from `config.types.ts`) for standard model configs, or customize as needed.
  - Model providers supported: `google`, `vertex`, `openai`, `anthropic`, `ollama` (see `provider.utils.ts`).
  - Use `createModelInstance` from `model.utils.ts` to instantiate models in agent factories.

### Example Config

```typescript
import { BaseAgentConfig, DEFAULT_MODELS, defaultResponseValidation } from "./config.types";
export const analystAgentConfig: BaseAgentConfig = {
  id: "analyst-agent",
  name: "Analyst Agent",
  description: "Specialized in interpreting data, identifying patterns, and extracting meaningful insights from information.",
  modelConfig: DEFAULT_MODELS.GOOGLE_THINKING,
  responseValidation: defaultResponseValidation,
  instructions: "...",
  toolIds: ["format-content", "search-documents", ...],
};
```

---

## 3. Creating an Agent Implementation

- Import your config and the appropriate agent factory:
  - Use `createAgentFromConfig` from `base.agent.ts` for standard, single-step, or simple agents.
  
    ```typescript
    import { createAgentFromConfig } from "./base.agent";
    ```

  - Use `createAdvancedAgentFromConfig` from `advancedBase.agent.ts` for agents needing step-based (ReACT-style) execution, multi-tool/multi-agent orchestration, or OpenTelemetry tracing.
  
    ```typescript
    import { createAdvancedAgentFromConfig } from "./advancedBase.agent";
    ```

  - Use `createRLAgentFromConfig` from `RLBase.agent.ts` for agents that require RL feedback, reward, and policy optimization (autonomous learning agents).
  
    ```typescript
    import { createRLAgentFromConfig } from "./RLBase.agent";
    ```

- Inject `sharedMemory` and optional error handler
- Export your agent

### Example: Standard Agent

```typescript
import { createAgentFromConfig } from "./base.agent";
import { analystAgentConfig } from "./config/analyst.config";
import { sharedMemory } from "../database";

export const analystAgent = createAgentFromConfig({
  config: analystAgentConfig,
  memory: sharedMemory,
  onError: async (error) => ({ text: `Error: ${error.message}` })
});
```

### Example: Advanced Agent

```typescript
import { createAdvancedAgentFromConfig } from "./advancedBase.agent";
import { analystAgentConfig } from "./config/analyst.config";
import { sharedMemory } from "../database";

export const advancedAnalystAgent = createAdvancedAgentFromConfig({
  config: analystAgentConfig,
  memory: sharedMemory,
  onError: async (error) => ({ text: `Error: ${error.message}` })
});
```

### Example: RL Agent

```typescript
import { createRLAgentFromConfig } from "./RLBase.agent";
import { analystAgentConfig } from "./config/analyst.config";
import { sharedMemory } from "../database";

export const rlAnalystAgent = createRLAgentFromConfig({
  config: analystAgentConfig,
  memory: sharedMemory,
  onError: async (error) => ({ text: `Error: ${error.message}` })
});
```

**Key Differences:**

- `base.agent.ts` (createAgentFromConfig): For simple, single-step, or stateless agents. Minimal hooks, no step-based execution, no RL.
- `advancedBase.agent.ts` (createAdvancedAgentFromConfig): For agents needing step-based reasoning, multi-tool/multi-agent orchestration, and distributed tracing (OpenTelemetry). Use for ReACT, tool-using, or delegating agents.
- `RLBase.agent.ts` (createRLAgentFromConfig): For agents that learn from feedback, calculate rewards, and optimize their policy using RL tools. Use for autonomous, self-improving agents.

---

## 4. Advanced & RL Agent Bases

- **advancedBase.agent.ts:**
  - Supports step-based (ReACT-style) execution, multi-tool/multi-agent orchestration, OpenTelemetry tracing, advanced memory/context, and enhanced hooks.
  - Use `createAdvancedAgentFromConfig` for agents needing orchestration, delegation, or distributed tracing.
- **RLBase.agent.ts:**
  - Adds RL feedback, reward, and policy optimization. Integrates RL tools (`collectFeedbackTool`, `analyzeFeedbackTool`, `applyRLInsightsTool`, `calculateRewardTool`, `defineRewardFunctionTool`, `optimizePolicyTool`).
  - Use `createRLAgentFromConfig` for agents that learn from feedback and optimize their policy.
- **master.agent.ts:**
  - Orchestrates other agents, supports ReACT+Action prompt pattern, and is registered in the agent barrel for network use.

---

## 5. Registering Your Agent

- Add your agent to `src/mastra/agents/index.ts` for discoverability and use in networks or workflows.
- Example:

```typescript
export * from "./analyst.agent";
export * from "./yourAgent.agent";
```

---

## 6. Model & Provider Utilities

- Use `model.utils.ts` for model instantiation:
  - `createModelInstance(config)` is the main entry point for all agent factories.
  - Helpers: `createGoogleModel`, `createVertexModel`, `createOpenAIModel`, `createAnthropicModel`, `createOllamaModel`.
- Use `provider.utils.ts` for provider setup/config:
  - Helpers: `setupGoogleProvider`, `setupVertexProvider`, `setupOpenAIProvider`, `setupAnthropicProvider`, `setupOllamaProvider`.
  - All providers are type-safe and validated with Zod schemas.

---

## 7. Testing & Validation

- Add new agents to `Agent-Fails.md` for tracking and testing.
- Move to "Working" section only after full validation.
- After every edit, run lint/type checks and fix all errors.
- Use tracing and debug logs to monitor agent execution and performance.

---

## 8. Best Practices

- **Follow the agent pattern:** config + agent + registration
- **Validate tool registration and schemas** after every change
- **Use tracing and debug logging** for all agent actions
- **Document all changes** in the changelog and README
- **Track production benchmarks:** p99 latency, error rate, tracing coverage, RL improvement, feedback collection
- **Never remove or overwrite code unless explicitly instructed**
- **Gather context before making changes**
- **Ask for clarification if unsure**
- **Use Zod for all schema validation**
- **Use OpenTelemetry and SigNoz for tracing and observability**

---

## 9. Example: Minimal Agent

```typescript
// config/minimal.config.ts
import { BaseAgentConfig, DEFAULT_MODELS } from "./config.types";
export const minimalAgentConfig: BaseAgentConfig = {
  id: "minimal-agent",
  name: "Minimal Agent",
  description: "A minimal agent for demonstration.",
  modelConfig: DEFAULT_MODELS.GOOGLE_STANDARD,
  instructions: "You are a minimal agent.",
  toolIds: ["format-content"],
};

// minimal.agent.ts
import { createAgentFromConfig } from "./base.agent";
import { minimalAgentConfig } from "./config/minimal.config";
import { sharedMemory } from "../database";

export const minimalAgent = createAgentFromConfig({
  config: minimalAgentConfig,
  memory: sharedMemory,
});
```

---

## 10. Troubleshooting

- If your agent fails to start, check for missing tools, invalid config, or registration issues.
- Use debug logs and tracing to pinpoint errors.
- Check `Agent-Fails.md` for known issues and testing status.
- Always run lint/type checks after editing agent or tool files.

---

## 11. Further Reading

- [README.md](./README.md) for workspace structure, benchmarks, and best practices
- [CHANGELOG.md](./CHANGELOG.md) for historical changes
- [Agent-Fails.md](./Agent-Fails.md) for testing and validation status
- [ToolsTutorial.md](./ToolsTutorial.md) for tool development
- [WorkflowTutorial.md](./WorkflowTutorial.md) for workflow orchestration

---

*Last updated: 2025-04-17*
