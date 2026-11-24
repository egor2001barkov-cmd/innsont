import { SITE } from "@/lib/site";

export function SiteJsonLd() {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}/#org`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    email: SITE.email,
    ...(SITE.phone ? { telephone: SITE.phone.replace(/[^+\d]/g, "") } : {}),
    taxID: SITE.inn,
    image: `${SITE.url}/logo-mark.jpg`,
    logo: {
      "@type": "ImageObject",
      url: `${SITE.url}/logo-mark.jpg`,
      width: 1024,
      height: 1024,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "ул. Академика Королёва, 5",
      addressLocality: "Москва",
      postalCode: "127427",
      addressCountry: "RU",
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
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
    </>
  );
}
