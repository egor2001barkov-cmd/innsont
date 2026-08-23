"use client";

import { useState, type FormEvent } from "react";

export function LlmsGenerator() {
  const [domain, setDomain] = useState("example.ru");
  const [pages, setPages] = useState(
    "/ — О компании\n/produkty — Продукты\n/tseny — Цены\n/blog — Блог\n/pomoshch — Справка"
  );
  const [file, setFile] = useState("");

  function build(e: FormEvent) {
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
        const abs = path.startsWith("http")
          ? path
          : `https://${host}${path.startsWith("/") ? path : `/${path}`}`;
        const title = note || path;
        return `- [${title}](${abs}): ${note || "ключевая страница"}`;
      });
    setFile(
      [
        `# ${host}`,
        "",
        `> Короткая карта сайта для языковых моделей. Не архив — только то, что стоит читать первым.`,
        "",
        "## Главное",
        "",
        lines.join("\n"),
        "",
      ].join("\n")
    );
  }

  return (
    <div className="card p-6 md:p-8">
      <form className="space-y-4" onSubmit={build}>
        <label className="block text-sm font-semibold">
          Домен
          <input
            className="input mt-1.5"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="insont.ru"
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
        <p className="text-xs text-muted">Без почты и без водяного знака в файле.</p>
      </form>
      {file && (
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-sm font-semibold">Готовый файл</span>
            <button
              type="button"
              className="text-sm font-semibold text-orange"
              onClick={() => navigator.clipboard.writeText(file)}
            >
              Скопировать
            </button>
          </div>
          <pre className="overflow-auto rounded-2xl bg-[#111] p-5 text-[13px] leading-6 text-[#e8e0d6]">
            {file}
          </pre>
        </div>
      )}
    </div>
  );
}
