<script lang="ts">
  import "../app.pcss";
  import { ModeWatcher } from "mode-watcher";
  import { Toaster } from "$lib/components/ui/sonner";
  import { getFlash } from "sveltekit-flash-message";
  import { page } from "$app/stores";
  import { toast } from "svelte-sonner";
  import { setupViewTransition } from "sveltekit-view-transition";

  setupViewTransition();

  let { children } = $props();

  const flash = getFlash(page);

  // TODO This cause a bug because of Svelte 5
  // more info https://github.com/wobsoriano/svelte-sonner/issues/38
  $effect(() => {
    if (!$flash) return;

    const { status, text } = $flash;

    switch (status) {
      case "success":
        toast.success(text);
        break;
      case "warning":
        toast.warning(text);
        break;
      case "error":
        toast.error(text);
        break;
    }
  });
</script>

<ModeWatcher />
<Toaster richColors closeButton position={"top-center"} />

{@render children()}
