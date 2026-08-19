import PageTitle from "@/components/shop/wishlist/PageTitle";
import Wishlist from "@/components/shop/wishlist/Wishlist";
import { shopRouteMetadata } from "@/lib/metadata/shop";

export const metadata = shopRouteMetadata(
  "Wishlist",
  "Review and manage products you have saved for later.",
);

const WishlistPage = () => {
  return (
    <>
      <PageTitle />
      <Wishlist />
    </>
  );
};

export default WishlistPage;
