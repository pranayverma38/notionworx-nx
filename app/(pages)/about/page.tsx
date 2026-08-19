import { Metadata } from "next";

import PageTitle from "@/components/pages/about/PageTitle";
import MainAbout from "@/components/pages/about/MainAbout";
import BannerWhyChoose from "@/components/pages/about/BannerWhyChoose";

export const metadata: Metadata = {
  title: "About Notion Worx",
  description:
    "Learn how the Notion Worx storefront now organizes custom canopies, displays, flags, apparel, and event essentials through a unified local catalog.",
};

const AboutPage = () => {
  return (
    <>
      <PageTitle />
      <MainAbout />
      <BannerWhyChoose />
    </>
  );
};

export default AboutPage;
