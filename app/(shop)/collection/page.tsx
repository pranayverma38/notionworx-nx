import Link from "next/link";

import CollectionCategoriesClient from "@/components/shop/collection/CollectionCategoriesClient";
import { shopRouteMetadata } from "@/lib/metadata/shop";

export const metadata = shopRouteMetadata(
  "Collections",
  "Explore storefront collections for canopies, displays, flags, apparel, and event essentials.",
);

export default function page() {
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
              <p className="text-caption-01">Collections</p>
            </div>
            <h3>Collections</h3>
            <p className="text-body-1 cl-text-2">
              Browse the migrated product collections now powering this
              storefront, from custom canopies to trade show
              <br className="d-none d-lg-block" />
              displays, flags, apparel, and accessories.
            </p>
          </div>
        </div>
      </section>
      {/* /Page Title */}
      {/* Collection */}
      <CollectionCategoriesClient />
      {/* /Collection */}
    </>
  );
}
