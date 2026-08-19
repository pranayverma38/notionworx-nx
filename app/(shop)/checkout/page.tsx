import Checkout from "@/components/shop/checkout/Checkout";
import PageTitle from "@/components/shop/checkout/PageTitle";
import { shopRouteMetadata } from "@/lib/metadata/shop";

export const metadata = shopRouteMetadata(
  "Checkout",
  "Review your cart, shipping, and payment details to complete your order.",
);

export default function page() {
  return (
    <>
      <PageTitle />
      {/* Checkout */}
      <Checkout />
      {/* /Checkout */}
    </>
  );
}
