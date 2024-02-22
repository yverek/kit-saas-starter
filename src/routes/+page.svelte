<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData } from "./$types";
  import { Button } from "$lib/components/ui/button";
  import Sun from "lucide-svelte/icons/sun";
  import Moon from "lucide-svelte/icons/moon";
  import { toggleMode } from "mode-watcher";

  export let data: PageData;
</script>

<Button on:click={toggleMode} variant="outline" size="icon">
  <Sun class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
  <Moon class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
  <span class="sr-only">Toggle theme</span>
</Button>

<form method="post" action="/auth/logout" use:enhance>
  <Button type="submit" variant="outline" size="sm">Logout</Button>
</form>
<h1>Landing Page</h1>
