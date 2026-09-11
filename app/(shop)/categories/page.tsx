import CollectionCategoriesClient from "@/components/shop/collection/CollectionCategoriesClient";
import PageTitleHeader from "@/components/ui/PageTitleHeader";
import { shopRouteMetadata } from "@/lib/metadata/shop";
import { getCategoryPageCategories } from "@/lib/medusa/notionworx-storefront";

export const metadata = shopRouteMetadata(
  "Categories",
  "Explore Medusa-backed storefront categories for canopies, displays, flags, apparel, and event essentials.",
);

export default async function CategoriesPage() {
  const categories = await getCategoryPageCategories();

  return (
    <>
      <PageTitleHeader
        breadcrumbLabel="Categories"
        title="Categories"
        description={
          <>
            Browse the Medusa-backed storefront categories now powering this
            catalog, from custom canopies to trade show displays, flags,
            apparel, and accessories.
          </>
        }
      />
      <CollectionCategoriesClient categories={categories} />
    </>
  );
}
