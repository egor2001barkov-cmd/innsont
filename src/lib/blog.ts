export type Post = {
  slug: string;
  title: string;
  /** SERP title without « | INSONT». Keep ≤ 50 chars. */
  metaTitle?: string;
  description: string;
  date: string;
  author: string;
  tag: string;
  read: string;
  excerpt: string;
  /** Уникальная обложка (SVG в /public/blog). */
  cover?: string;
  /** Markdown: заголовки ##, таблицы, списки, абзацы. */
  body: string;
};

import { post as beloeSeo } from "./posts/beloe-seo-chto-eto";
import { post as filtrYandeksa } from "./posts/kak-ponyat-chto-filtr-yandeksa";
import { post as kommercheskieFaktory } from "./posts/kommercheskie-faktory-chek-list";
import { post as geoProtivSeo } from "./posts/geo-protiv-seo-chto-meniaetsia-v-2026";
import { post as iiKrawleram } from "./posts/kak-otkryt-sayt-ii-krawleram";
import { post as aeoBankov } from "./posts/aeo-dlia-bankov-i-fintech";
import { post as roiIiVidimosti } from "./posts/kak-izmerit-roi-ii-vidimosti";
import { post as llmsTxt } from "./posts/llms-txt-zachem-i-kak";
import { post as skolkoStoit } from "./posts/skolko-stoit-seo-v-2026";
import { post as wordstatInstr } from "./posts/wordstat-instrukciya-s-chastotoy";
import { post as tehaudit } from "./posts/tehnicheskiy-audit-saita-samostoyatelno";
import { post as skorost } from "./posts/skorost-saita-ttfb-lcp-cls";
import { post as mobilnaya } from "./posts/mobilnaya-versiya-mobile-first";
import { post as mikrorazmetka } from "./posts/mikrorazmetka-schema-org-2026";
import { post as kanibalizaciya } from "./posts/kanibalizaciya-klyuchevyh-zaprosov";
import { post as vebmaster } from "./posts/yandex-vebmaster-instrumenty";
import { post as searchConsole } from "./posts/search-console-dlya-russkogo-saita";
import { post as geozaprosy } from "./posts/geozaprosy-i-regionalnoe-prodvizhenie";
import { post as posadochnaya } from "./posts/posadochnaya-stranica-anatomiya";
import { post as iiKontent } from "./posts/ii-kontent-i-pravila-poiska";
import { post as seoEcom } from "./posts/seo-internet-magazina-2026";
import { post as brendovyeIks } from "./posts/brendovye-zaprosy-i-iks";
import { post as vyborPodryadchika } from "./posts/kak-vybrat-seo-podryadchika";

export const POSTS: Post[] = [
  // Свежие материалы вперёд
  vyborPodryadchika,
  brendovyeIks,
  seoEcom,
  iiKontent,
  posadochnaya,
  geozaprosy,
  searchConsole,
  vebmaster,
  kanibalizaciya,
  mikrorazmetka,
  mobilnaya,
  skorost,
  tehaudit,
  wordstatInstr,
  skolkoStoit,
  llmsTxt,
  roiIiVidimosti,
  aeoBankov,
  iiKrawleram,
  geoProtivSeo,
  kommercheskieFaktory,
  filtrYandeksa,
  beloeSeo,
  {
    // Исследование живёт на собственной странице /blog/issledovanie-ii-vidimosti-rf
    slug: "issledovanie-ii-vidimosti-rf",
    title: "Что растит видимость в нейросетях в России — и что нет",
    metaTitle: "Что растит ИИ-видимость в России",
    description:
      "1 240 коммерческих сайтов РФ, март–июнь 2026. Доля цитирования коррелирует с ростом в GigaChat и ChatGPT на 0,38. Тональность почти не связана.",
    date: "2026-08-13",
    author: "Мария Левина",
    tag: "Исследование",
    read: "14 мин",
    excerpt:
      "Растут не те, о ком модель говорит теплее. Растут те, чей домен чаще стоит в источниках. В Яндексе рядом едет витрина: цены, регион, дата.",
    cover: undefined,
    body: "",
  },
];

export function getPost(slug: string) {
  return POSTS.find((p) => p.slug === slug);
}
