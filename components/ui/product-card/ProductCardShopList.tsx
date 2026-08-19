"use client";

import Link from "next/link";
import AddToCartButton from "@/components/common/AddToCartButton";
import CompareButton from "@/components/common/CompareButton";
import QuickViewButton from "@/components/common/QuickViewButton";
import WishlistButton from "@/components/common/WishlistButton";
import {
  ProductCardBadgeList,
  ProductCardDualImageLink,
  ProductCardMarquee,
  ProductCardColorSwatches,
  ProductCardPriceWrap,
  ProductCardSizeList,
  ProductCardStars,
} from "./ProductCardParts";
import { useProductCard } from "./ProductCardContext";

const LIST_DESCRIPTION =
  "Button-up shirt sleeves and a relaxed silhouette. It’s tailored with drapey, crinkle-texture fabric that’s made from LENZING™ ECOVERO™ Viscose — responsibly sourced wood-based fibres produced through a process that reduces...";

export function ProductCardShopList() {
  const {
    product,
    wrapperClass,
    cardClass,
    infoClassName,
    nameLinkClasses,
    starWrapClassName,
    imgWidth,
    imgHeight,
    shopMeta,
    showRatting,
    activeImage,
    activeHoverImage,
    setActiveImage,
    hasSize,
  } = useProductCard();

  const availability = shopMeta?.availability ?? "In Stock";
  const brand = shopMeta?.brand ?? "";

  return (
    <div
      className={`card-product product-style_list ${cardClass}`.trim()}
      data-availability={availability}
      data-brand={brand}
    >
      <div className={`card-product_wrapper ${wrapperClass}`.trim()}>
        <ProductCardDualImageLink
          productId={product.id}
          activeImage={activeImage}
          hoverImage={activeHoverImage}
          alt={product.name}
          width={imgWidth}
          height={imgHeight}
        />
        <ProductCardBadgeList product={product} />
        {product.marquee != null && (
          <ProductCardMarquee text={product.marquee} />
        )}
      </div>
      <div className={`card-product_info ${infoClassName}`.trim()}>
        <Link
          href={`/product-detail/${product.id}`}
          className={nameLinkClasses}
        >
          {product.name}
        </Link>
        {showRatting ? (
          <ProductCardStars className={starWrapClassName} />
        ) : null}
        <ProductCardPriceWrap
          price={product.price}
          priceOld={product.priceOld}
        />
        <p className="description text-caption-01 mb-10">{LIST_DESCRIPTION}</p>
        {product.colors != null && product.colors.length > 0 && (
          <ProductCardColorSwatches
            colors={product.colors}
            activeImage={activeImage}
            onHoverColor={setActiveImage}
          />
        )}
        {hasSize && (
          <ProductCardSizeList
            sizes={product.sizes!}
            className="mb-10"
          />
        )}
        <ul className="product-action_list">
          <li>
            <AddToCartButton
              product={product}
              href="#shoppingCart"
              dataToggle="offcanvas"
              className="hover-tooltip tooltip-top box-icon"
              label="Add to Cart"
              variant="tooltip"
            />
          </li>
          <li className="wishlist">
            <WishlistButton
              product={product}
              className="hover-tooltip tooltip-top box-icon"
            />
          </li>
          <li className="compare">
            <CompareButton
              product={product}
              className="hover-tooltip tooltip-top box-icon"
            />
          </li>
          <li>
            <QuickViewButton
              product={product}
              className="hover-tooltip tooltip-top box-icon"
            />
          </li>
        </ul>
      </div>
    </div>
  );
}
