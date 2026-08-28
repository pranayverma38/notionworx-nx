import { Metadata } from "next";
import Hero from "@/components/homes/home-office-equipment/Hero";
import Category from "@/components/homes/home-office-equipment/Category";
import Products from "@/components/homes/home-office-equipment/Products";
import Lookbook from "@/components/homes/home-office-equipment/Lookbook";
import Features from "@/components/homes/home-office-equipment/Features";
import ProductTab from "@/components/homes/home-office-equipment/ProductTab";
import Banner from "@/components/homes/home-office-equipment/Banner";
import Blogs from "@/components/homes/home-office-equipment/Blogs";
import Gallery from "@/components/homes/home-office-equipment/Gallery";
export const metadata: Metadata = {
  title:
    "Home Office Equipment | Amerce - Multipurpose eCommerce React Nextjs Template",
  description: "Amerce - Multipurpose eCommerce React Nextjs Template",
};
export default function HomeOfficeEquipmentPage() {
  return (
    <>
      <>
                <Hero />
                <Category />
                <Products />
                <Lookbook />
                <Features />
                <ProductTab />
                <Banner />
                <Blogs />
                <Gallery />
      </>
    </>
  );
}
