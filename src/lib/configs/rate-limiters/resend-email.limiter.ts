import { RetryAfterRateLimiter } from "sveltekit-rate-limiter/server";

export const resendChangeEmailLimiter = new RetryAfterRateLimiter({
  IP: [1, "h"],
  IPUA: [1, "h"]
});

export const resendVerifyEmailLimiter = new RetryAfterRateLimiter({
  IP: [1, "h"],
  IPUA: [1, "h"]
});
