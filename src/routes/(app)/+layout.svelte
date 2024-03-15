<script lang="ts">
  import { Button } from "$components/ui/button";
  import { APP_NAME } from "$configs/general";
  import { route } from "$lib/ROUTES";
  import Sun from "lucide-svelte/icons/sun";
  import Moon from "lucide-svelte/icons/moon";
  import { toggleMode } from "mode-watcher";
  import { enhance } from "$app/forms";
  import * as Avatar from "$lib/components/ui/avatar";
  import type { Snippet } from "svelte";
  import type { User } from "lucia";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { CircleUser, CreditCard, Lock, LogOut, Settings } from "lucide-svelte";
  import { Input } from "$lib/components/ui/input";

  type Props = {
    children: Snippet;
    data: {
      user: User;
    };
  };

  let { children, data }: Props = $props();

  let initials = $state("");

  $effect(() => {
    initials = data.user.name
      .split(" ")
      .map((word) => word[0].toUpperCase())
      .join("");
  });
</script>

<nav class="mx-6 my-3 flex justify-between">
  <a href={route("/app/dashboard")} class="flex items-center gap-3">
    <img src="/logo.png" class="size-9" alt={`${APP_NAME} Logo`} />
    <span class="hidden text-xl font-bold text-black dark:text-white sm:block">{APP_NAME}</span>
  </a>
  <div class="flex gap-2">
    <Input type="search" placeholder="Search..." class="h-10 md:w-[100px] lg:w-[300px]" />

    <Button on:click={toggleMode} variant="outline" size="icon">
      <Sun color="black" class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon color="white" class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span class="sr-only">Toggle theme</span>
    </Button>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild let:builder>
        <Button variant="ghost" builders={[builder]} class="relative size-10 rounded-full">
          <Avatar.Root class="size-10">
            <Avatar.Image src={data.user.avatarUrl} alt={`${data.user.name} avatar`} />
            <Avatar.Fallback>
              {initials}
            </Avatar.Fallback>
          </Avatar.Root>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content class="w-56" align="end">
        <DropdownMenu.Label class="font-normal">
          <div class="flex flex-col space-y-1">
            <p class="text-sm font-medium leading-none">{data.user.name}</p>
            <p class="text-xs leading-none text-muted-foreground">{data.user.email}</p>
          </div>
        </DropdownMenu.Label>
        <DropdownMenu.Separator />
        <DropdownMenu.Group>
          <DropdownMenu.Item>
            <Button variant="ghost" class="h-6 w-full justify-start p-0" href={route("/app/profile")}>
              <CircleUser class="mr-1 size-5" />
              Profile
            </Button>
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            <Button variant="ghost" class="h-6 w-full justify-start p-0" href={route("/app/billing")}>
              <CreditCard class="mr-1 size-5" />
              Billing
            </Button>
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            <Button variant="ghost" class="h-6 w-full justify-start p-0" href={route("/app/settings")}>
              <Settings class="mr-1 size-5" />
              Settings
            </Button>
          </DropdownMenu.Item>
          {#if data.user.isAdmin}
            <DropdownMenu.Item>
              <Button variant="ghost" class="h-6 w-full justify-start p-0" href={route("/admin")}>
                <Lock class="mr-1 size-5" />
                Admin
              </Button>
            </DropdownMenu.Item>
          {/if}
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>
          <LogOut class="mr-1 size-5" />
          <form method="post" action="/auth/logout" class="w-full" use:enhance>
            <Button type="submit" variant="ghost" class="h-6 w-full justify-start p-0">Logout</Button>
          </form>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
</nav>

<section>
  {@render children()}
</section>
