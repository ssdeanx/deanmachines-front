# Static Export Guidelines

- Use `functions/mastra.config.ts` for server-side Mastra configurations.
- Move server-side functionality to API endpoints during static exports.
- Configure `mastraClient` in `src/lib/mastra.ts` for client-side compatibility.

## Example Static Export Setup

1. Server-side configuration:

   ```typescript
   export const mastra = new Mastra({
     agents,
     workflows: { ragWorkflow },
     networks,
   });
   ```

2. Client-side configuration:

```typescript
export const mastraClient = new MastraClient({
  baseUrl: process.env.NEXT_PUBLIC_MASTRA_API_URL,
});
```
