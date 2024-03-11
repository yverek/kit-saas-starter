<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import * as Form from "$lib/components/ui/form";
  import { APP_NAME } from "$configs/general";
  import Input from "$components/ui/input/input.svelte";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import * as flashModule from "sveltekit-flash-message/client";
  import { changeEmailFormSchemaFirstStep } from "$validations/auth";
  import Turnstile from "$components/layout/Turnstile.svelte";
  import { Loader2 } from "lucide-svelte";

  let { data } = $props();

  const form = superForm(data.form, {
    validators: zodClient(changeEmailFormSchemaFirstStep),
    delayMs: 500,
    timeoutMs: 5000,
    multipleSubmits: "prevent",
    syncFlashMessage: true,
    flashMessage: { module: flashModule },
    onUpdate: () => resetTurnstile()
  });

  const { form: formData, enhance, delayed } = form;

  let resetTurnstile = $state(() => {});
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
      <Turnstile action={"change-email-submit"} bind:resetTurnstile />
      <Form.Button type="submit" class="mt-2" disabled={$delayed}>
        {#if $delayed}
          <Loader2 class="mr-2 h-4 w-4 animate-spin" /> Loading...
        {:else}
          Change my email
        {/if}
      </Form.Button>
    </form>
  </Card.Content>
</Card.Root>
