<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import * as Form from "$lib/components/ui/form";
  import { route } from "$lib/ROUTES";
  import Input from "$components/ui/input/input.svelte";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import * as flashModule from "sveltekit-flash-message/client";
  import { passwordResetFormSchemaSecondStep, type PasswordResetFormSchemaSecondStep } from "$validations/auth";

  let { data } = $props();

  const form = superForm(data.form, {
    validators: zodClient(passwordResetFormSchemaSecondStep),
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
    <div class="text-muted-foreground">Please check your email account for a message to reset your password.</div>
    <form class="flex flex-col" method="post" use:enhance>
      <Form.Field {form} name="token" class="space-y-1">
        <Form.Control let:attrs>
          <Form.Label>Token</Form.Label>
          <Input {...attrs} type="text" bind:value={$formData.token} />
        </Form.Control>
        <Form.FieldErrors let:errors class="h-4 text-xs">
          {#if errors[0]}
            {errors[0]}
          {/if}
        </Form.FieldErrors>
      </Form.Field>
      <Form.Button type="submit" class="mt-2">Confirm</Form.Button>
    </form>
  </Card.Content>
  <Card.Footer>
    <p class="text-sm">
      If you did not receive the email,
      <!-- TODO implement this route -->
      <a href={route("/")} class="underline">click here</a> to resend it.
    </p>
  </Card.Footer>
</Card.Root>
