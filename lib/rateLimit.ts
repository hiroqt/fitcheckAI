import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// In-memory fallback cache for environments without Upstash configured
const memoryStore = new Map<string, { count: number; resetAt: number }>();

function inMemoryRateLimit(ip: string, limit: number, windowMs: number) {
  const now = Date.now();
  const record = memoryStore.get(ip);

  // Clean expired
  if (!record || now > record.resetAt) {
    memoryStore.set(ip, { count: 1, resetAt: now + windowMs });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: Math.ceil((now + windowMs) / 1000),
    };
  }

  if (record.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: Math.ceil(record.resetAt / 1000),
      retryAfter: Math.ceil((record.resetAt - now) / 1000),
    };
  }

  record.count += 1;
  return {
    success: true,
    limit,
    remaining: limit - record.count,
    reset: Math.ceil(record.resetAt / 1000),
  };
}

let ratelimitInstance: Ratelimit | null = null;

function getUpstashRatelimit(): Ratelimit | null {
  if (ratelimitInstance) return ratelimitInstance;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  try {
    const redis = new Redis({ url, token });
    ratelimitInstance = new Ratelimit({
      redis,
      // 3 requests per IP per 1 hour sliding window
      limiter: Ratelimit.slidingWindow(3, "1 h"),
      analytics: true,
      prefix: "ratelimit:fitcheck:inquiry",
    });
    return ratelimitInstance;
  } catch (error) {
    console.warn("[RateLimit] Failed to initialize Upstash Redis, falling back to local memory:", error);
    return null;
  }
}

export async function checkRateLimit(ip: string): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}> {
  const isDev = process.env.NODE_ENV !== "production";
  const isLocalhost = ["127.0.0.1", "::1", "localhost"].includes(ip);

  // In local development, give a generous limit (e.g. 100/hr) so developer testing isn't locked out
  const limit = isDev && isLocalhost ? 100 : 3;
  const windowMs = 60 * 60 * 1000;

  const upstash = getUpstashRatelimit();

  if (upstash && !isDev) {
    try {
      const result = await upstash.limit(ip);
      return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
        retryAfter: result.success ? undefined : Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)),
      };
    } catch (error) {
      console.warn("[RateLimit] Upstash limit check failed, falling back to local limiter:", error);
    }
  }

  // Fallback / Development limiter
  return inMemoryRateLimit(ip, limit, windowMs);
}

