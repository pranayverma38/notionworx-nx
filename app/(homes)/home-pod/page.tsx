import { Metadata } from "next";
import TopBar2 from "@/components/topBars/TopBar2";
import Header3 from "@/components/headers/Header3";
import Footer4 from "@/components/footers/Footer4";
import Hero from "@/components/homes/home-pod/Hero";
import Category from "@/components/homes/home-pod/Category";
import TopTrend from "@/components/homes/home-pod/TopTrend";
import BannerCountdown from "@/components/homes/home-pod/BannerCountdown";
import Lookbook from "@/components/homes/home-pod/Lookbook";
import Collection from "@/components/homes/home-pod/Collection";
import ProductTab from "@/components/homes/home-pod/ProductTab";
// import BannerCountdown from "@/components/homes/home-pod/BannerCountdown";
import Testimonials from "@/components/homes/home-pod/Testimonials";
import Features from "@/components/homes/home-pod/Features";
import Gallery from "@/components/homes/home-pod/Gallery";
export const metadata: Metadata = {
  title: "Home Pod | Amerce - Multipurpose eCommerce React Nextjs Template",
  description: "Amerce - Multipurpose eCommerce React Nextjs Template",
};
export default function HomePodPage() {
  return (
    <>
      <TopBar2 hasSwiper isDark />
      <Header3 />
      <>
        <Hero />
        <Category />
        <TopTrend />
        <BannerCountdown />
        <Lookbook />
        <Collection />
        <ProductTab />
        <BannerCountdown />
        <Testimonials />
        <Features />
        <Gallery />
      </>

      <Footer4 />
    </>
  );
}
