import Footer1 from "@/components/footers/Footer1";
import Header5 from "@/components/headers/Header5";
import { Metadata } from "next";
import Hero from "@/components/homes/home-baby/Hero";
import ReturnShipping from "@/components/homes/home-baby/ReturnShipping";
import Category from "@/components/homes/home-baby/Category";
import TopPicksThisWeek from "@/components/homes/home-baby/TopPicksThisWeek";
import Banner from "@/components/homes/home-baby/Banner";
import Favorite from "@/components/homes/home-baby/Favorite";
import Bundle from "@/components/homes/home-baby/Bundle";
import Testimonials from "@/components/homes/home-baby/Testimonials";
import Blog from "@/components/homes/home-baby/Blog";
import Gallery from "@/components/homes/home-baby/Gallery";
export const metadata: Metadata = {
  title: "Home Baby | Amerce - Multipurpose eCommerce React Nextjs Template",
  description: "Amerce - Multipurpose eCommerce React Nextjs Template",
};
export default function HomeBabyPage() {
  return (
    <>
      <Header5 />
      <>
                <Hero />
                <ReturnShipping />
                <Category />
                <TopPicksThisWeek />
                <Banner />
                <Favorite />
                <Bundle />
                <Testimonials />
                <Blog />
                <Gallery />
      </>

      <Footer1 hideTopRule />
    </>
  );
}
