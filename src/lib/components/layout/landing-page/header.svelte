<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import Sun from "lucide-svelte/icons/sun";
  import Moon from "lucide-svelte/icons/moon";
  import { toggleMode } from "mode-watcher";
  import { APP_NAME } from "$configs/general";
  import { navLinks } from "$configs/landing/header-links";
  import type { User } from "lucia";
  import { enhance } from "$app/forms";
  import { route } from "$lib/ROUTES";

  type Props = { user: User | null };

  let { user }: Props = $props();
</script>

<header class="border-b border-gray-500 py-4 dark:border-gray-600">
  <nav class="flex justify-between">
    <a href={route("/")} class="flex items-center gap-3">
      <img src="/logo.png" class="size-9" alt={`${APP_NAME} Logo`} />
      <span class="hidden text-xl font-bold text-black dark:text-white sm:block">{APP_NAME}</span>
    </a>
    <ul class="hidden lg:flex lg:flex-row lg:font-medium">
      {#each navLinks as { name, href }}
        <li>
          <Button {href} variant="link" class="text-md text-black dark:text-white">
            {name}
            <span class="sr-only">{name}</span>
          </Button>
        </li>
      {/each}
    </ul>
    <div class="flex gap-2">
      <Button on:click={toggleMode} variant="outline" size="icon">
        <Sun color="black" class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon color="white" class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span class="sr-only">Toggle theme</span>
      </Button>
      {#if user}
        <form method="post" action="/auth/logout" use:enhance>
          <Button type="submit" variant="outline">Logout</Button>
        </form>
        <Button href={route("/dashboard")}>
          Dashboard
          <span class="sr-only">Dashboard</span>
        </Button>
      {:else}
        <Button href={route("/auth/login")} variant="secondary">
          Login
          <span class="sr-only">Login</span>
        </Button>
        <Button href={route("/auth/register")}>
          Register
          <span class="sr-only">Register</span>
        </Button>
      {/if}
    </div>
  </nav>
</header>
