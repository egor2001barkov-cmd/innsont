/**
 * Очеловечиватель: находит ИИ-паттерны (методика humanizer) и предлагает правки.
 * Паттерны — по скиллу humanizer (§1–§22, русская адаптация).
 */

export type Severity = "высокая" | "средняя" | "низкая";
export type Hit = { fragment: string; index: number };
export type PatternResult = { id: string; section: string; name: string; severity: Severity; hits: Hit[] };
export type Report = {
  score: number;
  totalPatterns: number;
  totalHits: number;
  patterns: PatternResult[];
  cleanedText: string;
  autoRemoved: number;
};

type Rule = {
  id: string;
  section: string;
  name: string;
  severity: Severity;
  source: string;
  flags: string;
  replacement?: string;
};

const RULES: Rule[] = [
  { id: "moral", section: "§2", name: "«Мораль:» / «Вывод один:»", severity: "высокая",
    source: "Мораль[:\\s]|Вывод один[:\\s]|Запомните одно[:\\s]", flags: "g", replacement: "" },
  { id: "davaite", section: "§4", name: "«Давайте разберём»", severity: "высокая",
    source: "[Дд]авайте\\s+(?:разбер|погруз|начн|перейд|посмотр)\\s*", flags: "g", replacement: "" },
  { id: "otmetit", section: "§4", name: "«стоит отметить» / «важно отметить»", severity: "высокая",
    source: "[Сс]тоит отметить,?\\s*|[Вв]ажно отметить,?\\s*|[Пп]одчеркн[её]м, что\\s*", flags: "g", replacement: "" },
  { id: "ne-sekret", section: "§4", name: "«не секрет» / «честно говоря»", severity: "средняя",
    source: "не секрет, что\\s*|честно говоря,?\\s*", flags: "gi", replacement: "" },
  { id: "modern-world", section: "§13", name: "«в современном мире»", severity: "высокая",
    source: "в современном мире\\s*", flags: "gi", replacement: "" },
  { id: "chat-tail", section: "§22", name: "Чат-хвосты", severity: "высокая",
    source: "Надеюсь, этот (?:материал|текст|гайд)[^.]*\\.", flags: "gi", replacement: "" },
  { id: "cliche-end", section: "§2", name: "«В заключение» / «Подводя итог»", severity: "средняя",
    source: "В заключение[,\\s]*|Подводя итог[,\\s]*|Резюмируя[,\\s]*", flags: "g", replacement: "" },
  { id: "simple-words", section: "§2", name: "«Простыми словами —»", severity: "средняя",
    source: "Простыми словами[—:]\\s*", flags: "gi", replacement: "" },
  { id: "why-closer", section: "§2", name: "«и вот почему:» / «Вот почему»", severity: "средняя",
    source: "и вот почему[:\\s]|Вот почему[,:]\\s*", flags: "gi", replacement: "" },
  { id: "predstavte", section: "§4", name: "«Представьте»", severity: "средняя",
    source: "^Представьте\\s+[^.]*\\.", flags: "gim", replacement: "" },
  { id: "key-role", section: "§12", name: "«играет ключевую роль»", severity: "средняя",
    source: "играет ключевую роль|играет ключевую|ключевую роль", flags: "gi" },
  { id: "svidetelstvuet", section: "§12", name: "«свидетельствует» / «демонстрирует»", severity: "низкая",
    source: "свидетельствует о|демонстрирует|подчёркивает", flags: "gi" },
  { id: "sales", section: "§16", name: "«надёжный партнёр» / «идеальное решение»", severity: "средняя",
    source: "надёжный партн[её]р|идеальное решение|уникальное решение", flags: "gi" },
  { id: "innov", section: "§12", name: "«инновационный» / «прорывной»", severity: "средняя",
    source: "инновационн|прорывн", flags: "gi" },
  { id: "proryv", section: "§13", name: "«настоящий прорыв» / «новый уровень»", severity: "средняя",
    source: "настоящий прорыв|новый уровень|кардинально меняет", flags: "gi" },
  { id: "not-x-y", section: "§1", name: "«не просто X — это Y»", severity: "высокая",
    source: "не\\s+(?:просто|только)[^.!?]{0,80}[—,]\\s*это", flags: "gi" },
  { id: "split-contrast", section: "§1", name: "«Это не X. Это Y.»", severity: "высокая",
    source: "(?:^|\\. )Это не [^.]{5,60}\\.\\s*Это [^.]{5,60}\\.", flags: "g" },
  { id: "triad", section: "§6", name: "Триады-перечисления", severity: "низкая",
    source: "(?:эффективность|качество|над[её]жность|гибкость)[,\\s]+(?:и|плюс)\\s+(?:эффективность|качество|над[её]жность|гибкость)", flags: "gi" },

  // Расширенный набор: проверен проходами по 1000+ текстов (kaywoon/luwam/odyzon, октябрь–ноябрь 2026).
  // Формулировки фразовые (не голые стемы), чтобы не калечить спецификации и факты.
  { id: "ne-prosto-a", section: "§1", name: "«не просто X, а/но Y» (полный контраст)", severity: "высокая",
    source: "не\\s+(?:просто|только)\\s+[^,.;!?]{2,60}\\s*(?:&nbsp;)?[—,]?\\s*(?:а|но)\\s+", flags: "gi" },
  { id: "idealno-podhodit", section: "§16", name: "«идеально подходит»", severity: "средняя",
    source: "идеальн\\w*\\s+подход", flags: "gi", replacement: "хорошо подходит" },
  { id: "idealnoe-reshenie", section: "§16", name: "«идеальное решение/выбор/вариант»", severity: "средняя",
    source: "идеальн(?:ое|ый|ая)\\s+(?:решение|выбор|вариант)", flags: "gi", replacement: "подходящее решение" },
  { id: "unikaln", section: "§16", name: "«уникальный + штамп-существительное»", severity: "средняя",
    source: "уникальн(?:ый|ая|ое|ые)\\s+(?:возможность|возможности|опыт|предложение|продукт|решение|технология|подход)", flags: "gi" },
  { id: "shirokiy-spektr", section: "§16", name: "«широкий спектр»", severity: "средняя",
    source: "широк\\w+\\s+спектр", flags: "gi", replacement: "широкий выбор" },
  { id: "bezgranichn", section: "§16", name: "«безграничные возможности»", severity: "средняя",
    source: "безграничн\\w+", flags: "gi" },
  { id: "neprevzoydenn", section: "§16", name: "«непревзойдённый»", severity: "средняя",
    source: "непревзойд[её]нн\\w*", flags: "gi", replacement: "отличный" },
  { id: "nezamenim", section: "§16", name: "«незаменимый»", severity: "средняя",
    source: "незаменим\\w*", flags: "gi", replacement: "полезный" },
  { id: "vysokokachestv", section: "§16", name: "«высококачественный»", severity: "средняя",
    source: "высококачественн\\w*", flags: "gi", replacement: "качественный" },
  { id: "peredovye", section: "§12", name: "«передовые технологии»", severity: "средняя",
    source: "передов\\w+\\s+(?:технолог|решени|разработк)", flags: "gi", replacement: "современные технологии" },
  { id: "kriticheski-vazhno", section: "§12", name: "«критически важно»", severity: "средняя",
    source: "критически\\s+важн\\w*", flags: "gi", replacement: "важно" },
  { id: "klyuchevye-osobennosti", section: "§12", name: "«Ключевые особенности»", severity: "средняя",
    source: "Ключевые\\s+особенности", flags: "g", replacement: "Главные особенности" },
  { id: "sochetaet-v-sebe", section: "§12", name: "«сочетает в себе»", severity: "средняя",
    source: "сочетает\\s+в\\s+себе", flags: "gi", replacement: "сочетает" },
  { id: "novy-uroven", section: "§13", name: "«выводит на новый уровень»", severity: "средняя",
    source: "(?:выводит|поднимает|вывел|вывела)\\s+на\\s+новый\\s+уровень", flags: "gi", replacement: "заметно улучшает" },
  { id: "dannye-podtverzhdayut", section: "§12", name: "«Данные подтверждают:»", severity: "средняя",
    source: "Данные\\s+подтверждают[:,]\\s*", flags: "g", replacement: "" },
  { id: "vazhno-ponimat", section: "§2", name: "«Важно понимать:» в начале предложения", severity: "средняя",
    source: "(?:^|[.!?]\\s{1,3})Важно\\s+понимать[:,]\\s*", flags: "g" },
  { id: "stoit-otmetit-chto", section: "§2", name: "«Стоит отметить, что» в начале предложения", severity: "низкая",
    source: "(?:^|[.!?]\\s{1,3})Стоит\\s+отметить,?\\s+что\\s+", flags: "g" },
  { id: "individualny-podhod", section: "§16", name: "«индивидуальный подход к каждому»", severity: "низкая",
    source: "индивидуальн\\w+\\s+подход\\s+к\\s+каждому", flags: "gi" },
  { id: "komanda-professionalov", section: "§16", name: "«команда профессионалов»", severity: "низкая",
    source: "команда\\s+профессионалов|опытные\\s+специалисты\\s+с\\s+многолетним", flags: "gi" },
  { id: "dostupnye-ceny", section: "§16", name: "«по доступным ценам» / «в короткие сроки»", severity: "низкая",
    source: "по\\s+доступным\\s+ценам|в\\s+самые\\s+короткие\\s+сроки", flags: "gi" },
  { id: "bezuprechn", section: "§16", name: "«безупречный»", severity: "низкая",
    source: "безупречн\\w*\\s+(?:качество|сервис|репутация|стиль)", flags: "gi" },
  { id: "voploshchenie", section: "§13", name: "«воплощение/олицетворение»", severity: "низкая",
    source: "воплощени\\w+\\s+(?:качеств|идей|стиля)|олицетворя\\w+\\s+собой", flags: "gi" },
  { id: "ne-tolko-no-i", section: "§1", name: "«не только X, но и …» (пустая половина)", severity: "низкая",
    source: "не\\s+только\\s+[^,.;]{2,40},\\s*но\\s+и\\s+(?:позволяет|даёт|открывает|обеспечивает)", flags: "gi" },
];

function insideQuotes(text: string, idx: number): boolean {
  const before = text.slice(Math.max(0, idx - 60), idx);
  const after = text.slice(idx, idx + 100);
  return before.lastIndexOf("\u00AB") >= 0 && after.indexOf("\u00BB") > 0;
}

export function analyze(text: string, autoFix: boolean): Report {
  const patterns: PatternResult[] = [];
  let totalHits = 0;
  let cleaned = text;
  let autoRemoved = 0;

  for (const rule of RULES) {
    const rx = new RegExp(rule.source, rule.flags);
    const hits: Hit[] = [];
    const found = text.matchAll(rx);
    for (const m of found) {
      if (insideQuotes(text, m.index ?? 0)) continue;
      hits.push({ fragment: m[0].slice(0, 120), index: m.index ?? 0 });
      if (hits.length >= 50) break;
    }
    if (hits.length > 0) {
      patterns.push({ id: rule.id, section: rule.section, name: rule.name, severity: rule.severity, hits });
      totalHits += hits.length;
    }
    if (autoFix && rule.replacement !== undefined) {
      const rx2 = new RegExp(rule.source, rule.flags);
      cleaned = cleaned.replace(rx2, rule.replacement);
      autoRemoved++;
    }
  }

  if (autoFix) {
    cleaned = cleaned.replace(/[ \t]{2,}/g, " ").replace(/\n{3,}/g, "\n\n");
  }

  let penalty = 0;
  for (const p of patterns) {
    const w = p.severity === "высокая" ? 4 : p.severity === "средняя" ? 2 : 1;
    penalty += p.hits.length * w;
  }
  const words = text.split(/\s+/).filter(Boolean).length || 1;
  const density = (penalty / words) * 1000;
  const score = Math.max(0, Math.min(100, Math.round(100 - Math.min(100, density * 2))));

  return { score, totalPatterns: patterns.length, totalHits, patterns, cleanedText: cleaned, autoRemoved };
}
