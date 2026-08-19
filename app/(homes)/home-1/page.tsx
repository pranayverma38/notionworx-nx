import { Metadata } from "next";

import Header1 from "@/components/headers/Header1";
import TopBar1 from "@/components/topBars/TopBar1";
import Footer1 from "@/components/footers/Footer1";
import Hero from "@/components/homes/home-1/Hero";
import Category from "@/components/homes/home-1/Category";
import TopPicsProducts from "@/components/homes/home-1/TopPicsProducts";
import Collection from "@/components/homes/home-1/Collection";
import TopPicksThisWeek from "@/components/homes/home-1/TopPicksThisWeek";
import Lookbook from "@/components/homes/home-1/Lookbook";
import Testimonial from "@/components/homes/home-1/Testimonial";
import Gallery from "@/components/homes/home-1/Gallery";
import Features from "@/components/homes/home-1/Features";
export const metadata: Metadata = {
  title: "Index | Amerce - Multipurpose eCommerce React Nextjs Template",
  description: "Amerce - Multipurpose eCommerce React Nextjs Template",
};
export default function IndexPage() {
  return (
    <>
      <TopBar1 />
      <Header1 />
      <>
        <Hero />
        <Category />
        <TopPicsProducts />
        <Collection />
        <TopPicksThisWeek />
        <Lookbook />
        <Testimonial />
        <Gallery />
        <Features />
      </>

      <Footer1 />
    </>
  );
}
