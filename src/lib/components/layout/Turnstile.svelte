<script lang="ts">
  import { Turnstile } from "svelte-turnstile";
  import { PUBLIC_CLOUDFLARE_TURNSTILE_KEY } from "$env/static/public";

  let { action } = $props<{ action: string }>();

  const siteKey = PUBLIC_CLOUDFLARE_TURNSTILE_KEY;
  const formsField = "turnstileToken";
  const appearance = "interaction-only";
</script>

<Turnstile {siteKey} {formsField} {action} {appearance} />
