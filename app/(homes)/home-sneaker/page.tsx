import Footer1 from "@/components/footers/Footer1";
import Header6 from "@/components/headers/Header6";
import TopBar1 from "@/components/topBars/TopBar1";
import { Metadata } from "next";
import Hero from "@/components/homes/home-sneaker/Hero";
import Category from "@/components/homes/home-sneaker/Category";
import Products from "@/components/homes/home-sneaker/Products";
import Collection from "@/components/homes/home-sneaker/Collection";
// import Products from "@/components/homes/home-sneaker/Products";
import BannerStep from "@/components/homes/home-sneaker/BannerStep";
import Features from "@/components/homes/home-sneaker/Features";
import Testimonials from "@/components/homes/home-sneaker/Testimonials";
import Blogs from "@/components/homes/home-sneaker/Blogs";
import Gallery from "@/components/homes/home-sneaker/Gallery";
import FeaturedProducts from "@/components/homes/home-sneaker/FeaturedProducts";
export const metadata: Metadata = {
  title: "Home Sneaker | Amerce - Multipurpose eCommerce React Nextjs Template",
  description: "Amerce - Multipurpose eCommerce React Nextjs Template",
};
export default function HomeSneakerPage() {
  return (
    <>
      <TopBar1 />
      <Header6 />
      <>
        <Hero />
        <Category />
        <Products />
        <Collection />
        <FeaturedProducts />
        <BannerStep />
        <Features />
        <Testimonials />
        <Blogs />
        <Gallery />
      </>

      <Footer1 />
    </>
  );
}
