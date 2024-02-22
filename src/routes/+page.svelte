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
  <Sun
    class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
  />
  <Moon
    class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
  />
  <span class="sr-only">Toggle theme</span>
</Button>
<h1>Landing Page</h1>
<section>
  <article>
    <h2>Total of users registered <strong>({data.users[0].value})</strong></h2>
  </article>
  <article>
    <strong>{JSON.stringify(data.user, null, 2)}</strong>
    <form method="post" use:enhance>
      <button style="margin-top: 10px;">Sign out</button>
    </form>
  </article>
</section>
