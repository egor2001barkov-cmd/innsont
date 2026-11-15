import { NextResponse } from "next/server";
import { currentAccount, badRequest, unauthorized } from "@/lib/api";
import { analyzeLocalMarket } from "@/lib/local-competitors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Локальные конкуренты: карточки из выгрузки Maps/2ГИС. */
export async function POST(req: Request) {
  const acc = currentAccount(req);
  if (!acc) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as { businesses?: unknown };
  if (!Array.isArray(body.businesses) || body.businesses.length === 0) {
    return badRequest("Передайте карточки: name, rating, reviews, website");
  }
  if (body.businesses.length > 300) return badRequest("Максимум 300 карточек");

  const businesses = body.businesses
    .filter((b): b is Record<string, unknown> => Boolean(b) && typeof b === "object")
    .map((b) => ({
      name: String(b.name ?? "").slice(0, 120),
      rating: Number(b.rating) || 0,
      reviews: Number(b.reviews) || 0,
      website: typeof b.website === "string" ? b.website.slice(0, 300) : "",
      category: typeof b.category === "string" ? b.category.slice(0, 80) : "",
    }));

  return NextResponse.json({ report: analyzeLocalMarket(businesses) });
}
