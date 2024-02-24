<script lang="ts">
  import { Header, Hero } from "$components/layout";

  let { data } = $props();
</script>

<Header user={data.user} />

<Hero />
