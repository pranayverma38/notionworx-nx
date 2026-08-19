import { Metadata } from "next";
import TopBar2 from "@/components/topBars/TopBar2";
import Header2 from "@/components/headers/Header2";
import Footer2 from "@/components/footers/Footer2";
import Hero from "@/components/homes/home-auto/Hero";
import Features from "@/components/homes/home-auto/Features";
import Banner from "@/components/homes/home-auto/Banner";
import Category from "@/components/homes/home-auto/Category";
import BestDealsOfTheWeek from "@/components/homes/home-auto/BestDealsOfTheWeek";
import ImageBanner from "@/components/homes/home-auto/ImageBanner";
import FeaturedProducts from "@/components/homes/home-auto/FeaturedProducts";
import BannerSale from "@/components/homes/home-auto/BannerSale";
import FeaturedProducts2 from "@/components/homes/home-auto/FeaturedProducts2";
import Cta from "@/components/homes/home-auto/Cta";
import Blog from "@/components/homes/home-auto/Blog";
export const metadata: Metadata = {
  title: "Home Auto | Amerce - Multipurpose eCommerce React Nextjs Template",
  description: "Amerce - Multipurpose eCommerce React Nextjs Template",
};
export default function HomeAutoPage() {
  return (
    <>
      <TopBar2 />
      <Header2 navCategoryStyle="style-2" />
      <>
        <Hero />
        <h2 className="d-none">Perfect Heading Seo</h2>
        <Features />
        <Banner />
        <Category />
        <BestDealsOfTheWeek />
        <ImageBanner />
        <FeaturedProducts />
        <BannerSale />
        <FeaturedProducts2 />
        <Cta />
        <Blog />
      </>

      <Footer2 />
    </>
  );
}
