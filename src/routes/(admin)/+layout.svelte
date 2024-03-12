<script lang="ts">
  let { children } = $props();
</script>

<section class="m-16">
  <div class="mx-auto flex flex-col items-center justify-center">
    {@render children()}
  </div>
</section>
