import Footer9 from "@/components/footers/Footer9";
import Header11 from "@/components/headers/Header11";
import TopBar5 from "@/components/topBars/TopBar5";
import { Metadata } from "next";
import Category from "@/components/homes/home-furniture/Category";
import Parallax from "@/components/homes/home-furniture/Parallax";
import Products from "@/components/homes/home-furniture/Products";
import BannerProduct from "@/components/homes/home-furniture/BannerProduct";
import Collection from "@/components/homes/home-furniture/Collection";
import BannerCountdown from "@/components/homes/home-furniture/BannerCountdown";
import BannerLookbook from "@/components/homes/home-furniture/BannerLookbook";
import BannerDiscover from "@/components/homes/home-furniture/BannerDiscover";
import TopSeller from "@/components/homes/home-furniture/TopSeller";
import Testimonials from "@/components/homes/home-furniture/Testimonials";
import Blog from "@/components/homes/home-furniture/Blog";
import Gallery from "@/components/homes/home-furniture/Gallery";
export const metadata: Metadata = {
  title:
    "Home Furniture | Amerce - Multipurpose eCommerce React Nextjs Template",
  description: "Amerce - Multipurpose eCommerce React Nextjs Template",
};
export default function HomeFurniturePage() {
  return (
    <>
      <TopBar5 />
      <Header11 />
      <>
        <Category />
        <Parallax />
        <Products />
        <BannerProduct />
        <Collection />
        <BannerCountdown />
        <BannerLookbook />
        <BannerDiscover />
        <TopSeller />
        <Testimonials />
        <Blog />
        <Gallery />
      </>

      <Footer9 />
    </>
  );
}
