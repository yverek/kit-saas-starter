import { Facebook, GitHub, Instagram, TikTok, Twitter, Discord } from "$components/icons";
import { route } from "$lib/ROUTES";

export const legals = [
  {
    name: "Privacy Policy",
    href: "#"
  },
  {
    name: "Terms & Conditions",
    href: "#"
  },
  {
    name: "Cookie Policy",
    href: "#"
  }
];

export const socials = [
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
