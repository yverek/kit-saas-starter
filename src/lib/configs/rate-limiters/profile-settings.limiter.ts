import { RetryAfterRateLimiter } from "sveltekit-rate-limiter/server";

export const profileSettingsLimiter = new RetryAfterRateLimiter({
  IP: [3, "h"],
  IPUA: [3, "h"]
});
