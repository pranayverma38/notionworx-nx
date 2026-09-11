import type { Metadata } from "next";
import {
  getShopCatalogProducts,
  getShopProductByRouteId,
} from "@/lib/medusa/notionworx-storefront";
import type { ProductCardItem } from "@/types/productCard";

export const AMERCE_SITE_TITLE =
  "Notion Worx";

export const AMERCE_DEFAULT_DESCRIPTION =
  "Custom canopies, trade show displays, flags, apparel, and event essentials available from the migrated storefront.";

async function getResolvedShopProductData(
  id: string,
): Promise<{
  product: ProductCardItem | null;
  catalogProducts: ProductCardItem[];
}> {
  const catalogProducts = await getShopCatalogProducts();
  const product =
    (await getShopProductByRouteId(id)) ?? catalogProducts[0] ?? null;

  return {
    product,
    catalogProducts,
  };
}

export async function buildShopProductMetadata(
  id: string,
  pageLabel: string,
): Promise<Metadata> {
  const { product } = await getResolvedShopProductData(id);
  if (!product) {
    return {
      title: `${pageLabel} | ${AMERCE_SITE_TITLE}`,
      description: AMERCE_DEFAULT_DESCRIPTION,
    };
  }
  const title = `${product.name} | ${pageLabel} | ${AMERCE_SITE_TITLE}`;
  const rawDesc =
    product.description && product.description.trim().length > 0
      ? `${product.name} — ${product.description}`
      : `${product.name} — ${AMERCE_DEFAULT_DESCRIPTION}`;
  const description = rawDesc.slice(0, 160);
  return { title, description };
}

export async function getShopProductPageData(id: string): Promise<{
  product: ProductCardItem | null;
  catalogProducts: ProductCardItem[];
}> {
  return getResolvedShopProductData(id);
}
