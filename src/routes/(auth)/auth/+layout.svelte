<script lang="ts">
  import { APP_NAME, APP_URL } from "$lib/constants/general";
  import type { LayoutData } from "./$types";
  import { page } from "$app/stores";

  export let data: LayoutData;
</script>

<section>
  <div class="mx-auto flex flex-col items-center justify-center gap-6 px-6 py-8 md:h-screen lg:py-0">
    <a href={APP_URL} class="flex items-center gap-2">
      <img src="/logo.png" class="size-8" alt={`${APP_NAME} Logo`} />
      <span class="text-2xl font-bold text-black dark:text-white">{APP_NAME}</span>
    </a>
    <div class="w-full rounded-lg border shadow sm:max-w-md">
      <div class="space-y-4 p-6 sm:p-8 md:space-y-6">
        <h1 class="text-xl font-bold text-black dark:text-white md:text-2xl">
          {$page.data.title}
        </h1>
        <slot />
      </div>
    </div>
  </div>
</section>
