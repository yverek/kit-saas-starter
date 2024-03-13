import { RetryAfterRateLimiter } from "sveltekit-rate-limiter/server";

export const resendEmailLimiter = new RetryAfterRateLimiter({
  IP: [1, "h"],
  IPUA: [1, "h"]
});
