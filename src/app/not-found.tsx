import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <p className="text-sm font-semibold text-orange">404</p>
      <h1 className="mt-3 text-4xl">Страница не найдена</h1>
      <p className="mt-3 text-muted">
        Возможно, раздел переехал. Начните с главной или тарифов.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/" className="btn-primary">
          На главную
        </Link>
        <Link href="/tseny" className="btn-outline">
          Тарифы
        </Link>
      </div>
    </div>
  );
}
