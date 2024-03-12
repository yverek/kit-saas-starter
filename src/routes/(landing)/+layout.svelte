<script lang="ts">
  import { Footer, Header } from "$components/layout/landing-page";
  let { data, children } = $props();
</script>

<div class="container">
  <Header user={data.user} />
  {@render children()}
  <Footer />
</div>
