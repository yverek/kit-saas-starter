<script lang="ts">
  import { Turnstile } from "svelte-turnstile";
  import { PUBLIC_CLOUDFLARE_TURNSTILE_KEY } from "$env/static/public";

  const formsField = "turnstileToken";
  const siteKey = PUBLIC_CLOUDFLARE_TURNSTILE_KEY;
</script>

<Turnstile {siteKey} {formsField} />
