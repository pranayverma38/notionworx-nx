import { Metadata } from "next";
import Header4 from "@/components/headers/Header4";
import Footer5 from "@/components/footers/Footer5";
import Category from "@/components/homes/home-pet-care/Category";
import BannerCollection from "@/components/homes/home-pet-care/BannerCollection";
import TopPick from "@/components/homes/home-pet-care/TopPick";
import Lookbook from "@/components/homes/home-pet-care/Lookbook";
import Featured from "@/components/homes/home-pet-care/Featured";
import BannerProduct from "@/components/homes/home-pet-care/BannerProduct";
import ProductSingle from "@/components/homes/home-pet-care/ProductSingle";
import Testimonials from "@/components/homes/home-pet-care/Testimonials";
import Blogs from "@/components/homes/home-pet-care/Blogs";
import Features from "@/components/homes/home-pet-care/Features";
import Gallery from "@/components/homes/home-pet-care/Gallery";
export const metadata: Metadata = {
  title:
    "Home Pet Care | Amerce - Multipurpose eCommerce React Nextjs Template",
  description: "Amerce - Multipurpose eCommerce React Nextjs Template",
};
export default function HomePetCarePage() {
  return (
    <>
      <Header4 />
      <>
                <Category />
                <BannerCollection />
                <TopPick />
                <Lookbook />
                <Featured hideBannerMaxWidthPx={1199} />
                <BannerProduct />
                <ProductSingle />
                <Testimonials />
                <Blogs />
                <Features />
                <Gallery />
      </>

      <Footer5 />
    </>
  );
}
