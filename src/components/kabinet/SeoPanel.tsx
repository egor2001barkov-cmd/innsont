"use client";

import { useMemo, useState } from "react";

/**
 * SEO-проверка текста в редакторе (аналог Writesonic SEO Checker).
 * Клиентский скоринг в реальном времени: ключ, структура, плотность, ссылки, читабельность.
 */

type Check = { ok: boolean; label: string; detail: string };

function analyze(text: string, keyword: string): { score: number; checks: Check[]; words: number } {
  const md = text.trim();
  const words = md.split(/\s+/).filter(Boolean).length;
  const kw = keyword.trim().toLowerCase();
  const checks: Check[] = [];

  // Объём
  checks.push({
    ok: words >= 600,
    label: "Объём текста",
    detail: words >= 900 ? `${words} слов — отлично` : words >= 600 ? `${words} слов — допустимо` : `${words} слов — мало (цель 600+)`,
  });

  if (kw) {
    const lower = md.toLowerCase();
    const kwCount = lower.split(kw).length - 1;
    const density = words ? (kwCount * kw.split(/\s+/).length) / words * 100 : 0;
    checks.push({
      ok: density >= 0.3 && density <= 3,
      label: "Плотность ключа",
      detail: `${kwCount} вхождений, ${(density * 100 / 100).toFixed(1)}% ${density > 3 ? "— переспам" : density < 0.3 ? "— слишком редко" : "— норма"}`,
    });

    // Ключ в H1
    const h1 = md.match(/^#\s+(.+)$/m)?.[1]?.toLowerCase() || "";
    checks.push({ ok: h1.includes(kw), label: "Ключ в H1", detail: h1 ? (h1.includes(kw) ? "есть" : "нет вхождения") : "H1 не найден" });

    // Ключ в первом абзаце
    const firstPara = md.split(/\n\n/).find((p) => p.trim() && !p.trim().startsWith("#"))?.toLowerCase() || "";
    checks.push({ ok: firstPara.includes(kw), label: "Ключ в первом абзаце", detail: firstPara.includes(kw) ? "есть" : "нет — добавьте в первые 2 абзаца" });

    // Ключ в H2
    const h2s = [...md.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1].toLowerCase());
    const kwInH2 = h2s.filter((h) => h.includes(kw.split(/\s+/)[0])).length;
    checks.push({ ok: kwInH2 >= 1, label: "Ключ в заголовках H2", detail: `${kwInH2} из ${h2s.length} H2 содержат слово из ключа` });
  }

  // Структура H2
  const h2count = (md.match(/^##\s+/gm) || []).length;
  checks.push({
    ok: h2count >= 3,
    label: "Структура H2",
    detail: h2count >= 3 ? `${h2count} разделов` : `${h2count} разделов — цель 3+`,
  });

  // FAQ
  const hasFaq = /(^##\s.*(частые вопросы|вопросы и ответы|faq))/im.test(md);
  checks.push({ ok: hasFaq, label: "FAQ-раздел", detail: hasFaq ? "есть" : "нет — добавьте FAQ последним разделом" });

  // Ссылки
  const links = (md.match(/\[[^\]]+\]\([^)]+\)/g) || []).length;
  checks.push({
    ok: links >= 2,
    label: "Перелинковка",
    detail: links >= 2 ? `${links} ссылок` : `${links} ссылка — цель 2+ на смежные страницы`,
  });

  // Списки/таблицы
  const lists = (md.match(/^\s*[-*]\s+/gm) || []).length;
  const tables = (md.match(/^\|.+\|$/gm) || []).length;
  checks.push({
    ok: lists + tables >= 5,
    label: "Списки и таблицы",
    detail: lists + tables >= 5 ? `${lists} пунктов, ${tables} строк таблиц` : "мало структуры — добавьте список или таблицу",
  });

  // Читабельность: средняя длина предложения
  const sentences = md.split(/[.!?]+/).filter((s) => s.trim().length > 3);
  const avgLen = sentences.length ? words / sentences.length : 0;
  checks.push({
    ok: avgLen > 8 && avgLen < 22,
    label: "Среднее предложение",
    detail: `${avgLen.toFixed(1)} слов ${avgLen >= 22 ? "— длинно, разбейте" : avgLen <= 8 ? "— рубленый стиль" : "— норма"}`,
  });

  // Штампы
  const stamp = /(не просто|широкий спектр|по доступным ценам|идеальн(?:ое|ый)|уникальн(?:ый|ая))/gi;
  const stamps = (md.match(stamp) || []).length;
  checks.push({ ok: stamps === 0, label: "ИИ-штампы", detail: stamps === 0 ? "чисто" : `${stamps} вхождений — прогоните очеловечиватель` });

  const okCount = checks.filter((c) => c.ok).length;
  const score = Math.round((okCount / checks.length) * 100);
  return { score, checks, words };
}

export function SeoPanel({ text }: { text: string }) {
  const [kw, setKw] = useState("");
  const [open, setOpen] = useState(false);
  const res = useMemo(() => analyze(text, kw), [text, kw]);

  const color = res.score >= 80 ? "text-[#15803d]" : res.score >= 50 ? "text-[#b45309]" : "text-[#b91c1c]";

  return (
    <div className="mt-2 rounded-lg border border-[#e5e7eb]">
      <button
        className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] font-medium"
        onClick={() => setOpen(!open)}
      >
        <span className="text-[11px] uppercase tracking-wide text-[#9ca3af]">SEO</span>
        <span className={`tabular-nums font-bold ${color}`}>{res.score}/100</span>
        <span className="text-[12px] text-[#6b7280]">
          {res.checks.filter((c) => !c.ok).length} замечаний · {res.words} слов
        </span>
        <span className="ml-auto text-[#9ca3af]">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="border-t border-[#f3f4f6] px-3 py-2">
          <input
            className="ws-input mb-2 h-8 py-0.5 text-[12px]"
            placeholder="ключевой запрос для проверки вхождений…"
            value={kw}
            onChange={(e) => setKw(e.target.value)}
          />
          <ul className="space-y-1">
            {res.checks.map((c) => (
              <li key={c.label} className="flex items-baseline gap-2 text-[12.5px]">
                <span className={c.ok ? "text-[#15803d]" : "text-[#b45309]"}>{c.ok ? "✓" : "!"}</span>
                <span className="min-w-[130px] font-medium">{c.label}</span>
                <span className="text-[#6b7280]">{c.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
