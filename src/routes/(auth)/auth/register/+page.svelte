<script lang="ts">
  import { superForm } from "sveltekit-superforms";
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import * as Card from "$lib/components/ui/card";
  import { zodClient } from "sveltekit-superforms/adapters";
  import type { PageData } from "./$types";
  import registerFormSchema from "$lib/zod-schemas/register-form.schema";
  import Button from "$components/ui/button/button.svelte";
  import Apple from "$components/icons/apple.svelte";
  import Google from "$components/icons/google.svelte";
  import { route } from "$lib/ROUTES";

  export let data: PageData;

  const form = superForm(data.form, { validators: zodClient(registerFormSchema) });
  const { form: formData, enhance } = form;
</script>

<Card.Root class="w-96">
  <Card.Header class="space-y-1">
    <Card.Title class="text-2xl">Create an account</Card.Title>
  </Card.Header>
  <Card.Content class="grid gap-4">
    <div class="grid grid-cols-2 gap-6">
      <!-- TODO change this href -->
      <Button variant="outline" href="#">
        <Apple class="mr-2 h-4 w-4" />
        GitHub
      </Button>
      <!-- TODO change this href -->
      <Button variant="outline" href="#">
        <Google class="mr-2 h-4 w-4" />
        Google
      </Button>
    </div>
    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <span class="w-full border-t" />
      </div>
      <div class="relative flex justify-center text-xs uppercase">
        <span class="bg-card px-2 text-muted-foreground"> or register with </span>
      </div>
    </div>
    <form class="flex flex-col" method="post" use:enhance>
      <Form.Field {form} name="name">
        <Form.Control let:attrs>
          <Form.Label>Name</Form.Label>
          <Input {...attrs} type="name" bind:value={$formData.name} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="email">
        <Form.Control let:attrs>
          <Form.Label>Email</Form.Label>
          <Input {...attrs} type="email" bind:value={$formData.email} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="password">
        <Form.Control let:attrs>
          <Form.Label>Password</Form.Label>
          <Input {...attrs} type="password" bind:value={$formData.password} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="passwordConfirm">
        <Form.Control let:attrs>
          <Form.Label>Password Confirm</Form.Label>
          <Input {...attrs} type="password" bind:value={$formData.passwordConfirm} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Button type="submit" class="mt-4">Create account</Form.Button>
    </form>
  </Card.Content>
  <Card.Footer>
    <p class="text-sm">
      Already have an account? <a href={route("/auth/login")} class="font-medium hover:underline">Login</a>
    </p>
  </Card.Footer>
</Card.Root>
