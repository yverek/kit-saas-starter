<script lang="ts">
  import { superForm } from "sveltekit-superforms";
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import * as Card from "$lib/components/ui/card";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { registerFormSchema } from "$validations/auth";
  import Button from "$components/ui/button/button.svelte";
  import Apple from "$components/icons/apple.svelte";
  import Google from "$components/icons/google.svelte";
  import { route } from "$lib/ROUTES";
  import * as flashModule from "sveltekit-flash-message/client";
  import PasswordStrength from "$components/layout/PasswordStrength.svelte";
  import { passwordStrength, type FirstOption, type Result, type Option } from "check-password-strength";

  let { data } = $props();

  let popoverOpen = $state(false);

  const form = superForm(data.form, {
    validators: zodClient(registerFormSchema),
    invalidateAll: true,
    delayMs: 500,
    multipleSubmits: "prevent",
    syncFlashMessage: true,
    flashMessage: { module: flashModule }
  });
  const { form: formData, enhance } = form;

  const customOptions: [FirstOption<string>, ...Option<string>[]] = [
    { id: 0, value: "Too weak", minDiversity: 0, minLength: 0 },
    { id: 1, value: "Weak", minDiversity: 2, minLength: 6 },
    { id: 2, value: "Medium", minDiversity: 3, minLength: 8 },
    { id: 3, value: "Strong", minDiversity: 4, minLength: 10 }
  ];

  let pwd: Result<string> = $state(passwordStrength($formData.password, customOptions));
  let myData: Array<{ name: string; isDone: boolean }> = $derived([
    { name: "Minimum number of characters is 10.", isDone: pwd.length >= 10 },
    { name: "Should contain lowercase.", isDone: pwd.contains.includes("lowercase") },
    { name: "Should contain uppercase.", isDone: pwd.contains.includes("uppercase") },
    { name: "Should contain numbers.", isDone: pwd.contains.includes("number") },
    { name: "Should contain special characters.", isDone: pwd.contains.includes("symbol") }
  ]);

  $effect(() => {
    pwd = passwordStrength($formData.password, customOptions);
  });
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
        Apple
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
    <form class="flex flex-col gap-2" method="post" use:enhance>
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
      <Form.Field {form} name="password" class="space-y-1">
        <Form.Control let:attrs>
          <Form.Label>Password</Form.Label>
          <Input
            {...attrs}
            type="password"
            bind:value={$formData.password}
            onfocus={() => (popoverOpen = true)}
            onblur={() => (popoverOpen = false)}
          />
          {#if popoverOpen}
            <PasswordStrength {pwd} {myData}></PasswordStrength>
          {/if}
        </Form.Control>
        <Form.FieldErrors let:errors class="h-4 text-xs">
          {#if errors[0]}
            {errors[0]}
          {/if}
        </Form.FieldErrors>
      </Form.Field>
      <Form.Field {form} name="passwordConfirm" class="space-y-1">
        <Form.Control let:attrs>
          <Form.Label>Password Confirm</Form.Label>
          <Input {...attrs} type="password" bind:value={$formData.passwordConfirm} />
        </Form.Control>
        <Form.FieldErrors let:errors class="h-4 text-xs">
          {#if errors[0]}
            {errors[0]}
          {/if}
        </Form.FieldErrors>
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
