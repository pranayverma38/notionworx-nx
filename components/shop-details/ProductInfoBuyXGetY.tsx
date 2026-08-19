"use client";
import Image from "next/image";

import { useProduct } from "@/context/ProductContext";
import { ProductCardItem } from "@/types/productCard";
import Link from "next/link";
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

export default function ProductInfoBuyXGetY({
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
            <ProductVariantPicker />
            <ProductQuantityBuy product={product} />
          </div>

          <ProductExtraActions />

          <div className="br-line" />

          <form className="form-buyX-getY" onSubmit={(e) => e.preventDefault()}>
            <h5 className="title-buyX-getY">Special Deal</h5>
            <div className="group-item-product">
              <div className="item-product">
                <div className="ribbon effect-flash">Buy 1</div>
                <div className="img-product">
                  <Image
                    loading="lazy"
                    src="/assets/images/product/product-2.jpg"
                    alt="img-product"
                  />
                </div>
                <div className="info-product">
                  <Link
                    href="/product-detail/1"
                    className="name-product lh-24 fw-medium link-underline-text text-line-clamp-2"
                  >
                    Buttons Cotton Top
                  </Link>
                  <div className="price-wrap">
                    <span className="price-new text-primary fw-semibold">
                      $49.99
                    </span>
                    <span className="price-old text-caption-01 cl-text-3">
                      $59.99
                    </span>
                  </div>
                  <div className="variant-product tf-select">
                    <select defaultValue="XS">
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                    </select>
                  </div>
                </div>
              </div>
              <span className="plus-add">
                <i className="icon icon-plus" />
              </span>
              <div className="item-product">
                <div className="ribbon effect-flash">Get 1 Off 20%</div>
                <div className="img-product">
                  <Image
                    loading="lazy"
                    src="/assets/images/product/product-3.jpg"
                    alt="img-product"
                  />
                </div>
                <div className="info-product">
                  <Link
                    href="/product-detail/2"
                    className="name-product lh-24 fw-medium link-underline-text text-line-clamp-2"
                  >
                    Wool Midi Coat
                  </Link>
                  <div className="price-wrap">
                    <span className="price-new text-primary fw-semibold">
                      $22.99
                    </span>
                    <span className="price-old text-caption-01 cl-text-3">
                      $48.99
                    </span>
                  </div>
                  <div className="variant-product tf-select">
                    <select defaultValue="XS">
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <a
              href="#shoppingCart"
              data-bs-toggle="offcanvas"
              className="tf-btn effect-flash"
            >
              Grab this deal
            </a>
          </form>

          <div className="br-line" />

          <ProductDelivery />
          <ProductSafeCheckout />
        </div>
      </div>
    </div>
  );
}
