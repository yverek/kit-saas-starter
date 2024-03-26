import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";
import { kitRoutes } from "vite-plugin-kit-routes";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import type { KIT_ROUTES } from "$lib/ROUTES";
import { paraglide } from "@inlang/paraglide-js-adapter-sveltekit/vite";

export default defineConfig({
  plugins: [
    wasm(),
    topLevelAwait(),
    paraglide({
      project: "./project.inlang",
      outdir: "./src/lib/paraglide"
    }),
    sveltekit(),
    kitRoutes<KIT_ROUTES>({
      post_update_run: "npm exec prettier ./src/lib/ROUTES.ts -- -w",
      LINKS: {
        // socials
        discord: "https://discord.com",
        facebook: "https://facebook.com",
        github: "https://github.com/yverek/kit-saas-starter",
        instagram: "https://instagram.com",
        tiktok: "https://tiktok.com",
        twitter: "https://twitter.com",

        // tools
        svelte: "https://svelte.dev",
        tailwind: "https://tailwindcss.com",
        drizzle: "https://orm.drizzle.team",
        lucia: "https://lucia-auth.com"
      },
      PAGES: {
        "/auth/login": {
          explicit_search_params: {
            redirectTo: { type: "string" }
          }
        }
      }
    })
  ],
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"]
  }
});
