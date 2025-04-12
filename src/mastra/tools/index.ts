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
import { z } from "zod";
import { Tool } from "@mastra/core/tools";
import { createLogger } from "@mastra/core/logger";
import { createMastraTools } from "@agentic/mastra";

// === Internal tool imports ===
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

// --- Import additional tools from new modules ---
import { analyzeContentTool, formatContentTool } from "./contentTools";
import { searchDocumentsTool, embedDocumentTool } from "./document-tools";

// --- Import extra modules that return or represent tool instances ---
import { GitHubClient } from "./github";
import { GraphNode } from "./graphRag";
import { createCalculatorTool } from "./calculator";
import { createLlamaIndexTools } from "./llamaindex";
import { McpTools } from "./mcptools";
import { arxiv } from "./arxiv";
import { WikipediaClient } from "./wikibase";
import { createAISDKTools } from "./ai-sdk";
import { e2b } from "./e2b";
// Import GraphRag tools so that they are read and fully functional.
import { createGraphRagTool, graphRagQueryTool } from "./graphRag";
import { llmChainTool, aiSdkPromptTool } from "./llmchain";
import { github } from "../integrations";
// === Export all tool modules ===
export * from "./e2b";
export * from "./exasearch";
export * from "./google-search";
export * from "./brave-search";
export * from "./tavily";
export * from "./readwrite";
export * from "./vectorquerytool";
export * from "./rlFeedback";
export * from "./rlReward";
export * from "./memoryQueryTool";
export * from "./github";
export * from "./graphRag";
export * from "./calculator";
export * from "./llamaindex";
export * from "./mcptools";
export * from "./arxiv";
export * from "./wikibase";
export * from "./ai-sdk";
export * from "./contentTools";
export * from "./document-tools";
export * from "./llmchain";

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
 *
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

export const getMainBranchRef = createTool({
  id: "getMainBranchRef",
  description: "Fetch the main branch reference from a GitHub repository",
  inputSchema: z.object({
    owner: z.string(),
    repo: z.string(),
  }),
  outputSchema: z.object({
    ref: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const client = await github.getApiClient();

    const mainRef = await client.gitGetRef({
      path: {
        owner: context.owner,
        repo: context.repo,
        ref: "heads/main",
      },
    });

    return { ref: mainRef.data?.ref };
  },
});

// === Search Tools Initialization ===

/**
 * Record type for search tools.
 */
interface SearchToolRecord {
  [key: string]: Tool<z.ZodTypeAny, z.ZodTypeAny> | undefined;
}

/**
 * Initializes search tools based on available API keys.
 * Each tool is wrapped with createMastraTools to ensure proper adapter implementation.
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
  // createMastraExaSearchTools returns an object like { 'exa_search': Tool }, extract the tool.
  exa: config.EXA_API_KEY
    ? ensureToolOutputSchema(
        createMastraExaSearchTools({ apiKey: config.EXA_API_KEY })["exa_search"]
      ) // Ensure schema and access the specific tool
    : undefined,
};

// === Core Tools Initialization ===

/**
 * Core tools that are always available.
 */
const coreTools: Tool<z.ZodTypeAny, z.ZodTypeAny>[] = [
  vectorQueryTool as Tool<z.ZodTypeAny, z.ZodTypeAny>,
  googleVectorQueryTool as Tool<z.ZodTypeAny, z.ZodTypeAny>,
  filteredQueryTool as Tool<z.ZodTypeAny, z.ZodTypeAny>,
  readFileTool as Tool<z.ZodTypeAny, z.ZodTypeAny>,
  writeToFileTool as Tool<z.ZodTypeAny, z.ZodTypeAny>,
  memoryQueryTool as Tool<z.ZodTypeAny, z.ZodTypeAny>,
  collectFeedbackTool as Tool<z.ZodTypeAny, z.ZodTypeAny>,
  analyzeFeedbackTool as Tool<z.ZodTypeAny, z.ZodTypeAny>,
  applyRLInsightsTool as Tool<z.ZodTypeAny, z.ZodTypeAny>,
  calculateRewardTool as Tool<z.ZodTypeAny, z.ZodTypeAny>,
  defineRewardFunctionTool as Tool<z.ZodTypeAny, z.ZodTypeAny>,
  optimizePolicyTool as Tool<z.ZodTypeAny, z.ZodTypeAny>,
];

// === Additional Tools from contentTools and document-tools ===
const additionalTools: Tool<z.ZodTypeAny, z.ZodTypeAny>[] = [
  analyzeContentTool,
  formatContentTool,
  searchDocumentsTool,
  embedDocumentTool,
];

// === Extra Tools Initialization ===
/**
 * Extra tools aggregated from modules that expose tool instances.
 * NOTE: Some imports (like GraphNode, CalculatorConfig, WikipediaClient) are types or configurations,
 * so only tool instances are added to the tools map.
 */

/**
 * Helper function to ensure a tool has a valid Zod output schema.
 * If the output schema is undefined, it defaults to `z.object({})`.
 *
 * @template TInput - The Zod type of the input schema.
 * @template TOutput - The Zod type of the output schema (can be undefined).
 * @param {Tool<TInput, TOutput>} tool - The tool to process.
 * @returns {Tool<TInput, z.ZodTypeAny>} - The tool with a guaranteed valid output schema.
 */
function ensureToolOutputSchema<
  TInput extends z.ZodTypeAny,
  TOutput extends z.ZodTypeAny | undefined
>(tool: Tool<TInput, TOutput>): Tool<TInput, z.ZodTypeAny> {
  // If outputSchema is already a ZodType, return the tool as is, but typed correctly.
  if (tool.outputSchema && tool.outputSchema instanceof z.ZodType) {
    return tool as Tool<TInput, z.ZodTypeAny>;
  }
  // Otherwise, provide a default schema and return the modified tool.
  // Use 'unknown' in the cast as the exact TInput is generic here.
  return {
    ...tool,
    outputSchema: z.object({}).describe("Default empty output"),
  } as unknown as Tool<TInput, z.ZodTypeAny>;
}

const extraTools: Tool<z.ZodTypeAny, z.ZodTypeAny>[] = [];

// Instantiate GitHub client using the provided API key.
const gitHubTool = new GitHubClient({ apiKey: config.GITHUB_API_KEY });
const gitHubToolsRaw = Object.values(createMastraTools(gitHubTool));
extraTools.push(...gitHubToolsRaw.map(ensureToolOutputSchema));

// Instantiate (or use) the E2B tool if it is already an instance.
if (e2b && typeof e2b === "object" && "id" in e2b) {
  // Assuming e2b conforms to AIFunctionsProvider
  const e2bToolsRaw = Object.values(createMastraTools(e2b));
  extraTools.push(...e2bToolsRaw.map(ensureToolOutputSchema));
}

// Create and add LlamaIndex tools.
// Assuming createLlamaIndexTools returns Tool[] directly
const llamaIndexArray = createLlamaIndexTools();
if (Array.isArray(llamaIndexArray)) {
  // Ensure schema for LlamaIndex tools as well, casting to satisfy the map function's parameter type
  extraTools.push(
    ...llamaIndexArray.map((tool) =>
      ensureToolOutputSchema(tool as unknown as Tool<any, any>)
    )
  );
}

// Initialize MCP tools to connect to Docker socat bridge
// This can work with: docker run -i --rm alpine/socat STDIO TCP:host.docker.internal:8811
import { createMcpTools } from "@agentic/mcp";

// Initialize MCP tools asynchronously and add them to extraTools later
(async () => {
  try {
    const mcpTools = await createMcpTools({
      name: "docker-mcp-server",
      // Connect to external TCP server using serverUrl
      serverUrl: "http://localhost:8811",
    });

    // Wrap with createMastraTools and add to extraTools
    const mcpMastraTools = createMastraTools(mcpTools);
    const mcpToolsArray = Object.values(mcpMastraTools).map(
      ensureToolOutputSchema
    );

    // Add to extraTools
    extraTools.push(...mcpToolsArray);
    logger.info(
      `Added ${mcpToolsArray.length} MCP tools from Docker socat bridge`
    );
  } catch (error) {
    logger.error("Failed to initialize Docker socat MCP tools:", {
      error: error instanceof Error ? error.message : String(error),
    });
  }
})();

// Include 'arxiv' tool if it is a valid tool instance.
// Assuming 'arxiv' is a provider-like object
if (arxiv && typeof arxiv === "object" && "id" in arxiv) {
  const arxivProvider = {
    ...arxiv, // Spread properties if arxiv is an object
    id: String(arxiv.id || "arxiv-fallback-id"), // Ensure id is a string
    description: (arxiv as any).description || "Arxiv Tool", // Ensure description exists
    // Ensure 'arxiv' conforms to AIFunctionsProvider structure if needed by createMastraTools
  };
  // Cast to 'any' to bypass strict type check if the exact structure of 'arxiv' is uncertain but expected to work at runtime.
  const arxivToolsRaw = Object.values(createMastraTools(arxivProvider as any));
  extraTools.push(...arxivToolsRaw.map(ensureToolOutputSchema));
}

// Create and add AISDK tools.
// Assuming createAISDKTools returns Tool[] directly
const aisdkToolsArray = createAISDKTools();
if (Array.isArray(aisdkToolsArray)) {
  extraTools.push(...aisdkToolsArray.map(ensureToolOutputSchema));
}

// Instantiate Wikipedia client.
const wikiClient = new WikipediaClient();
const wikiToolsRaw = Object.values(createMastraTools(wikiClient));
extraTools.push(...wikiToolsRaw.map(ensureToolOutputSchema));

// Instantiate Calculator tool.
// createCalculatorTool returns a Tool instance directly.
const calculatorToolInstance = createCalculatorTool();
// Ensure the schema is valid and add it directly.
extraTools.push(ensureToolOutputSchema(calculatorToolInstance));

// Add GraphRag tools to the extra tools array.
// Assuming createGraphRagTool and graphRagQueryTool are Tool instances.
// If they are providers, they should be wrapped like other providers.
// If they are Tool instances, add them directly.
extraTools.push(ensureToolOutputSchema(createGraphRagTool));
extraTools.push(ensureToolOutputSchema(graphRagQueryTool));

// Create an alias tool for "graph-rag" required by data-manager-agent.
// This alias uses the properties of createGraphRagTool but overrides the id.
// Ensure createGraphRagTool is a valid Tool object before spreading.
if (
  createGraphRagTool &&
  typeof createGraphRagTool === "object" &&
  "id" in createGraphRagTool
) {
  const graphRagAliasTool: Tool<any, any> = {
    ...(createGraphRagTool as Tool<any, any>), // Spread properties of the original tool
    id: "graph-rag", // Override the id
  };
  extraTools.push(ensureToolOutputSchema(graphRagAliasTool));
} else {
  logger.warn(
    "Could not create 'graph-rag' alias: createGraphRagTool is not a valid Tool object."
  );
}

// Add LLM chain tools for AI model interactions
// Assuming llmChainTool and aiSdkPromptTool are providers or provider-like objects
// that createMastraTools can handle.
const llmChainToolsRaw = Object.values(createMastraTools(llmChainTool));
extraTools.push(...llmChainToolsRaw.map(ensureToolOutputSchema));

const aiSdkPromptToolsRaw = Object.values(createMastraTools(aiSdkPromptTool));
extraTools.push(...aiSdkPromptToolsRaw.map(ensureToolOutputSchema));

// === Filter Optional Search Tools ===
const optionalTools: Tool<z.ZodTypeAny, z.ZodTypeAny>[] = Object.values(
  searchTools
).filter(
  (tool): tool is Tool<z.ZodTypeAny, z.ZodTypeAny> => tool !== undefined
);

// === Aggregate All Tools ===

/**
 * Complete collection of all available tools (core + optional + additional + extra).
 */
export const allTools: readonly Tool<z.ZodTypeAny, z.ZodTypeAny>[] =
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
  Tool<z.ZodTypeAny, z.ZodTypeAny>
> = new Map(allTools.map((tool) => [tool.id, tool]));

/**
 * Grouped tools by category for easier access.
 */
export const toolGroups = {
  search: Object.values(searchTools).filter(
    (tool): tool is Tool<z.ZodTypeAny, z.ZodTypeAny> => tool !== undefined
  ),
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
  content: [analyzeContentTool, formatContentTool],
  document: [searchDocumentsTool, embedDocumentTool],
  extra: extraTools,
};

// === Log Initialization Results ===
logger.info(`Initialized ${allTools.length} tools successfully`);
logger.info(
  `Search tools available: ${
    toolGroups.search.map((t) => t.id).join(", ") || "none"
  }`
);

// For backward compatibility.
export { allToolsMap as toolMap };
export { toolGroups as groups };

export default allToolsMap;
