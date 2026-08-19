import TopBar2 from "@/components/topBars/TopBar2";
import Header2 from "@/components/headers/Header2";
import { Metadata } from "next";
import Footer3 from "@/components/footers/Footer3";
import Category from "@/components/homes/home-electronics/Category";
import Collection from "@/components/homes/home-electronics/Collection";
// import Collection from "@/components/homes/home-electronics/Collection";
import BestSeller from "@/components/homes/home-electronics/BestSeller";
import ProductThumbs from "@/components/homes/home-electronics/ProductThumbs";
import GearBundle from "@/components/homes/home-electronics/GearBundle";
import Banner from "@/components/homes/home-electronics/Banner";
import Testimonials from "@/components/homes/home-electronics/Testimonials";
import Blog from "@/components/homes/home-electronics/Blog";
import Faq from "@/components/homes/home-electronics/Faq";
import Features from "@/components/homes/home-electronics/Features";
import Collection2 from "@/components/homes/home-electronics/Collection2";
export const metadata: Metadata = {
  title:
    "Home Electronics | Amerce - Multipurpose eCommerce React Nextjs Template",
  description: "Amerce - Multipurpose eCommerce React Nextjs Template",
};
export default function HomeElectronicsPage() {
  return (
    <>
      <TopBar2 isContainerFull isDark />
      <Header2 isContainerFull />
      <>
        <Category />
        <Collection />
        <Collection2 />
        <BestSeller />
        <ProductThumbs />
        <GearBundle />
        <Banner />
        <Testimonials />
        <Blog />
        <Faq />
        <Features />
      </>

      <Footer3 />
    </>
  );
}
