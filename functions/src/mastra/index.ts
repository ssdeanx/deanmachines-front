/**
 * DeanMachines AI Platform - Mastra Core Instance & Configuration
 *
 * This single file initializes and exports the central Mastra instance,
 * along with all necessary configurations (telemetry, logging, middleware)
 * and components (agents, workflows, networks).
 */
import { Mastra, OtelConfig } from '@mastra/core';
import { createLogger } from '@mastra/core/logger';

// Import components directly
import agents from './agents';
import { ragWorkflow } from './workflows';
import { networks } from './workflows/Networks/agentNetwork';

// Import observability services initialization function
import { initObservability } from './services';

// --- Configuration Definitions Moved Here ---

// Configure logger (Define before use)
const logger = createLogger({ name: 'mastra-main', level: 'debug' });

// [ANNOTATION] Helper function to parse comma-separated key=value pairs for OTLP headers.
// Handles potential extra whitespace and invalid pairs.
const parseOtlpHeaders = (): Record<string, string> | undefined => {
  const headersEnv = process.env.OTEL_EXPORTER_OTLP_HEADERS;
  if (!headersEnv) {
    logger.debug("[mastra/index.ts] No OTEL_EXPORTER_OTLP_HEADERS found."); // Use logger
    return undefined;
  }
  try {
    const headers = Object.fromEntries(
      headersEnv.split(',')
        .map(h => {
          const trimmed = h.trim();
          const firstEqual = trimmed.indexOf('=');
          if (firstEqual <= 0 || firstEqual === trimmed.length - 1) return null;
          return [trimmed.substring(0, firstEqual).trim(), trimmed.substring(firstEqual + 1).trim()];
        })
        .filter((pair): pair is [string, string] => pair !== null && pair[0] !== '' && pair[1] !== '')
    );
    logger.debug("[mastra/index.ts] Parsed OTLP Headers:", { headers }); // Use logger
    return Object.keys(headers).length > 0 ? headers : undefined;
  } catch (e) {
    // Wrap the error in an object for the logger's second argument
    logger.error("[mastra/index.ts] Error parsing OTEL_EXPORTER_OTLP_HEADERS:", { error: e instanceof Error ? e.message : String(e), rawError: e }); // Use logger
    return undefined;
  }
};

// Define telemetry configuration (Define before use)
const telemetry: OtelConfig = {
  enabled: process.env.MASTRA_TELEMETRY_ENABLED !== 'false',
  serviceName: process.env.MASTRA_SERVICE_NAME || "deanmachines-ai-mastra",
  export: {
    type: "otlp" as const,
    protocol: "http" as const,
    endpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "http://localhost:4318",
    headers: parseOtlpHeaders(),
  },
  sampling: {
    type: "always_on" as const,
    // probability: 0.1
  },
  // Resource attributes like environment and service version might be set
  // via standard OTEL environment variables (e.g., OTEL_RESOURCE_ATTRIBUTES)
  // or handled internally by Mastra/initObservability based on other config.
  // 'resourceAttributes' is not a direct property of OtelConfig type.
  // resourceAttributes: {
  //   'deployment.environment': process.env.NODE_ENV || 'development',
  //   'service.version': process.env.APP_VERSION || 'v1.0.0',
  // },
};

// Log the final config for verification during startup.
logger.info("[mastra/index.ts] Telemetry Configuration Defined:", { telemetryConfig: telemetry });

// Define server middleware (Define before use)
const serverMiddleware = [
  {
    handler: (c: any, next: any) => { // Add basic types for context and next
      logger.info(
        `Processing request: ${c.req.method} ${c.req.url}`
      );
      const startTime = Date.now();
      const result = next();
      const endTime = Date.now();
      logger.debug(`Request processed in ${endTime - startTime}ms`);
      return result;
    },
  },
  // Add other middleware from mastra.config.ts if needed (CORS, bodyLimit, etc.)
  // Example:
  // { path: '/*', handler: cors({ origin: '*' }) },
  // { path: '/invoke', handler: bodyLimit({ maxSize: 5 * 1024 * 1024 }) },
];

// --- Initialize Observability ---
// Initialize *after* telemetry config is defined
logger.info("Initializing observability services...");
export const observabilityServices = initObservability({
  otelEnabled: telemetry.enabled,
  signozEnabled: telemetry.enabled,
  langfuseEnabled: telemetry.enabled,
  langsmithEnabled: telemetry.enabled,
  serviceName: telemetry.serviceName,
  environment: process.env.NODE_ENV || 'development'
});
logger.info("Observability services initialized:", {
  otel: !!observabilityServices.opentelemetry,
  signoz: !!observabilityServices.signoz,
  langfuse: !!observabilityServices.langfuse,
  langsmith: !!observabilityServices.langsmith
});


// --- Initialize and Export the Mastra instance ---
// Initialize *after* all configs (logger, telemetry, middleware) and components are defined/imported
logger.info("Initializing Mastra instance...");
export const mastra = new Mastra({
  agents: agents,
  workflows: { ragWorkflow },
  networks: networks,
  logger: logger, // Use logger defined above
  telemetry: telemetry, // Use telemetry defined above
  serverMiddleware: serverMiddleware, // Use middleware defined above
});
logger.info("Mastra instance initialized.");

// --- Utility Functions ---

/**
 * Creates a properly formatted streaming response (SSE)
 */
export const createStreamResponse = (stream: ReadableStream): Response => {
  const body = new ReadableStream({
    async start(controller) {
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          controller.enqueue(`data: ${chunk}\n\n`);
        }
      } catch (error: any) {
        logger.error('Streaming error in createStreamResponse:', { error: error.message });
        try {
           controller.enqueue(`data: ${JSON.stringify({ error: 'Stream processing error', details: error?.message || 'Unknown error' })}\n\n`);
        } catch (e) {/* Ignore if controller is already closed */}
      } finally {
        try {
           controller.close();
        } catch (e) {/* Ignore if controller is already closed */}
        logger.debug('SSE stream closed in createStreamResponse.');
      }
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
};

// Log that the main entry point has finished processing
logger.info("[src/mastra/index.ts] Mastra setup complete.");
