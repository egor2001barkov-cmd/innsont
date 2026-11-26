// Пересобирает public/llms.txt (короткую карту для ИИ) из данных сайта.
// Caddy отдаёт public/llms.txt как статический файл, поэтому файл нужно обновлять
// при каждом изменении структуры сайта — и обязательно после деплоя новых страниц.
//
// Запуск из корня репозитория:
//   node --experimental-strip-types --import ./scripts/tsalias-register.mjs scripts/gen-llms.mjs
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const { llmsShortText } = await import("../src/lib/llms-site.ts");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const text = llmsShortText();
writeFileSync(path.join(root, "public", "llms.txt"), text, "utf-8");
const STALE = /insont\.ru\/(?:seo\/(?:robots-txt|posadochnye|vebmaster|search-console|kommercheskie-faktory|tekhnicheskiy-audit|mikrorazmetka|semantika-wordstat|skolko-stoit|regionalnoe-prodvizhenie|glossariy|prodvizhenie-sayta|prodvizhenie|raskrutka-sayta)|geo\/kak-popast-v-gigachat)(?=[)/\s]|$)/g;
const links = (text.match(/\]\(https?:\/\//g) || []).length;
const stale = (text.match(STALE) || []).length;
const featured = (text.match(/\]\(https:\/\/insont\.ru\/blog\/[^)]+\)/g) || []).length;
console.log(`public/llms.txt: ${Buffer.byteLength(text, "utf8")} байт, ссылок ${links} (статей ${featured}), старых адресов ${stale}`);
if (stale) process.exitCode = 1;
