<script lang="ts">
  import { ChevronRight } from "lucide-svelte";
  import Button from "$components/ui/button/button.svelte";
  import { GitHub, Drizzle, Svelte, Tailwind, Cloudflare, Shacdn, TypeScript, Pnpm, Superforms } from "$components/icons";
  import { route } from "$lib/ROUTES";
  import * as m from "$paraglide/messages";
</script>

<section id="hero">
  <div class="py-8 text-center lg:py-16">
    <Button
      href={route("github")}
      class="mb-7 inline-flex items-center justify-between rounded-full px-1 py-1 pr-2 text-sm"
      role="alert"
      variant="secondary"
    >
      <span class="mr-3 rounded-full bg-primary px-4 py-1.5 text-xs text-white">{m.headline()}</span>
      <span class="text-sm font-medium">KSS 0.1.0 is out! See what's new</span>
      <ChevronRight class="ml-2 size-4" />
    </Button>
    <h1 class="mb-4 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">Go live in minutes</h1>
    <p class="mb-8 text-lg font-normal text-gray-500 dark:text-gray-400 lg:text-xl">
      Bootstrap your next SaaS project with this open source SvelteKit template. 🚀
    </p>
    <div class="mb-8 flex flex-row items-center justify-center space-x-4 lg:mb-16">
      <Button variant="outline" class="text-md h-12 w-36 font-bold" href={route("github")}>
        <GitHub class="mr-2 size-5" />GitHub
      </Button>
      <Button href={route("/auth/register")} class="text-md h-12 w-36 font-bold">
        Get started <ChevronRight class="size-5 !text-primary-foreground" />
      </Button>
    </div>
    <div class="mx-auto text-center lg:max-w-screen-lg lg:px-36">
      <span class="font-semibold uppercase text-gray-400">Tools</span>
      <div class="mb-8 mt-8 flex flex-wrap items-center justify-center sm:justify-between">
        <Button href="https://svelte.dev/" variant="link" class="flex h-16 flex-row items-center gap-2 text-black dark:text-white">
          <Svelte class="size-12" /> Svelte
        </Button>
        <Button href="https://shadcn-svelte.com/" variant="link" class="flex h-16 flex-row items-center gap-2 text-black dark:text-white">
          <Shacdn class="size-12" /> shadcn-svelte
        </Button>
        <Button href="https://orm.drizzle.team/" variant="link" class="flex h-16 flex-row items-center gap-2 text-black dark:text-white">
          <Drizzle class="size-12" /> Drizzle ORM
        </Button>
        <Button href="https://superforms.rocks/" variant="link" class="flex h-16 flex-row items-center gap-2 text-black dark:text-white">
          <Superforms class="size-12" /> Superforms
        </Button>
        <Button href="https://typescriptlang.org/" variant="link" class="flex h-16 flex-row items-center gap-2 text-black dark:text-white">
          <TypeScript class="size-12" /> TypeScript
        </Button>
        <Button href="https://pnpm.io/" variant="link" class="flex h-16 flex-row items-center gap-2 text-black dark:text-white">
          <Pnpm class="size-12" /> pnpm
        </Button>
        <Button href="https://tailwindcss.com/" variant="link" class="flex h-16 flex-row items-center gap-2 text-black dark:text-white">
          <Tailwind class="size-12" /> Tailwind CSS
        </Button>
        <Button href="https://cloudflare.com/" variant="link" class="flex h-16 flex-row items-center gap-2 text-black dark:text-white">
          <Cloudflare class="size-12" /> Cloudflare
        </Button>
      </div>
      <span class="font-semibold uppercase text-gray-400">and much more...</span>
    </div>
  </div>
</section>
