import { createLogger } from '@mastra/core/logger';
import { UpstashVector } from "@mastra/upstash";
import { createAISpan, recordMetrics } from "../services/signoz";

const logger = createLogger({
  name: "upstash-vector",
  level: process.env.LOG_LEVEL === "debug" ? "debug" : "info",
});

const url = process.env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_VECTOR_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.UPSTASH_VECTOR_REST_TOKEN;

if (!url || !token) {
  logger.error("Upstash vector environment variables are missing.");
  throw new Error("Upstash vector environment variables are missing.");
}

const indexName = process.env.UPSTASH_VECTOR_INDEX || "default";

// Export a ready-to-use UpstashVector instance
export const upstashVector = new UpstashVector({ url, token });

// Helper methods with tracing
// UpstashVector expects: upsert({ indexName, ids, vectors, metadata })
export async function upsertVectors(items: Array<{ id: string; values: number[]; metadata?: Record<string, any> }>) {
  const span = createAISpan("upstash.vector.upsert", { count: items.length, indexName });
  try {
    const ids = items.map(i => i.id);
    const vectors = items.map(i => i.values);
    const metadata = items.map(i => i.metadata || {});
    const result = await upstashVector.upsert({ indexName, ids, vectors, metadata });
    recordMetrics(span, { status: "success" });
    logger.info(`Upserted ${items.length} vectors to Upstash (index: ${indexName}).`);
    return result;
  } catch (error) {
    recordMetrics(span, { status: "error", errorMessage: String(error) });
    logger.error("Upstash vector upsert failed", { error });
    throw error;
  } finally {
    span.end();
  }
}

// UpstashVector expects: query({ indexName, queryVector, topK, filter, includeVector })
export async function queryVectors(query: { queryVector: number[]; topK?: number; filter?: Record<string, any>; includeVector?: boolean; }) {
  const topK = query.topK ?? 5;
  const span = createAISpan("upstash.vector.query", { topK, indexName });
  try {
    const result = await upstashVector.query({
      indexName,
      queryVector: query.queryVector,
      topK,
      filter: query.filter,
      includeVector: query.includeVector,
    });
    recordMetrics(span, { status: "success" });
    logger.info(`Queried Upstash vector store (topK=${topK}, index: ${indexName}).`);
    return result;
  } catch (error) {
    recordMetrics(span, { status: "error", errorMessage: String(error) });
    logger.error("Upstash vector query failed", { error });
    throw error;
  } finally {
    span.end();
  }
}