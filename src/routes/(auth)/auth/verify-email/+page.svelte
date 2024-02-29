<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import * as Form from "$lib/components/ui/form";
  import { APP_NAME } from "$configs/general";
  import { route } from "$lib/ROUTES";
  import Input from "$components/ui/input/input.svelte";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import * as flashModule from "sveltekit-flash-message/client";
  import emailValidationFormSchema from "$validations/email-validation-form.schema";

  let { data } = $props();

  const form = superForm(data.form, {
    validators: zodClient(emailValidationFormSchema),
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
    <Card.Title class="text-2xl">Confirm your email address</Card.Title>
  </Card.Header>
  <Card.Content class="grid gap-4">
    <div class="text-muted-foreground">
      Please check your email account for a message to confirm your email address for {APP_NAME}.
    </div>
    <form class="flex flex-col" method="post" use:enhance>
      <Form.Field {form} name="code" class="space-y-1">
        <Form.Control let:attrs>
          <Form.Label>Code</Form.Label>
          <Input {...attrs} type="text" bind:value={$formData.code} />
        </Form.Control>
        <Form.FieldErrors class="h-4 text-xs" />
      </Form.Field>
      <Form.Button type="submit" class="mt-2">Verify</Form.Button>
    </form>
  </Card.Content>
  <Card.Footer>
    <p class="text-sm">
      If you did not receive the email,
      <a href={route("/")} class="underline">click here</a> to resend it.
    </p>
  </Card.Footer>
</Card.Root>
