import type { Metadata } from "next";
import Breadcrumb from "@/components/shop-details/Breadcrumb";
import RelatedProducts from "@/components/shop-details/RelatedProducts";
import ProductSection from "@/components/shop-details/ProductSection";
import { buildShopProductMetadata } from "@/lib/metadata/shop-product";
import { products } from "@/data/products/products";
import ProductDescription2 from "@/components/shop-details/ProductDescription2";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return buildShopProductMetadata(id, "Product detail");
}

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = products.find((p) => p.id === Number(id)) || products[0];

  return (
    <>
      <Breadcrumb product={product} />
      <ProductSection product={product} />
<ProductDescription2 />
      <RelatedProducts />
    </>
  );
}
