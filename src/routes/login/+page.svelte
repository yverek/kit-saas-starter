<script lang="ts">
  import type { PageData, ActionData } from "./$types";
  import { enhance } from "$app/forms";

  export let data: PageData;
  export let form: ActionData;
</script>

<h1>Sign in</h1>
<form method="post" use:enhance>
  <label for="username">Username</label>
  <input name="username" id="username" /><br />
  <label for="password">Password</label>
  <input type="password" name="password" id="password" /><br />
  <button>Continue</button>
  <p>{form?.message ?? ""}</p>
</form>
<a href="/signup">Create an account</a>
