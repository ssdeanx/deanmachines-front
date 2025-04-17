import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { generateText } from "ai";
import { createGoogleModel } from "../agents/config/model.utils";
import { DEFAULT_MODELS } from "../agents/config/config.types";

/**
 * Mastra AI tool for generating Mermaid diagrams from natural language descriptions.
 * Supports all major Mermaid diagram types: flowchart, sequence, gantt, class, state, journey, pie, requirements, ERD, etc.
 *
 * Input: description (string), diagramType (optional string)
 * Output: mermaid (string, valid Mermaid code)
 */
export const mermaidWriterTool = createTool({
  id: "write-mermaid-diagram",
  description:
    "Generates a Mermaid diagram from a natural language description. Supports all Mermaid diagram types.",
  inputSchema: z.object({
    description: z
      .string()
      .describe(
        "Description of the diagram to generate (e.g., 'A flowchart showing login process')."
      ),
    diagramType: z
      .enum([
        "flowchart",
        "sequence",
        "gantt",
        "class",
        "state",
        "journey",
        "pie",
        "requirements",
        "erDiagram",
        "quadrantChart",
        "network",
        "gitGraph",
        "timeline",
        "mindmap",
        "other"
      ])
      .optional()
      .describe(
        "Optional: Specify diagram type (flowchart, sequence, gantt, class, state, journey, pie, requirements, erDiagram, quadrantChart, network, gitGraph, timeline, mindmap, other)."
      ),
  }),
  outputSchema: z.object({
    mermaid: z.string().describe("The generated Mermaid diagram code."),
    diagramType: z.string().optional().describe("The detected or used diagram type."),
  }),
  async execute({ context }) {
    // Compose a prompt for the LLM
    const typeHint = context.diagramType
      ? `Type: ${context.diagramType}`
      : "";
    const prompt = `You are a Mermaid diagram generator. Given a description, output ONLY valid Mermaid code for the requested diagram.\n${typeHint}\nDescription: ${context.description}\n\nRequirements:\n- Use the correct Mermaid syntax for the requested diagram type.\n- Do not include any explanation, only the Mermaid code.\n- If diagramType is not specified, infer the best type.\n- Supported types: flowchart, sequence, gantt, class, state, journey, pie, requirements, erDiagram, quadrantChart, network, gitGraph, timeline, mindmap.\n- Start the output with the correct diagram type keyword (e.g., 'flowchart TD', 'sequenceDiagram', 'gantt', etc.).`;
    const model = createGoogleModel(
      DEFAULT_MODELS.GOOGLE_STANDARD.modelId
    );
    const result = await generateText({
      model,
      messages: [{ role: "user", content: prompt }],
    });
    // Optionally, try to detect the diagram type from the output
    const code = result.text.trim();
    const detectedType = code.split("\n")[0]?.split(" ")[0] || undefined;
    return { mermaid: code, diagramType: detectedType };
  },
});
