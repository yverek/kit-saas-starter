<script lang="ts">
  import "../app.pcss";
  import { ModeWatcher } from "mode-watcher";
  import { Toaster } from "$lib/components/ui/sonner";
  import { getFlash } from "sveltekit-flash-message";
  import { page } from "$app/stores";
  // import { toast } from "svelte-sonner";

  // let { data } = $props();

  // const flash = getFlash(page);

  // TODO commented because of a bug in Svelte 5
  // ! more info https://github.com/wobsoriano/svelte-sonner/issues/38
  // $effect(() => {
  //   if (!$flash) return;

  //   const { status, text } = $flash;

  //   switch (status) {
  //     case "success":
  //       toast.success(text);
  //     case "warning":
  //       toast.warning(text);
  //     case "error":
  //       toast.error(text);
  //   }
  // });
</script>

<ModeWatcher />
<Toaster richColors closeButton position={"top-center"} />

<slot />
