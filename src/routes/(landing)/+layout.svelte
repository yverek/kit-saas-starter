<script lang="ts">
  import { Footer, Header } from "$components/layout/landing-page";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;
</script>

<div class="container">
  <Header user={data.user} />
  <slot />
  <Footer />
</div>
