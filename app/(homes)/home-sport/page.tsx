import { Metadata } from "next";
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
    </>
  );
}
