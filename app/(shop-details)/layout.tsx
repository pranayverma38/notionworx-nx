import Footer1 from "@/components/footers/Footer1";
import CloseNavDropdownsOnRoute from "@/components/headers/CloseNavDropdownsOnRoute";
import Header10 from "@/components/headers/Header10";
import TopBar4 from "@/components/topBars/TopBar4";
import type { Metadata } from "next";
import {
  AMERCE_DEFAULT_DESCRIPTION,
  AMERCE_SITE_TITLE,
} from "@/lib/metadata/shop-product";
import StickyProduct from "@/components/shop-details/StickyProduct";

export const metadata: Metadata = {
  title: `Shop product | ${AMERCE_SITE_TITLE}`,
  description: AMERCE_DEFAULT_DESCRIPTION,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CloseNavDropdownsOnRoute />
      <TopBar4 />
      <Header10 parentClass="tf-header" containerFull hasHrLine />
      {children}
      <StickyProduct/>
      <Footer1/>
    </>
  );
}

