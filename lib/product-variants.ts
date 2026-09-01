import type { ProductSizeVariant } from "@/types/productCard";

export function parseVariantPrice(value?: number | string | null): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
}

export function resolveVariantSelectionOption(
  variants: ProductSizeVariant[] | undefined,
  selectedValue?: string,
): ProductSizeVariant | undefined {
  if (!variants?.length) {
    return undefined;
  }

  if (selectedValue) {
    const exactMatch = variants.find((variant) => variant.value === selectedValue);
    if (exactMatch) {
      return exactMatch;
    }
  }

  return variants.find((variant) => variant.active) ?? variants[0];
}

export function getInitialVariantSelectionValue(
  variants: ProductSizeVariant[] | undefined,
): string | undefined {
  return resolveVariantSelectionOption(variants)?.value;
}

export function resolveConfiguredBasePrice(
  basePrice: number,
  variants: ProductSizeVariant[] | undefined,
  selectedValue?: string,
): number {
  return (
    parseVariantPrice(
      resolveVariantSelectionOption(variants, selectedValue)?.price,
    ) ?? basePrice
  );
}

export function resolveConfiguredCompareAtPrice(
  compareAtPrice: number | undefined,
  variants: ProductSizeVariant[] | undefined,
  selectedValue?: string,
): number | undefined {
  return (
    parseVariantPrice(
      resolveVariantSelectionOption(variants, selectedValue)?.compareAtPrice,
    ) ?? compareAtPrice
  );
}
