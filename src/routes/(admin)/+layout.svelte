<script lang="ts">
  import type { LayoutData } from "./$types";

  export let data: LayoutData;
</script>

<section class="m-16">
  <div class="mx-auto flex flex-col items-center justify-center">
    <slot />
  </div>
</section>
