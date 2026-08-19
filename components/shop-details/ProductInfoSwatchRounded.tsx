"use client";

import { useProduct } from "@/context/ProductContext";
import { ProductCardItem } from "@/types/productCard";
import {
  ProductTitle,
  ProductPrice,
  ProductShortDescription,
  ProductViews,
  ProductVariantPicker,
  ProductQuantityBuy,
  ProductExtraActions,
  ProductDelivery,
  ProductSafeCheckout,
} from "./product-info";

export default function ProductInfoSwatchRounded({
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

          <div className="tf-product-variant">
            <ProductVariantPicker colorType="rounded" />
            <ProductQuantityBuy product={product} />
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
