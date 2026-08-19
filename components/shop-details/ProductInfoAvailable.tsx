"use client";

import { useProduct } from "@/context/ProductContext";
import { ProductCardItem } from "@/types/productCard";
import {
  ProductTitle,
  ProductPrice,
  ProductShortDescription,
  ProductViews,
  ProductQuantityBuy,
  ProductExtraActions,
  ProductDelivery,
  ProductSafeCheckout,
} from "./product-info";

export default function ProductInfoAvailable({
  product,
}: {
  product: ProductCardItem;
}) {
  const { registerPane } = useProduct();

  const available = 40;
  const sold = 120;
  const progressPercent = (sold / (available + sold)) * 100;

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

          <div className="tf-product-progress-sale">
            <div className="title">
              <div className="available text">
                Available: <span className="number fw-7">{available}</span>
              </div>
              <div className="sold text">
                Sold: <span className="number fw-7 text-primary">{sold}</span>
              </div>
            </div>
            <div className="progress-cart">
              <div
                className="value"
                style={{ width: `${progressPercent}%` }}
                data-progress={progressPercent}
              />
            </div>
          </div>

          <ProductQuantityBuy product={product} />
          <ProductExtraActions />

          <div className="br-line" />

          <div className="tf-product-pickup-available">
            <span className="icon icon-CheckCircle1" />
            <div className="content">
              <p className="">
                <span className="fw-medium">
                  Pickup available at Sydney Store.
                </span>
                Usually ready in 24 hours.
              </p>
              <a
                href="#pickUp"
                data-bs-toggle="offcanvas"
                className="text-label cl-text-2 link text-decoration-underline"
              >
                Check availability other stores
              </a>
            </div>
          </div>

          <ProductDelivery />
          <ProductSafeCheckout />
        </div>
      </div>
    </div>
  );
}
