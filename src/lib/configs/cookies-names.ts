const BASE = "kss";
const RATE_LIMITER_BASE = `${BASE}_rate_limiter`;

export const LOGIN_LIMITER_COOKIE_NAME = `${RATE_LIMITER_BASE}_login`;

export const SESSION_COOKIE_NAME = `${BASE}_auth`;

export const GITHUB_OAUTH_STATE_COOKIE_NAME = `${BASE}_github_oauth_state`;
export const GOOGLE_OAUTH_STATE_COOKIE_NAME = `${BASE}_google_oauth_state`;
export const GOOGLE_OAUTH_CODE_VERIFIER_COOKIE_NAME = `${BASE}_google_oauth_code_verifier`;
