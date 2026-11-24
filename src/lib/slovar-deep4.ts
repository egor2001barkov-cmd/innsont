type Deep4 = { deep: { title: string; text: string; points?: string[] }[]; faqs?: { q: string; a: string }[] };

export const TERM_DEEP4: Record<string, Deep4> = {
  canonical: {
    deep: [],
    faqs: [
      {
        q: "Canonical обязателен на каждой странице?",
        a: "Да. Если тега нет, поисковик выбирает главную версию сам, и выбор может не совпасть с ожиданием.",
      },
    ],
  },
  "redirect-301": {
    deep: [],
    faqs: [
      {
        q: "Сколько живёт редирект?",
        a: "Столько, сколько нужен старый адрес. Для переезда домена минимум год. Удалять редирект раньше значит терять внешние ссылки.",
      },
    ],
  },
};
