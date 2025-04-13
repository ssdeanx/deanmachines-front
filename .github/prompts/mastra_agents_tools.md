# Agents and Tools Development

- Define all agents in the `functions/src/mastra/agents/` directory.
- Use descriptive names and purposes for each agent.
- Link tools to agents using the `tools` array.
- Define tools in `functions/src/mastra/tools/` and ensure they follow the schema validation.
- Include examples for all tools in their comments.

## Example Agent w/ Tools

```typescript
const weatherAgent = mastra.createAgent({
  name: "weatherAgent",
  description: "Provides weather-related information",
  model: { provider: "google", name: "gemini-1.5-pro" },
  tools: [weatherTool],
});
```

```typescript
const weatherTool = createTool({
  name: "getWeather",
  description: "Fetches weather data",
  schema: z.object({
    location: z.string().describe("The location to fetch weather for"),
  }),
  execute: async ({ location }) => {
    // Fetch weather data here
  },
const weatherTool = createTool({
  name: "getWeather",
  description: "Fetches weather data",
  schema: z.object({
    location: z.string().describe("The location to fetch weather for"),
  }),
  execute: async ({ location }) => {
    // Fetch weather data here
  },
});
```
