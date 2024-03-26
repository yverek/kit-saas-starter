<script lang="ts">
  import { ParaglideJS } from "@inlang/paraglide-js-adapter-sveltekit";
  import { i18n } from "$lib/i18n";
  import { Footer, Header } from "$components/layout/landing-page";

  let { data, children } = $props();
</script>

<ParaglideJS {i18n}>
  <div class="container">
    <Header user={data.user} />
    {@render children()}
    <Footer />
  </div>
</ParaglideJS>
