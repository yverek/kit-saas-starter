import type { RetryAfterRateLimiter } from "sveltekit-rate-limiter/server";
import type { RequestEvent } from "@sveltejs/kit";

export async function verifyRateLimiter(event: RequestEvent, limiter: RetryAfterRateLimiter) {
  const status = await limiter.check(event);

  if (status.limited) {
    const retryAfterInMinutes = Math.round(status.retryAfter / 60);
    return retryAfterInMinutes.toString();
  }
}
