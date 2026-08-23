import { RichPage, richMetadata } from "@/components/RichPage";
import { getLongPage } from "@/lib/geo-pages";

const page = getLongPage("/geo/vs-seo")!;

export const metadata = richMetadata(page);

export default function Page() {
  return <RichPage page={page} />;
}
