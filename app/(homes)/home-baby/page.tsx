import { Metadata } from "next";
import Hero from "@/components/homes/home-baby/Hero";
import Category from "@/components/homes/home-baby/Category";
import TopPicksThisWeek from "@/components/homes/home-baby/TopPicksThisWeek";
import Banner from "@/components/homes/home-baby/Banner";
import Favorite from "@/components/homes/home-baby/Favorite";
import Bundle from "@/components/homes/home-baby/Bundle";
import Testimonials from "@/components/homes/home-baby/Testimonials";
import Gallery from "@/components/homes/home-baby/Gallery";
import PromoCollection from "@/components/homes/home-baby/PromoCollection";
export const metadata: Metadata = {
  title: "Home Baby | Notion Worx",
  description:
    "Explore featured collections, bundles, and customer favorites on the Notion Worx baby home page.",
};
export default function HomeBabyPage() {
  return (
    <>
      <>
        <Hero />
        <PromoCollection />
        <Category />
        <TopPicksThisWeek />
        <Banner />
        <Favorite />
        <Bundle />
        <Testimonials />
        <Gallery />
      </>
    </>
  );
}
