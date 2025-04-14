/**
 * OpenTelemetry Tracing Service for Mastra
 * 
 * This module provides OpenTelemetry initialization and tracing functionality
 * for the DeanMachines AI platform. It sets up auto-instrumentation and provides
 * utilities to interact with the OpenTelemetry API.
 */
import process from 'process';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { createLogger } from '@mastra/core/logger';
import { OTelInitOptions } from './types';

// Configure logger for the tracing service
const logger = createLogger({ name: 'opentelemetry-tracing', level: 'info' });

/**
 * Initialize OpenTelemetry SDK with auto-instrumentation for SigNoz
 * 
 * @param options - Configuration options for the OpenTelemetry SDK
 * @returns The configured SDK instance
 */
export function initOpenTelemetry({
  serviceName = 'deanmachines-ai',
  serviceVersion = '1.0.0',
  environment = 'development',
  enabled = true,
  endpoint,
}: OTelInitOptions): NodeSDK | null {
  // Skip initialization if explicitly disabled
  if (!enabled) {
    logger.info('OpenTelemetry tracing is disabled');
    return null;
  }

  try {
    logger.info(`Initializing OpenTelemetry for service: ${serviceName}`, { environment });

    // Get endpoint from options or environment variables
    const exporterUrl = endpoint || 
      process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 
      'http://localhost:4317/v1/traces';

    // Create exporter
    const traceExporter = new OTLPTraceExporter({
      url: exporterUrl,
    });

    // Create resource using resourceFromAttributes (SDK 2.0 pattern)
    const resource = resourceFromAttributes({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
      [SemanticResourceAttributes.SERVICE_VERSION]: serviceVersion,
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: environment,
    });

    // Create SDK with auto-instrumentation
    const sdk = new NodeSDK({
      resource,
      traceExporter,
      instrumentations: [getNodeAutoInstrumentations()]
    });

    // Initialize SDK (in SDK 2.0 start() returns void)
    try {
      sdk.start();
      logger.info('OpenTelemetry SDK initialized successfully');
    } catch (initError) {
      logger.error('Error initializing OpenTelemetry SDK', { 
        error: initError instanceof Error ? initError.message : String(initError) 
      });
    }

    // Set up graceful shutdown
    process.on('SIGTERM', () => {
      if (sdk) {
        try {
          sdk.shutdown();
          logger.info('OpenTelemetry SDK shut down successfully');
        } catch (shutdownError) {
          logger.error('Error shutting down OpenTelemetry SDK', { 
            error: shutdownError instanceof Error ? shutdownError.message : String(shutdownError) 
          });
        } finally {
          process.exit(0);
        }
      }
    });

    return sdk;
  } catch (error) {
    logger.error('Failed to initialize OpenTelemetry', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return null;
  }
}

// Export SDK instance for external use
let sdkInstance: NodeSDK | null = null;

/**
 * Get the current SDK instance
 * 
 * @returns The SDK instance or null if not initialized
 */
export function getOpenTelemetrySdk(): NodeSDK | null {
  return sdkInstance;
}

/**
 * Initialize OpenTelemetry with default configuration
 * 
 * @returns The SDK instance
 */
export function initializeDefaultTracing(): NodeSDK | null {
  if (!sdkInstance) {
    sdkInstance = initOpenTelemetry({
      serviceName: process.env.OTEL_SERVICE_NAME || 'deanmachines-ai',
      environment: process.env.NODE_ENV || 'development',
      enabled: process.env.ENABLE_OPENTELEMETRY !== 'false',
    });
  }
  return sdkInstance;
}
