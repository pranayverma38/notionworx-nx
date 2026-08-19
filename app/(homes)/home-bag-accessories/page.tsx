import { Metadata } from "next";
import TopBar2 from "@/components/topBars/TopBar2";
import Header3 from "@/components/headers/Header3";
import Footer3 from "@/components/footers/Footer3";
import GridCollection from "@/components/homes/home-bag-accessories/GridCollection";
import Category from "@/components/homes/home-bag-accessories/Category";
import BestChoice from "@/components/homes/home-bag-accessories/BestChoice";
import Collection from "@/components/homes/home-bag-accessories/Collection";
import ProductCountdown from "@/components/homes/home-bag-accessories/ProductCountdown";
import Brand from "@/components/homes/home-bag-accessories/Brand";
import Lookbook from "@/components/homes/home-bag-accessories/Lookbook";
import Features from "@/components/homes/home-bag-accessories/Features";
import Testimonials from "@/components/homes/home-bag-accessories/Testimonials";
import Gallery from "@/components/homes/home-bag-accessories/Gallery";
export const metadata: Metadata = {
  title:
    "Home Bag Accessories | Amerce - Multipurpose eCommerce React Nextjs Template",
  description: "Amerce - Multipurpose eCommerce React Nextjs Template",
};
export default function HomeBagAccessoriesPage() {
  return (
    <>
      <TopBar2 isDark hasSwiper />
      <Header3 />
      <>
                <GridCollection />
                <Category />
                <BestChoice />
                <Collection />
                <ProductCountdown />
                <Brand />
                <Lookbook />
                <Features />
                <Testimonials />
                <Gallery />
      </>

      <Footer3 />
    </>
  );
}
