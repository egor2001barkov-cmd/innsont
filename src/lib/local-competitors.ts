export type LocalBusiness = {
  name: string;
  rating?: number;
  reviews?: number;
  website?: string;
  email?: string;
  address?: string;
  city?: string;
  category?: string;
  phone?: string;
};

export type LocalCompetitorReport = {
  count: number;
  averageRating: number;
  medianReviews: number;
  withWebsite: number;
  withEmail: number;
  top: { name: string; rating: number; reviews: number; hasWebsite: boolean; score: number }[];
  vulnerable: { name: string; rating: number; reviews: number }[];
  withoutWebsite: string[];
  categories: { name: string; count: number }[];
  recommendations: string[];
};

function median(values: number[]) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

const round = (n: number) => Math.round(n * 10) / 10;

/** Анализ локального рынка по выгрузке карточек (Google Maps/2ГИС) без внешних API. */
export function analyzeLocalMarket(businesses: LocalBusiness[]): LocalCompetitorReport {
  const valid = businesses.filter((b) => b && typeof b.name === "string" && b.name.trim());
  if (valid.length === 0) {
    return {
      count: 0,
      averageRating: 0,
      medianReviews: 0,
      withWebsite: 0,
      withEmail: 0,
      top: [],
      vulnerable: [],
      withoutWebsite: [],
      categories: [],
      recommendations: ["Передайте хотя бы одну карточку: name, rating, reviews, website"],
    };
  }

  const ratings = valid.map((b) => Number(b.rating) || 0).filter((r) => r > 0);
  const reviews = valid.map((b) => Number(b.reviews) || 0);
  const withWebsite = valid.filter((b) => (b.website || "").trim()).length;
  const withEmail = valid.filter((b) => (b.email || "").trim()).length;

  const scored = valid
    .map((b) => {
      const rating = Number(b.rating) || 0;
      const count = Number(b.reviews) || 0;
      return {
        name: b.name.trim(),
        rating,
        reviews: count,
        hasWebsite: Boolean((b.website || "").trim()),
        score: round(rating * Math.log(count + 1)),
      };
    })
    .sort((a, b) => b.score - a.score);

  const vulnerable = scored
    .filter((b) => b.reviews >= 50 && b.rating > 0 && b.rating < 4)
    .slice(0, 10)
    .map(({ name, rating, reviews }) => ({ name, rating, reviews }));

  const categories = [...valid.reduce((map, b) => {
    const key = (b.category || "").trim();
    if (!key) return map;
    map.set(key, (map.get(key) || 0) + 1);
    return map;
  }, new Map<string, number>()).entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  const averageRating = ratings.length ? round(ratings.reduce((s, r) => s + r, 0) / ratings.length) : 0;
  const recommendations: string[] = [];

  if (withWebsite < valid.length) {
    recommendations.push(
      `${valid.length - withWebsite} из ${valid.length} конкурентов без сайта — их трафик из поиска забирает тот, у кого сайт есть`,
    );
  }
  if (averageRating > 0) {
    recommendations.push(`Средний рейтинг рынка ${averageRating}: цель для входа в топ Карт — не ниже 4,6 при системной работе с отзывами`);
  }
  if (vulnerable.length > 0) {
    recommendations.push(`Есть ${vulnerable.length} конкурентов с высоким числом отзывов и рейтингом ниже 4,0 — их недовольные клиенты ищут альтернативу`);
  }
  if (scored[0]) {
    recommendations.push(`Лидер по видимости: ${scored[0].name} (${scored[0].rating}★, ${scored[0].reviews} отзывов) — изучите его оффер и структуру карточки`);
  }

  return {
    count: valid.length,
    averageRating,
    medianReviews: median(reviews),
    withWebsite,
    withEmail,
    top: scored.slice(0, 10),
    vulnerable,
    withoutWebsite: valid.filter((b) => !(b.website || "").trim()).map((b) => b.name.trim()).slice(0, 20),
    categories,
    recommendations,
  };
}
