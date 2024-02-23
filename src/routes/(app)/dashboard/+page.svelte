<script lang="ts">
  import { enhance } from "$app/forms";
  import Button from "$components/ui/button/button.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<form method="post" action="/auth/logout" use:enhance>
  <Button type="submit" variant="outline" size="sm">Logout</Button>
</form>
