<script lang="ts">
  import { enhance } from "$app/forms";
  import { Button, buttonVariants } from "$components/ui/button";
  import { route } from "$lib/ROUTES";
  import * as Table from "$lib/components/ui/table";
  import { Check, Pencil, Trash2, X } from "lucide-svelte";
  import { Input } from "$lib/components/ui/input";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";

  const { data } = $props();
</script>

<Table.Root class="mb-10 w-full">
  <Table.Caption>Add pagination to this table</Table.Caption>
  <Table.Header>
    <Table.Row>
      <Table.Head class="w-[100px]">ID</Table.Head>
      <Table.Head>Name</Table.Head>
      <Table.Head>Username</Table.Head>
      <Table.Head>Email</Table.Head>
      <Table.Head class="w-[75px]">Verified</Table.Head>
      <Table.Head class="w-[75px]">Admin</Table.Head>
      <Table.Head class="w-[150px]">Created At</Table.Head>
      <Table.Head class="w-[150px]">Modified At</Table.Head>
      <Table.Head class="w-8 px-0"></Table.Head>
      <Table.Head class="w-8 px-0"></Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each data.users as user (user.id)}
      <Table.Row>
        <Table.Cell class="font-medium">
          <Button variant="link" href={route("/admin/database/users/[userId=userId]", { userId: user.id })}>
            {user.id}
          </Button>
        </Table.Cell>
        <Table.Cell>{user.name}</Table.Cell>
        <Table.Cell>{user.username}</Table.Cell>
        <Table.Cell>{user.email}</Table.Cell>
        <Table.Cell>
          {#if user.isVerified}
            <Check color="green" class="mx-auto" />
          {:else}
            <X color="red" class="mx-auto" />
          {/if}
        </Table.Cell>
        <Table.Cell>
          {#if user.isAdmin}
            <Check color="green" class="mx-auto" />
          {:else}
            <X color="red" class="mx-auto" />
          {/if}
        </Table.Cell>
        <Table.Cell>{user.createdAt.toLocaleString()}</Table.Cell>
        <Table.Cell>{user.modifiedAt?.toLocaleString()}</Table.Cell>
        <Table.Cell class="w-8 px-2">
          <Button class="size-10 p-0" href={route("/admin/database/users/[userId=userId]", { userId: user.id })}>
            <Pencil class="size-5" />
          </Button>
        </Table.Cell>
        <Table.Cell class="w-8 px-1">
          <AlertDialog.Root>
            <AlertDialog.Trigger class={buttonVariants({ variant: "destructive" }) + " size-10 !p-0"}>
              <Trash2 class="size-5" />
            </AlertDialog.Trigger>
            <AlertDialog.Content>
              <AlertDialog.Header>
                <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
                <AlertDialog.Description>
                  This action cannot be undone. This will permanently delete this user from our servers.
                </AlertDialog.Description>
              </AlertDialog.Header>
              <AlertDialog.Footer>
                <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                <form method="post" action={route("deleteUser /admin/database/users")} use:enhance>
                  <Input type="hidden" name="userId" value={user.id} />
                  <AlertDialog.Action class={buttonVariants({ variant: "destructive" })} type="submit">Submit</AlertDialog.Action>
                </form>
              </AlertDialog.Footer>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>
