import CollectionCategoriesClient from "@/components/shop/collection/CollectionCategoriesClient";
import PageTitleHeader from "@/components/ui/PageTitleHeader";
import { shopRouteMetadata } from "@/lib/metadata/shop";

export const metadata = shopRouteMetadata(
  "Collections",
  "Explore storefront collections for canopies, displays, flags, apparel, and event essentials.",
);

export default function page() {
  return (
    <>
      {/* Page Title */}
      <PageTitleHeader
        breadcrumbLabel="Collections"
        title="Collections"
        description={
          <>
            Browse the migrated product collections now powering this
            storefront, from custom canopies to trade show displays, flags,
            apparel, and accessories.
          </>
        }
      />
      {/* /Page Title */}
      {/* Collection */}
      <CollectionCategoriesClient />
      {/* /Collection */}
    </>
  );
}
