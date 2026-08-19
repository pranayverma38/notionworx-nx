import { Metadata } from "next";
import IndexPage from "./(homes)/home-1/page";
import MiniPopup from "@/components/modals/MiniPopup";
import { miniPopupProduct } from "@/data/products/products";
export const metadata: Metadata = {
  title: "Home | Notion Worx",
  description:
    "Explore custom canopies, displays, flags, apparel, and event essentials from the migrated storefront catalog.",
};
export default function page() {
  return (
    <>
      <IndexPage />
      <MiniPopup product={miniPopupProduct} />
    </>
  );
}
