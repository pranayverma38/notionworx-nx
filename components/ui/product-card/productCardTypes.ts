/** Card layout mode from parent props (list / mini / grid + hover styles). */
export type ProductCardLayoutVariant =
  | "default"
  | "miniList"
  | "shopList"
  | "shopGridHover02"
  | "shopGridHover03"
  | "shopGridHover04"
  | "shopGridHover05"
  | "shopGridHover06";

/** Variant used by grid toolbar + bottom bar (list/mini map to default grid chrome). */
export type ProductCardGridVariant =
  | "default"
  | "shopGridHover02"
  | "shopGridHover03"
  | "shopGridHover04"
  | "shopGridHover05"
  | "shopGridHover06";

export function layoutToGridVariant(
  v: ProductCardLayoutVariant | undefined,
): ProductCardGridVariant {
  if (v === "shopList" || v === "miniList") return "default";
  return (v ?? "default") as ProductCardGridVariant;
}
