"use client";
import { useState } from "react";
import { useProduct } from "@/context/ProductContext";
import { ProductCardItem } from "@/types/productCard";
import ProductGroupedItems, { GroupedItem } from "./ProductGroupedItems";
import ProductAccordions from "./ProductAccordions";
import {
  ProductTitle,
  ProductShortDescription,
  ProductViews,
  ProductExtraActions,
  ProductDelivery,
  ProductSafeCheckout,
} from "./product-info";

export default function ProductInfoGrouped({
  product,
}: {
  product: ProductCardItem;
}) {
  const { registerPane } = useProduct();

  // State for grouped items
  const [groupedItems, setGroupedItems] = useState<GroupedItem[]>([
    {
      id: 1,
      name: "V-neck cotton T-shirt",
      price: 29.99,
      priceOld: 39.99,
      img: "/assets/images/product/product-3.jpg",
      quantity: 1,
      variant: "Green, XS",
    },
    {
      id: 2,
      name: "Square metallic frame sunglasses",
      price: 69.99,
      priceOld: 89.99,
      img: "/assets/images/product/product-6.jpg",
      quantity: 1,
      variant: "Green, XS",
    },
    {
      id: 3,
      name: "Oval shoulder bag",
      price: 49.99,
      priceOld: 59.99,
      img: "/assets/images/product/product-8.jpg",
      quantity: 1,
      variant: "Green, XS",
    },
  ]);

  const updateGroupedQuantity = (id: number, delta: number) => {
    setGroupedItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  };

  const updateGroupedVariant = (id: number, variant: string) => {
    setGroupedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, variant } : item)),
    );
  };

  const totalPrice = groupedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const oldPrice = groupedItems.reduce(
    (sum, item) => sum + (item.priceOld || item.price) * item.quantity,
    0,
  );

  return (
    <div className="col-md-6">
      <div className="tf-product-info-wrap position-relative mt-md-0">
        <div ref={registerPane} className="tf-zoom-main sticky-top" />
        <div className="tf-product-info-list mb-40 gap-20">
          <div className="tf-product-info-heading">
            <ProductTitle product={product} />
            <ProductShortDescription />
            <ProductViews />
          </div>

          <ProductGroupedItems
            items={groupedItems}
            onUpdateQuantity={updateGroupedQuantity}
            onUpdateVariant={updateGroupedVariant}
          />

          <div className="d-flex align-items-center gap-12">
            <div className="h6">Total Price:</div>
            <div className="product-infor-price">
              <h4 className="price-on-sale">${totalPrice.toFixed(2)}</h4>
              <div className="br-line type-vertical" />
              <p className="cl-text-3 text-decoration-line-through text-caption-01">
                ${oldPrice.toFixed(2)}
              </p>
              <span className="badge-sale text-white fw-semibold text-caption-02">
                -{Math.round(((oldPrice - totalPrice) / oldPrice) * 100)}%
              </span>
            </div>
          </div>
          <a
            href="#shoppingCart"
            data-bs-toggle="offcanvas"
            className="tf-btn type-xl animate-btn w-100"
          >
            Add To Cart
          </a>

          <ProductExtraActions />

          <div className="br-line" />

          <ProductDelivery />
          <ProductSafeCheckout />
        </div>

        <ProductAccordions />
      </div>
    </div>
  );
}
