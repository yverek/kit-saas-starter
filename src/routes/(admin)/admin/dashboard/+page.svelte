<script lang="ts">
  import { enhance } from "$app/forms";
  import Button from "$components/ui/button/button.svelte";
  import { route } from "$lib/ROUTES";
  import * as Table from "$lib/components/ui/table";
  import { Trash2 } from "lucide-svelte";

  const { data } = $props();
</script>

<Table.Root class="mx-auto mb-10 max-w-xl">
  <Table.Caption>A list of users.</Table.Caption>
  <Table.Header>
    <Table.Row>
      <Table.Head class="w-[100px]">ID</Table.Head>
      <Table.Head>Name</Table.Head>
      <Table.Head>Email</Table.Head>
      <Table.Head class="text-right">Verified</Table.Head>
      <Table.Head class="text-right"></Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each data.users as user, i (user.id)}
      <Table.Row>
        <Table.Cell class="font-medium">{user.id}</Table.Cell>
        <Table.Cell>{user.name}</Table.Cell>
        <Table.Cell>{user.email}</Table.Cell>
        <Table.Cell class="text-right ">{user.verified ? "yes" : "no"}</Table.Cell>
        <Table.Cell class="text-right ">
          <form method="post" action={route("default /admin/dashboard")} use:enhance>
            <input type="hidden" name="userId" value={user.id} />
            <Button variant="ghost" type="submit">
              <Trash2 class="size-6 !text-red-600" />
            </Button>
          </form>
        </Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>

<form method="post" action={route("default /auth/logout")} use:enhance>
  <Button type="submit" variant="outline" size="sm">Logout</Button>
</form>
