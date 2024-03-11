interface TokenValidateResponse {
  "error-codes": string[];
  success: boolean;
  action: string;
  cdata: string;
}

export async function validateTurnstileToken(token: string, secret: string) {
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ response: token, secret: secret })
  });

  const data = await response.json<TokenValidateResponse>();

  return {
    success: data.success,
    error: data["error-codes"]?.length ? data["error-codes"][0] : null
  };
}
