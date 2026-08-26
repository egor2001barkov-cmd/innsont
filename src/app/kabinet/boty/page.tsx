"use client";

import { useState } from "react";
import { BarGroup } from "@/components/kabinet/Charts";
import { useWorkspace } from "@/components/kabinet/useWorkspace";
import { auditFor } from "@/lib/workspace";

export default function BotsPage() {
  const { project, ready } = useWorkspace();
  const [bot, setBot] = useState("все");
  if (!ready || !project) return null;
  const data = auditFor(project);
  const rows = bot === "все" ? data.bots : data.bots.filter((b) => b.bot === bot);
  const hits = data.bots.reduce((s, b) => s + b.hits, 0);
  const blocked = data.bots.reduce((s, b) => s + b.blocked, 0);

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-sm text-[#6b7280]">
        Кто обходит {project.url}: Яндекс, Google, Bing. Блоки в robots.txt режут обход.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="ws-card p-4">
          <div className="text-[12px] font-medium uppercase tracking-wide text-[#9ca3af]">Заходов за 7 дней</div>
          <div className="mt-1 text-[26px] font-bold">{hits.toLocaleString("ru-RU")}</div>
        </div>
        <div className="ws-card p-4">
          <div className="text-[12px] font-medium uppercase tracking-wide text-[#9ca3af]">Заблокировано</div>
          <div className="mt-1 text-[26px] font-bold text-[#b91c1c]">{blocked.toLocaleString("ru-RU")}</div>
        </div>
        <div className="ws-card p-4">
          <div className="text-[12px] font-medium uppercase tracking-wide text-[#9ca3af]">Уникальных URL</div>
          <div className="mt-1 text-[26px] font-bold">{data.crawled.toLocaleString("ru-RU")}</div>
        </div>
      </div>

      <div className="ws-card mt-4 p-5">
        <h2 className="text-sm font-semibold">Нагрузка ботов по дням</h2>
        <p className="mb-2 text-[12px] text-[#9ca3af]">Яндекс · Google · Bing</p>
        <BarGroup
          series={data.botTrend.map((d) => ({
            label: d.label,
            values: [
              { key: "yandex", value: d.yandex, color: "#fc3f1d" },
              { key: "google", value: d.google, color: "#4285f4" },
              { key: "bing", value: d.bing, color: "#00809d" },
            ],
          }))}
        />
        <div className="mt-2 flex flex-wrap gap-4 text-[12px] text-[#6b7280]">
          <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[#fc3f1d]" /> Яндекс</span>
          <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[#4285f4]" /> Google</span>
          <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[#00809d]" /> Bing</span>
        </div>
      </div>

      <div className="ws-card mt-4 min-w-0 overflow-x-auto">
        <div className="flex items-center justify-between border-b border-[#f3f4f6] p-4">
          <h2 className="text-sm font-semibold">Агенты</h2>
          <select className="ws-input w-auto" value={bot} onChange={(e) => setBot(e.target.value)}>
            <option value="все">Все боты</option>
            {data.bots.map((b) => (
              <option key={b.bot}>{b.bot}</option>
            ))}
          </select>
        </div>
        <table className="ws-table">
          <thead>
            <tr>
              <th>Бот</th>
              <th>Заходы</th>
              <th>Блок</th>
              <th>Страниц</th>
              <th>Последний</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.bot}>
                <td className="font-medium">{r.bot}</td>
                <td className="tabular-nums">{r.hits.toLocaleString("ru-RU")}</td>
                <td className="tabular-nums">{r.blocked}</td>
                <td className="tabular-nums">{r.pages}</td>
                <td className="text-[#6b7280]">{r.last}</td>
                <td>
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[11px] font-medium ${
                      r.status === "ок"
                        ? "bg-[#dcfce7] text-[#166534]"
                        : r.status === "блок"
                          ? "bg-[#fee2e2] text-[#991b1b]"
                          : "bg-[#f3f4f6] text-[#4b5563]"
                    }`}
                  >
                    {r.status === "ок" ? "открыт" : r.status === "блок" ? "режет robots" : "редко"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
