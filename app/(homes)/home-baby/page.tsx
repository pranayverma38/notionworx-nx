import { Metadata } from "next";
import Hero from "@/components/homes/home-baby/Hero";
import TentAssemblyAnimation from "@/components/homes/home-baby/TentAssemblyAnimation";
import TopPicksThisWeek from "@/components/homes/home-baby/TopPicksThisWeek";
import Testimonials from "@/components/homes/home-baby/Testimonials";
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
        <Testimonials />
      </>
    </>
  );
}
