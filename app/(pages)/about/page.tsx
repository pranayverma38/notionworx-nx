import { Metadata } from "next";

import PageTitle from "@/components/pages/about/PageTitle";
import MainAbout from "@/components/pages/about/MainAbout";
import BannerWhyChoose from "@/components/pages/about/BannerWhyChoose";
import Testimonial from "@/components/pages/about/Testimonial";
import Member from "@/components/pages/about/Member";

export const metadata: Metadata = {
  title: "About Us | Amerce - Multipurpose eCommerce React Nextjs Template",
  description: "Amerce - Multipurpose eCommerce React Nextjs Template",
};

const AboutPage = () => {
  return (
    <>
      <PageTitle />
      <MainAbout />
      <BannerWhyChoose />
      <Testimonial />
      <Member />
    </>
  );
};

export default AboutPage;
