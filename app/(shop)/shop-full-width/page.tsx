import Shop from "@/components/shop/shop-default/Shop";
import PageTitleHeader from "@/components/ui/PageTitleHeader";
import {
  SHOP_LISTING_DESCRIPTION,
  shopRouteMetadata,
} from "@/lib/metadata/shop";

export const metadata = shopRouteMetadata(
  "Shop — Full width",
  SHOP_LISTING_DESCRIPTION,
);

export default function page() {
  return (
    <>
      {/* Page Title */}
      <PageTitleHeader
        breadcrumbLabel="Tops & Shirts"
        title="Tops & Shirts"
        description={
          <>
            Step into our Tops & Shirts Collection, where elegance meets
            confidence in styles that inspire every moment.
          </>
        }
      />
      <Shop isFullWidth />
      {/* /Page Title */}
    </>
  );
}
