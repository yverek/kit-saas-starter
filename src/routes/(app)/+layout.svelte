<script lang="ts">
  import { enhance } from "$app/forms";
  import { Button } from "$lib/components/ui/button";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;
</script>

<form method="post" action="/auth/logout" use:enhance>
  <Button type="submit" variant="outline" size="sm">Logout</Button>
</form>
