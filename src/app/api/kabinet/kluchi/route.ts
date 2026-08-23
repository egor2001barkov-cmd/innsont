import { NextResponse } from "next/server";
import { findCompetitorLandings } from "@/lib/landings";
import { guessSphere, sphereById, type Competitor } from "@/lib/spheres";
import {
  fetchWordstat,
  resolveWordstatToken,
  suggestAsWordstat,
  yandexSuggest,
} from "@/lib/wordstat";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    phrase?: string;
    sphere?: string;
    region?: number;
    token?: string;
    extraHosts?: string[];
    projectHost?: string;
    projectName?: string;
  };
  const phrase = (body.phrase || "").trim().slice(0, 120);
  if (phrase.length < 2) {
    return NextResponse.json({ error: "Введите запрос от 2 символов" }, { status: 400 });
  }

  const sphereId = body.sphere || guessSphere(body.projectHost || "", body.projectName || "");
  const sphere = sphereById(sphereId);
  const region = Number(body.region) || 225;
  const token = resolveWordstatToken(body.token);

  const suggest = await yandexSuggest(phrase).catch(() => [] as string[]);

  let wordstat = suggestAsWordstat(phrase, suggest);
  let wordstatError: string | undefined;
  if (token) {
    try {
      wordstat = await fetchWordstat(token, phrase, region === 225 ? undefined : region);
    } catch (e) {
      wordstatError = e instanceof Error ? e.message : "Wordstat недоступен";
    }
  } else {
    wordstatError = "Нет токена Wordstat — частотность оценочная, фразы живые из подсказок Яндекса";
  }

  const phrases = [phrase, ...wordstat.top.map((t) => t.phrase), ...suggest].filter(
    (v, i, a) => a.findIndex((x) => x.toLowerCase() === v.toLowerCase()) === i
  );

  const extra = (body.extraHosts || []).filter(Boolean);
  const comps: Competitor[] = sphere.competitors;

  const landings = await findCompetitorLandings({
    phrases: phrases.slice(0, 8),
    competitors: comps,
    extraHosts: extra,
  });

  return NextResponse.json({
    phrase,
    sphere: { id: sphere.id, label: sphere.label },
    region,
    suggest,
    wordstat,
    wordstatLive: wordstat.source === "wordstat",
    wordstatError,
    landings,
  });
}
