import { Metadata } from "next";
import Hero from "@/components/homes/home-fashion-2/Hero";
import Category from "@/components/homes/home-fashion-2/Category";
import Products from "@/components/homes/home-fashion-2/Products";
import ProductThumbs from "@/components/homes/home-fashion-2/ProductThumbs";
import CollectionStyle from "@/components/homes/home-fashion-2/CollectionStyle";
import InfiniteSlide from "@/components/homes/home-fashion-2/InfiniteSlide";
import ProductFeature from "@/components/homes/home-fashion-2/ProductFeature";
import Testimonials from "@/components/homes/home-fashion-2/Testimonials";
import Gallery from "@/components/homes/home-fashion-2/Gallery";
export const metadata: Metadata = {
  title:
    "Home Fashion 2 | Amerce - Multipurpose eCommerce React Nextjs Template",
  description: "Amerce - Multipurpose eCommerce React Nextjs Template",
};
export default function HomeFashion2Page() {
  return (
    <>
      <>
                <Hero />
                <Category />
                <Products />
                <ProductThumbs />
                <CollectionStyle />
                <InfiniteSlide />
                <ProductFeature />
                <Testimonials />
                <Gallery />
      </>
    </>
  );
}
