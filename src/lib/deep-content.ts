import { CITY_DEEP, type DeepExtra } from "./deep-content-cities";
import { SEO_DEEP } from "./deep-content-seo";
import { WAVE1_EXTRA } from "./deep-content-extra";
import { WAVE1_EXTRA2 } from "./deep-content-extra2";
import { WAVE1_EXTRA3 } from "./deep-content-extra3";
import { WAVE1_EXTRA4 } from "./deep-content-extra4";
import { WAVE1_EXTRA5 } from "./deep-content-extra5";
import { WAVE1_EXTRA6 } from "./deep-content-extra6";
import { WAVE1_RELATED } from "./deep-content-related";
import { COMPARE_DEEP } from "./deep-content-compare";
import { COMPARE_DEEP2 } from "./deep-content-compare2";
import { COMPARE_DEEP3 } from "./deep-content-compare3";
import { COMPARE_DEEP4 } from "./deep-content-compare4";
import { COMPARE_DEEP5 } from "./deep-content-compare5";
import { COMPARE_DEEP6 } from "./deep-content-compare6";
import { COMPARE_DEEP7 } from "./deep-content-compare7";
import { COMPARE_DEEP8 } from "./deep-content-compare8";
import { COMPARE_DEEP9 } from "./deep-content-compare9";
import { BACKLINKS_DEEP } from "./deep-content-backlinks";
import { COMPARE_DEEP10 } from "./deep-content-compare10";
import { COMPARE_DEEP11 } from "./deep-content-compare11";
import { COMPARE_DEEP12 } from "./deep-content-compare12";
import { COMPARE_DEEP13 } from "./deep-content-compare13";
import { COMPARE_DEEP14 } from "./deep-content-compare14";
import { COMPARE_DEEP15 } from "./deep-content-compare15";
import { COMPARE_DEEP16 } from "./deep-content-compare16";
import { GEO_DEEP } from "./deep-content-geo";
import { SEO_NOV_DEEP } from "./deep-content-seo-nov";

export type { DeepExtra };

const cat = <T>(a?: T[], b?: T[]): T[] | undefined =>
  a?.length || b?.length ? [...(a ?? []), ...(b ?? [])] : undefined;

function mergeMaps(...maps: Record<string, DeepExtra>[]): Record<string, DeepExtra> {
  const out: Record<string, DeepExtra> = {};
  for (const map of maps) {
    for (const [path, extra] of Object.entries(map)) {
      const prev = out[path];
      out[path] = {
        sections: cat(prev?.sections, extra.sections),
        faqs: cat(prev?.faqs, extra.faqs),
        bullets: cat(prev?.bullets, extra.bullets),
        related: cat(prev?.related, extra.related),
      };
    }
  }
  return out;
}

export const DEEP_CONTENT = mergeMaps(CITY_DEEP, SEO_DEEP, WAVE1_EXTRA, WAVE1_EXTRA2, WAVE1_EXTRA3, WAVE1_EXTRA4, WAVE1_EXTRA5, WAVE1_EXTRA6, WAVE1_RELATED, COMPARE_DEEP, COMPARE_DEEP2, COMPARE_DEEP3, COMPARE_DEEP4, COMPARE_DEEP5, COMPARE_DEEP6, COMPARE_DEEP7, COMPARE_DEEP8, COMPARE_DEEP9, BACKLINKS_DEEP, COMPARE_DEEP10, COMPARE_DEEP11, COMPARE_DEEP12, COMPARE_DEEP13, COMPARE_DEEP14, COMPARE_DEEP15, COMPARE_DEEP16, GEO_DEEP, SEO_NOV_DEEP);
