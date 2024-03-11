import type { RetryAfterRateLimiter } from "sveltekit-rate-limiter/server";
// import type { RequestEvent } from "./$types";
import { setFlash } from "sveltekit-flash-message/server";
import { fail } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";

export async function verifyRateLimiter(event: RequestEvent, limiter: RetryAfterRateLimiter) {
  const status = await limiter.check(event);

  if (status.limited) {
    const retryAfterInMinutes = status.retryAfter / 60;
    const retryAfter = retryAfterInMinutes.toString();

    setFlash({ status: "error", text: `Too many requests, retry in ${retryAfter} minutes` }, event);
    fail(429);
  }
}
