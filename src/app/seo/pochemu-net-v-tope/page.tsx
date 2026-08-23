import { RichPage, richMetadata } from "@/components/RichPage";
import { getLongPage } from "@/lib/geo-pages";

const page = getLongPage("/seo/pochemu-net-v-tope")!;

export const metadata = richMetadata(page);

export default function Page() {
  return <RichPage page={page} />;
}
