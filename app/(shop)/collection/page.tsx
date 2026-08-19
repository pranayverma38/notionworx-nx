import Link from "next/link";

import CollectionCategoriesClient from "@/components/shop/collection/CollectionCategoriesClient";
import { shopRouteMetadata } from "@/lib/metadata/shop";

export const metadata = shopRouteMetadata(
  "All categories",
  "Explore every category — outerwear, dresses, footwear, bags, and accessories.",
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
              <p className="text-caption-01">All Categories</p>
            </div>
            <h3>All Categories</h3>
            <p className="text-body-1 cl-text-2">
              Step into our all categories, where elegance meets confidence in
              styles that
              <br className="d-none d-lg-block" />
              empower and inspire every moment.
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
