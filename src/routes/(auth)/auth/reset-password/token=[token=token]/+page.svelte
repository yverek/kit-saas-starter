<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import * as Form from "$lib/components/ui/form";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import * as flashModule from "sveltekit-flash-message/client";
  import { passwordResetFormSchemaThirdStep } from "$validations/auth";
  import Input from "$components/ui/input/input.svelte";
  import PasswordStrength from "$components/layout/PasswordStrength.svelte";
  import { passwordStrength, type FirstOption, type Result, type Option } from "check-password-strength";

  let { data } = $props();

  let isPasswordFieldFocused = $state(false);

  const form = superForm(data.form, {
    validators: zodClient(passwordResetFormSchemaThirdStep),
    invalidateAll: true,
    delayMs: 2000,
    multipleSubmits: "prevent",
    syncFlashMessage: true,
    flashMessage: { module: flashModule }
  });

  const { form: formData, enhance } = form;

  // ! this code is duplicated from register route
  // TODO export
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

<Card.Root class="w-1/3">
  <Card.Header class="space-y-1">
    <Card.Title class="text-2xl">Change your password</Card.Title>
  </Card.Header>
  <Card.Content class="grid gap-4">
    <form class="flex flex-col gap-3" method="post" use:enhance>
      <Form.Field {form} name="password" class="space-y-1">
        <Form.Control let:attrs>
          <Form.Label>Password</Form.Label>
          <Input
            {...attrs}
            type="password"
            bind:value={$formData.password}
            onfocus={() => (isPasswordFieldFocused = true)}
            onblur={() => (isPasswordFieldFocused = false)}
          />
          {#if isPasswordFieldFocused}
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
      <Form.Button type="submit" class="mt-4">Change password</Form.Button>
    </form>
  </Card.Content>
</Card.Root>
