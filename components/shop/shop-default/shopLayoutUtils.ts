import type { ProductCardProps } from "@/components/ui/ProductCard";

export type ShopLayoutVariant =
  | "default"
  | "leftSidebar"
  | "rightSidebar"
  | "loadMoreButton"
  | "infinityScroll"
  | "filterDropdown"
  | "filterDrawer"
  | "shopHover02"
  | "shopHover03"
  | "shopHover04"
  | "shopHover05"
  | "shopHover06";

export type ShopVariantProp = ShopLayoutVariant[];

export function normalizeShopVariants(
  input?: ShopLayoutVariant[],
): ShopLayoutVariant[] {
  if (input == null || input.length === 0) return ["default"];
  return input;
}

const HOVER_TO_CARD: Partial<
  Record<ShopLayoutVariant, NonNullable<ProductCardProps["variant"]>>
> = {
  shopHover02: "shopGridHover02",
  shopHover03: "shopGridHover03",
  shopHover04: "shopGridHover04",
  shopHover05: "shopGridHover05",
  shopHover06: "shopGridHover06",
};

/** Last matching `shopHover*` in the list wins. */
export function resolveGridProductCardVariant(
  variants: ShopLayoutVariant[],
): NonNullable<ProductCardProps["variant"]> {
  let card: NonNullable<ProductCardProps["variant"]> = "default";
  for (const v of variants) {
    const next = HOVER_TO_CARD[v];
    if (next) card = next;
  }
  return card;
}

/** Page numbers shown in the pagination control (max 5 buttons sliding window). */
export function computePageItems(
  totalPages: number,
  currentPage: number,
  maxBtn = 5,
): number[] {
  if (totalPages <= maxBtn) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + maxBtn - 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/** Viewport width at which desktop filter sidebars are shown instead of offcanvas. */
export const SHOP_SIDEBAR_DESKTOP_MIN_PX = 1200;
