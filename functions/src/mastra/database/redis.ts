import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: "UPSTASH_REDIS_REST_URL",
  token: "UPSTASH_REDIS_REST_TOKEN",
});

/**
 * function to demonstrate Redis operations
 * @returns {Promise<string|null>} The value retrieved from Redis
 */
async function RedisOperation(): Promise<string | null> {
  await redis.set('foo', 'bar');
  return redis.get('foo');
}

// Export the function so it can be used in other modules
export { RedisOperation };

// Usage example:
// RedisOperation().then(data => console.log(data));
