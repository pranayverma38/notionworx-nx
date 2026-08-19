"use client";

import type { MouseEvent } from "react";
import AddToCartButton from "@/components/common/AddToCartButton";
import { useContextElement } from "@/context/Context";
import { ProductCardSizeList } from "./ProductCardParts";
import { useProductCard } from "./ProductCardContext";

function VariantSizeBox({ sizes }: { sizes: string[] }) {
  return (
    <div className="variant-box">
      <ProductCardSizeList sizes={sizes} />
    </div>
  );
}

/** Sizes strip + bottom CTAs (Quick Add / Quick View) for grid cards. */
export function ProductCardBottomSection() {
  const {
    gridVariant,
    product,
    hasSize,
    isShopGridHoverBar,
    actionBotLabel,
    actionBotHref,
    actionBotDataToggle,
  } = useProductCard();
  const { setQuickViewItem } = useContextElement();

  const openQuickView = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setQuickViewItem(product);
  };

  if (gridVariant === "shopGridHover06") {
    return (
      <>
        <div className="product-action_bot vertical">
          <AddToCartButton
            product={product}
            href="#quickAdd"
            dataToggle="modal"
            label="Quick Add"
            className="tf-btn btn-white small w-100 sm-d-none"
          />
          <a
            href="#quickView"
            data-bs-toggle="offcanvas"
            className="btn-icon-quick_view sm-d-none"
            onClick={openQuickView}
            aria-label="Quick view"
          >
            <i className="icon icon-Eye" aria-hidden />
          </a>
        </div>
        {hasSize && <VariantSizeBox sizes={product.sizes!} />}
      </>
    );
  }

  return (
    <>
      {hasSize && <VariantSizeBox sizes={product.sizes!} />}
      {gridVariant === "shopGridHover05" ? (
        <div className="product-action_bot vertical">
          <a
            href="#quickView"
            data-bs-toggle="offcanvas"
            className="tf-btn btn-white small w-100 sm-d-none"
            onClick={openQuickView}
          >
            Quick View
          </a>
          <AddToCartButton
            product={product}
            href="#quickAdd"
            dataToggle="modal"
            label="Quick Add"
          />
        </div>
      ) : (
        !isShopGridHoverBar && (
          <div className="product-action_bot">
            <AddToCartButton
              product={product}
              href={actionBotHref}
              dataToggle={actionBotDataToggle}
              label={actionBotLabel}
            />
          </div>
        )
      )}
    </>
  );
}
