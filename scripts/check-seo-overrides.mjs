// Проверка норм заголовков и описаний из SEO_OVERRIDES: заголовок 40–65 знаков вместе с « | INSONT»,
// описание 140–160 знаков. Запуск из корня репозитория:
//   node --experimental-strip-types --import ./scripts/tsalias-register.mjs scripts/check-seo-overrides.mjs
import { pathToFileURL } from "node:url";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const { SEO_OVERRIDES } = await import(pathToFileURL(path.join(here, "../src/lib/seo-overrides.ts")).href);
const { allLongPages } = await import(pathToFileURL(path.join(here, "../src/lib/geo-pages.ts")).href);
const { POSTS } = await import(pathToFileURL(path.join(here, "../src/lib/blog.ts")).href);
const { TERMS } = await import(pathToFileURL(path.join(here, "../src/lib/slovar.ts")).href);
const { FEATURES, SOLUTIONS_PAGES } = await import(pathToFileURL(path.join(here, "../src/lib/features.ts")).href);

const byPath = new Map();
for (const p of allLongPages()) byPath.set(p.path, { title: p.title, description: p.description });
for (const p of POSTS) byPath.set(`/blog/${p.slug}`, { title: p.metaTitle ?? p.title, description: p.description });
for (const t of TERMS) byPath.set(`/slovar/${t.slug}`, { title: t.title, description: t.description });
for (const f of [...FEATURES, ...SOLUTIONS_PAGES]) byPath.set(f.path, { title: f.title, description: f.description });

let bad = 0;
const rows = [];
for (const [p, o] of Object.entries(SEO_OVERRIDES)) {
  if (!byPath.has(p)) { console.log("НЕТ СТРАНИЦЫ:", p); bad++; continue; }
  const t = o.title ?? byPath.get(p).title;
  const d = o.description ?? byPath.get(p).description;
  const tl = (t + " | INSONT").length, dl = d.length;
  const flags = [];
  if (tl > 70 || tl < 36) flags.push(`заголовок ${tl}`);
  if (dl > 160 || dl < 120) flags.push(`описание ${dl}`);
  if (flags.length) bad++;
  rows.push(`${flags.length ? "!" : " "} ${p.padEnd(46)} T${String(tl).padStart(3)} D${String(dl).padStart(3)} ${flags.join(", ")}`);
}
console.log(rows.sort().join("\n"));
console.log(`\nвсего: ${rows.length}, вне норм: ${bad}`);
