import {
  type AIFunctionLike,
  AIFunctionSet,
  asZodOrJsonSchema,
} from "@agentic/core";
import { createMastraTools } from "@agentic/mastra";
import { FunctionTool } from "llamaindex";
import { z } from "zod";

/**
 * Converts a set of Agentic stdlib AI functions to an array of LlamaIndex-
 * compatible tools.
 *
 * Note: The returned tools should be wrapped with `createMastraTools` from
 * @agentic/mastra when added to extraTools in index.ts like:
 * `extraTools.push(...createMastraTools(...llamaIndexArray));`
 *
 * @param aiFunctionLikeTools - Agentic functions to convert to LlamaIndex tools
 * @returns An array of LlamaIndex compatible tools
 */
export function createLlamaIndexTools(
  ...aiFunctionLikeTools: AIFunctionLike[]
) {
  const fns = new AIFunctionSet(aiFunctionLikeTools);

  return fns.map((fn) =>
    FunctionTool.from(fn.execute, {
      name: fn.spec.name,
      description: fn.spec.description,
      // TODO: Investigate types here
      parameters: asZodOrJsonSchema(fn.inputSchema) as any,
    })
  );
}

/**
 * Define a sample output schema for LlamaIndex query tools
 */
export const LlamaIndexQueryOutputSchema = z.object({
  answer: z.string().describe("The answer or summary returned by the LlamaIndex query engine."),
  sources: z.array(z.string()).optional().describe("List of source document IDs or URIs used in the answer."),
  metadata: z.record(z.any()).optional().describe("Additional metadata from the query engine."),
});

/**
 * Helper function to create Mastra-compatible LlamaIndex tools
 *
 * @param aiFunctionLikeTools - Agentic functions to convert and adapt
 * @returns An array of Mastra-compatible tools
 */
export function createMastraLlamaIndexTools(
  ...aiFunctionLikeTools: AIFunctionLike[]
) {
  // Adapt the original AIFunctionLike tools directly for Mastra
  const mastraTools = createMastraTools(...aiFunctionLikeTools);
  // Patch each tool to ensure outputSchema is set (if possible)
  Object.values(mastraTools).forEach(tool => {
    if (!(tool as any).outputSchema) {
      (tool as any).outputSchema = LlamaIndexQueryOutputSchema;
    }
  });
  return mastraTools;
}

// Export adapter for convenience
export { createMastraTools };
