import type { Metadata } from "next";
import { Exo_2, Manrope, Michroma } from "next/font/google";
import { SiteChrome } from "@/components/SiteChrome";
import { YandexMetrika } from "@/components/YandexMetrika";
import { SITE } from "@/lib/site";
import { THEME_BOOT } from "@/lib/theme";
import "./globals.css";

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
});

const display = Exo_2({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700", "800"],
});

const brand = Michroma({
  variable: "--font-brand",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | Продвижение в Яндексе, Google и нейросетях`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "продвижение сайта",
    "SEO продвижение",
    "продвижение в Яндексе",
    "продвижение сайта в Google",
    "продвижение в Google",
    "продвижение в Bing",
    "Яндекс Вебмастер",
    "Google Search Console",
    "Google Профиль компании",
    "продвижение в Google Maps",
    "вывод сайта в топ",
    "технический аудит сайта",
    "GEO оптимизация",
    "микроразметка schema.org",
  ],
  other: {
    "geo.region": "RU-MOW",
    "geo.placename": "Москва",
    ICBM: "55.8217, 37.6114",
    "geo.position": "55.8217;37.6114",
  },
  alternates: {
    canonical: SITE.url,
    languages: { "ru-RU": SITE.url },
  },
  authors: [{ name: SITE.name }],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: SITE.name,
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
  verification: {
    yandex: "eab405796df2103e",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      data-theme="light"
      suppressHydrationWarning
      className={`${sans.variable} ${display.variable} ${brand.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg text-ink">
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
        <YandexMetrika />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
