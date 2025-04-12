/**
 * Firebase Functions entry point
 *
 * This file exports all callable functions that will be deployed to Firebase.
 * Each exported function becomes accessible as an HTTP endpoint or callable
 * function from the client.
 */

import * as logger from "firebase-functions/logger";
import { contentAnalyzer, interactiveCreator } from "./genkit-content-analyzer";
import { onRequest, onCall, HttpsOptions } from "firebase-functions/v2/https";
import { mastra } from "./mastra"; // Import your Mastra instance

// Export GenKit functions
export { contentAnalyzer, interactiveCreator };

/**
 * Configuration options for HTTP endpoints
 */
const httpOptions: HttpsOptions = {
  cors: true,
  maxInstances: 10,
};

/**
 * Health check endpoint
 *
 * @returns Status information about the deployed functions
 */
export const healthCheck = onRequest(httpOptions, (request, response) => {
  logger.info("Health check requested", {
    source: request.headers["user-agent"] || "unknown",
    timestamp: new Date().toISOString(),
  });

  response.status(200).json({
    status: "ok",
    version: process.env.npm_package_version || "0.1.0",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    mastra: {
      initialized: !!mastra,
      agentCount: Object.keys(mastra.agents).length,
      networkCount: Object.keys(mastra.networks || {}).length,
    },
  });
});

/**
 * Interface for agent query parameters
 */
interface AgentQueryParams {
  prompt: string;
  agentId?: string;
}

/**
 * Interface for tool execution parameters
 */
interface ToolExecutionParams {
  /**
   * Name of the tool to execute
   */
  toolName: string;

  /**
   * Tool-specific parameters
   */
  params: Record<string, unknown>;
}

/**
 * Interface for workflow execution parameters
 */
interface WorkflowExecutionParams {
  /**
   * Name of the workflow to execute
   */
  workflowName: string;

  /**
   * Initial input for the workflow
   */
  input: unknown;

  /**
   * Optional workflow configuration
   */
  config?: Record<string, unknown>;
}

/**
 * Generic error response interface
 */
interface ErrorResponse {
  error: {
    message: string;
    code: string;
    details?: unknown;
  };
}

/**
 * Callable function to query a Mastra agent
 *
 * @param data - The query parameters including prompt and optional agentId
 * @returns The agent's response or an error message
 */
export const queryAgent = onCall<AgentQueryParams>(async (request) => {
  try {
    const { prompt, agentId = "writer-agent" } = request.data;

    // Validate inputs
    if (!prompt || typeof prompt !== "string") {
      return {
        error: {
          message: "Invalid prompt",
          code: "invalid_argument",
        },
      } as ErrorResponse;
    }

    logger.info(`Agent query received for ${agentId}`, {
      uid: request.auth?.uid || "anonymous",
      promptLength: prompt.length,
    });

    // Get the requested agent or default to writer-agent
    const agent = mastra.agents[agentId];
    if (!agent) {
      return {
        error: {
          message: `Agent ${agentId} not found`,
          code: "not_found",
          details: {
            availableAgents: Object.keys(mastra.agents),
          },
        },
      } as ErrorResponse;
    }

    // Query the agent
    const response = await agent.generate({ input: prompt });

    return {
      response: response.output,
      agentId,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error("Error in agent query", error);
    return {
      error: {
        message: error instanceof Error ? error.message : "Unknown error occurred",
        code: "internal",
        details: error instanceof Error ? { stack: error.stack } : undefined,
      },
    } as ErrorResponse;
  }
});

/**
 * Callable function to execute a specific Mastra tool
 *
 * @param data - The tool execution parameters
 * @returns The tool's execution result or an error message
 */
export const executeTool = onCall<ToolExecutionParams>(async (request) => {
  try {
    const { toolName, params } = request.data;

    // Validate inputs
    if (!toolName || typeof toolName !== "string") {
      return {
        error: {
          message: "Invalid tool name",
          code: "invalid_argument",
        },
      } as ErrorResponse;
    }

    logger.info(`Tool execution requested: ${toolName}`, {
      uid: request.auth?.uid || "anonymous",
      params: JSON.stringify(params),
    });

    // Find the requested tool
    // Note: Mastra tools might be accessed differently depending on your setup
    const tool = mastra.tools?.[toolName];
    if (!tool) {
      return {
        error: {
          message: `Tool ${toolName} not found`,
          code: "not_found",
          details: {
            availableTools: Object.keys(mastra.tools || {}),
          },
        },
      } as ErrorResponse;
    }

    // Execute the tool with the provided parameters
    const result = await tool.execute(params);

    return {
      result,
      toolName,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error("Error executing tool", error);
    return {
      error: {
        message: error instanceof Error ? error.message : "Unknown error occurred",
        code: "internal",
        details: error instanceof Error ? { stack: error.stack } : undefined,
      },
    } as ErrorResponse;
  }
});

/**
 * Callable function to execute a Mastra workflow
 *
 * @param data - The workflow execution parameters
 * @returns The workflow's execution result or an error message
 */
export const executeWorkflow = onCall<WorkflowExecutionParams>(async (request) => {
  try {
    const { workflowName, input, config } = request.data;

    // Validate inputs
    if (!workflowName || typeof workflowName !== "string") {
      return {
        error: {
          message: "Invalid workflow name",
          code: "invalid_argument",
        },
      } as ErrorResponse;
    }

    logger.info(`Workflow execution requested: ${workflowName}`, {
      uid: request.auth?.uid || "anonymous",
    });

    // Get the requested workflow
    const workflow = mastra.workflows?.[workflowName];
    if (!workflow) {
      return {
        error: {
          message: `Workflow ${workflowName} not found`,
          code: "not_found",
          details: {
            availableWorkflows: Object.keys(mastra.workflows || {}),
          },
        },
      } as ErrorResponse;
    }

    // Execute the workflow with the provided input and config
    const result = await workflow.execute(input, config);

    return {
      result,
      workflowName,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error("Error executing workflow", error);
    return {
      error: {
        message: error instanceof Error ? error.message : "Unknown error occurred",
        code: "internal",
        details: error instanceof Error ? { stack: error.stack } : undefined,
      },
    } as ErrorResponse;
  }
});

/**
 * List all available Mastra agents
 *
 * @returns List of agent IDs and their capabilities
 */
export const listAgents = onRequest(httpOptions, (request, response) => {
  try {
    // Build agent information
    const agentInfo = Object.entries(mastra.agents).map(([id, agent]) => ({
      id,
      name: agent.name || id,
      description: agent.description || "No description provided",
      hasTools: Array.isArray(agent.tools) && agent.tools.length > 0,
      toolCount: Array.isArray(agent.tools) ? agent.tools.length : 0,
    }));

    response.status(200).json({
      agents: agentInfo,
      count: agentInfo.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Error listing agents", error);
    response.status(500).json({
      error: {
        message: error instanceof Error ? error.message : "Unknown error occurred",
        code: "internal",
      },
    });
  }
});

/**
 * List all available Mastra tools
 *
 * @returns List of tool IDs and their capabilities
 */
export const listTools = onRequest(httpOptions, (request, response) => {
  try {
    // Safety check if tools are available
    if (!mastra.tools) {
      response.status(200).json({
        tools: [],
        count: 0,
        timestamp: new Date().toISOString(),
        message: "No tools are configured in this Mastra instance",
      });
      return;
    }

    // Build tool information
    const toolInfo = Object.entries(mastra.tools).map(([id, tool]) => ({
      id,
      name: tool.name || id,
      description: tool.description || "No description provided",
      parameters: tool.parameters || {},
    }));

    response.status(200).json({
      tools: toolInfo,
      count: toolInfo.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Error listing tools", error);
    response.status(500).json({
      error: {
        message: error instanceof Error ? error.message : "Unknown error occurred",
        code: "internal",
      },
    });
  }
});

/**
 * List all available Mastra workflows
 *
 * @returns List of workflow IDs and their descriptions
 */
export const listWorkflows = onRequest(httpOptions, (request, response) => {
  try {
    // Safety check if workflows are available
    if (!mastra.workflows) {
      response.status(200).json({
        workflows: [],
        count: 0,
        timestamp: new Date().toISOString(),
        message: "No workflows are configured in this Mastra instance",
      });
      return;
    }

    // Build workflow information
    const workflowInfo = Object.entries(mastra.workflows).map(([id, workflow]) => ({
      id,
      name: workflow.name || id,
      description: workflow.description || "No description provided",
      steps: Array.isArray(workflow.steps) ? workflow.steps.length : 0,
    }));

    response.status(200).json({
      workflows: workflowInfo,
      count: workflowInfo.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Error listing workflows", error);
    response.status(500).json({
      error: {
        message: error instanceof Error ? error.message : "Unknown error occurred",
        code: "internal",
      },
    });
  }
});
