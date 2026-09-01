import Shop from "@/components/shop/shop-default/Shop";
import PageTitleHeader from "@/components/ui/PageTitleHeader";
import { getShopCatalogProducts } from "@/lib/medusa/notionworx-storefront";
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
  const products = await getShopCatalogProducts();

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
      <Shop
        defaultCategories={activeCategory ? [activeCategory] : []}
        itemPerPage={30}
        products={products}
      />
      {/* /Page Title */}
    </>
  );
}
