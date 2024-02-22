<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import Sun from "lucide-svelte/icons/sun";
  import Moon from "lucide-svelte/icons/moon";
  import { toggleMode } from "mode-watcher";
  import { APP_NAME, APP_URL } from "$lib/constants/general";
  import { NAV_LINKS } from "$lib/constants/landing-page";
</script>

<header class="border-b px-4 py-2.5">
  <nav class="mx-auto flex max-w-screen-xl justify-between">
    <a href={APP_URL} class="flex items-center gap-3">
      <img src="/logo.png" class="size-10" alt={`${APP_NAME} Logo`} />
      <span class="text-xl font-bold text-black dark:text-white">{APP_NAME}</span>
    </a>
    <ul class="mt-4 flex flex-col font-medium md:mt-0 md:flex-row">
      {#each NAV_LINKS as { name, href }}
        <li>
          <Button {href} variant="link" class="text-md text-black dark:text-white">
            {name}
            <span class="sr-only">{name}</span>
          </Button>
        </li>
      {/each}
    </ul>
    <div class="ml-2 flex gap-2">
      <Button on:click={toggleMode} variant="secondary" size="icon">
        <Sun class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span class="sr-only">Toggle theme</span>
      </Button>
      <Button href="/auth/login" variant="secondary">
        Login
        <span class="sr-only">Login</span>
      </Button>
      <Button href="/auth/register">
        Register
        <span class="sr-only">Register</span>
      </Button>
    </div>
  </nav>
</header>
