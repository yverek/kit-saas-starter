<script lang="ts">
  import * as Card from "$lib/components/ui/card";

  let { data } = $props();
</script>

<Card.Root class="w-1/3">
  <Card.Header class="space-y-1">
    <Card.Title class="text-2xl">{data.title}</Card.Title>
  </Card.Header>
  <Card.Content class="grid gap-4">
    {data.body}
  </Card.Content>
</Card.Root>
