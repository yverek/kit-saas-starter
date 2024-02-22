<script lang="ts">
  import { superForm } from "sveltekit-superforms";
  import { Field, Control, Label, FieldErrors } from "formsnap";
  import { zodClient } from "sveltekit-superforms/adapters";
  import type { PageData } from "./$types";
  import loginFormSchema from "$lib/zod-schemas/login-form.schema";

  export let data: PageData;
  const form = superForm(data.form, {
    validators: zodClient(loginFormSchema)
  });
  const { form: formData, enhance } = form;
</script>

<slot name="title">Login to your account</slot>

<form class="space-y-4 md:space-y-6" method="post" use:enhance>
  <div>
    <Field {form} name="email">
      <Control let:attrs>
        <Label class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Email</Label>
        <input
          class="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          {...attrs}
          type="email"
          bind:value={$formData.email}
        />
      </Control>
      <FieldErrors />
    </Field>
    <Field {form} name="password">
      <Control let:attrs>
        <Label class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Password</Label>
        <input
          class="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          {...attrs}
          type="password"
          bind:value={$formData.password}
        />
      </Control>
      <FieldErrors />
    </Field>
  </div>
  <div class="justify- flex items-center">
    <a href="/auth/password-reset" class="text-primary-600 dark:text-primary-500 text-sm font-medium hover:underline">Forgot password?</a>
  </div>
  <button
    type="submit"
    class="bg-primary-600 hover:bg-primary-700 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 w-full rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4"
  >
    Login
  </button>
  <p class="text-sm font-light text-gray-500 dark:text-gray-400">
    Don't have an account yet? <a href="/auth/register" class="text-primary-600 dark:text-primary-500 font-medium hover:underline">Sign up</a>
  </p>
</form>
