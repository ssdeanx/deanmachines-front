import { Mastra } from "@mastra/core";
import { createLogger } from "@mastra/core/logger";
import agents from "./src/mastra/agents";
import { ragWorkflow, networks } from "./src/mastra/workflows";

// Export telemetry configuration to fix the dev server error
export const telemetry = {
  enabled: false,
  sampling: {
    type: "always_off",
  },
};

export const mastra = new Mastra({
  agents,
  workflows: {
    ragWorkflow,
  },
  networks,
  logger: createLogger({
    name: "DeanmachinesAI",
    level: "info",
  }),
  serverMiddleware: [
    {
      handler: (c, next) => {
        console.log(
          `[${new Date().toISOString()}] Processing request: ${c.req.method} ${
            c.req.url
          }`
        );
        // Track request timing for RL metrics
        const startTime = Date.now();

        const result = next();

        const endTime = Date.now();
        console.log(`Request processed in ${endTime - startTime}ms`);

        return result;
      },
    },
  ],
});
