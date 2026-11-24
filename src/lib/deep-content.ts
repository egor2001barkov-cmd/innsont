import { CITY_DEEP, type DeepExtra } from "./deep-content-cities";
import { SEO_DEEP } from "./deep-content-seo";
import { WAVE1_EXTRA } from "./deep-content-extra";
import { WAVE1_EXTRA2 } from "./deep-content-extra2";
import { WAVE1_EXTRA3 } from "./deep-content-extra3";
import { WAVE1_EXTRA4 } from "./deep-content-extra4";
import { WAVE1_EXTRA5 } from "./deep-content-extra5";
import { WAVE1_EXTRA6 } from "./deep-content-extra6";
import { WAVE1_RELATED } from "./deep-content-related";

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

export const DEEP_CONTENT = mergeMaps(CITY_DEEP, SEO_DEEP, WAVE1_EXTRA, WAVE1_EXTRA2, WAVE1_EXTRA3, WAVE1_EXTRA4, WAVE1_EXTRA5, WAVE1_EXTRA6, WAVE1_RELATED);
