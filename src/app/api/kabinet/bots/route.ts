import { NextResponse } from "next/server";
import { currentAccount, badRequest, unauthorized } from "@/lib/api";
import { parseRobots } from "@/lib/site-audit";

export const runtime = "nodejs";
export const maxDuration = 120;

const BOTS: { name: string; ua: string; kind: "поиск" | "ИИ"; note: string }[] = [
  { name: "YandexBot", ua: "Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)", kind: "поиск", note: "Основной робот Яндекса" },
  { name: "Googlebot", ua: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)", kind: "поиск", note: "Основной робот Google" },
  { name: "bingbot", ua: "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)", kind: "поиск", note: "Робот Bing" },
  { name: "GPTBot", ua: "Mozilla/5.0 (compatible; GPTBot/1.0; +https://openai.com/gptbot)", kind: "ИИ", note: "ChatGPT/OpenAI" },
  { name: "ClaudeBot", ua: "Mozilla/5.0 (compatible; ClaudeBot/1.0; +claude-bot)" , kind: "ИИ", note: "Claude/Anthropic" },
  { name: "PerplexityBot", ua: "Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)", kind: "ИИ", note: "Perplexity" },
  { name: "YandexGPT", ua: "Mozilla/5.0 (compatible; YandexGPT/1.0)", kind: "ИИ", note: "Ответы Алисы и YandexGPT" },
];

/** Реальная проверка ботов: правила robots.txt + живой запрос к сайту с User-Agent бота. */
export async function POST(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();
  const body = (await req.json().catch(() => ({}))) as { site?: string };
  const raw = String(body.site || "").trim();
  if (!raw) return badRequest("Нужен адрес сайта");
  let origin: string;
  try {
    origin = new URL(raw.match(/^https?:\/\//i) ? raw : `https://${raw}`).origin;
  } catch {
    return badRequest("Некорректный адрес");
  }

  const robotsRes = await fetch(origin + "/robots.txt", {
    signal: AbortSignal.timeout(8_000),
  }).catch(() => null);
  const robotsText = robotsRes?.ok ? (await robotsRes.text().catch(() => "")).slice(0, 40_000) : "";
  const blocks = parseRobots(robotsText);

  const results = await Promise.all(
    BOTS.map(async (bot) => {
      // правило в robots: ищем блок бота, иначе *
      const own = blocks[bot.name.toLowerCase()];
      const all = blocks["*"];
      const rules = own || all;
      const banned = Boolean(
        rules?.some((r) => r.disallow.some((d) => d.replace(/\s/g, "") === "/"))
      );
      // живой заход с UA бота: некоторые WAF режут ботов независимо от robots
      let responds: boolean | null = null;
      let status: number | null = null;
      try {
        const res = await fetch(origin + "/", {
          headers: { "User-Agent": bot.ua, Accept: "text/html" },
          redirect: "follow",
          signal: AbortSignal.timeout(10_000),
        });
        status = res.status;
        responds = res.ok;
      } catch {
        responds = false;
      }
      return {
        ...bot,
        robotsRule: robotsText ? (banned ? "закрыт" : own ? "разрешён (свой блок)" : "разрешён (общий блок)") : "robots не найден",
        bannedInRobots: banned,
        siteResponds: responds,
        status,
      };
    })
  );

  return NextResponse.json({ robotsFound: Boolean(robotsText), bots: results });
}
