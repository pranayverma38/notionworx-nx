import { Metadata } from "next";
import IndexPage from "./(homes)/home-1/page";
import MiniPopup from "@/components/modals/MiniPopup";
import { miniPopupProduct } from "@/data/products/products";
export const metadata: Metadata = {
  title: "Index | Amerce - Multipurpose eCommerce React Nextjs Template",
  description: "Amerce - Multipurpose eCommerce React Nextjs Template",
};
export default function page() {
  return (
    <>
      <IndexPage />
      <MiniPopup product={miniPopupProduct} />
    </>
  );
}
