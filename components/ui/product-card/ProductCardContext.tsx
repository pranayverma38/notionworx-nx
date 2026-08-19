"use client";

import {
  createContext,
  useContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { ProductCardItem } from "@/types/productCard";
import {
  layoutToGridVariant,
  type ProductCardGridVariant,
  type ProductCardLayoutVariant,
} from "./productCardTypes";
import { shopHoverBarFlags } from "./productCardUtils";

export type ProductCardContextValue = {
  product: ProductCardItem;
  layoutVariant: ProductCardLayoutVariant;
  gridVariant: ProductCardGridVariant;
  wrapperClass: string;
  cardClass: string;
  infoClassName: string;
  nameLinkClasses: string;
  starWrapClassName: string;
  imgWidth: number;
  imgHeight: number;
  shopMeta?: { brand?: string; availability?: string };
  showRatting: boolean;
  activeImage: string;
  activeHoverImage: string;
  setActiveImage: Dispatch<SetStateAction<string>>;
  hasSize: boolean;
  actionBotLabel: string;
  actionBotHref: string;
  actionBotDataToggle: "modal" | "offcanvas";
  wowDelay?: string;
  isShopGridHoverBar: boolean;
  shopHoverActionClass: string;
  shopGridStyleClass: string;
};

const ProductCardContext = createContext<ProductCardContextValue | null>(null);

export function ProductCardProvider({
  value,
  children,
}: {
  value: ProductCardContextValue;
  children: ReactNode;
}) {
  return (
    <ProductCardContext.Provider value={value}>
      {children}
    </ProductCardContext.Provider>
  );
}

export function useProductCard(): ProductCardContextValue {
  const ctx = useContext(ProductCardContext);
  if (ctx == null) {
    throw new Error("useProductCard must be used within <ProductCardProvider>");
  }
  return ctx;
}

export function buildProductCardContextValue(params: {
  product: ProductCardItem;
  layoutVariant: ProductCardLayoutVariant;
  wrapperClass: string;
  cardClass: string;
  infoClassName: string;
  nameLinkClasses: string;
  starWrapClassName: string;
  imgWidth: number;
  imgHeight: number;
  shopMeta?: { brand?: string; availability?: string };
  showRatting: boolean;
  activeImage: string;
  activeHoverImage: string;
  setActiveImage: Dispatch<SetStateAction<string>>;
  hasSize: boolean;
  actionBotLabel: string;
  actionBotHref: string;
  actionBotDataToggle: "modal" | "offcanvas";
  wowDelay?: string;
}): ProductCardContextValue {
  const gridVariant = layoutToGridVariant(params.layoutVariant);
  const { isShopGridHoverBar, shopHoverActionClass, shopGridStyleClass } =
    shopHoverBarFlags(gridVariant);

  return {
    ...params,
    gridVariant,
    isShopGridHoverBar,
    shopHoverActionClass,
    shopGridStyleClass,
  };
}
