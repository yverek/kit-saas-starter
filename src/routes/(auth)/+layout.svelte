<script lang="ts">
  import { route } from "$lib/ROUTES";
  import { APP_NAME } from "$configs/general";
</script>

<section class="m-16">
  <div class="mx-auto flex flex-col items-center justify-center gap-6 px-6 py-8 lg:py-0">
    <a href={route("/")} class="flex items-center gap-2">
      <img src="/logo.png" class="size-8" alt={`${APP_NAME} Logo`} />
      <span class="text-2xl font-bold text-black dark:text-white">{APP_NAME}</span>
    </a>
    <slot />
  </div>
</section>
