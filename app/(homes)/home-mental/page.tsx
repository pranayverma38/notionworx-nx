import { Metadata } from "next";
import TopBar2 from "@/components/topBars/TopBar2";
import Header2 from "@/components/headers/Header2";
import Footer2 from "@/components/footers/Footer2";
import Hero from "@/components/homes/home-mental/Hero";
import Category from "@/components/homes/home-mental/Category";
import Collection from "@/components/homes/home-mental/Collection";
import TopPick from "@/components/homes/home-mental/TopPick";

import Featured from "@/components/homes/home-mental/Featured";
import Testimonials from "@/components/homes/home-mental/Testimonials";
import BannerText from "@/components/homes/home-mental/BannerText";
import Blogs from "@/components/homes/home-mental/Blogs";
import Features from "@/components/homes/home-mental/Features";
export const metadata: Metadata = {
  title: "Home Mental | Amerce - Multipurpose eCommerce React Nextjs Template",
  description: "Amerce - Multipurpose eCommerce React Nextjs Template",
};
export default function HomeMentalPage() {
  return (
    <>
      <TopBar2 />
      <Header2 />
      <>
        <Hero />
        <Category />
        <Collection />
        <TopPick />
        <Collection />
        <Featured />
        <Testimonials />
        <BannerText />
        <Blogs />
        <Features />
      </>

      <Footer2 />
    </>
  );
}
