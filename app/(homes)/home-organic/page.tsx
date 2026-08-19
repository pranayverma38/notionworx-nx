import Footer1 from "@/components/footers/Footer1";
import Header8 from "@/components/headers/Header8";
import TopBar2 from "@/components/topBars/TopBar2";
import { Metadata } from "next";
import Hero from "@/components/homes/home-organic/Hero";
import Category from "@/components/homes/home-organic/Category";
import Favorite from "@/components/homes/home-organic/Favorite";
import BannerImage from "@/components/homes/home-organic/BannerImage";
import Popular from "@/components/homes/home-organic/Popular";
import BannerProductSingle from "@/components/homes/home-organic/BannerProductSingle";
import Testimonials from "@/components/homes/home-organic/Testimonials";
import Gallery from "@/components/homes/home-organic/Gallery";
export const metadata: Metadata = {
  title: "Home Organic | Amerce - Multipurpose eCommerce React Nextjs Template",
  description: "Amerce - Multipurpose eCommerce React Nextjs Template",
};
export default function HomeOrganicPage() {
  return (
    <>
      <TopBar2 isDark hasSwiper />
      <Header8 />
      <>
                <Hero />
                <Category />
                <Favorite />
                <BannerImage />
                <Popular />
                <BannerProductSingle />
                <Testimonials />
                <Gallery />
      </>

      <Footer1 hideTopRule />
    </>
  );
}
