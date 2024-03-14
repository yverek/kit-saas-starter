/* eslint-disable */
/**
 * This file was generated by 'vite-plugin-kit-routes'
 *
 *      >> DO NOT EDIT THIS FILE MANUALLY <<
 */

/**
 * PAGES
 */
const PAGES = {
  "/admin/dashboard": `/admin/dashboard`,
  "/app/billing": `/app/billing`,
  "/app/dashboard": `/app/dashboard`,
  "/app/profile": `/app/profile`,
  "/app/settings": `/app/settings`,
  "/app/settings/account": `/app/settings/account`,
  "/app/settings/notifications": `/app/settings/notifications`,
  "/app/settings/profile": `/app/settings/profile`,
  "/auth/change-email/confirm": `/auth/change-email/confirm`,
  "/auth/change-email/submit": `/auth/change-email/submit`,
  "/auth/login": (params?: { redirectTo?: string }) => {
    return `/auth/login${appendSp({ redirectTo: params?.redirectTo })}`;
  },
  "/auth/register": `/auth/register`,
  "/auth/reset-password": `/auth/reset-password`,
  "/auth/reset-password/[userId=userId]": (params: { userId: Parameters<typeof import("../params/userId.ts").match>[0] }) => {
    return `/auth/reset-password/${params.userId}`;
  },
  "/auth/reset-password/[userId=userId]/new-password": (params: { userId: Parameters<typeof import("../params/userId.ts").match>[0] }) => {
    return `/auth/reset-password/${params.userId}/new-password`;
  },
  "/auth/verify-email": `/auth/verify-email`,
  "/": `/`,
  "/legal/cookie-policy": `/legal/cookie-policy`,
  "/legal/privacy-policy": `/legal/privacy-policy`,
  "/legal/terms-and-conditions": `/legal/terms-and-conditions`
};

/**
 * SERVERS
 */
const SERVERS = {
  "GET /auth/oauth/github": `/auth/oauth/github`,
  "GET /auth/oauth/github/callback": `/auth/oauth/github/callback`,
  "GET /auth/oauth/google": `/auth/oauth/google`,
  "GET /auth/oauth/google/callback": `/auth/oauth/google/callback`
};

/**
 * ACTIONS
 */
const ACTIONS = {
  "default /admin/dashboard": `/admin/dashboard`,
  "default /app/settings/account": `/app/settings/account`,
  "default /app/settings/profile": `/app/settings/profile`,
  "confirm /auth/change-email/confirm": `/auth/change-email/confirm?/confirm`,
  "resendEmail /auth/change-email/confirm": `/auth/change-email/confirm?/resendEmail`,
  "default /auth/change-email/submit": `/auth/change-email/submit`,
  "default /auth/login": `/auth/login`,
  "default /auth/logout": `/auth/logout`,
  "default /auth/register": `/auth/register`,
  "default /auth/reset-password": `/auth/reset-password`,
  "confirm /auth/reset-password/[userId=userId]": (params: { userId: Parameters<typeof import("../params/userId.ts").match>[0] }) => {
    return `/auth/reset-password/${params.userId}?/confirm`;
  },
  "resendEmail /auth/reset-password/[userId=userId]": (params: { userId: Parameters<typeof import("../params/userId.ts").match>[0] }) => {
    return `/auth/reset-password/${params.userId}?/resendEmail`;
  },
  "default /auth/reset-password/[userId=userId]/new-password": (params: { userId: Parameters<typeof import("../params/userId.ts").match>[0] }) => {
    return `/auth/reset-password/${params.userId}/new-password`;
  },
  "confirm /auth/verify-email": `/auth/verify-email?/confirm`,
  "resendEmail /auth/verify-email": `/auth/verify-email?/resendEmail`
};

/**
 * LINKS
 */
const LINKS = {
  discord: `https://discord.com`,
  facebook: `https://facebook.com`,
  github: `https://github.com/yverek/kit-saas-starter`,
  instagram: `https://instagram.com`,
  tiktok: `https://tiktok.com`,
  twitter: `https://twitter.com`,
  svelte: `https://svelte.dev`,
  tailwind: `https://tailwindcss.com`,
  drizzle: `https://orm.drizzle.team`,
  lucia: `https://lucia-auth.com`
};

type ParamValue = string | number | undefined;

/**
 * Append search params to a string
 */
export const appendSp = (sp?: Record<string, ParamValue | ParamValue[]>, prefix: "?" | "&" = "?") => {
  if (sp === undefined) return "";

  const params = new URLSearchParams();
  const append = (n: string, v: ParamValue) => {
    if (v !== undefined) {
      params.append(n, String(v));
    }
  };

  for (const [name, val] of Object.entries(sp)) {
    if (Array.isArray(val)) {
      for (const v of val) {
        append(name, v);
      }
    } else {
      append(name, val);
    }
  }

  const formatted = params.toString();
  if (formatted) {
    return `${prefix}${formatted}`;
  }
  return "";
};

/**
 * get the current search params
 *
 * Could be use like this:
 * ```
 * route("/cities", { page: 2 }, { ...currentSP() })
 * ```
 */
export const currentSp = () => {
  const params = new URLSearchParams(window.location.search);
  const record: Record<string, string> = {};
  for (const [key, value] of params.entries()) {
    record[key] = value;
  }
  return record;
};

function StringOrUndefined(val: any) {
  if (val === undefined) {
    return undefined;
  }

  return String(val);
}

// route function helpers
type NonFunctionKeys<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];
type FunctionKeys<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T];
type FunctionParams<T> = T extends (...args: infer P) => any ? P : never;

const AllObjs = { ...PAGES, ...ACTIONS, ...SERVERS, ...LINKS };
type AllTypes = typeof AllObjs;

/**
 * To be used like this:
 * ```ts
 * import { route } from './ROUTES'
 *
 * route('site_id', { id: 1 })
 * ```
 */
export function route<T extends FunctionKeys<AllTypes>>(key: T, ...params: FunctionParams<AllTypes[T]>): string;
export function route<T extends NonFunctionKeys<AllTypes>>(key: T): string;
export function route<T extends keyof AllTypes>(key: T, ...params: any[]): string {
  if ((AllObjs[key] as any) instanceof Function) {
    const element = (AllObjs as any)[key] as (...args: any[]) => string;
    return element(...params);
  } else {
    return AllObjs[key] as string;
  }
}

/**
 * Add this type as a generic of the vite plugin `kitRoutes<KIT_ROUTES>`.
 *
 * Full example:
 * ```ts
 * import type { KIT_ROUTES } from './ROUTES'
 * import { kitRoutes } from 'vite-plugin-kit-routes'
 *
 * kitRoutes<KIT_ROUTES>({
 *  PAGES: {
 *    // here, key of object will be typed!
 *  }
 * })
 * ```
 */
export type KIT_ROUTES = {
  PAGES: {
    "/admin/dashboard": never;
    "/app/billing": never;
    "/app/dashboard": never;
    "/app/profile": never;
    "/app/settings": never;
    "/app/settings/account": never;
    "/app/settings/notifications": never;
    "/app/settings/profile": never;
    "/auth/change-email/confirm": never;
    "/auth/change-email/submit": never;
    "/auth/login": never;
    "/auth/register": never;
    "/auth/reset-password": never;
    "/auth/reset-password/[userId=userId]": "userId";
    "/auth/reset-password/[userId=userId]/new-password": "userId";
    "/auth/verify-email": never;
    "/": never;
    "/legal/cookie-policy": never;
    "/legal/privacy-policy": never;
    "/legal/terms-and-conditions": never;
  };
  SERVERS: {
    "GET /auth/oauth/github": never;
    "GET /auth/oauth/github/callback": never;
    "GET /auth/oauth/google": never;
    "GET /auth/oauth/google/callback": never;
  };
  ACTIONS: {
    "default /admin/dashboard": never;
    "default /app/settings/account": never;
    "default /app/settings/profile": never;
    "confirm /auth/change-email/confirm": never;
    "resendEmail /auth/change-email/confirm": never;
    "default /auth/change-email/submit": never;
    "default /auth/login": never;
    "default /auth/logout": never;
    "default /auth/register": never;
    "default /auth/reset-password": never;
    "confirm /auth/reset-password/[userId=userId]": "userId";
    "resendEmail /auth/reset-password/[userId=userId]": "userId";
    "default /auth/reset-password/[userId=userId]/new-password": "userId";
    "confirm /auth/verify-email": never;
    "resendEmail /auth/verify-email": never;
  };
  LINKS: {
    discord: never;
    facebook: never;
    github: never;
    instagram: never;
    tiktok: never;
    twitter: never;
    svelte: never;
    tailwind: never;
    drizzle: never;
    lucia: never;
  };
  Params: { redirectTo: never; userId: never };
};
