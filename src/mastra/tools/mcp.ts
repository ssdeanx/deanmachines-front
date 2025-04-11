import "dotenv/config";

import { createAISDKTools } from "@agentic/ai-sdk";
import { createMastraTools } from "@agentic/mastra";
import { createMcpTools } from "@agentic/mcp";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

async function main() {
  // Create MCP tools provider for socat bridge server at 8811
  // This can work with: docker run -i --rm alpine/socat STDIO TCP:host.docker.internal:8811
  const mcpTools = await createMcpTools({
    name: "docker-mcp-server",
    // Connect to external TCP server using serverUrl
    serverUrl: "http://localhost:8811",
  });

  const result = await generateText({
    model: google("models/gemini-2.0-flash"),
    // Adapt the MCP tools provider directly for the AI SDK.
    tools: createAISDKTools(mcpTools),
    toolChoice: "required",
    temperature: 0,
    system: "You are a helpful assistant. Be as concise as possible.",
    prompt: "What files are in the current directory?",
    maxTokens: 2000,
  });

  console.log(result.toolResults[0]);
}

await main();
