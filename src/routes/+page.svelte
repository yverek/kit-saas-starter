<script lang="ts">
  import { Header, Hero } from "$components/layout/landing-page";

  let { data } = $props();
</script>

<Header user={data.user} />

<Hero />
