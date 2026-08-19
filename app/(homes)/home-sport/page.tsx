import { Metadata } from "next";
import TopBar1 from "@/components/topBars/TopBar1";
import Header1 from "@/components/headers/Header1";
import Footer4 from "@/components/footers/Footer4";
import GridCollection from "@/components/homes/home-sport/GridCollection";
import Features from "@/components/homes/home-sport/Features";
import BestChoice from "@/components/homes/home-sport/BestChoice";
import Collection from "@/components/homes/home-sport/Collection";
import ProductTab from "@/components/homes/home-sport/ProductTab";
import Brand from "@/components/homes/home-sport/Brand";
import Lookbook from "@/components/homes/home-sport/Lookbook";
import BannerProductSingle from "@/components/homes/home-sport/BannerProductSingle";
import Testimonials from "@/components/homes/home-sport/Testimonials";
import Gallery from "@/components/homes/home-sport/Gallery";
export const metadata: Metadata = {
  title: "Home Sport | Amerce - Multipurpose eCommerce React Nextjs Template",
  description: "Amerce - Multipurpose eCommerce React Nextjs Template",
};
export default function HomeSportPage() {
  return (
    <>
      <TopBar1 />
      <Header1 />
      <>
                <GridCollection />
                <Features />
                <BestChoice />
                <Collection />
                <ProductTab />
                <Brand />
                <Lookbook />
                <BannerProductSingle />
                <Testimonials />
                <Gallery />
      </>

      <Footer4 />
    </>
  );
}
