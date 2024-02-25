<script>
  import { route } from "$lib/ROUTES";
  import { legals, socials } from "$lib/constants/footer-links";
  import { APP_NAME } from "$lib/constants/general";
</script>

<footer class="border-t p-6">
  <div class="max-w-screen-xl">
    <div class="md:flex md:justify-between">
      <div class="mb-6 md:mb-0">
        <a href={route("/")} class="flex items-center gap-3">
          <img src="/logo.png" class="size-8" alt={`${APP_NAME} Logo`} />
          <span class="text-xl font-bold text-black dark:text-white">{APP_NAME}</span>
        </a>
      </div>
      <div class="grid grid-cols-2 gap-8 sm:grid-cols-2 sm:gap-6">
        <div class="mr-4">
          <h2 class="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">Legal</h2>
          <ul class="flex flex-col gap-4 text-gray-600 dark:text-gray-400">
            {#each legals as { name, href }}
              <li>
                <a {href} class="hover:underline">{name}</a>
              </li>
            {/each}
          </ul>
        </div>
        <div>
          <h2 class="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">Resources</h2>
          <ul class="flex flex-col gap-4 text-gray-600 dark:text-gray-400">
            <li>
              <a href="https://flowbite.com" class="hover:underline">Svelte</a>
            </li>
            <li>
              <a href="https://tailwindcss.com" class="hover:underline">Tailwind CSS</a>
            </li>
            <li>
              <a href="https://tailwindcss.com" class="hover:underline">Drizzle ORM</a>
            </li>
            <li>
              <a href="https://lucia-auth.com" class="hover:underline">Lucia</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <hr class="my-6 border-gray-200 dark:border-gray-700 sm:mx-auto lg:my-8" />
    <div class="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
      <span class="text-sm text-gray-600 dark:text-gray-400">
        © 2024 <a href={route("/")} class="hover:underline">KSS</a>™. All Rights Reserved.
      </span>
      <div class="flex gap-6">
        {#each socials as { href, component }}
          <a {href}>
            <svelte:component this={component} class="size-5 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white" />
          </a>
        {/each}
      </div>
    </div>
  </div>
</footer>
