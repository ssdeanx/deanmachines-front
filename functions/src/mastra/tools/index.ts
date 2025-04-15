/**
 * Tool Registry and Management
 *
 * This module serves as the central registry for all available tools,
 * handling their initialization, configuration, and export. It assembles
 * core, optional, additional, and extra tools into a lookup map so that agents
 * can easily find and use them.
 *
 * @module Tools
 */

// === Standard library imports ===
import { env } from "process";

// === Third-party imports ===
import { z, ZodType, ZodTypeAny } from "zod"; // Import specific Zod types
import { Tool, createTool } from "@mastra/core/tools"; // Using Mastra core Tool
import { createLogger } from "@mastra/core/logger";
// Note: createMastraTools from @agentic/mastra is used internally by tool modules now

// === Internal tool imports ===
// --- Core & Optional Tools ---
import {
  vectorQueryTool,
  googleVectorQueryTool,
  filteredQueryTool,
} from "./vectorquerytool";
import { createBraveSearchTool } from "./brave-search";
import { createGoogleSearchTool } from "./google-search";
import { createTavilySearchTool } from "./tavily";
import { createMastraExaSearchTools } from "./exasearch";
import { readFileTool, writeToFileTool } from "./readwrite";
import {
  collectFeedbackTool,
  analyzeFeedbackTool,
  applyRLInsightsTool,
} from "./rlFeedback";
import {
  calculateRewardTool,
  defineRewardFunctionTool,
  optimizePolicyTool,
} from "./rlReward";
import { memoryQueryTool } from "./memoryQueryTool";

// --- Additional Tools ---
import { analyzeContentTool, formatContentTool } from "./contentTools";
import { searchDocumentsTool, embedDocumentTool } from "./document-tools";

// --- Extra Tools (Import Helper Functions & Direct Tools) ---
import { createCalculatorTool } from "./calculator";
import { createLlamaIndexTools } from "./llamaindex";
import { createMastraArxivTools } from "./arxiv"; // Import Mastra helper
import { createMastraWikipediaTools } from "./wikibase"; // Import Mastra helper
import { createMastraAISDKTools } from "./ai-sdk"; // Import Mastra helper
import { createMastraE2BTools } from "./e2b"; // Import Mastra helper
import { createGraphRagTool, graphRagQueryTool } from "./graphRag"; // These are Mastra core tools
import { createMastraLLMChainTools, LLMChainOutputSchema, AiSdkPromptOutputSchema } from "./llmchain"; // Import Mastra helper
import { createMastraGitHubTools } from "./github"; // Import Mastra helper
import { github } from "../integrations"; // Used for custom getMainBranchRef
import ExaSearchOutputSchema from "./exasearch";
import { GitHubUserSchema } from "./github"; // Assuming this is the correct export for GitHub user schema

// === Export all tool modules (Consider if all are needed) ===
export * from "./e2b";
export * from "./exasearch";
export * from "./readwrite";
export * from "./vectorquerytool";
export * from "./rlFeedback";
export * from "./rlReward";
export * from "./memoryQueryTool";
export * from "./github";
export * from "./graphRag";
export * from "./calculator";
export * from "./llamaindex";
export * from "./mcptools"; // Keep export even if tools commented out
export * from "./arxiv";
export * from "./wikibase";
export * from "./ai-sdk";
export * from "./contentTools";
export * from "./document-tools";
export * from "./llmchain";
export * from "./brave-search";
export * from "./google-search";
export * from "./tavily";
export { LLMChainOutputSchema, AiSdkPromptOutputSchema };
export { ExaSearchOutputSchema };
export { GitHubUserSchema };

// === Configure Logger ===
const logger = createLogger({ name: "tool-initialization", level: "info" });

// === Environment Configuration ===

/**
 * Schema for environment variables used to initialize tools.
 */
const envSchema = z.object({
  GOOGLE_AI_API_KEY: z.string().min(1, "Google AI API key is required"),
  PINECONE_API_KEY: z.string().min(1, "Pinecone API key is required"),
  PINECONE_INDEX: z.string().default("Default"),
  BRAVE_API_KEY: z.string().optional(),
  EXA_API_KEY: z.string().optional(),
  GOOGLE_CSE_KEY: z.string().optional(),
  GOOGLE_CSE_ID: z.string().optional(),
  TAVILY_API_KEY: z.string().optional(),
  // API keys for extra tools
  E2B_API_KEY: z.string().min(1, "E2B API key is required"),
  GITHUB_API_KEY: z.string().min(1, "GitHub API key is required"),
});

/**
 * Type alias for the validated environment configuration.
 */
export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Validates the environment configuration.
 * @returns {EnvConfig} The validated environment configuration.
 * @throws {Error} When validation fails.
 */
function validateConfig(): EnvConfig {
  try {
    return envSchema.parse(env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingKeys = error.errors
        .filter((e) => e.code === "invalid_type" && e.received === "undefined")
        .map((e) => e.path.join("."));
      if (missingKeys.length > 0) {
        logger.error(
          `Missing required environment variables: ${missingKeys.join(", ")}`
        );
      }
    }
    logger.error("Environment validation failed:", { error });
    throw new Error(
      `Failed to validate environment configuration: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

// === Initialize Environment Configuration ===
const config: EnvConfig = validateConfig();

// === Custom Tool Definition (Example: GitHub - using Mastra core createTool) ===
// Define a potential type for the GitHub API client (adjust based on actual client)
// This interface reflects the expected structure for the git.getRef method from Octokit REST client
interface GitHubApiClient {
    git: {
        getRef: (options: { owner: string; repo: string; ref: string; [key: string]: any }) => Promise<{ data?: { ref?: string } }>;
        // Add other git methods if needed
    };
    // Add other top-level client methods if needed (e.g., repos, users)
}

export const getMainBranchRef = createTool({ // Using @mastra/core/tools createTool
  id: "getMainBranchRef",
  description: "Fetch the main branch reference from a GitHub repository",
  inputSchema: z.object({
    owner: z.string(),
    repo: z.string(),
  }),
  outputSchema: z.object({
    ref: z.string().optional(),
  }),
  async execute(context) { // Correctly define the execute function signature
    // Cast to unknown first, then to the specific interface to satisfy TS strictness
    const client = (await github.getApiClient()) as unknown as GitHubApiClient;

    // Check for the nested structure
    if (!client || !client.git || typeof client.git.getRef !== 'function') {
        logger.error("GitHub client or git.getRef method not available.");
        throw new Error("GitHub integration is not configured correctly.");
    }

    try {
        // Call the method using the nested structure
        // Access input parameters via context.context
        const mainRef = await client.git.getRef({
            owner: context.context.owner, // Access via context.context
            repo: context.context.repo,   // Access via context.context
            ref: "heads/main", // Common way to reference main branch head
        });
        // Access data safely
        return { ref: mainRef?.data?.ref };
    } catch (error: any) {
        // Handle cases where the ref might not exist (e.g., 404)
        if (error.status === 404) {
            // Use correct context access in logging as well
            logger.warn(`Main branch ref not found for ${context.context.owner}/${context.context.repo}`); // Use context.context
            return { ref: undefined };
        }
        // Use correct context access in logging as well
        logger.error(`Error fetching main branch ref for ${context.context.owner}/${context.context.repo}:`, error); // Use context.context
        throw error; // Re-throw unexpected errors
    }
  },
});

// === Search Tools Initialization ===

/**
 * Record type for search tools.
 */
interface SearchToolRecord {
  [key: string]: Tool<ZodTypeAny, ZodTypeAny> | undefined;
}

/**
 * Helper function to ensure a tool has a valid Zod output schema.
 * Defaults to `z.object({})` if undefined.
 * Needed for tools not created via Mastra helpers (e.g., LlamaIndex, Calculator, Exa).
 */
function ensureToolOutputSchema<
  TInput extends ZodTypeAny,
  TOutput extends ZodTypeAny | undefined
>(tool: Tool<TInput, TOutput>): Tool<TInput, ZodTypeAny> {
  // Check if outputSchema is a valid Zod schema instance
  if (tool.outputSchema && tool.outputSchema instanceof ZodType) {
    // If it is, the type is already correct or compatible
    return tool as Tool<TInput, ZodTypeAny>;
  }
  // If not, provide a default empty object schema
  logger.warn(`Tool "${tool.id}" missing valid output schema, defaulting to empty object.`);
  return {
    ...tool,
    outputSchema: z.object({}).describe("Default empty output"),
  } as Tool<TInput, ZodTypeAny>; // Cast needed after modification
}


/**
 * Initializes search tools based on available API keys.
 */
const searchTools: SearchToolRecord = {
  brave: config.BRAVE_API_KEY
    ? createBraveSearchTool({ apiKey: config.BRAVE_API_KEY })
    : undefined,
  google:
    config.GOOGLE_CSE_KEY && config.GOOGLE_CSE_ID
      ? createGoogleSearchTool({
          apiKey: config.GOOGLE_CSE_KEY,
          searchEngineId: config.GOOGLE_CSE_ID,
        })
      : undefined,
  tavily: config.TAVILY_API_KEY
    ? createTavilySearchTool({ apiKey: config.TAVILY_API_KEY })
    : undefined,
  exa: config.EXA_API_KEY
    ? (() => {
        const exaTool = createMastraExaSearchTools({ apiKey: config.EXA_API_KEY })["exa_search"] as Tool<any, any>;
        // Patch outputSchema directly
        (exaTool as any).outputSchema = ExaSearchOutputSchema;
        return exaTool;
      })()
    : undefined,
};

// === Core Tools Initialization ===

/**
 * Core tools that are always available.
 */
const coreTools: Tool<any, any>[] = [
  vectorQueryTool,
  googleVectorQueryTool,
  filteredQueryTool,
  readFileTool,
  writeToFileTool,
  memoryQueryTool,
  collectFeedbackTool,
  analyzeFeedbackTool,
  applyRLInsightsTool,
  calculateRewardTool,
  defineRewardFunctionTool,
  optimizePolicyTool,
  getMainBranchRef, // Added the custom GitHub tool here
];

// === Additional Tools from contentTools and document-tools ===
const additionalTools: Tool<any, any>[] = [
  analyzeContentTool,
  formatContentTool,
  searchDocumentsTool,
  embedDocumentTool,
];

// === Extra Tools Initialization ===

// Array to hold all extra tools
const extraTools: Tool<any, any>[] = [];

// --- E2B Tools (using Mastra helper) ---
try {
    const e2bToolsObject = createMastraE2BTools(); // Use the helper from e2b.ts, returns an object
    const e2bToolsArray = Object.values(e2bToolsObject); // Extract tool values into an array
    // Cast to Tool<any, any> to resolve potential type mismatches
    extraTools.push(...e2bToolsArray.map(tool => tool as Tool<any, any>));
    logger.info(`Added ${e2bToolsArray.length} E2B tools.`);
} catch (error) {
    logger.error("Failed to initialize E2B tools:", { error });
}

// --- LlamaIndex Tools (needs schema check) ---
try {
    const llamaIndexArrayRaw = createLlamaIndexTools(); // Returns FunctionTool[]
    if (Array.isArray(llamaIndexArrayRaw)) {
      const llamaIndexTools = llamaIndexArrayRaw.map(llamaTool => {
          // Adapt FunctionTool to Mastra Tool structure
          const mastraTool: Tool<any, any> = {
              id: llamaTool.metadata.name,
              description: llamaTool.metadata.description,
              inputSchema: llamaTool.metadata.parameters as z.ZodSchema | undefined, // Cast schema if needed
              execute: llamaTool.call as any, // Use the 'call' method for execution
              // outputSchema is handled by ensureToolOutputSchema
          };
          return ensureToolOutputSchema(mastraTool); // Now apply schema check
      });
      extraTools.push(...llamaIndexTools);
      logger.info(`Added ${llamaIndexTools.length} LlamaIndex tools.`);
    } else {
        logger.warn("createLlamaIndexTools did not return an array.");
    }
} catch (error) {
    logger.error("Failed to initialize LlamaIndex tools:", { error });
}

// --- MCP Tools (Intentionally Commented Out) ---
// import { createMcpTools } from "@agentic/mcp"; // Assuming this path is correct if uncommented
// (async () => {
//   try {
//     const mcpTools = await createMcpTools({ /* config */ });
//     // Need a createMastraMcpTools helper or use createMastraTools directly if uncommented
//     // const mcpMastraTools = createMastraTools(mcpTools);
//     // const mcpToolsArray = Object.values(mcpMastraTools).map(ensureToolOutputSchema);
//     // extraTools.push(...mcpToolsArray);
//     // logger.info(`Added ${mcpToolsArray.length} MCP tools`);
//   } catch (error) {
//     logger.error("Failed to initialize MCP tools:", { error });
//   }
// })();

// --- Arxiv Tools (using Mastra helper) ---
try {
    const arxivToolsObject = createMastraArxivTools(); // Use the helper from arxiv.ts
    const arxivToolsArray = Object.values(arxivToolsObject); // Extract tool values into an array
    // Cast to Tool<any, any> to resolve potential type mismatches
    extraTools.push(...arxivToolsArray.map(tool => tool as Tool<any, any>));
    logger.info(`Added ${arxivToolsArray.length} Arxiv tools.`);
} catch (error) {
    logger.error("Failed to initialize Arxiv tools:", { error });
}

// --- AI SDK Tools (using Mastra helper) ---
// Assuming createMastraAISDKTools() in ai-sdk.ts correctly finds/uses AIFunctionLike[]
try {
    const aisdkToolsObject = createMastraAISDKTools(); // Helper likely returns an object
    const aisdkToolsArray = Object.values(aisdkToolsObject); // Extract tool values into an array
    // Cast to Tool<any, any> to resolve potential type mismatches
    extraTools.push(...aisdkToolsArray.map(tool => tool as Tool<any, any>));
    logger.info(`Added ${aisdkToolsArray.length} AI SDK tools (via Mastra helper).`);
} catch (error) {
    logger.error("Failed to initialize AI SDK tools:", { error });
}

// --- Wikipedia Tools (using Mastra helper) ---
try {
  const wikiToolsObject = createMastraWikipediaTools(); // Use the helper from wikibase.ts
  const wikiToolsArray = Object.values(wikiToolsObject); // Extract tool values
  // Cast to Tool<any, any> to resolve potential type mismatches
  extraTools.push(...wikiToolsArray.map(tool => tool as Tool<any, any>));
  logger.info(`Added ${wikiToolsArray.length} Wikipedia tools.`);
} catch (error) {
  logger.error("Failed to initialize Wikipedia tools:", { error });
}

// --- Calculator Tool (needs schema check) ---
try {
    const calculatorToolInstance = createCalculatorTool();
    extraTools.push(ensureToolOutputSchema(calculatorToolInstance)); // Schema check needed
    logger.info("Added Calculator tool.");
} catch (error) {
    logger.error("Failed to initialize Calculator tool:", { error });
}

// --- GraphRag Tools (Mastra core tools, need schema check) ---
try {
    // Add the main GraphRag tools if they are valid Tool objects
    if (createGraphRagTool && typeof createGraphRagTool === 'object' && 'id' in createGraphRagTool) {
        extraTools.push(ensureToolOutputSchema(createGraphRagTool as Tool<any, any>)); // Schema check
    } else { logger.warn("createGraphRagTool is not a valid Tool object."); }

    if (graphRagQueryTool && typeof graphRagQueryTool === 'object' && 'id' in graphRagQueryTool) {
        extraTools.push(ensureToolOutputSchema(graphRagQueryTool as Tool<any, any>)); // Schema check
    } else { logger.warn("graphRagQueryTool is not a valid Tool object."); }

    // Create and add the 'graph-rag' alias
    if (createGraphRagTool && typeof createGraphRagTool === 'object' && 'id' in createGraphRagTool) {
      const baseTool = createGraphRagTool as Tool<any, any>;
      const graphRagAliasTool: Tool<any, any> = { ...baseTool, id: "graph-rag" };
      extraTools.push(ensureToolOutputSchema(graphRagAliasTool)); // Schema check
      logger.info("Added GraphRag tools and 'graph-rag' alias.");
    } else {
      logger.warn("Could not create 'graph-rag' alias: createGraphRagTool is not valid.");
    }
} catch (error) {
    logger.error("Failed to initialize GraphRag tools:", { error });
}

// --- LLM Chain Tools (using Mastra helper) ---
try {
    const llmChainToolsObject = createMastraLLMChainTools(); // Use the helper from llmchain.ts
    const llmChainToolsArray = Object.values(llmChainToolsObject); // Get tool values
    // Cast to Tool<any, any> to resolve potential type mismatches from different internal definitions
    extraTools.push(...llmChainToolsArray.map(tool => tool as Tool<any, any>));
    logger.info(`Added ${llmChainToolsArray.length} LLM Chain tools.`);
} catch (error) {
    logger.error("Failed to initialize LLM Chain tools:", { error });
}

// --- GitHub Tools (using Mastra helper) ---
try {
    const githubToolsObject = createMastraGitHubTools(); // Use the helper from github.ts
    const githubToolsArray = Object.values(githubToolsObject); // Extract tool values
    // Cast to Tool<any, any> to resolve potential type mismatches
    extraTools.push(...githubToolsArray.map(tool => tool as Tool<any, any>));
    logger.info(`Added ${githubToolsArray.length} GitHub tools (via Mastra helper).`);
} catch (error) {
    logger.error("Failed to initialize GitHub tools:", { error });
}


// === Filter Optional Search Tools ===
const optionalTools: Tool<any, any>[] = Object.values(
  searchTools
).filter(
  (tool): tool is Tool<any, any> => tool !== undefined
);

// === Aggregate All Tools ===

/**
 * Complete collection of all available tools (core + optional + additional + extra).
 */
export const allTools: readonly Tool<any, any>[] =
  Object.freeze([
    ...coreTools,
    ...optionalTools,
    ...additionalTools,
    ...extraTools,
  ]);

/**
 * Map for efficient lookup of tools by their ID.
 */
export const allToolsMap: ReadonlyMap<
  string,
  Tool<any, any>
> = new Map(allTools.map((tool) => [tool.id, tool]));

/**
 * Grouped tools by category for easier access.
 */
export const toolGroups = {
  search: optionalTools,
  vector: [vectorQueryTool, googleVectorQueryTool, filteredQueryTool],
  file: [readFileTool, writeToFileTool],
  memory: [memoryQueryTool],
  rl: [
    collectFeedbackTool,
    analyzeFeedbackTool,
    applyRLInsightsTool,
    calculateRewardTool,
    defineRewardFunctionTool,
    optimizePolicyTool,
  ],
  content: additionalTools.filter(t => ['analyzeContentTool', 'formatContentTool'].includes(t.id)),
  document: additionalTools.filter(t => ['searchDocumentsTool', 'embedDocumentTool'].includes(t.id)),
  github: [getMainBranchRef, ...extraTools.filter(t => t.id.startsWith('github_'))], // Group custom and provider tools
  extra: extraTools, // Contains all tools added above
};

// === Log Initialization Results ===
logger.info(`Initialized ${allTools.length} tools successfully.`);
logger.info(
  `Search tools available: ${
    toolGroups.search.map((t) => t.id).join(", ") || "none"
  }`
);
// Add specific checks for included tools based on expected IDs from helpers
logger.info(`GraphRag tools included: ${extraTools.some(t => t.id.startsWith('graphRag') || t.id === 'createGraphRagTool' || t.id === 'graph-rag')}`);
logger.info(`LLMChain tools included: ${extraTools.some(t => t.id.startsWith('llm-chain_'))}`); // Assuming helper creates IDs like 'llm-chain_...'
logger.info(`E2B tools included: ${extraTools.some(t => t.id.startsWith('e2b_'))}`); // Assuming helper creates IDs like 'e2b_...'
logger.info(`Arxiv tools included: ${extraTools.some(t => t.id.startsWith('arxiv_'))}`); // Assuming helper creates IDs like 'arxiv_...'
logger.info(`AI SDK tools included: ${extraTools.some(t => t.id.startsWith('ai-sdk_'))}`); // Assuming helper creates IDs like 'ai-sdk_...'


// For backward compatibility.
export { allToolsMap as toolMap };
export { toolGroups as groups };

export default allToolsMap;