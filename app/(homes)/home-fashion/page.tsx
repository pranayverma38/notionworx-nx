import Footer1 from "@/components/footers/Footer1";
import Header9 from "@/components/headers/Header9";
import TopBar3 from "@/components/topBars/TopBar3";
import { Metadata } from "next";
import Hero from "@/components/homes/home-fashion/Hero";
import Today from "@/components/homes/home-fashion/Today";
import Category from "@/components/homes/home-fashion/Category";
import BannerHighlight from "@/components/homes/home-fashion/BannerHighlight";
import Lookbook from "@/components/homes/home-fashion/Lookbook";
import Testimonials from "@/components/homes/home-fashion/Testimonials";
import Banner from "@/components/homes/home-fashion/Banner";
import Gallery from "@/components/homes/home-fashion/Gallery";
export const metadata: Metadata = {
  title: "Home Fashion | Amerce - Multipurpose eCommerce React Nextjs Template",
  description: "Amerce - Multipurpose eCommerce React Nextjs Template",
};
export default function HomeFashionPage() {
  return (
    <>
      <TopBar3 />
      <Header9 />
      <>
        <Hero />
        <Today />
        <Category />
        <BannerHighlight />
        <Lookbook />
        <Testimonials />
        <Banner />
        <Gallery />
      </>

      <Footer1 />
    </>
  );
}
