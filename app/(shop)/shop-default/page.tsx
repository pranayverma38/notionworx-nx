import Link from "next/link";

import Shop from "@/components/shop/shop-default/Shop";
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
      <section className="section-page-title text-center flat-spacing-2 pb-0">
        <div className="container">
          <div className="main-page-title">
            <div className="breadcrumbs">
              <Link href={`/`} className="text-caption-01 cl-text-3 link">
                Home
              </Link>
              <i className="icon icon-CaretRightThin cl-text-3" />
              <p className="text-caption-01">
                {activeCategory ?? "All Products"}
              </p>
            </div>
            <h3>{activeCategory ?? "All Products"}</h3>
            <p className="text-body-1 cl-text-2">
              Browse our migrated storefront catalog of custom canopies,
              displays, flags, apparel, and event essentials
              <br className="d-none d-lg-block" />
              with local images and on-site product detail pages.
            </p>
          </div>
        </div>
      </section>
      <Shop defaultCategories={activeCategory ? [activeCategory] : []} />
      {/* /Page Title */}
    </>
  );
}
