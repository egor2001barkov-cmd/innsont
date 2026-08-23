import { ResourceShell, resourceMeta } from "@/lib/resources";

export const metadata = resourceMeta(
  "Центр помощи INNSONT — кабинет, тарифы, агенты",
  "Документация и поддержка: как пользоваться кабинетом, тарифами, статьями и API INNSONT.",
  "/resursy/pomoshch"
);

export default function Page() {
  return (
    <ResourceShell
      eyebrow="Учиться"
      h1="Центр помощи"
      lead="Короткие гайды, чтобы команда запустилась за день, а не за квартал."
      path="/resursy/pomoshch"
    >
      <ul>
        <li>Как добавить проект и список промптов</li>
        <li>Как загрузить голос бренда в Автора статей</li>
        <li>Как читать долю цитирования</li>
        <li>Как выставить счёт юрлица</li>
        <li>Письмо в поддержку: support@innsont.ru, ответ в рабочий день</li>
      </ul>
    </ResourceShell>
  );
}
