/**
 * DeanMachines AI Platform - Mastra Core Instance & Configuration
 *
 * This single file initializes and exports the central Mastra instance,
 * along with all necessary configurations (telemetry, logging, middleware)
 * and components (agents, workflows, networks).
 */
import { Mastra, OtelConfig } from '@mastra/core';
import { createLogger } from '@mastra/core/logger';

// Configure logger (Define before use)
const logger = createLogger({ name: 'mastra-main', level: 'debug' });

// Import each agent by name
import { researchAgent } from './agents/research.agent';
import { analystAgent } from './agents/analyst.agent';
import { writerAgent } from './agents/writer.agent';
import { rlTrainerAgent } from './agents/rlTrainer.agent';
import { dataManagerAgent } from './agents/dataManager.agent';
import { agenticAssistant } from './agents/agentic.agent';
import { coderAgent } from './agents/coder.agent';
import { copywriterAgent } from './agents/copywriter.agent';
import { architectAgent } from './agents/architect.agent';
import { debuggerAgent } from './agents/debugger.agent';
import { uiUxCoderAgent } from './agents/uiUxCoder.agent';
import { codeDocumenterAgent } from './agents/codeDocumenter.agent';
import { marketResearchAgent } from './agents/marketResearch.agent';
import { socialMediaAgent } from './agents/socialMedia.agent';
import { seoAgent } from './agents/seoAgent.agent';

import { ragWorkflow } from './workflows';
import { networks } from './workflows/Networks/agentNetwork';
import { mainWorkflow } from "./workflows/workflowFactory";

// Import observability services initialization function
import { initObservability } from './services';

// [ANNOTATION] Helper function to parse comma-separated key=value pairs for OTLP headers.
const parseOtlpHeaders = (): Record<string, string> | undefined => {
  const headersEnv = process.env.OTEL_EXPORTER_OTLP_HEADERS;
  if (!headersEnv) {
    logger.debug("[mastra/index.ts] No OTEL_EXPORTER_OTLP_HEADERS found.");
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
    logger.debug("[mastra/index.ts] Parsed OTLP Headers:", { headers });
    return Object.keys(headers).length > 0 ? headers : undefined;
  } catch (e) {
    logger.error("[mastra/index.ts] Error parsing OTEL_EXPORTER_OTLP_HEADERS:", { error: e instanceof Error ? e.message : String(e), rawError: e });
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
  },
};

logger.info("[mastra/index.ts] Telemetry Configuration Defined:", { telemetryConfig: telemetry });

// Define server middleware (Define before use)
const serverMiddleware = [
  {
    handler: (c: any, next: any) => {
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
  // Add other middleware from mastra.config.ts if needed
];

// --- Initialize Observability ---
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
logger.info("Initializing Mastra instance...");
export const mastra = new Mastra({
  agents: {
    researchAgent,
    analystAgent,
    writerAgent,
    rlTrainerAgent,
    dataManagerAgent,
    agenticAssistant,
    coderAgent,
    copywriterAgent,
    architectAgent,
    debuggerAgent,
    uiUxCoderAgent,
    codeDocumenterAgent,
    marketResearchAgent,
    socialMediaAgent,
    seoAgent,
  },
  workflows: { ragWorkflow, mainWorkflow },
  networks: networks,
  logger: logger,
  telemetry: telemetry,
  serverMiddleware: serverMiddleware,
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

logger.info("[src/mastra/index.ts] Mastra setup complete.");
