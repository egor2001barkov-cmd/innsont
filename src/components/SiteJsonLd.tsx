import { SITE } from "@/lib/site";

export function SiteJsonLd() {
  const org = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": `${SITE.url}/#org`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    email: SITE.email,
    taxID: SITE.inn,
    image: `${SITE.url}/logo-mark.jpg`,
    logo: {
      "@type": "ImageObject",
      url: `${SITE.url}/logo-mark.jpg`,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "ул. Академика Королёва, 5",
      addressLocality: "Москва",
      postalCode: "127427",
      addressCountry: "RU",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 55.8217,
      longitude: 37.6114,
    },
    areaServed: [
      { "@type": "Country", name: "Russia" },
      { "@type": "City", name: "Москва" },
      { "@type": "City", name: "Санкт-Петербург" },
    ],
    sameAs: [SITE.telegram, SITE.max],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    inLanguage: "ru-RU",
    publisher: { "@id": `${SITE.url}/#org` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.url}/seo?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const app = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: SITE.url,
    description: SITE.description,
    inLanguage: "ru-RU",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "RUB",
      lowPrice: "4490",
      highPrice: "24990",
    },
    featureList: [
      "Продвижение в Яндексе, Google и Bing",
      "Семантика Wordstat",
      "Аудит сайта",
      "Личный кабинет проектов",
    ],
    provider: { "@id": `${SITE.url}/#org` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(app) }} />
    </>
  );
}
