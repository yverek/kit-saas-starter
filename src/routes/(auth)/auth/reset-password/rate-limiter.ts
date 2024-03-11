import { RESET_PASSWORD_LIMITER_COOKIE_NAME } from "$configs/cookies-names";
import { RATE_LIMITER_SECRET_KEY } from "$env/static/private";
import { RetryAfterRateLimiter } from "sveltekit-rate-limiter/server";

export const resetPasswordLimiter = new RetryAfterRateLimiter({
  rates: {
    IP: [5, "h"],
    IPUA: [5, "h"],
    cookie: {
      name: RESET_PASSWORD_LIMITER_COOKIE_NAME,
      secret: RATE_LIMITER_SECRET_KEY,
      rate: [5, "h"],
      preflight: true
    }
  }
});
