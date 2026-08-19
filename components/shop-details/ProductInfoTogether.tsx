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

interface BundleItem {
  id: number;
  name: string;
  price: number;
  img: string;
  color: string;
  size: string;
  selected: boolean;
}

export default function ProductInfoTogether({
  product,
}: {
  product: ProductCardItem;
}) {
  const { registerPane } = useProduct();

  const [bundleItems, setBundleItems] = useState<BundleItem[]>([
    {
      id: 1,
      name: "V-neck cotton T-shirt",
      price: 29.99,
      img: "/assets/images/product/product-3.jpg",
      color: "Light Gray",
      size: "Small",
      selected: true,
    },
    {
      id: 2,
      name: "Oval shoulder bag",
      price: 69.99,
      img: "/assets/images/product/product-6.jpg",
      color: "Light Gray",
      size: "Small",
      selected: false,
    },
    {
      id: 3,
      name: "V-neck cotton T-shirt",
      price: 49.99,
      img: "/assets/images/product/product-8.jpg",
      color: "Light Gray",
      size: "Small",
      selected: false,
    },
  ]);

  const primaryBundleId = bundleItems[0]?.id;

  const toggleBundleItem = (id: number) => {
    if (id === primaryBundleId) return;
    setBundleItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item,
      ),
    );
  };

  /** Current product (first row) is always included; extras are optional checkboxes. */
  const totalPrice =
    (bundleItems[0]?.price ?? 0) +
    bundleItems
      .slice(1)
      .filter((item) => item.selected)
      .reduce((sum, item) => sum + item.price, 0);

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

          <div className="tf-product-fbt">
            <h5 className="mb-24">Frequently Bought Together</h5>
            <ul className="list-order-product list-bundle-prd">
              {bundleItems.map((item, index) => (
                <li key={item.id} className="order-item fw-medium">
                  <div className="bundle-check d-flex">
                    <input
                      type="checkbox"
                      name={
                        index === 0
                          ? "fbt-current-product"
                          : `bundle-extra-${item.id}`
                      }
                      className="tf-check style-2"
                      checked={index === 0 ? true : item.selected}
                      onChange={() => {
                        if (index !== 0) toggleBundleItem(item.id);
                      }}
                      aria-label={
                        index === 0
                          ? "Current product, always included"
                          : undefined
                      }
                    />
                  </div>
                  <a href="#" className="img-prd">
                    <Image
                      loading="lazy"
                      width={100}
                      height={133}
                      src={item.img}
                      alt={item.name}
                    />
                  </a>
                  <div className="infor-prd">
                    <a
                      href="#"
                      className="prd_name fw-medium lh-24 link link-underline text-capitalize"
                    >
                      {item.name}
                    </a>
                    <div className="text-caption-01">
                      <span className="cl-text-2"> Color: </span>
                      {item.color}
                    </div>
                    <div className="text-caption-01">
                      <span className="cl-text-2"> Size: </span>
                      {item.size}
                    </div>
                  </div>
                  <div className="quantity-price text-primary">
                    ${item.price}
                  </div>
                </li>
              ))}
            </ul>
            <h6 className="bundle-total-submit mb-12">
              <span className="text cl-text-2 fw-normal">Total price:</span>
              &nbsp;
              <span className="total-price-bundle fw-semibold">
                ${totalPrice.toFixed(2)}
              </span>
            </h6>
            <button
              data-bs-target="#shoppingCart"
              type="button"
              data-bs-toggle="offcanvas"
              className="btn-submit-total tf-btn btn-primary w-100 animate-btn"
            >
              Add Selected To Cart
              <i className="icon icon-shopping-cart-simple fs-24" />
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
