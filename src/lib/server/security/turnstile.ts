import { CLOUDFLARE_TURNSTILE_SECRET } from "$env/static/private";
import { logger } from "$lib/logger";

interface TokenValidateResponse {
  "error-codes": string[];
  challenge_ts: string;
  hostname: string;
  success: boolean;
  action: string;
  cdata: string;
}

interface Result {
  success: boolean;
  error: string | null;
}

/**
 * Validates a turnstile token by sending a request to the Cloudflare API.
 *
 * @param {string} token - The turnstile token to validate.
 * @param {string} ip - The IP address of the client making the request.
 * @returns {Promise<Result>} - A promise that resolves to an object containing the validation result.
 */
export async function validateTurnstileToken(token: string, ip: string): Promise<Result> {
  const idempotencyKey = crypto.randomUUID();
  const body = { response: token, secret: CLOUDFLARE_TURNSTILE_SECRET, idempotency_key: idempotencyKey, remoteip: ip };
  let response: Response;

  try {
    response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body)
    });
  } catch (error) {
    logger.error("An error occurred during token validation:", error);

    return { success: false, error: "An error occurred during token validation" };
  }

  if (!response.ok) {
    logger.error("An error occurred during token validation");

    return { success: false, error: "An error occurred during token validation" };
  }

  const data = await response.json<TokenValidateResponse>();

  const success = data.success;
  const error = data["error-codes"]?.length ? data["error-codes"][0] : null;

  return { success, error };
}
