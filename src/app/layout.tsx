import type { Metadata } from "next";
import { Onest } from "next/font/google";
import { SiteChrome } from "@/components/SiteChrome";
import { YandexMetrika } from "@/components/YandexMetrika";
import { SITE } from "@/lib/site";
import { THEME_BOOT } from "@/lib/theme";
import "./globals.css";

const sans = Onest({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  display: "swap",
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
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
      { url: "/favicon-120x120.png", type: "image/png", sizes: "120x120" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      data-theme="light"
      suppressHydrationWarning
      className={`${sans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full min-w-0 max-w-full flex-col overflow-x-clip bg-bg text-ink">
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
        <YandexMetrika />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
