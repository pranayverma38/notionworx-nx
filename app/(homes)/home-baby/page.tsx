import { Metadata } from "next";
import Hero from "@/components/homes/home-baby/Hero";
import TopPicksThisWeek from "@/components/homes/home-baby/TopPicksThisWeek";
import Banner from "@/components/homes/home-baby/Banner";
import TentAssemblyAnimation from "@/components/homes/home-baby/TentAssemblyAnimation";
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
        <TentAssemblyAnimation />
        <TopPicksThisWeek />
        <Banner />
        <Testimonials />
        <Gallery />
      </>
    </>
  );
}
