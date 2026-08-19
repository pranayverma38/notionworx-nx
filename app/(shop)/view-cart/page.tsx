import PageTitle from "@/components/shop/view-cart/PageTitle";
import ShoppingCart from "@/components/shop/view-cart/ShoppingCart";
import MayBe from "@/components/shop/view-cart/MayBe";
import { shopRouteMetadata } from "@/lib/metadata/shop";

export const metadata = shopRouteMetadata(
  "View cart",
  "Review items in your bag, apply discounts, and proceed to checkout.",
);

const ViewCartPage = () => {
  return (
    <>
      <PageTitle />
      <ShoppingCart />
      <MayBe />
    </>
  );
};

export default ViewCartPage;
