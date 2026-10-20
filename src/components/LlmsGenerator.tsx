"use client";

import { useState, type FormEvent } from "react";

type LlmsResult = {
  markdown: string;
  stats: { pagesScanned: number; urlsInSitemap: number; sections: string[]; skipped: number };
  warnings: string[];
};

export function LlmsGenerator() {
  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const [site, setSite] = useState("");
  const [maxPages, setMaxPages] = useState(50);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [result, setResult] = useState<LlmsResult | null>(null);

  const [domain, setDomain] = useState("example.ru");
  const [pages, setPages] = useState(
    "/ — О компании\n/produkty — Продукты\n/tseny — Цены\n/blog — Блог\n/pomoshch — Справка"
  );
  const [manual, setManual] = useState("");

  function buildManual(e: FormEvent) {
    e.preventDefault();
    const host = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
    const lines = pages
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => {
        const [url, ...rest] = l.split("—");
        const path = (url || "/").trim();
        const note = rest.join("—").trim();
        const abs = path.startsWith("http") ? path : `https://${host}${path.startsWith("/") ? path : `/${path}`}`;
        return `- [${note || path}](${abs})`;
      });
    setManual(
      [`# ${host}`, "", `> Короткая карта сайта для языковых моделей.`, "", "## Главное", "", lines.join("\n"), ""].join("\n")
    );
  }

  async function generate() {
    setErr("");
    setResult(null);
    setBusy(true);
    const res = await fetch("/api/llms/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ site, maxPages }),
    });
    const data = (await res.json().catch(() => ({}))) as LlmsResult & { error?: string };
    setBusy(false);
    if (!res.ok) {
      setErr(data.error || "Не удалось собрать файл");
      return;
    }
    setResult(data);
  }

  const out = mode === "auto" ? result?.markdown : manual;

  return (
    <div className="card p-6 md:p-8">
      <div className="mb-5 inline-flex rounded-lg bg-[#f3f4f6] p-1 text-[13px] font-medium">
        <button
          className={`rounded-md px-3 py-1.5 ${mode === "auto" ? "bg-white shadow-sm" : "text-[#6b7280]"}`}
          onClick={() => setMode("auto")}
        >
          По сайту — автоматически
        </button>
        <button
          className={`rounded-md px-3 py-1.5 ${mode === "manual" ? "bg-white shadow-sm" : "text-[#6b7280]"}`}
          onClick={() => setMode("manual")}
        >
          Вручную
        </button>
      </div>

      {mode === "auto" ? (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            void generate();
          }}
        >
          <label className="block text-sm font-semibold">
            Адрес сайта
            <input
              className="input mt-1.5"
              value={site}
              onChange={(e) => setSite(e.target.value)}
              placeholder="example.ru"
              required
            />
          </label>
          <label className="block text-sm font-semibold">
            Сколько страниц обойти: {maxPages}
            <input
              className="mt-2 w-full"
              type="range"
              min={20}
              max={100}
              step={10}
              value={maxPages}
              onChange={(e) => setMaxPages(Number(e.target.value))}
            />
          </label>
          <p className="text-xs text-muted">
            Читаем robots.txt и sitemap, обходим страницы, вытягиваем title, description и H1,
            группируем по разделам: услуги, цены, блог, кейсы. Без почты и водяных знаков.
          </p>
          {err && <p className="text-sm text-[#b91c1c]">{err}</p>}
          <button className="btn-primary" type="submit" disabled={busy || !site.trim()}>
            {busy ? "Обходим сайт… (до минуты)" : "Собрать llms.txt"}
          </button>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={buildManual}>
          <label className="block text-sm font-semibold">
            Домен
            <input
              className="input mt-1.5"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.ru"
            />
          </label>
          <label className="block text-sm font-semibold">
            Страницы — по одной в строке, через тире
            <textarea
              className="input mt-1.5 min-h-40"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
            />
          </label>
          <button className="btn-primary" type="submit">
            Собрать llms.txt
          </button>
        </form>
      )}

      {result && (
        <p className="mt-4 text-[13px] text-muted">
          Обошли {result.stats.pagesScanned} страниц (в sitemap {result.stats.urlsInSitemap} URL),
          разделы: {result.stats.sections.join(", ")}
          {result.stats.skipped ? ` · пропустили ${result.stats.skipped} недоступных` : ""}
          {result.warnings.length ? ` · ${result.warnings.join("; ")}` : ""}
        </p>
      )}

      {out && (
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-sm font-semibold">Готовый файл</span>
            <div className="flex gap-3">
              <button
                type="button"
                className="text-sm font-semibold text-orange"
                onClick={() => navigator.clipboard.writeText(out)}
              >
                Скопировать
              </button>
              <a
                className="text-sm font-semibold text-orange"
                href={`data:text/plain;charset=utf-8,${encodeURIComponent(out)}`}
                download="llms.txt"
              >
                Скачать
              </a>
            </div>
          </div>
          <pre className="overflow-auto rounded-2xl bg-[#111] p-5 text-[13px] leading-6 text-[#e8e0d6]">
            {out}
          </pre>
          <p className="mt-2 text-xs text-muted">
            Положите файл в корень сайта: https://ваш-сайт/llms.txt — так его найдут GPTBot,
            ClaudeBot и другие модели.
          </p>
        </div>
      )}
    </div>
  );
}
