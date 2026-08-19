
import Breadcrumb from "@/components/shop-details/Breadcrumb";
import ProductDescription from "@/components/shop-details/ProductDescription";
import RelatedProducts from "@/components/shop-details/RelatedProducts";
import ProductSection from "@/components/shop-details/ProductSection";
import { products } from "@/data/products/products";
import type { Metadata } from "next";
import { buildShopProductMetadata } from "@/lib/metadata/shop-product";



export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return buildShopProductMetadata(id, "Swatch dropdown color");
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
      <ProductSection product={product} layout="swatch-dropdown-color" />
<ProductDescription />
      <RelatedProducts />
    </>
  );
}
