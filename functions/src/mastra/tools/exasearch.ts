import { aiFunction, AIFunctionsProvider } from "@agentic/core";
import { z } from "zod";
import { createMastraTools } from "@agentic/mastra";

import {
  searchWeb,
  searchWithFilters,
  searchForRAG,
  type ExaSearchResult,
  type ExaSearchConfig as ExaConfig
} from "../services/exasearch";
// Export types for consumers
export type { ExaConfig as ExaSearchConfig, ExaSearchResult as ExaSearchResult };

const ExaSearchInputSchema = z.object({
  query: z.string().describe("The search query to execute"),
  numResults: z.number().optional().default(5),
  filters: z
    .object({
      site: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      recentOnly: z.boolean().optional(),
    })
    .optional(),
  useRAG: z.boolean().optional().default(false),
});

type ExaSearchInput = z.infer<typeof ExaSearchInputSchema>;

/**
 * Provides Exa search functionality as an AI function provider.
 */
export class ExaSearchProvider extends AIFunctionsProvider {
  private readonly apiKey?: string;

  /**
   * Initializes the ExaSearchProvider.
   * @param {object} [config] - Configuration options.
   * @param {string} [config.apiKey] - The Exa API key. If not provided, it might be sourced from environment variables within the service layer.
   */
  constructor(config?: { apiKey?: string }) {
    super();
    this.apiKey = config?.apiKey;
    // Note: The actual use of the apiKey needs to happen within the search methods,
    // potentially by passing it to the underlying service functions (searchWeb, etc.)
    // or by configuring an Exa client instance here.
    // This example assumes the service functions are adapted to receive the key
    // or that a shared configuration mechanism exists.
  }

  /**
   * Performs web searches using the Exa search API with various filtering options.
   * @param input - The search parameters.
   * @returns An object containing the search results or an error message.
   */
  @aiFunction({
    name: "exa_search",
    description:
      "Performs web searches using Exa search API with various filtering options",
    inputSchema: ExaSearchInputSchema,
  })
  async search(
    input: ExaSearchInput
  ): Promise<{ results: string; error?: string }> {
    // Prepare config for service calls, including the API key if available
    const serviceConfig: ExaConfig = {
      apiKey: this.apiKey, // Pass the API key
      numResults: input.numResults,
      useHighlights: input.useRAG, // Assuming useHighlights corresponds to RAG usage
    };

    try {
      let results;
      if (input.useRAG) {
        // Assuming searchForRAG accepts ExaConfig
        results = await searchForRAG(input.query, serviceConfig);
      } else if (input.filters) {
        // Assuming searchWithFilters accepts ExaConfig
        results = await searchWithFilters(
          input.query,
          input.filters,
          serviceConfig
        );
      } else {
        // Assuming searchWeb accepts ExaConfig
        results = await searchWeb(input.query, serviceConfig);
      }
      return { results: JSON.stringify(results, null, 2) };
    } catch (error) {
      return {
        results: "",
        error:
          error instanceof Error
            ? error.message
            : "Unknown error during search",
      };
    }
  }
}

/**
 * Creates an instance of the ExaSearchProvider.
 *
 * @param {object} [config] - Optional configuration parameters.
 * @param {string} [config.apiKey] - The API key for Exa search.
 * @returns {ExaSearchProvider} An instance of ExaSearchProvider.
 */
export function createExaSearchProvider(config?: { apiKey?: string }): ExaSearchProvider {
  // Pass the config (containing the apiKey) to the provider's constructor.
  return new ExaSearchProvider(config);
}

/**
 * Helper function to create Mastra-compatible Exa search tools.
 *
 * This function creates an Exa search provider and wraps it with `createMastraTools`
 * to ensure compatibility with the Mastra framework.
 *
 * @returns {ReturnType<typeof createMastraTools>} An array of Mastra-compatible tools
 */
export function createMastraExaSearchTools(config?: { apiKey?: string }) {
  // Pass config if needed by the provider in the future, or handle API key logic here/within the provider.
  // For now, createExaSearchProvider doesn't accept config.
  const exaSearchProvider = createExaSearchProvider();
  // If the provider needs the API key, it should be passed during its instantiation.
  // Example: const exaSearchProvider = createExaSearchProvider(config);
  return createMastraTools(exaSearchProvider);
}

// Export adapter for convenience
export { createMastraTools };

// Default export for easier importing
export default createExaSearchProvider;
