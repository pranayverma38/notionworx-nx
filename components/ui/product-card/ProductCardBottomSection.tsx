"use client";

import AddToCartButton from "@/components/common/AddToCartButton";
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
  const isQuickAddAction = actionBotHref === "#quickAdd";

  if (gridVariant === "shopGridHover06") {
    return (
      <>
        <div className="product-action_bot vertical">
          <AddToCartButton
            product={product}
            href="#shoppingCart"
            dataToggle="offcanvas"
            label="Add to Cart"
            className="tf-btn btn-white small w-100 sm-d-none"
          />
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
          <AddToCartButton
            product={product}
            href="#shoppingCart"
            dataToggle="offcanvas"
            label="Add to Cart"
          />
        </div>
      ) : (
        !isShopGridHoverBar &&
        !isQuickAddAction && (
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
