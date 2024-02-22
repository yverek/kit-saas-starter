<script lang="ts">
  import { APP_NAME } from "$lib/constants/general";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;
</script>

<section class="bg-gray-50 dark:bg-gray-900">
  <div class="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
    <!-- TODO make logo visible for light mode -->
    <a href="/" class="mb-6 flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
      <img class="mr-2 h-8 w-8" src="/images/logo.png" alt="logo" />
      {APP_NAME}
    </a>
    <div class="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0 dark:border dark:border-gray-700 dark:bg-gray-800">
      <div class="space-y-4 p-6 sm:p-8 md:space-y-6">
        <!-- TODO test this -->
        <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          <slot name="title" />
        </h1>
        <slot />
      </div>
    </div>
  </div>
</section>
