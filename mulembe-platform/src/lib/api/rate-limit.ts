interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const tracker = new Map<string, RateLimitEntry>();

/**
 * In-memory sliding-window rate limiter for API routes.
 * @param key unique identifier (e.g. IP address or userId)
 * @param limit max requests allowed within window
 * @param windowMs time window in milliseconds (default 60 seconds)
 */
export function checkRateLimit(
  key: string,
  limit = 60,
  windowMs = 60_000
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = tracker.get(key);

  if (!entry || entry.resetAt <= now) {
    tracker.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { success: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

