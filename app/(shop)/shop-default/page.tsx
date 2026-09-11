import PageTitleHeader from "@/components/ui/PageTitleHeader";
import ShopDefaultClient from "@/components/shop/shop-default/ShopDefaultClient";
import {
  SHOP_LISTING_DESCRIPTION,
  shopRouteMetadata,
} from "@/lib/metadata/shop";

export const metadata = shopRouteMetadata("Shop", SHOP_LISTING_DESCRIPTION);

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory = category?.trim() || null;

  return (
    <>
      {/* Page Title */}
      <PageTitleHeader
        breadcrumbLabel={activeCategory ?? "All Products"}
        title={activeCategory ?? "All Products"}
        description={
          <>
            Browse our migrated storefront catalog of custom canopies,
            displays, flags, apparel, and event essentials with local images
            and on-site product detail pages.
          </>
        }
      />
      <ShopDefaultClient
        defaultCategories={activeCategory ? [activeCategory] : []}
        itemPerPage={30}
      />
      {/* /Page Title */}
    </>
  );
}
