import { dev } from "$app/environment";

export const APP_NAME = "Kit SaaS Starter";
export const APP_URL = dev ? "localhost:5173" : "https://kit-saas-starter.pages.dev";
export const APP_EMAIL = "Kit SaaS Starter <onboarding@resend.dev>";

export const SESSION_COOKIE_NAME = "kss_auth";

// TODO should we export this constants into a dedicated "cookie" file?
export const GITHUB_OAUTH_STATE_COOKIE_NAME = "kss_github_oauth_state";
export const GOOGLE_OAUTH_STATE_COOKIE_NAME = "kss_google_oauth_state";
export const GOOGLE_OAUTH_CODE_VERIFIER_COOKIE_NAME = "kss_google_oauth_code_verifier";

export type OAUTH_PROVIDERS = "google" | "github";
