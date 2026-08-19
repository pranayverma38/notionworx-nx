"use client";

import Link from "next/link";
import {
  ProductCardBadgeList,
  ProductCardColorSwatches,
  ProductCardCountdown,
  ProductCardDualImageLink,
  ProductCardMarquee,
  ProductCardPriceWrap,
  ProductCardStars,
} from "./ProductCardParts";
import { ProductCardActionList } from "./ProductCardActionList";
import { ProductCardBottomSection } from "./ProductCardBottomSection";
import { useProductCard } from "./ProductCardContext";

export function ProductCardGridView() {
  const {
    product,
    wrapperClass,
    cardClass,
    infoClassName,
    nameLinkClasses,
    starWrapClassName,
    imgWidth,
    imgHeight,
    wowDelay,
    shopMeta,
    activeImage,
    activeHoverImage,
    setActiveImage,
    hasSize,
    shopGridStyleClass,
  } = useProductCard();

  return (
    <div
      className={`card-product wow fadeInUp${shopGridStyleClass} ${hasSize ? "has-size" : ""} ${cardClass}`.trim()}
      data-wow-delay={wowDelay}
      data-availability={shopMeta?.availability}
      data-brand={shopMeta?.brand}
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
        <ul className="product-action_list">
          <ProductCardActionList />
        </ul>
        <ProductCardBadgeList product={product} />
        <ProductCardBottomSection />
        {product.marquee != null && (
          <ProductCardMarquee text={product.marquee} />
        )}
        {product.countdown != null && <ProductCardCountdown />}
      </div>
      <div className={`card-product_info ${infoClassName}`.trim()}>
        <Link
          href={`/product-detail/${product.id}`}
          className={nameLinkClasses}
        >
          {product.name}
        </Link>
        <ProductCardStars className={starWrapClassName} />
        <ProductCardPriceWrap
          price={product.price}
          priceOld={product.priceOld}
        />
        {product.colors != null && product.colors.length > 0 && (
          <ProductCardColorSwatches
            colors={product.colors}
            activeImage={activeImage}
            onHoverColor={setActiveImage}
          />
        )}
      </div>
    </div>
  );
}
