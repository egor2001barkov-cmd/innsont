// Регистрирует хук разрешения модулей (alias «@/…» и расширения .ts) для текущего процесса node.
// Запуск: node --experimental-strip-types --import ./scripts/tsalias-register.mjs <скрипт>
import { register } from "node:module";
import { pathToFileURL } from "node:url";

register(pathToFileURL(new URL("./tsalias-hooks.mjs", import.meta.url).pathname).href);
