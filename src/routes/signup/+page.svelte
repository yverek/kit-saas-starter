<script lang="ts">
  import { superForm } from "sveltekit-superforms";
  import { Field, Control, Label, FieldErrors } from "formsnap";
  import { zodClient } from "sveltekit-superforms/adapters";
  import type { PageData } from "./$types";
  import registerFormSchema from "$lib/zod-schemas/register-form.schema";

  export let data: PageData;
  const form = superForm(data.form, {
    validators: zodClient(registerFormSchema)
  });
  const { form: formData, enhance } = form;
</script>

<h1>Create an account</h1>
<form method="post" use:enhance>
  <Field {form} name="name">
    <Control let:attrs>
      <Label>Name</Label>
      <input {...attrs} type="name" bind:value={$formData.name} />
    </Control>
    <FieldErrors />
  </Field>
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
  <Field {form} name="passwordConfirm">
    <Control let:attrs>
      <Label>Password Confirm</Label>
      <input {...attrs} type="password" bind:value={$formData.passwordConfirm} />
    </Control>
    <FieldErrors />
  </Field>
  <p>{form?.message ?? ""}</p>
  <button>Continue</button>
</form>
<a href="/login">Sign in</a>
