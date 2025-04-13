import { createLogger } from '@mastra/core/logger';
import { Redis } from '@upstash/redis';

/**
 * Redis client for caching operations within the Mastra application.
 * Uses environment variables for secure configuration.
 */
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

// Initialize logger for Redis operations
const logger = createLogger({
  name: "redis-cache",
  level: process.env.LOG_LEVEL === "debug" ? "debug" : "info",
});

/**
 * Cache interface for commonly used operations
 */
export interface CacheService {
  /**
   * Gets a value from the cache
   * @param key - The key to retrieve
   * @returns The stored value or null if not found
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Sets a value in the cache
   * @param key - The key to set
   * @param value - The value to store
   * @param expirySeconds - Optional TTL in seconds
   * @returns Success status ("OK" or null if operation failed)
   */
  set<T>(key: string, value: T, expirySeconds?: number): Promise<"OK" | null>;

  /**
   * Deletes a value from the cache
   * @param key - The key to delete
   * @returns Number of entries deleted (0 or 1)
   */
  delete(key: string): Promise<number>;

  /**
   * Checks if a key exists in the cache
   * @param key - The key to check
   * @returns True if the key exists, false otherwise
   */
  exists(key: string): Promise<boolean>;

  /**
   * Sets a value only if the key doesn't already exist
   * @param key - The key to set
   * @param value - The value to store
   * @param expirySeconds - Optional TTL in seconds
   * @returns True if set successfully, false if key already exists
   */
  setNX<T>(key: string, value: T, expirySeconds?: number): Promise<boolean>;

  /**
   * Clears the entire cache (use with caution)
   * @returns Success status
   */
  clear(): Promise<string>;

  /**
   * Tests connection to Redis
   * @returns True if connection is successful
   */
  ping(): Promise<boolean>;
}

/**
 * Redis-based cache implementation for the Mastra application
 */
export const cacheService: CacheService = {
  async get<T>(key: string): Promise<T | null> {
    try {
      logger.debug(`Cache get: ${key}`);
      return await redis.get<T>(key);
    } catch (error) {
      logger.error(`Cache get error for key "${key}":`, { error: String(error) });
      return null;
    }
  },

  async set<T>(key: string, value: T, expirySeconds?: number): Promise<"OK" | null> {
    try {
      logger.debug(`Cache set: ${key} (TTL: ${expirySeconds || 'none'})`);
      if (expirySeconds) {
        return await redis.set(key, value, { ex: expirySeconds }) as "OK" | null;
      }
      return await redis.set(key, value) as "OK" | null;
    } catch (error) {
      logger.error(`Cache set error for key "${key}":`, { error: String(error) });
      return null;
    }
  },

  async delete(key: string): Promise<number> {
    try {
      logger.debug(`Cache delete: ${key}`);
      return await redis.del(key);
    } catch (error) {
      logger.error(`Cache delete error for key "${key}":`, { error: String(error) });
      return 0;
    }
  },

  async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(`Cache exists error for key "${key}":`, { error: String(error) });
      return false;
    }
  },

  async setNX<T>(key: string, value: T, expirySeconds?: number): Promise<boolean> {
    try {
      const result = await redis.setnx(key, value);
      if (result === 1 && expirySeconds) {
        await redis.expire(key, expirySeconds);
      }
      return result === 1;
    } catch (error) {
      logger.error(`Cache setNX error for key "${key}":`, { error: String(error) });
      return false;
    }
  },

  async clear(): Promise<string> {
    try {
      logger.warn('Clearing entire Redis cache');
      return await redis.flushall();
    } catch (error) {
      logger.error('Cache clear error:', { error: String(error) });
      return 'Error clearing cache';
    }
  },

  async ping(): Promise<boolean> {
    try {
      const response = await redis.ping();
      return response === 'PONG';
    } catch (error) {
      logger.error('Redis ping failed:', { error: String(error) });
      return false;
    }
  }
};

/**
 * Legacy function for backwards compatibility
 * @deprecated Use cacheService methods instead
 * @returns {Promise<string|null>} The value retrieved from Redis
 */
export async function RedisOperation(): Promise<string | null> {
  await cacheService.set('foo', 'bar');
  return cacheService.get('foo');
}
