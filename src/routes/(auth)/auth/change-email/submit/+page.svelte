<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import * as Form from "$lib/components/ui/form";
  import { APP_NAME } from "$configs/general";
  import Input from "$components/ui/input/input.svelte";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import * as flashModule from "sveltekit-flash-message/client";
  import { changeEmailFormSchemaFirstStep } from "$validations/auth";

  let { data } = $props();

  const form = superForm(data.form, {
    validators: zodClient(changeEmailFormSchemaFirstStep),
    invalidateAll: true,
    delayMs: 500,
    multipleSubmits: "prevent",
    syncFlashMessage: true,
    flashMessage: { module: flashModule }
  });

  const { form: formData, enhance } = form;
</script>

<Card.Root class="w-1/3">
  <Card.Header class="space-y-1">
    <Card.Title class="text-2xl">Change your email</Card.Title>
  </Card.Header>
  <Card.Content class="grid gap-4">
    <div class="text-muted-foreground">
      Insert your new email for {APP_NAME}.
    </div>
    <form class="flex flex-col" method="post" use:enhance>
      <Form.Field {form} name="email" class="space-y-1">
        <Form.Control let:attrs>
          <Form.Label>Email</Form.Label>
          <Input {...attrs} type="email" bind:value={$formData.email} />
        </Form.Control>
        <Form.FieldErrors class="h-4 text-xs" />
      </Form.Field>
      <Form.Button type="submit" class="mt-2">Change my email</Form.Button>
    </form>
  </Card.Content>
</Card.Root>
