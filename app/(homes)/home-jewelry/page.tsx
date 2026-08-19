import Footer7 from "@/components/footers/Footer7";
import Header10 from "@/components/headers/Header10";
import { Metadata } from "next";
import Hero from "@/components/homes/home-jewelry/Hero";
import BannerCountdown from "@/components/homes/home-jewelry/BannerCountdown";
import Category from "@/components/homes/home-jewelry/Category";
import Slide from "@/components/homes/home-jewelry/Slide";
import Collection from "@/components/homes/home-jewelry/Collection";
import BestSale from "@/components/homes/home-jewelry/BestSale";
import BannerCollection from "@/components/homes/home-jewelry/BannerCollection";
import NewArrivals from "@/components/homes/home-jewelry/NewArrivals";
import BannerProductSingle from "@/components/homes/home-jewelry/BannerProductSingle";
import Lookbook from "@/components/homes/home-jewelry/Lookbook";
import Highlight from "@/components/homes/home-jewelry/Highlight";
import Blogs from "@/components/homes/home-jewelry/Blogs";
import TopBar6 from "@/components/topBars/TopBar6";
export const metadata: Metadata = {
  title: "Home Jewelry | Amerce - Multipurpose eCommerce React Nextjs Template",
  description: "Amerce - Multipurpose eCommerce React Nextjs Template",
};
export default function HomeJewelryPage() {
  return (
    <>
      <TopBar6 />
      <Header10 />
      <>
                <Hero />
                <BannerCountdown />
                <Category />
                <Slide />
                <Collection />
                <BestSale />
                <BannerCollection />
                <NewArrivals />
                <BannerProductSingle />
                <Lookbook />
                <Highlight />
                <Blogs />
      </>

      <Footer7 />
    </>
  );
}
