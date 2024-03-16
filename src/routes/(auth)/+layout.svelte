<script lang="ts">
  import { route } from "$lib/ROUTES";
  import { APP_NAME } from "$configs/general";
  import * as Card from "$lib/components/ui/card";

  let { children } = $props();
</script>

<section class="flex min-h-screen w-screen flex-col items-center justify-center py-8">
  <div class="flex w-full max-w-xl flex-col items-center justify-center gap-6 px-6 py-8 lg:py-0">
    <a href={route("/")} class="flex items-center gap-2">
      <img src="/logo.png" class="size-8" alt={`${APP_NAME} Logo`} />
      <span class="text-2xl font-bold text-black dark:text-white">{APP_NAME}</span>
    </a>
    <Card.Root class="w-full">
      {@render children()}
    </Card.Root>
  </div>
</section>
