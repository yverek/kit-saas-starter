import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";
import { kitRoutes } from "vite-plugin-kit-routes";
import type { KIT_ROUTES } from "$lib/ROUTES";

export default defineConfig({
  plugins: [
    sveltekit(),
    kitRoutes<KIT_ROUTES>({
      post_update_run: "npm exec prettier ./src/lib/ROUTES.ts -- -w",
      LINKS: {
        facebook: "https://facebook.com/",
        github: "https://github.com/yverek/kit-saas-starter",
        instagram: "https://instagram.com/",
        tiktok: "https://tiktok.com/",
        twitter: "https://twitter.com/"
      }
    })
  ],
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"]
  }
});
