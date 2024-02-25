<script lang="ts">
  import { Features, Footer, Header, Hero } from "$components/layout/landing-page";

  let { data } = $props();
</script>

<div class="container">
  <Header user={data.user} />
  <Hero />
  <hr class="border-gray-200 dark:border-gray-800" />
  <Features />
  <Footer />
</div>
