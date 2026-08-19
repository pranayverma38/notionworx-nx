"use client";

import AddToCartButton from "@/components/common/AddToCartButton";
import CompareButton from "@/components/common/CompareButton";
import QuickViewButton from "@/components/common/QuickViewButton";
import WishlistButton from "@/components/common/WishlistButton";
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
        <li className="wishlist">
          <WishlistButton
            product={product}
            className="hover-tooltip tooltip-left box-icon"
          />
        </li>
        <li className="compare">
          <CompareButton
            product={product}
            className="hover-tooltip tooltip-left box-icon"
          />
        </li>
        <li className="d-sm-none">
          <QuickViewButton
            product={product}
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
            href="#quickAdd"
            dataToggle="modal"
            variant="tooltip"
            className={shopHoverActionClass}
            label="Quick Add"
          />
        </li>
        <li className="wishlist">
          <WishlistButton
            product={product}
            className={shopHoverActionClass}
          />
        </li>
        <li className="compare">
          <CompareButton
            product={product}
            className={shopHoverActionClass}
          />
        </li>
        <li>
          <QuickViewButton
            product={product}
            className={shopHoverActionClass}
          />
        </li>
      </>
    );
  }

  return (
    <>
      <li className="wishlist">
        <WishlistButton product={product} />
      </li>
      <li className="compare">
        <CompareButton product={product} />
      </li>
      <li>
        <QuickViewButton product={product} />
      </li>
    </>
  );
}
