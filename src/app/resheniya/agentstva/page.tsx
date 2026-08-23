import { FeatureView, pageMetadata } from "@/components/FeatureView";
import { SOLUTIONS_PAGES } from "@/lib/features";

const page = SOLUTIONS_PAGES.find((p) => p.slug === "agentstva")!;

export const metadata = pageMetadata(page);

export default function Page() {
  return <FeatureView page={page} section="Решения" />;
}
