import { LibSQLStore } from '@mastra/core/storage/libsql';
import { LibSQLVector } from '@mastra/core/vector/libsql';
import { Memory } from '@mastra/memory';

import { cacheService, redis, RedisOperation } from './redis';
import { createAISpan, recordMetrics } from '../services/signoz';
import { upstashVector, upsertVectors, queryVectors } from './upstashvector';

/**
 * Database configuration for memory persistence using LibSQL.
 *
 * This module sets up the LibSQL adapter for Mastra memory persistence,
 * allowing agent conversations and context to be stored reliably.
 */

import type { MastraStorage, MastraVector } from "@mastra/core";
// Re-export Redis components
export { redis, cacheService, RedisOperation };
export { upstashVector, upsertVectors, queryVectors };

/**
 * Check if Redis connection is available
 * @returns {Promise<boolean>} Connection status
 */
export async function checkRedisConnection(): Promise<boolean> {
  return cacheService.ping();
}

// Define the memory configuration type
export interface MemoryConfig {
  lastMessages: number;
  semanticRecall: {
    topK: number;
    messageRange: {
      before: number;
      after: number;
    };
  };
  workingMemory: {
    enabled: boolean;
    type: "text-stream";
  };
  threads: {
    generateTitle: boolean;
  };
}

// Default memory configuration that works well for most agents
const defaultMemoryConfig: MemoryConfig = {
  lastMessages: 50,
  semanticRecall: {
    topK: 5,
    messageRange: {
      before: 2,
      after: 1,
    },
  },
  workingMemory: {
    enabled: true,
    type: "text-stream",
  },
  threads: {
    generateTitle: true,
  },
};

/**
 * Creates a new Memory instance with LibSQL storage and vector capabilities.
 * @param options Memory configuration options
 * @returns Configured Memory instance
 */
export function createMemory(
  options: Partial<MemoryConfig> = defaultMemoryConfig
): Memory {
  // Initialize LibSQL storage
  const storage = new LibSQLStore({
    config: {
      url: process.env.DATABASE_URL || "file:.mastra/mastra.db",
    },
  });

  // Initialize LibSQL vector store for semantic search
  const vector = new LibSQLVector({
    connectionUrl: process.env.DATABASE_URL || "file:.mastra/mastra.db",
  });

  return new Memory({
    storage: storage as MastraStorage,
    vector: vector as MastraVector,
    options,
  });
}

// Export shared memory instance
export const sharedMemory = createMemory();

// Re-export Memory type for convenience
export type { Memory };

// --- Tracing wrappers for memory operations ---
export async function tracedQuery(params: Parameters<Memory["query"]>[0]) {
  const span = createAISpan("memory.query", { source: "libsql" });
  try {
    const result = await sharedMemory.query(params);
    recordMetrics(span, { status: "success" });
    return result;
  } catch (error) {
    recordMetrics(span, { status: "error", errorMessage: String(error) });
    throw error;
  } finally {
    span.end();
  }
}

export async function tracedSaveMessages(params: Parameters<Memory["saveMessages"]>[0]) {
  const span = createAISpan("memory.saveMessages", { source: "libsql" });
  try {
    const result = await sharedMemory.saveMessages(params);
    recordMetrics(span, { status: "success" });
    return result;
  } catch (error) {
    recordMetrics(span, { status: "error", errorMessage: String(error) });
    throw error;
  } finally {
    span.end();
  }
}
