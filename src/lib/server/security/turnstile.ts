import { CLOUDFLARE_TURNSTILE_SECRET } from "$env/static/private";

interface TokenValidateResponse {
  "error-codes": string[];
  challenge_ts: string;
  hostname: string;
  success: boolean;
  action: string;
  cdata: string;
}

export async function validateTurnstileToken(token: string, ip: string) {
  const idempotencyKey = crypto.randomUUID();

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ response: token, secret: CLOUDFLARE_TURNSTILE_SECRET, idempotency_key: idempotencyKey, remoteip: ip })
  });

  const data = await response.json<TokenValidateResponse>();

  return {
    success: data.success,
    error: data["error-codes"]?.length ? data["error-codes"][0] : null
  };
}
