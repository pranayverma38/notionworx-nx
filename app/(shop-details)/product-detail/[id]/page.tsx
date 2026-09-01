import type { Metadata } from "next";
import Breadcrumb from "@/components/shop-details/Breadcrumb";
import ProductDescription from "@/components/shop-details/ProductDescription";
import RelatedProducts from "@/components/shop-details/RelatedProducts";
import ProductSection from "@/components/shop-details/ProductSection";
import { products as localProducts } from "@/data/products/products";
import {
  AMERCE_DEFAULT_DESCRIPTION,
  AMERCE_SITE_TITLE,
} from "@/lib/metadata/shop-product";
import {
  getShopCatalogProducts,
  getShopProductByRouteId,
} from "@/lib/medusa/notionworx-storefront";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = (await getShopProductByRouteId(id)) ?? localProducts[0];
  const title = `${product.name} | Product detail | ${AMERCE_SITE_TITLE}`;
  const rawDescription =
    product.description && product.description.trim().length > 0
      ? `${product.name} — ${product.description}`
      : `${product.name} — ${AMERCE_DEFAULT_DESCRIPTION}`;

  return {
    title,
    description: rawDescription.slice(0, 160),
  };
}

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const catalogProducts = await getShopCatalogProducts();
  const product = (await getShopProductByRouteId(id)) ?? catalogProducts[0] ?? localProducts[0];

  return (
    <>
      <Breadcrumb product={product} catalogProducts={catalogProducts} />
      <ProductSection product={product} />
      <ProductDescription product={product} />
      <RelatedProducts currentProduct={product} catalogProducts={catalogProducts} />
    </>
  );
}
