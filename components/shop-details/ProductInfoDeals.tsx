"use client";
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

interface SimpleDeal {
  id: number;
  count: number;
  discount: number;
  totalPrice: number;
}

export default function ProductInfoDeals({
  product,
}: {
  product: ProductCardItem;
}) {
  const { registerPane } = useProduct();
  const [selectedDeal, setSelectedDeal] = useState<number>(1);

  const deals: SimpleDeal[] = [
    {
      id: 1,
      count: 5,
      discount: 15,
      totalPrice: 51.0,
    },
    {
      id: 2,
      count: 10,
      discount: 20,
      totalPrice: 102.0,
    },
    {
      id: 3,
      count: 15,
      discount: 25,
      totalPrice: 153.0,
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

          <div className="tf-product-volume-discount">
            <h5 className="mb-20">Best Deal For You</h5>
            <div className="flat-check-list list-volume-discount">
              {deals.map((deal) => (
                <label
                  key={deal.id}
                  className={`check-item volume-discount-item ${
                    selectedDeal === deal.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedDeal(deal.id)}
                >
                  <span className="content">
                    <span className="volume-check">
                      <input
                        className="tf-check-rounded style-2"
                        type="radio"
                        name="volume_discount"
                        checked={selectedDeal === deal.id}
                        onChange={() => setSelectedDeal(deal.id)}
                      />
                    </span>
                    <span className="name fw-semibold">
                      Buy {deal.count} item{deal.count > 1 ? "s" : ""} for{" "}
                      {deal.discount}% OFF per item
                    </span>
                    <span className="tags-save text-caption-01">
                      Save {deal.discount}%
                    </span>
                  </span>
                  <span className="d-block text-end">
                    <span className="cl-text-2">Total price:</span>
                    <span className="price-total fw-semibold">
                      ${deal.totalPrice.toFixed(2)}
                    </span>
                  </span>
                </label>
              ))}
            </div>
            <button
              data-bs-target="#shoppingCart"
              type="button"
              data-bs-toggle="offcanvas"
              className="tf-btn animate-btn btn-add-to-cart"
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
