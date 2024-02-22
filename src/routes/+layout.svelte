<script lang="ts">
  import "../app.pcss";
  import { ModeWatcher } from "mode-watcher";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;
</script>

<ModeWatcher />
<slot />
