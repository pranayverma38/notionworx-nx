import type { Metadata } from "next";
import HomeBabyPage from "./(homes)/home-baby/page";
import SiteShell from "@/components/layouts/SiteShell";

export const metadata: Metadata = {
  title: "Home | Notion Worx",
  description:
    "Explore featured collections, bundles, and customer favorites on the Notion Worx storefront.",
};

export default function Page() {
  return (
    <SiteShell>
      <HomeBabyPage />
    </SiteShell>
  );
}
