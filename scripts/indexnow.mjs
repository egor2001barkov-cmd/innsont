#!/usr/bin/env node
/**
 * Отправка URL в IndexNow (общий эндпоинт: Bing, Yandex, Seznam, Naver).
 *
 *   node scripts/indexnow.mjs                    # весь sitemap
 *   node scripts/indexnow.mjs --dry-run          # показать, что уйдёт
 *   node scripts/indexnow.mjs --limit 20         # первые 20 URL
 *   node scripts/indexnow.mjs --url https://insont.ru/blog/ctr-snipeta-uvelichit-kliki
 *
 * Ключ не дублируется в скрипте: берём его из единственного источника —
 * файла public/<key>.txt (имя файла = ключ, так требует протокол).
 */
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR = join(ROOT, "public");
const SITE = "https://insont.ru";
const ENDPOINT = "https://api.indexnow.org/indexnow";
const MAX_URLS = 10_000;

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

function readKey() {
  // ключ — hex-имя файла в public, содержимое повторяет имя
  const candidates = readdirSync(PUBLIC_DIR).filter((f) => /^[a-f0-9]{8,128}\.txt$/.test(f));
  if (candidates.length !== 1) {
    fail(`в public/ должен быть ровно один <key>.txt, найдено: ${candidates.length}`);
  }
  const key = candidates[0].replace(/\.txt$/, "");
  const inside = readFileSync(join(PUBLIC_DIR, candidates[0]), "utf8").trim();
  if (inside !== key) {
    fail(`содержимое ${candidates[0]} не совпадает с именем файла`);
  }
  return key;
}

function parseArgs(argv) {
  const opts = { dryRun: false, limit: Infinity, urls: [], sitemap: `${SITE}/sitemap.xml` };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--dry-run") opts.dryRun = true;
    else if (arg === "--limit") opts.limit = Number(argv[++i]);
    else if (arg === "--url") opts.urls.push(argv[++i]);
    else if (arg === "--sitemap") opts.sitemap = argv[++i];
    else if (arg === "--help" || arg === "-h") {
      console.log(readFileSync(fileURLToPath(import.meta.url), "utf8").split("*/")[0]);
      process.exit(0);
    } else fail(`неизвестный аргумент: ${arg}`);
  }
  if (!Number.isFinite(opts.limit) || opts.limit <= 0) opts.limit = Infinity;
  return opts;
}

async function sitemapUrls(sitemapUrl) {
  const res = await fetch(sitemapUrl);
  if (!res.ok) fail(`sitemap ${sitemapUrl} → ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

const opts = parseArgs(process.argv.slice(2));
const key = readKey();
const keyLocation = `${SITE}/${key}.txt`;

let urls = opts.urls.length > 0 ? opts.urls : await sitemapUrls(opts.sitemap);
urls = [...new Set(urls)].filter((u) => u === SITE || u.startsWith(`${SITE}/`));
urls = urls.slice(0, Math.min(opts.limit, MAX_URLS));

if (urls.length === 0) fail("нечего отправлять: список URL пуст");

console.log(`IndexNow: ${urls.length} URL → ${ENDPOINT}`);
console.log(`Ключ: ${keyLocation}`);

if (opts.dryRun) {
  console.log("— dry-run, запрос не отправлен. Первые URL:");
  for (const u of urls.slice(0, 10)) console.log(`  ${u}`);
  if (urls.length > 10) console.log(`  … ещё ${urls.length - 10}`);
  process.exit(0);
}

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(SITE).host, key, keyLocation, urlList: urls }),
});

const body = (await res.text()).catch(() => "");
console.log(`Ответ: HTTP ${res.status}${body ? ` — ${body.trim().slice(0, 300)}` : ""}`);

// 200 — принято, 202 — принято, ключ проверяется асинхронно
if (res.status !== 200 && res.status !== 202) {
  console.error("✗ IndexNow не принял отправку (400 — неверный ключ, 422 — чужой host, 429 — лимит)");
  process.exit(1);
}
console.log("✓ принято: Bing и Yandex получили сигнал о переобходе");
