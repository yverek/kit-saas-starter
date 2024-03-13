<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import * as Form from "$lib/components/ui/form";
  import { APP_NAME } from "$configs/general";
  import { route } from "$lib/ROUTES";
  import Input from "$components/ui/input/input.svelte";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import * as flashModule from "sveltekit-flash-message/client";
  import { verifyEmailFormSchema } from "$validations/auth";
  import Turnstile from "$components/layout/Turnstile.svelte";
  import { Loader2 } from "lucide-svelte";
  import { enhance } from "$app/forms";

  let { data } = $props();

  const form = superForm(data.form, {
    validators: zodClient(verifyEmailFormSchema),
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
    <Card.Title class="text-2xl">Confirm your email address</Card.Title>
  </Card.Header>
  <Card.Content class="grid gap-4">
    <div class="text-muted-foreground">
      Please check your email account for a message to confirm your email address for {APP_NAME}.
    </div>
    <form class="flex flex-col" method="post" action={route("confirm /auth/verify-email")} use:enhanceConfirmForm>
      <Form.Field {form} name="token" class="space-y-1">
        <Form.Control let:attrs>
          <Form.Label>Token</Form.Label>
          <Input {...attrs} type="text" bind:value={$formData.token} />
        </Form.Control>
        <Form.FieldErrors class="h-4 text-xs" />
      </Form.Field>
      <Turnstile action={"verify-email"} bind:resetTurnstile />
      <Form.Button type="submit" disabled={$delayed}>
        {#if $delayed}
          <Loader2 class="mr-2 h-4 w-4 animate-spin" /> Loading...
        {:else}
          Verify
        {/if}
      </Form.Button>
    </form>
  </Card.Content>
  <Card.Footer>
    If you did not receive the email,
    <form class="mx-1 flex flex-col" method="post" action={route("resendEmail /auth/verify-email")} use:enhance>
      <button type="submit" class="underline">click here</button>
    </form>
    to resend it.
  </Card.Footer>
</Card.Root>
