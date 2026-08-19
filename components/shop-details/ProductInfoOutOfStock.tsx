"use client";

import { useProduct } from "@/context/ProductContext";
import { ProductCardItem } from "@/types/productCard";
import {
  ProductTitle,
  ProductPrice,
  ProductShortDescription,
  ProductViews,
  ProductExtraActions,
  ProductDelivery,
  ProductSafeCheckout,
} from "./product-info";

export default function ProductInfoOutOfStock({
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

            <div className="product-stock mb-12">
              <span className="stock out-stock fw-medium">Out of Stock</span>
            </div>

            <ProductShortDescription />
            <ProductViews />
          </div>
          <div className="br-line" />

          <form
            className="form-notice-stock"
            onSubmit={(e) => e.preventDefault()}
          >
            <h5 className="title text-capitalize">
              Notify me when it back in stock
            </h5>
            <p className="desc cl-text-2">
              Enter your email address to be notified if the product becomes
              available again.
            </p>
            <div className="form-content">
              <input type="text" placeholder="Name*" required />
              <input type="email" placeholder="Email*" required />
              <button type="submit" className="tf-btn animate-btn text-nowrap">
                Subscribe Now
              </button>
            </div>
          </form>

          <ProductExtraActions />

          <div className="br-line" />

          <ProductDelivery />
          <ProductSafeCheckout />
        </div>
      </div>
    </div>
  );
}
