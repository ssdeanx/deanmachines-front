# Mastra Framework Integration Guidelines

- Use TypeScript for all Mastra integrations.
- Ensure agents, workflows, and tools are defined with clear, typed schemas.
- Log all agent and workflow interactions for debugging purposes.
- Optimize workflows for error handling, retries, and branching logic.
- Always use environment variables for sensitive configurations (e.g., API keys).
- Provide meaningful comments for all methods and classes to explain their functionality.
- Follow modular design principles for agents and workflows.

## Example Usages

1. Creating a new agent with a custom tool:

   ```typescript
   const agent = mastra.createAgent({
     name: "exampleAgent",
     description: "Handles example tasks",
     tools: [exampleTool],
   });
   ```

2. Defining a workflow with retry handling:

```TypeScript
const workflow = createWorkflow({
  name: "exampleWorkflow",
  steps: {
    step1: { /* Step logic */ },
    step2: { /* Step logic */ },
  },
});
```
