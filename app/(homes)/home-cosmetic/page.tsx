import Footer1 from "@/components/footers/Footer1";
import Header7 from "@/components/headers/Header7";
import { Metadata } from "next";
import Hero from "@/components/homes/home-cosmetic/Hero";
import InfiniteSlide from "@/components/homes/home-cosmetic/InfiniteSlide";
import TopPicksThisWeek from "@/components/homes/home-cosmetic/TopPicksThisWeek";
import BannerImage from "@/components/homes/home-cosmetic/BannerImage";
import Lookbook from "@/components/homes/home-cosmetic/Lookbook";
import BannerProductSingle from "@/components/homes/home-cosmetic/BannerProductSingle";
import BannerCountdown from "@/components/homes/home-cosmetic/BannerCountdown";
import Testimonials from "@/components/homes/home-cosmetic/Testimonials";
import BannerImageViewCompare from "@/components/homes/home-cosmetic/BannerImageViewCompare";
import Blog from "@/components/homes/home-cosmetic/Blog";
import Features from "@/components/homes/home-cosmetic/Features";
import Gallery from "@/components/homes/home-cosmetic/Gallery";
export const metadata: Metadata = {
  title:
    "Home Cosmetic | Amerce - Multipurpose eCommerce React Nextjs Template",
  description: "Amerce - Multipurpose eCommerce React Nextjs Template",
};
export default function HomeCosmeticPage() {
  return (
    <>
      <Header7 />
      <>
        <Hero />
        <InfiniteSlide />
        <TopPicksThisWeek />
        <BannerImage />
        <Lookbook />
        <BannerProductSingle />
        <BannerCountdown />
        <Testimonials />
        <BannerImageViewCompare />
        <Blog />
        <Features />
        <Gallery />
      </>

      <Footer1 />
    </>
  );
}
