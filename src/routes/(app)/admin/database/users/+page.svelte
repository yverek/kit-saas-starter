<script lang="ts">
  import { enhance } from "$app/forms";
  import { Button, buttonVariants } from "$components/ui/button";
  import { route } from "$lib/ROUTES";
  import * as Table from "$lib/components/ui/table";
  import { Check, Loader2, Pencil, Trash2, X } from "lucide-svelte";
  import * as Dialog from "$lib/components/ui/dialog";
  import { Input } from "$lib/components/ui/input";
  import * as Form from "$lib/components/ui/form";
  import * as flashModule from "sveltekit-flash-message/client";
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
        <Table.Cell class="font-medium">{user.id}</Table.Cell>
        <Table.Cell>{user.name}</Table.Cell>
        <Table.Cell>{user.username}</Table.Cell>
        <Table.Cell>{user.email}</Table.Cell>
        <Table.Cell>
          {#if user.isAdmin}
            <Check color="green" class="mx-auto" />
          {:else}
            <X color="red" class="mx-auto" />
          {/if}
        </Table.Cell>
        <Table.Cell>
          {#if user.isVerified}
            <Check color="green" class="mx-auto" />
          {:else}
            <X color="red" class="mx-auto" />
          {/if}
        </Table.Cell>
        <Table.Cell>{user.createdAt.toLocaleString()}</Table.Cell>
        <Table.Cell>{user.modifiedAt?.toLocaleString()}</Table.Cell>
        <Table.Cell class="w-8 px-1">
          <Dialog.Root>
            <Dialog.Trigger class={buttonVariants({ variant: "outline" }) + " size-10 !p-0"}>
              <Pencil class="size-5" />
            </Dialog.Trigger>
            <Dialog.Content class="sm:max-w-[425px]">
              <Dialog.Header>
                <Dialog.Title>Edit user</Dialog.Title>
                <Dialog.Description>Click save when you're done.</Dialog.Description>
              </Dialog.Header>
              <div class="grid gap-4 py-4">
                <!-- <form class="flex flex-col gap-2" method="post" use:updateUserEnhance>
                  <Form.Field {form} name="name" class="space-y-1">
                    <Form.Control let:attrs>
                      <Form.Label>Name</Form.Label>
                      <Input {...attrs} type="name" bind:value={$formData.name} />
                    </Form.Control>
                    <Form.FieldErrors let:errors class="h-4 text-xs">
                      {#if errors[0]}
                        {errors[0]}
                      {/if}
                    </Form.FieldErrors>
                  </Form.Field>
                  <Form.Field {form} name="email" class="space-y-1">
                    <Form.Control let:attrs>
                      <Form.Label>Email</Form.Label>
                      <Input {...attrs} type="email" bind:value={$formData.email} />
                    </Form.Control>
                    <Form.FieldErrors let:errors class="h-4 text-xs">
                      {#if errors[0]}
                        {errors[0]}
                      {/if}
                    </Form.FieldErrors>
                  </Form.Field>
                  <Form.Button type="submit" class="mt-4" disabled={$delayed}>
                    {#if $delayed}
                      <Loader2 class="mr-2 h-4 w-4 animate-spin" /> Loading...
                    {:else}
                      Create account
                    {/if}
                  </Form.Button>
                </form> -->
              </div>
              <Dialog.Footer>
                <Button type="submit">Save changes</Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Root>
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
                  <input type="hidden" name="userId" value={user.id} />
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
