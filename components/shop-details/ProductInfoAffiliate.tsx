"use client";

import { useProduct } from "@/context/ProductContext";
import { ProductCardItem } from "@/types/productCard";
import WishlistButton from "../common/WishlistButton";
import {
  ProductTitle,
  ProductPrice,
  ProductShortDescription,
  ProductViews,
  ProductExtraActions,
  ProductDelivery,
  ProductSafeCheckout,
} from "./product-info";

export default function ProductInfoAffiliate({
  product,
}: {
  product: ProductCardItem;
}) {
  const { registerPane } = useProduct();

  return (
    <div className="col-md-6">
      <div className="tf-product-info-wrap position-relative mt-md-0">
        <div ref={registerPane} className="tf-zoom-main sticky-top" />
        <div className="tf-product-info-list other-image-zoom">
          <div className="tf-product-info-heading">
            <ProductTitle product={product} />
            <ProductPrice product={product} />
            <ProductShortDescription />
            <ProductViews />
          </div>

          <div className="br-line" />

          <div className="tf-product-total-quantity">
            <div className="group-action">
              <a
                href="https://www.amazon.com/"
                target="_blank"
                className="tf-btn type-xl btn-primary animate-btn w-100"
              >
                Buy on Amazon
              </a>
              <WishlistButton
                className="hover-tooltip box-icon btn-wishlist"
                product={product}
                variant="button"
              />
            </div>
          </div>

          <ProductExtraActions />

          <div className="br-line" />

          <ProductDelivery />
          <ProductSafeCheckout />
        </div>
      </div>
    </div>
  );
}
