import Footer8 from "@/components/footers/Footer8";
import Header1 from "@/components/headers/Header1";
import TopBar1 from "@/components/topBars/TopBar1";
import { Metadata } from "next";
import Hero from "@/components/homes/home-garden/Hero";
import BestSale from "@/components/homes/home-garden/BestSale";
import Banner from "@/components/homes/home-garden/Banner";
import TrendingFinds from "@/components/homes/home-garden/TrendingFinds";
import PlanCare from "@/components/homes/home-garden/PlanCare";
// import Banner from "@/components/homes/home-garden/Banner";
import Testimonials from "@/components/homes/home-garden/Testimonials";
import BannerProductSingle from "@/components/homes/home-garden/BannerProductSingle";
import Blog from "@/components/homes/home-garden/Blog";
import Features from "@/components/homes/home-garden/Features";
import Gallery from "@/components/homes/home-garden/Gallery";
import Banner2 from "@/components/homes/home-garden/Banner2";
export const metadata: Metadata = {
  title: "Home Garden | Amerce - Multipurpose eCommerce React Nextjs Template",
  description: "Amerce - Multipurpose eCommerce React Nextjs Template",
};
export default function HomeGardenPage() {
  return (
    <>
      <TopBar1 />
      <Header1 />
      <>
        <Hero />
        <BestSale />
        <Banner />
        <TrendingFinds />
        <PlanCare />
        <Banner2 />
        <Testimonials />
        <BannerProductSingle />
        <Blog />
        <Features />
        <Gallery />
      </>

      <Footer8 />
    </>
  );
}
