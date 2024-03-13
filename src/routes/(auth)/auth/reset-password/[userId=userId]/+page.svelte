<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import * as Form from "$lib/components/ui/form";
  import { route } from "$lib/ROUTES";
  import Input from "$components/ui/input/input.svelte";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import * as flashModule from "sveltekit-flash-message/client";
  import { resetPasswordFormSchemaSecondStep } from "$validations/auth";
  import Turnstile from "$components/layout/Turnstile.svelte";
  import { Loader2 } from "lucide-svelte";
  import { enhance } from "$app/forms";

  let { data } = $props();

  const form = superForm(data.form, {
    validators: zodClient(resetPasswordFormSchemaSecondStep),
    delayMs: 500,
    timeoutMs: 5000,
    multipleSubmits: "prevent",
    syncFlashMessage: true,
    flashMessage: { module: flashModule },
    onUpdate: () => resetTurnstile()
  });

  const { form: formData, enhance: enhanceConfirmForm, delayed } = form;

  let resetTurnstile = $state(() => {});
</script>

<Card.Root class="w-1/3">
  <Card.Header class="space-y-1">
    <Card.Title class="text-2xl">Reset your password</Card.Title>
  </Card.Header>
  <Card.Content class="grid gap-4">
    <div class="text-muted-foreground">Please check your email account for a message to reset your password.</div>
    <form
      class="flex flex-col"
      method="post"
      action={route("confirm /auth/reset-password/[userId=userId]", { userId: data.userId })}
      use:enhanceConfirmForm
    >
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
      <Turnstile action={"reset-password-confirm"} bind:resetTurnstile />
      <Form.Button type="submit" disabled={$delayed}>
        {#if $delayed}
          <Loader2 class="mr-2 h-4 w-4 animate-spin" /> Loading...
        {:else}
          Confirm
        {/if}
      </Form.Button>
    </form>
  </Card.Content>
  <Card.Footer>
    If you did not receive the email,
    <form
      class="mx-1 flex flex-col"
      method="post"
      action={route("resendEmail /auth/reset-password/[userId=userId]", { userId: data.userId })}
      use:enhance
    >
      <button type="submit" class="underline">click here</button>
    </form>
    to resend it.
  </Card.Footer>
</Card.Root>
