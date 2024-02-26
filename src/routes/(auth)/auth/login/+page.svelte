<script lang="ts">
  import { toast } from "svelte-sonner";
  import { superForm } from "sveltekit-superforms";
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import * as Card from "$lib/components/ui/card";
  import { zodClient } from "sveltekit-superforms/adapters";
  import loginFormSchema from "$validations/login-form.schema";
  import Button from "$components/ui/button/button.svelte";
  import Apple from "$components/icons/apple.svelte";
  import Google from "$components/icons/google.svelte";
  import { route } from "$lib/ROUTES.js";
  import * as flashModule from "sveltekit-flash-message/client";

  let { data } = $props();

  const form = superForm(data.form, {
    validators: zodClient(loginFormSchema),
    invalidateAll: true,
    delayMs: 500,
    multipleSubmits: "prevent",
    syncFlashMessage: true,
    flashMessage: { module: flashModule }
  });

  const { form: formData, enhance } = form;
</script>

<Card.Root class="w-96">
  <Card.Header class="space-y-1">
    <Card.Title class="text-2xl">Login to your account</Card.Title>
  </Card.Header>
  <Card.Content class="grid gap-4">
    <div class="grid grid-cols-2 gap-6">
      <Button variant="outline">
        <Apple class="mr-2 h-4 w-4" />
        GitHub
      </Button>
      <Button variant="outline">
        <Google class="mr-2 h-4 w-4" />
        Google
      </Button>
    </div>
    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <span class="w-full border-t" />
      </div>
      <div class="relative flex justify-center text-xs uppercase">
        <span class="bg-card px-2 text-muted-foreground"> or login with </span>
      </div>
    </div>
    <form class="flex flex-col gap-2" method="post" use:enhance>
      <Form.Field {form} name="email" class="space-y-1">
        <Form.Control let:attrs>
          <Form.Label>Email</Form.Label>
          <Input {...attrs} type="email" bind:value={$formData.email} />
        </Form.Control>
        <Form.FieldErrors let:errors class="h-4 text-xs">
          {#if errors[0]}
            Invalid email
          {/if}
        </Form.FieldErrors>
      </Form.Field>
      <Form.Field {form} name="password" class="space-y-1">
        <Form.Control let:attrs>
          <Form.Label>Password</Form.Label>
          <Input {...attrs} type="password" bind:value={$formData.password} />
        </Form.Control>
        <Form.FieldErrors let:errors class="h-4 text-xs">
          {#if errors[0]}
            Invalid password
          {/if}
        </Form.FieldErrors>
      </Form.Field>
      <a href={route("/auth/password-reset")} class="flex- text-right text-sm font-medium hover:underline">Forgot password?</a>
      <Form.Button type="submit" class="mt-4">Login</Form.Button>
    </form>
  </Card.Content>
  <Card.Footer>
    <p class="text-sm">
      Don't have an account yet? <a href={route("/auth/register")} class="font-medium hover:underline">Register</a>
    </p>
  </Card.Footer>
</Card.Root>
