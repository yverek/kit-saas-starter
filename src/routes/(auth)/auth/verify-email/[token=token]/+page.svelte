<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import { route } from "$lib/ROUTES";

  let { data, form } = $props();
</script>

<Card.Root class="w-1/3">
  <Card.Header class="space-y-1">
    <Card.Title class="text-2xl">{data.title}</Card.Title>
  </Card.Header>
  <Card.Content class="grid gap-4">
    {data.message}
  </Card.Content>
  <Card.Footer>
    <p class="text-sm">
      You can now go to your <a href={route("/dashboard")} class="underline">dashboard</a>
    </p>
  </Card.Footer>
</Card.Root>
