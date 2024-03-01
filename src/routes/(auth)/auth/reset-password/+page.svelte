<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import * as Form from "$lib/components/ui/form";
  import Input from "$components/ui/input/input.svelte";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import * as flashModule from "sveltekit-flash-message/client";
  import { passwordResetFormSchema } from "$validations/auth";

  let { data } = $props();

  const form = superForm(data.form, {
    validators: zodClient(passwordResetFormSchema.omit({ code: true })),
    invalidateAll: true,
    delayMs: 2000,
    multipleSubmits: "prevent",
    syncFlashMessage: true,
    flashMessage: { module: flashModule }
  });

  const { form: formData, enhance } = form;
</script>

<Card.Root class="w-1/3">
  <Card.Header class="space-y-1">
    <Card.Title class="text-2xl">Reset your password</Card.Title>
  </Card.Header>
  <Card.Content class="grid gap-4">
    <div class="text-muted-foreground">Please insert your email to receive a code to reset your password.</div>
    <form class="flex flex-col" method="post" use:enhance>
      <Form.Field {form} name="email" class="space-y-1">
        <Form.Control let:attrs>
          <Form.Label>Email</Form.Label>
          <Input {...attrs} type="text" bind:value={$formData.email} />
        </Form.Control>
        <Form.FieldErrors let:errors class="h-4 text-xs">
          {#if errors[0]}
            {errors[0]}
          {/if}
        </Form.FieldErrors>
      </Form.Field>
      <Form.Button type="submit" class="mt-2">Send</Form.Button>
    </form>
  </Card.Content>
</Card.Root>
