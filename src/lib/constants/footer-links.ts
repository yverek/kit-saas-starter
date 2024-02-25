import { Facebook, GitHub, Instagram, TikTok, Twitter, Discord } from "$components/icons";
import { route } from "$lib/ROUTES";

export const footerLinks = [
  {
    href: route("facebook"),
    component: Facebook
  },
  {
    href: route("instagram"),
    component: Instagram
  },
  {
    href: route("twitter"),
    component: Twitter
  },
  {
    href: route("github"),
    component: GitHub
  },
  {
    href: route("tiktok"),
    component: TikTok
  },
  {
    href: route("discord"),
    component: Discord
  }
];
