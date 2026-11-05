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
import { post as proverkaIndeksacii } from "./posts/kak-proverit-zakryat-li-sayt-ot-indeksacii";
import { post as robotsPrimery } from "./posts/robots-txt-dlya-yandex-i-google-primery";
import { post as dobavitVebmaster } from "./posts/kak-dobavit-sayt-v-vebmaster-poshagovo";
import { post as cleanParam } from "./posts/clean-param-chto-eto-i-kak-napisat";
import { post as uvelichitIndeksaciyu } from "./posts/kak-proverit-i-uvelichit-indeksaciyu-sayta";
import { post as titleDesc } from "./posts/title-i-description-normy-dliny-primery";
import { post as wordstatIstoriya } from "./posts/wordstat-istoriya-zaprosov-sezonost";
import { post as gigachatOtvety } from "./posts/kak-popast-v-otvety-gigachat";
import { post as aeoMagazin } from "./posts/aeo-dlya-internet-magazina";
import { post as perplexityOverviews } from "./posts/perplexity-i-ai-overviews-kak-citiruyut-sayty";
import { post as konkurentyVotvetah } from "./posts/modeli-upominayut-konkurentov-chto-delat";
import { post as topvisorMegaindex } from "./posts/topvisor-ili-megaindex";
import { post as keysSoVebmaster } from "./posts/keys-so-ili-vebmaster";
import { post as insontAgentstvo } from "./posts/insont-ili-agentstvo";

export const POSTS: Post[] = [
  // Свежие материалы вперёд
  insontAgentstvo,
  keysSoVebmaster,
  topvisorMegaindex,
  konkurentyVotvetah,
  perplexityOverviews,
  aeoMagazin,
  gigachatOtvety,
  wordstatIstoriya,
  titleDesc,
  cleanParam,
  uvelichitIndeksaciyu,
  dobavitVebmaster,
  robotsPrimery,
  proverkaIndeksacii,
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

/** Соседи по кластеру для блока «Читайте дальше»: 3 связанные статьи на каждую. */
const RELATED: Record<string, string[]> = {
  "beloe-seo-chto-eto": ["kommercheskie-faktory-chek-list", "kak-ponyat-chto-filtr-yandeksa", "skolko-stoit-seo-v-2026"],
  "kommercheskie-faktory-chek-list": ["beloe-seo-chto-eto", "geozaprosy-i-regionalnoe-prodvizhenie", "mikrorazmetka-schema-org-2026"],
  "geo-protiv-seo-chto-meniaetsia-v-2026": ["kak-popast-v-otvety-gigachat", "llms-txt-zachem-i-kak", "kak-izmerit-roi-ii-vidimosti"],
  "kak-popast-v-otvety-gigachat": ["geo-protiv-seo-chto-meniaetsia-v-2026", "perplexity-i-ai-overviews-kak-citiruyut-sayty", "aeo-dlia-bankov-i-fintech"],
  "perplexity-i-ai-overviews-kak-citiruyut-sayty": ["geo-protiv-seo-chto-meniaetsia-v-2026", "modeli-upominayut-konkurentov-chto-delat", "kak-otkryt-sayt-ii-krawleram"],
  "modeli-upominayut-konkurentov-chto-delat": ["perplexity-i-ai-overviews-kak-citiruyut-sayty", "kak-izmerit-roi-ii-vidimosti", "kak-popast-v-otvety-gigachat"],
  "kak-izmerit-roi-ii-vidimosti": ["geo-protiv-seo-chto-meniaetsia-v-2026", "issledovanie-ii-vidimosti-rf", "modeli-upominayut-konkurentov-chto-delat"],
  "kak-otkryt-sayt-ii-krawleram": ["llms-txt-zachem-i-kak", "geo-protiv-seo-chto-meniaetsia-v-2026", "perplexity-i-ai-overviews-kak-citiruyut-sayty"],
  "llms-txt-zachem-i-kak": ["kak-otkryt-sayt-ii-krawleram", "geo-protiv-seo-chto-meniaetsia-v-2026", "kak-popast-v-otvety-gigachat"],
  "aeo-dlya-internet-magazina": ["geo-protiv-seo-chto-meniaetsia-v-2026", "seo-internet-magazina-2026", "kak-popast-v-otvety-gigachat"],
  "aeo-dlia-bankov-i-fintech": ["kak-popast-v-otvety-gigachat", "aeo-dlya-internet-magazina", "geo-protiv-seo-chto-meniaetsia-v-2026"],
  "ii-kontent-i-pravila-poiska": ["title-i-description-normy-dliny-primery", "beloe-seo-chto-eto", "kanibalizaciya-klyuchevyh-zaprosov"],
  "title-i-description-normy-dliny-primery": ["ii-kontent-i-pravila-poiska", "posadochnaya-stranica-anatomiya", "wordstat-instrukciya-s-chastotoy"],
  "posadochnaya-stranica-anatomiya": ["title-i-description-normy-dliny-primery", "wordstat-instrukciya-s-chastotoy", "kanibalizaciya-klyuchevyh-zaprosov"],
  "kanibalizaciya-klyuchevyh-zaprosov": ["posadochnaya-stranica-anatomiya", "wordstat-instrukciya-s-chastotoy", "seo-internet-magazina-2026"],
  "wordstat-instrukciya-s-chastotoy": ["wordstat-istoriya-zaprosov-sezonost", "posadochnaya-stranica-anatomiya", "geozaprosy-i-regionalnoe-prodvizhenie"],
  "wordstat-istoriya-zaprosov-sezonost": ["wordstat-instrukciya-s-chastotoy", "geozaprosy-i-regionalnoe-prodvizhenie", "kommercheskie-faktory-chek-list"],
  "tehnicheskiy-audit-saita-samostoyatelno": ["skorost-saita-ttfb-lcp-cls", "mikrorazmetka-schema-org-2026", "robots-txt-dlya-yandex-i-google-primery"],
  "skorost-saita-ttfb-lcp-cls": ["tehnicheskiy-audit-saita-samostoyatelno", "mobilnaya-versiya-mobile-first", "mikrorazmetka-schema-org-2026"],
  "mobilnaya-versiya-mobile-first": ["skorost-saita-ttfb-lcp-cls", "tehnicheskiy-audit-saita-samostoyatelno", "kak-proverit-i-uvelichit-indeksaciyu-sayta"],
  "mikrorazmetka-schema-org-2026": ["tehnicheskiy-audit-saita-samostoyatelno", "kommercheskie-faktory-chek-list", "robots-txt-dlya-yandex-i-google-primery"],
  "kak-dobavit-sayt-v-vebmaster-poshagovo": ["yandex-vebmaster-instrumenty", "search-console-dlya-russkogo-saita", "robots-txt-dlya-yandex-i-google-primery"],
  "yandex-vebmaster-instrumenty": ["kak-dobavit-sayt-v-vebmaster-poshagovo", "search-console-dlya-russkogo-saita", "kak-proverit-i-uvelichit-indeksaciyu-sayta"],
  "search-console-dlya-russkogo-saita": ["kak-dobavit-sayt-v-vebmaster-poshagovo", "yandex-vebmaster-instrumenty", "kak-proverit-i-uvelichit-indeksaciyu-sayta"],
  "kak-proverit-zakryat-li-sayt-ot-indeksacii": ["robots-txt-dlya-yandex-i-google-primery", "kak-proverit-i-uvelichit-indeksaciyu-sayta", "kak-otkryt-sayt-ii-krawleram"],
  "robots-txt-dlya-yandex-i-google-primery": ["clean-param-chto-eto-i-kak-napisat", "kak-proverit-zakryat-li-sayt-ot-indeksacii", "kak-dobavit-sayt-v-vebmaster-poshagovo"],
  "clean-param-chto-eto-i-kak-napisat": ["robots-txt-dlya-yandex-i-google-primery", "kak-proverit-i-uvelichit-indeksaciyu-sayta", "kak-proverit-zakryat-li-sayt-ot-indeksacii"],
  "kak-proverit-i-uvelichit-indeksaciyu-sayta": ["kak-proverit-zakryat-li-sayt-ot-indeksacii", "yandex-vebmaster-instrumenty", "search-console-dlya-russkogo-saita"],
  "skolko-stoit-seo-v-2026": ["insont-ili-agentstvo", "kak-vybrat-seo-podryadchika", "topvisor-ili-megaindex"],
  "insont-ili-agentstvo": ["skolko-stoit-seo-v-2026", "kak-vybrat-seo-podryadchika", "keys-so-ili-vebmaster"],
  "kak-vybrat-seo-podryadchika": ["insont-ili-agentstvo", "skolko-stoit-seo-v-2026", "brendovye-zaprosy-i-iks"],
  "topvisor-ili-megaindex": ["keys-so-ili-vebmaster", "skolko-stoit-seo-v-2026", "insont-ili-agentstvo"],
  "keys-so-ili-vebmaster": ["topvisor-ili-megaindex", "insont-ili-agentstvo", "skolko-stoit-seo-v-2026"],
  "kak-ponyat-chto-filtr-yandeksa": ["beloe-seo-chto-eto", "kommercheskie-faktory-chek-list", "brendovye-zaprosy-i-iks"],
  "brendovye-zaprosy-i-iks": ["kak-ponyat-chto-filtr-yandeksa", "kommercheskie-faktory-chek-list", "geozaprosy-i-regionalnoe-prodvizhenie"],
  "geozaprosy-i-regionalnoe-prodvizhenie": ["wordstat-instrukciya-s-chastotoy", "kommercheskie-faktory-chek-list", "wordstat-istoriya-zaprosov-sezonost"],
  "seo-internet-magazina-2026": ["kanibalizaciya-klyuchevyh-zaprosov", "aeo-dlya-internet-magazina", "kommercheskie-faktory-chek-list"],
  "issledovanie-ii-vidimosti-rf": ["kak-izmerit-roi-ii-vidimosti", "geo-protiv-seo-chto-meniaetsia-v-2026", "modeli-upominayut-konkurentov-chto-delat"],
};

/** До трёх связанных постов для блока «Читайте дальше». */
export function relatedPosts(slug: string): Post[] {
  return (RELATED[slug] ?? [])
    .map((s) => POSTS.find((p) => p.slug === s))
    .filter((p): p is Post => Boolean(p) && p!.slug !== slug)
    .slice(0, 3);
}

export function getPost(slug: string) {
  return POSTS.find((p) => p.slug === slug);
}
