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

<h1>Sign in</h1>
<form method="post" use:enhance>
  <Field {form} name="email">
    <Control let:attrs>
      <Label>Email</Label>
      <input {...attrs} type="email" bind:value={$formData.email} />
    </Control>
    <FieldErrors />
  </Field>
  <Field {form} name="password">
    <Control let:attrs>
      <Label>Password</Label>
      <input {...attrs} type="password" bind:value={$formData.password} />
    </Control>
    <FieldErrors />
  </Field>
  <button>Continue</button>
  <p>{form?.message ?? ""}</p>
</form>
<a href="/signup">Create an account</a>
