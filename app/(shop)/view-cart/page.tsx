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
      <ShoppingCart />
      <MayBe />
    </>
  );
};

export default ViewCartPage;
