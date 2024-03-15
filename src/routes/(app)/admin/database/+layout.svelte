<script lang="ts">
  import { Separator } from "$lib/components/ui/separator";
  import SidebarSettingsNav from "$lib/components/layout/app/sidebar-nav-settings.svelte";
  import { route } from "$lib/ROUTES";

  const sidebarNavItems = [
    {
      title: "Users",
      href: route("/admin/database/users")
    },
    {
      title: "Tokens",
      href: route("/admin/database/tokens")
    }
  ];

  let { children } = $props();
</script>

<div class="mx-8 mt-8 hidden space-y-6 rounded-lg border p-10 pb-16 md:block">
  <div class="space-y-0.5">
    <h2 class="text-2xl font-bold tracking-tight">Admin</h2>
    <p class="text-muted-foreground">Manage your SaaS app from here.</p>
  </div>
  <Separator class="my-6" />
  <div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
    <aside class="-mx-4">
      <SidebarSettingsNav items={sidebarNavItems} class="w-40" />
    </aside>
    <div class="w-full">
      {@render children()}
    </div>
  </div>
</div>
