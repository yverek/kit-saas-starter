<script lang="ts">
  import { Header, Hero, Footer } from "$components/layout/landing-page";

  let { data } = $props();
</script>

<Header user={data.user} />

<Hero />

<Footer />
