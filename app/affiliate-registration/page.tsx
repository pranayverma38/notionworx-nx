import type { Metadata } from "next";

import AffiliateRegistrationSection from "@/components/pages/affiliate-registration/AffiliateRegistrationSection";

export const metadata: Metadata = {
  title: "Affiliate Registration | Notion Worx",
  description:
    "Register as a Notion Worx affiliate partner and start earning $25 per referred order.",
};

export default function AffiliateRegistrationPage() {
  return (
    <main>
      <AffiliateRegistrationSection />
    </main>
  );
}
