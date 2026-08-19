"use client";

import { useState } from "react";
import type { ProductCardItem } from "@/types/productCard";
import {
  buildProductCardContextValue,
  ProductCardProvider,
} from "./product-card/ProductCardContext";
import type { ProductCardLayoutVariant } from "./product-card/productCardTypes";
import { ProductCardGridView } from "./product-card/ProductCardGridView";
import { ProductCardMiniList } from "./product-card/ProductCardMiniList";
import { ProductCardShopList } from "./product-card/ProductCardShopList";

export interface ProductCardProps {
  product: ProductCardItem;
  /** Shop grid hover variants: 02–04 Quick Add first in `product-action_list`, no default bottom bar. Hover-05/06: same icon row; 05 = text Quick View + Quick Add; 06 = Quick Add + icon quick view, `variant-box` after the bar. */
  variant?: ProductCardLayoutVariant;
  /** Optional data attributes for shop filtering / theme scripts. */
  shopMeta?: { brand?: string; availability?: string };
  /** Extra class on card-product_wrapper (e.g. "square") */
  wrapperClass?: string;
  /** Bottom CTA label. Default "Quick Add" */
  actionBotLabel?: string;
  /** Bottom CTA href. Default "#quickAdd" */
  actionBotHref?: string;
  /** Bottom CTA data attribute (e.g. "modal" for data-bs-toggle="modal") */
  actionBotDataToggle?: "modal" | "offcanvas";
  /** Card wrapper class (e.g. "has-size"). Default none. */
  cardClass?: string;
  /** Extra classes on `.card-product_info` (e.g. bundle lookbook: text-center align-items-center). */
  infoClassName?: string;
  /** Classes for the title link; default `link-underline-text`. */
  nameLinkClassName?: string;
  /** Passed to root as `data-wow-delay` (e.g. "0.1s"). */
  wowDelay?: string;
  /** Extra classes on `.star-wrap` (e.g. `justify-content-center` for bundle lookbook). */
  starWrapClassName?: string;
  imgWidth?: number;
  imgHeight?: number;
  showRatting?: boolean;
}

export default function ProductCard({
  product,
  variant = "default",
  wrapperClass = "",
  actionBotLabel = "Quick Add",
  actionBotHref = "#quickAdd",
  actionBotDataToggle = "modal",
  cardClass = "",
  infoClassName = "",
  nameLinkClassName,
  wowDelay,
  starWrapClassName = "",
  imgWidth = 330,
  imgHeight = 440,
  shopMeta,
  showRatting = true,
}: ProductCardProps) {
  const defaultImage = product.img ?? "";
  const [activeImage, setActiveImage] = useState(defaultImage);
  const activeHoverImage =
    activeImage === defaultImage
      ? (product.imgHover ?? defaultImage)
      : activeImage;

  const hasSize = product.sizes != null && product.sizes.length > 0;
  const nameLinkClasses =
    `name-product lh-24 fw-medium ${nameLinkClassName ?? "link-underline-text"}`.trim();

  const contextValue = buildProductCardContextValue({
    product,
    layoutVariant: variant,
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
    actionBotLabel,
    actionBotHref,
    actionBotDataToggle,
    wowDelay,
  });

  if (variant === "shopList") {
    return (
      <ProductCardProvider value={contextValue}>
        <ProductCardShopList />
      </ProductCardProvider>
    );
  }

  if (variant === "miniList" && product.img != null) {
    return (
      <ProductCardProvider value={contextValue}>
        <ProductCardMiniList />
      </ProductCardProvider>
    );
  }

  return (
    <ProductCardProvider value={contextValue}>
      <ProductCardGridView />
    </ProductCardProvider>
  );
}
