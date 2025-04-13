# Workflow Design Guidelines

- Use `createWorkflow` to define workflows in `functions/src/mastra/workflows/`.
- Ensure workflows are modular and reusable.
- Use durable state machines for workflows requiring error handling and retries.
- Include branching logic for workflows with multiple outcomes.
- Document each step of the workflow clearly.

## Example Workflow

```typescript
const exampleWorkflow = createWorkflow({
  name: "exampleWorkflow",
  steps: {
    validateInput: {
      execute: async (context) => {
        // Validation logic
      },
    },
    processData: {
      execute: async (context) => {
        // Data processing logic
      },
    },
  },
});
```
