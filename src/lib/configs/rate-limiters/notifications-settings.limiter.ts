import { RetryAfterRateLimiter } from "sveltekit-rate-limiter/server";

export const notificationsSettingsLimiter = new RetryAfterRateLimiter({
  IP: [3, "h"],
  IPUA: [3, "h"]
});
