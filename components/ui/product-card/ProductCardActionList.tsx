"use client";

import AddToCartButton from "@/components/common/AddToCartButton";
import { useProductCard } from "./ProductCardContext";

/** Hover icon row: default vs 02–04 quick add first vs 05/06 compact row. */
export function ProductCardActionList() {
  const {
    product,
    gridVariant,
    isShopGridHoverBar,
    shopHoverActionClass,
  } = useProductCard();

  if (gridVariant === "shopGridHover05" || gridVariant === "shopGridHover06") {
    return (
      <>
        <li>
          <AddToCartButton
            product={product}
            href="#shoppingCart"
            dataToggle="offcanvas"
            label="Add to Cart"
            variant="tooltip"
            className="hover-tooltip tooltip-left box-icon"
          />
        </li>
      </>
    );
  }

  if (isShopGridHoverBar) {
    return (
      <>
        <li>
          <AddToCartButton
            product={product}
            href="#shoppingCart"
            dataToggle="offcanvas"
            variant="tooltip"
            className={shopHoverActionClass}
            label="Add to Cart"
          />
        </li>
      </>
    );
  }

  return (
    <>
      <li>
        <AddToCartButton
          product={product}
          href="#shoppingCart"
          dataToggle="offcanvas"
          variant="tooltip"
          label="Add to Cart"
        />
      </li>
    </>
  );
}
