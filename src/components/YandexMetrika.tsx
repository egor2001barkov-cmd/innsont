import Script from "next/script";
import { Suspense } from "react";
import { YandexMetrikaHits } from "./YandexMetrikaHits";

export function YandexMetrika() {
  return (
    <>
      {/* Yandex.Metrika counter */}
      <Script id="yandex-metrika" strategy="afterInteractive">{`
    (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=111878788', 'ym');

    ym(111878788, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
      `}</Script>
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://mc.yandex.ru/watch/111878788"
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
      {/* /Yandex.Metrika counter */}
      <Suspense fallback={null}>
        <YandexMetrikaHits />
      </Suspense>
    </>
  );
}
