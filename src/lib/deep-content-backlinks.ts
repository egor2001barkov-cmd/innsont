import type { DeepExtra } from "./deep-content-cities";

export const BACKLINKS_DEEP: Record<string, DeepExtra> = {
  "/seo/vs-topvisor": {
    related: [
      { href: "/seo/vs-serpstat", title: "INSONT и Serpstat" },
      { href: "/seo/vs-se-ranking", title: "INSONT и SE Ranking" },
    ],
  },
  "/seo/vs-megaindex": {
    related: [{ href: "/seo/vs-serpstat", title: "INSONT и Serpstat" }],
  },
  "/seo/vs-keys-so": {
    related: [{ href: "/seo/vs-se-ranking", title: "INSONT и SE Ranking" }],
  },
  "/resheniya/kliniki": {
    related: [{ href: "/resheniya/kliniki-kazan", title: "Клиники в Казани" }],
  },
  "/resheniya/stomatologii": {
    related: [{ href: "/resheniya/stomatologii-moskva", title: "Стоматологии в Москве" }],
  },
  "/seo/kazan": {
    related: [{ href: "/resheniya/kliniki-kazan", title: "Клиники в Казани" }],
  },
  "/seo/moskva": {
    related: [{ href: "/resheniya/stomatologii-moskva", title: "Стоматологии в Москве" }],
  },
};
