import Link from "next/link";

import Shop from "@/components/shop/shop-default/Shop";
import {
  SHOP_LISTING_DESCRIPTION,
  shopRouteMetadata,
} from "@/lib/metadata/shop";

export const metadata = shopRouteMetadata(
  "Shop — Product hover 03",
  SHOP_LISTING_DESCRIPTION,
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
              <p className="text-caption-01">Tops &amp; Shirts</p>
            </div>
            <h3>Tops &amp; Shirts</h3>
            <p className="text-body-1 cl-text-2">
              Step into our Tops &amp; Shirts Collection, where elegance meets
              confidence in styles
              <br className="d-none d-lg-block" />
              that inspire every moment.
            </p>
          </div>
        </div>
      </section>
      <Shop variant={["shopHover03"]} />
      {/* /Page Title */}
    </>
  );
}
