import type { Metadata } from "next";
import { products } from "@/data/products/products";

export const AMERCE_SITE_TITLE =
  "Notion Worx";

export const AMERCE_DEFAULT_DESCRIPTION =
  "Custom canopies, trade show displays, flags, apparel, and event essentials available from the migrated storefront.";

export function buildShopProductMetadata(
  id: string,
  pageLabel: string,
): Metadata {
  const product = products.find((p) => p.id === Number(id)) || products[0];
  const title = `${product.name} | ${pageLabel} | ${AMERCE_SITE_TITLE}`;
  const rawDesc =
    product.description && product.description.trim().length > 0
      ? `${product.name} — ${product.description}`
      : `${product.name} — ${AMERCE_DEFAULT_DESCRIPTION}`;
  const description = rawDesc.slice(0, 160);
  return { title, description };
}
