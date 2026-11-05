#!/usr/bin/env node
// Генерирует src/lib/route-manifest.ts — тощий список всех существующих
// путей сайта (статические страницы + слаги динамических сегментов).
// Источники: дерево src/app/**/page.tsx + литералы path:/slug: в lib-файлах.
// Запуск: node scripts/gen-route-manifest.mjs [--stdout]
// После добавления/удаления страниц или статей — перегенерировать и закоммитить.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const APP = join(ROOT, "src/app");
const onlyStdout = process.argv.includes("--stdout");

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) {
      // динамические сегменты разрешаются источниками слагов ниже
      if (/^\[.*\]$/.test(name)) continue;
      walk(p, out);
    } else if (name === "page.tsx") {
      const rel = relative(APP, dir);
      out.push("/" + rel.split("/").join("/"));
    }
  }
  return out;
}

const paths = new Set(walk(APP));

// слаги статей блога
const postsDir = join(ROOT, "src/lib/posts");
for (const f of readdirSync(postsDir)) {
  if (!f.endsWith(".ts")) continue;
  const m = readFileSync(join(postsDir, f), "utf-8").match(/^\s*slug:\s*"([^"]+)"/m);
  if (m) paths.add("/blog/" + m[1]);
}
// статья-исследование живёт литералом в blog.ts
const blogTs = readFileSync(join(ROOT, "src/lib/blog.ts"), "utf-8");
for (const m of blogTs.matchAll(/^\s*slug:\s*"([^"]+)"/gm)) paths.add("/blog/" + m[1]);

// кейсы: /keysy/<slug>
const casesTs = readFileSync(join(ROOT, "src/lib/cases.ts"), "utf-8");
for (const m of casesTs.matchAll(/^\s*slug:\s*"([^"]+)"/gm)) paths.add("/keysy/" + m[1]);

// features + solutions + длинные страницы: литералы path: "..."
for (const lib of ["features.ts", "geo-pages.ts"]) {
  const src = readFileSync(join(ROOT, "src/lib", lib), "utf-8");
  for (const m of src.matchAll(/path:\s*"([^"]+)"/g)) paths.add(m[1]);
}

const sorted = [...paths].filter((p) => p && p !== "/").sort();
const body = `// АВТОГЕНЕРАТ: node scripts/gen-route-manifest.mjs — не редактировать руками.
// Полный список существующих путей (статические страницы + слаги динамики).
// Используется middleware для решения: слэш-URL → 308 (путь есть) или сразу 404 (пути нет).
export const KNOWN_PATHS = new Set<string>([
${sorted.map((p) => `  "${p}",`).join("\n")}
]);
`;

if (onlyStdout) {
  process.stdout.write(body);
} else {
  const { writeFileSync } = await import("node:fs");
  writeFileSync(join(ROOT, "src/lib/route-manifest.ts"), body, "utf-8");
  console.log("src/lib/route-manifest.ts: " + sorted.length + " путей");
}
