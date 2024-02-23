<script lang="ts">
  import "../app.pcss";
  import { ModeWatcher } from "mode-watcher";
  import type { LayoutData } from "./$types";
  import { Toaster } from "$lib/components/ui/sonner";

  export let data: LayoutData;
</script>

<ModeWatcher />
<Toaster richColors closeButton position={"top-center"} />

<slot />
