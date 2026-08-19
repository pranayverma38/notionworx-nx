import Footer4 from "@/components/footers/Footer4";
import Header6 from "@/components/headers/Header6";
import TopBar3 from "@/components/topBars/TopBar3";
import { Metadata } from "next";
import Hero from "@/components/homes/home-headphone/Hero";
import About from "@/components/homes/home-headphone/About";
import TopPick from "@/components/homes/home-headphone/TopPick";
import Banner from "@/components/homes/home-headphone/Banner";
import Collection from "@/components/homes/home-headphone/Collection";
import TrueSound from "@/components/homes/home-headphone/TrueSound";
import BannerImageViewCompare from "@/components/homes/home-headphone/BannerImageViewCompare";
import BannerProductSingle from "@/components/homes/home-headphone/BannerProductSingle";
import Testimonials from "@/components/homes/home-headphone/Testimonials";
import Blogs from "@/components/homes/home-headphone/Blogs";
export const metadata: Metadata = {
  title:
    "Home Headphone | Amerce - Multipurpose eCommerce React Nextjs Template",
  description: "Amerce - Multipurpose eCommerce React Nextjs Template",
};
export default function HomeHeadphonePage() {
  return (
    <>
      <TopBar3 />
      <Header6 />
      <>
        <Hero />
        <About />
        <TopPick />
        <Banner />
        <Collection />
        <TrueSound />
        <BannerImageViewCompare />
        <BannerProductSingle />
        <Testimonials />
        <Blogs />
      </>

      <Footer4 />
    </>
  );
}
