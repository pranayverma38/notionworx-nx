"use client";
import Image from "next/image";
import { useMemo } from "react";

import { useProduct } from "@/context/ProductContext";
import { useStorefrontCatalog } from "@/hooks/useStorefrontCatalog";
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
  const { products } = useStorefrontCatalog();
  const dealProducts = useMemo(() => {
    const relatedProducts = products
      .filter((entry) => entry.id !== product.id)
      .slice(0, 1);

    return [product, ...relatedProducts];
  }, [product, products]);

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
              {dealProducts.map((dealProduct, index) => {
                const variantOptions =
                  dealProduct.sizes && dealProduct.sizes.length > 0
                    ? dealProduct.sizes
                    : ["Default"];
                const imageSrc =
                  dealProduct.img ??
                  dealProduct.images?.[0]?.src ??
                  "/assets/images/product/product-1.jpg";

                return (
                  <div key={dealProduct.id} className="d-flex align-items-center">
                    {index > 0 ? (
                      <span className="plus-add">
                        <i className="icon icon-plus" />
                      </span>
                    ) : null}
                    <div className="item-product">
                      <div className="ribbon effect-flash">
                        {index === 0 ? "Buy 1" : "Get 1 Off 20%"}
                      </div>
                      <div className="img-product">
                        <Image
                          loading="lazy"
                          src={imageSrc}
                          alt={dealProduct.name}
                          width={120}
                          height={160}
                        />
                      </div>
                      <div className="info-product">
                        <Link
                          href={`/product-detail/${dealProduct.id}`}
                          className="name-product lh-24 fw-medium link-underline-text text-line-clamp-2"
                        >
                          {dealProduct.name}
                        </Link>
                        <div className="price-wrap">
                          <span className="price-new text-primary fw-semibold">
                            ${dealProduct.price.toFixed(2)}
                          </span>
                          {dealProduct.priceOld != null ? (
                            <span className="price-old text-caption-01 cl-text-3">
                              ${dealProduct.priceOld.toFixed(2)}
                            </span>
                          ) : null}
                        </div>
                        <div className="variant-product tf-select">
                          <select defaultValue={variantOptions[0]}>
                            {variantOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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
