import { FeatureView, pageMetadata } from "@/components/FeatureView";
import { SOLUTIONS_PAGES } from "@/lib/features";

const page = SOLUTIONS_PAGES.find((p) => p.slug === "internet-magaziny")!;

export const metadata = pageMetadata(page);

export default function Page() {
  return <FeatureView page={page} section="Решения" />;
}
