import { RichPage, richMetadata } from "@/components/RichPage";
import { getLongPage } from "@/lib/geo-pages";

const page = getLongPage("/geo/kak-popast-v-gigachat")!;

export const metadata = richMetadata(page);

export default function Page() {
  return <RichPage page={page} />;
}
