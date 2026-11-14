#!/usr/bin/env node
/**
 * Аудит внутренней перелинковки INSONT по исходникам (без сборки).
 *
 * Считает контекстные ссылки из тел статей блога (markdown [текст](/url)) и
 * строит граф: кто на кого ссылается, какие индексируемые страницы не получают
 * ни одной входящей ссылки из текста.
 *
 *   node scripts/internal-links-audit.mjs               # сводка
 *   node scripts/internal-links-audit.mjs --json out.json
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const POSTS_DIR = join(ROOT, "src/lib/posts");
const MANIFEST = join(ROOT, "src/lib/route-manifest.ts");

const args = process.argv.slice(2);
const jsonFlag = args.indexOf("--json");
const jsonOut = jsonFlag >= 0 ? args[jsonFlag + 1] : null;

function normalize(url) {
  let u = url.trim().replace(/^https?:\/\/insont\.ru/, "");
  u = u.split("#")[0].split("?")[0];
  if (u.length > 1) u = u.replace(/\/+$/, "");
  return u || "/";
}

function postBody(src) {
  const m = /body:\s*`/.exec(src);
  if (!m) return null;
  let i = m.index + m[0].length;
  const start = i;
  while (i < src.length) {
    if (src[i] === "`" && src[i - 1] !== "\\") return src.slice(start, i);
    i += 1;
  }
  return null;
}

const posts = [];
for (const file of readdirSync(POSTS_DIR).filter((f) => f.endsWith(".ts"))) {
  const src = readFileSync(join(POSTS_DIR, file), "utf8");
  const slug = (/slug:\s*"([^"]+)"/.exec(src) || [])[1] || file.replace(/\.ts$/, "");
  const title = (/title:\s*"([^"]+)"/.exec(src) || [])[1] || slug;
  const body = postBody(src);
  posts.push({ slug, title, file, route: `/blog/${slug}`, body: body ?? "", hasBody: Boolean(body) });
}

const links = [];
for (const post of posts) {
  const body = post.body;
  for (const m of body.matchAll(/\[([^\]]+)\]\((\/[^)\s]+)\)/g)) {
    if (m.index > 0 && body[m.index - 1] === "!") continue; // картинка
    links.push({ from: post.route, to: normalize(m[2]), anchor: m[1] });
  }
  for (const m of body.matchAll(/<a[^>]+href="(\/[^"]+)"/g)) {
    links.push({ from: post.route, to: normalize(m[1]), anchor: "" });
  }
}

const known = new Set(
  [...readFileSync(MANIFEST, "utf8").matchAll(/"(\/[^"]*)"/g)].map((m) => normalize(m[1])),
);
for (const post of posts) known.add(post.route);

const incoming = new Map();
const outgoing = new Map();
for (const link of links) {
  if (!known.has(link.to)) continue;
  if (!incoming.has(link.to)) incoming.set(link.to, []);
  incoming.get(link.to).push(link);
  outgoing.set(link.from, (outgoing.get(link.from) || 0) + 1);
}

const anchors = new Map();
for (const link of links) {
  const key = link.anchor.toLowerCase();
  if (!key) continue;
  anchors.set(key, (anchors.get(key) || 0) + 1);
}

const routes = [...known].sort();
const orphans = routes.filter((r) => !incoming.has(r));
const oneIncoming = routes.filter((r) => (incoming.get(r) || []).length === 1);
const postsWithoutCommercial = posts.filter((p) => {
  const outs = links.filter((l) => l.from === p.route).map((l) => l.to);
  return !outs.some((u) => u === "/tseny" || u === "/platforma" || u.startsWith("/instrumenty") || u === "/seo" || u === "/geo");
});

const summary = {
  posts: posts.length,
  postsWithoutBody: posts.filter((p) => !p.hasBody).map((p) => p.slug),
  contextualLinks: links.length,
  knownRoutes: routes.length,
  orphans: orphans.length,
  oneIncoming: oneIncoming.length,
  postsWithoutCommercialPath: postsWithoutCommercial.map((p) => p.route),
  topAnchors: [...anchors.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15),
  incomingByRoute: Object.fromEntries([...incoming.entries()].map(([k, v]) => [k, v.length])),
  orphanList: orphans,
  oneIncomingList: oneIncoming,
};

if (jsonOut) writeFileSync(jsonOut, JSON.stringify({ summary, links, posts: posts.map(({ body, ...p }) => p) }, null, 2));

console.log(`Статей: ${summary.posts} (без body: ${summary.postsWithoutBody.length})`);
console.log(`Контекстных ссылок: ${summary.contextualLinks}`);
console.log(`Маршрутов в манифесте: ${summary.knownRoutes}`);
console.log(`Сирот (0 входящих): ${summary.orphans}`);
console.log(`С одной входящей: ${summary.oneIncoming}`);
console.log(`Статей без коммерческого выхода: ${summary.postsWithoutCommercialPath.length}`);
console.log("\nТоп анкоров:");
for (const [a, c] of summary.topAnchors) console.log(`  ${c}× ${a}`);
console.log("\nСироты:");
for (const r of orphans.slice(0, 40)) console.log(`  ${r}`);
if (orphans.length > 40) console.log(`  … ещё ${orphans.length - 40}`);
console.log("\nБез коммерческого выхода:");
for (const r of summary.postsWithoutCommercialPath) console.log(`  ${r}`);
