import type { Metadata } from "next";

import Footer1 from "@/components/footers/Footer1";
import Header5 from "@/components/headers/Header5";
import AnnouncementBar from "@/components/topBars/AnnouncementBar";
import AffiliateRegistrationSection from "@/components/pages/affiliate-registration/AffiliateRegistrationSection";

export const metadata: Metadata = {
  title: "Affiliate Registration | Notion Worx",
  description:
    "Register as a Notion Worx affiliate partner and start earning $25 per referred order.",
};

export default function AffiliateRegistrationPage() {
  return (
    <>
      <AnnouncementBar />
      <Header5 />
      <main>
        <AffiliateRegistrationSection />
      </main>
      <Footer1 hideTopRule />
    </>
  );
}
