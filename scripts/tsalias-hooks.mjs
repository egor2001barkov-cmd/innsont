// Хук загрузчика модулей для запуска TS-модулей сайта обычным node (без сборки Next):
// подставляет alias «@/…» → src/… и добавляет расширение .ts/.tsx у относительных импортов.
// Используется скриптами генерации (public/llms.txt) — см. scripts/tsalias-register.mjs.
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "src");
const EXTS = ["", ".ts", ".tsx", "/index.ts"];

function firstExisting(base) {
  for (const ext of EXTS) {
    if (existsSync(base + ext)) return base + ext;
  }
  return null;
}

export async function resolve(specifier, context, nextResolve) {
  let base = null;
  if (specifier.startsWith("@/")) {
    base = firstExisting(path.join(SRC, specifier.slice(2)));
  } else if (specifier.startsWith("./") || specifier.startsWith("../")) {
    if (context.parentURL && !path.extname(specifier)) {
      base = firstExisting(path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier));
    }
  }
  if (base) return { url: pathToFileURL(base).href, shortCircuit: true };
  return nextResolve(specifier, context);
}
