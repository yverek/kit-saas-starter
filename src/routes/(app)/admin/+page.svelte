<script lang="ts">
  import Button from "$components/ui/button/button.svelte";
  import { route } from "$lib/ROUTES";
  import * as Card from "$lib/components/ui/card";
  import { Settings, Database } from "lucide-svelte";

  const features = [
    {
      name: "Database",
      href: route("/admin/database/users"),
      icon: Database
    },
    {
      name: "Settings",
      href: route("/admin/settings"),
      icon: Settings
    }
  ];
</script>

<div class="container mx-auto mt-12 flex flex-wrap place-content-center gap-6">
  {#each features as { icon, name, href } (href)}
    <Card.Root class="h-52 w-64">
      <Card.Header>
        <Card.Title class="mx-auto">
          <svelte:component this={icon} class="size-16" />
        </Card.Title>
        <Card.Description class="mx-auto text-xl">
          {name}
        </Card.Description>
      </Card.Header>
      <Card.Content class="flex flex-col gap-4 text-center">
        <Button class="mx-auto w-16" {href}>Open</Button>
      </Card.Content>
    </Card.Root>
  {/each}
</div>
