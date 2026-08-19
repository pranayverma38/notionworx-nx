import { Metadata } from "next";
import TopBar3 from "@/components/topBars/TopBar3";
import Header6 from "@/components/headers/Header6";
import Footer6 from "@/components/footers/Footer6";
import Hero from "@/components/homes/home-decor/Hero";
import ReturnShipping from "@/components/homes/home-decor/ReturnShipping";
import Category from "@/components/homes/home-decor/Category";
import TopPicksThisWeek from "@/components/homes/home-decor/TopPicksThisWeek";
import Lookbook from "@/components/homes/home-decor/Lookbook";
import NewArrival from "@/components/homes/home-decor/NewArrival";
import Testimonials from "@/components/homes/home-decor/Testimonials";
import BannerImage from "@/components/homes/home-decor/BannerImage";
import Features from "@/components/homes/home-decor/Features";
import Gallery from "@/components/homes/home-decor/Gallery";
export const metadata: Metadata = {
  title: "Home Decor | Amerce - Multipurpose eCommerce React Nextjs Template",
  description: "Amerce - Multipurpose eCommerce React Nextjs Template",
};
export default function HomeDecorPage() {
  return (
    <>
      <TopBar3 />
      <Header6 />
      <>
                <Hero />
                <ReturnShipping />
                <Category />
                <TopPicksThisWeek />
                <Lookbook />
                <NewArrival />
                <Testimonials />
                <BannerImage />
                <Features />
                <Gallery />
      </>

      <Footer6 />
    </>
  );
}
