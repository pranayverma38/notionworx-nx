import type { ProductCardGridVariant } from "./productCardTypes";

/** Layout flags for shop grid hover variants (02–04 toolbar, 03/04 style classes). */
export function shopHoverBarFlags(variant: ProductCardGridVariant) {
  const isShopGridHoverBar =
    variant === "shopGridHover02" ||
    variant === "shopGridHover03" ||
    variant === "shopGridHover04";

  const shopHoverActionClass =
    variant === "shopGridHover02"
      ? "hover-tooltip tooltip-left box-icon"
      : "hover-tooltip box-icon";

  const shopGridStyleClass =
    variant === "shopGridHover03"
      ? " style-2"
      : variant === "shopGridHover04"
        ? " style-4"
        : "";

  return { isShopGridHoverBar, shopHoverActionClass, shopGridStyleClass };
}

export function badgeClassFromBadge(badge: string | undefined): string {
  return badge?.toUpperCase() === "NEW" ? "new" : "sale";
}

export const STAR_COUNT = 5;
