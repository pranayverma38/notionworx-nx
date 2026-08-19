"use client";

import Image from "next/image";
import { useState } from "react";
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

interface DiscountDeal {
  id: number;
  count: number;
  priceNew: number;
  priceOld: number;
  save: number;
  img: string;
}

export default function ProductInfoVolumeDiscount({
  product,
}: {
  product: ProductCardItem;
}) {
  const { registerPane } = useProduct();
  const [selectedDeal, setSelectedDeal] = useState<number>(1);

  const deals: DiscountDeal[] = [
    {
      id: 1,
      count: 1,
      priceNew: 39.99,
      priceOld: 49.99,
      save: 15,
      img: "/assets/images/product/product-1.jpg",
    },
    {
      id: 2,
      count: 2,
      priceNew: 59.99,
      priceOld: 69.99,
      save: 20,
      img: "/assets/images/product/product-2.jpg",
    },
    {
      id: 3,
      count: 3,
      priceNew: 79.99,
      priceOld: 89.99,
      save: 25,
      img: "/assets/images/product/product-3.jpg",
    },
  ];

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

          <div className="tf-product-volume-discount overflow-auto">
            <h5 className="mb-20">Best Deal For You</h5>
            <div className="flat-check-list list-volume-discount-thumbnail">
              {deals.map((deal) => (
                <label
                  key={deal.id}
                  className={`check-item volume-discount-thumbnail-item ${
                    selectedDeal === deal.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedDeal(deal.id)}
                >
                  <span className="volume-check d-none">
                    <input
                      type="radio"
                      name="volume_discount"
                      checked={selectedDeal === deal.id}
                      onChange={() => setSelectedDeal(deal.id)}
                    />
                  </span>
                  <div className="image-box">
                    <Image
                      loading="lazy"
                      width={210}
                      height={280}
                      src={deal.img}
                      alt="Image"
                    />
                    <div className="tags-save text-caption-01">
                      Save {deal.save}%
                    </div>
                  </div>
                  <div className="content-discount">
                    <p className="count fw-medium text-body-1">
                      Buy {deal.count} item{deal.count > 1 ? "s" : ""}
                    </p>
                    <div className="price-wrap">
                      <span className="price-new text-primary fw-semibold">
                        ${deal.priceNew.toFixed(2).replace(".", ",")}
                      </span>
                      <span className="price-old text-caption-01 cl-text-3">
                        ${deal.priceOld.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            <button
              data-bs-target="#shoppingCart"
              type="button"
              data-bs-toggle="offcanvas"
              className="tf-btn animate-btn w-100"
            >
              Choose this deal
            </button>
          </div>

          <div className="br-line" />

          <ProductDelivery />
          <ProductSafeCheckout />
        </div>
      </div>
    </div>
  );
}
