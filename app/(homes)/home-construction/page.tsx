import Footer9 from "@/components/footers/Footer9";
import Header10 from "@/components/headers/Header10";
import TopBar4 from "@/components/topBars/TopBar4";
import { Metadata } from "next";
import Hero from "@/components/homes/home-construction/Hero";
import Categories from "@/components/homes/home-construction/Categories";
import TopPicksThisWeek from "@/components/homes/home-construction/TopPicksThisWeek";
import Arrival from "@/components/homes/home-construction/Arrival";
import TopPicksThisWeek2 from "@/components/homes/home-construction/TopPicksThisWeek2";
import BannerCountdown from "@/components/homes/home-construction/BannerCountdown";
import Lookbook from "@/components/homes/home-construction/Lookbook";
import BannerProductSingle from "@/components/homes/home-construction/BannerProductSingle";
import Testimonials from "@/components/homes/home-construction/Testimonials";
import Blog from "@/components/homes/home-construction/Blog";
export const metadata: Metadata = {
  title:
    "Home Construction | Amerce - Multipurpose eCommerce React Nextjs Template",
  description: "Amerce - Multipurpose eCommerce React Nextjs Template",
};
export default function HomeConstructionPage() {
  return (
    <>
      <main id="wrapper">
        <TopBar4 />
        <Header10 containerFull  parentClass="tf-header" hasHrLine/>
        <>
          <Hero />
          <Categories />
          <TopPicksThisWeek />
          <Arrival />
          <TopPicksThisWeek2 />
          <BannerCountdown />
          <Lookbook />
          <BannerProductSingle />
          <Testimonials />
          <Blog />
        </>

        <Footer9 />
      </main>
    </>
  );
}
