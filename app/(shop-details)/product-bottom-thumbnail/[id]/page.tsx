
import Breadcrumb from "@/components/shop-details/Breadcrumb";
import ProductDescription from "@/components/shop-details/ProductDescription";
import RelatedProducts from "@/components/shop-details/RelatedProducts";
import ProductSection from "@/components/shop-details/ProductSection";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  buildShopProductMetadata,
  getShopProductPageData,
} from "@/lib/metadata/shop-product";



export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return await buildShopProductMetadata(id, "Bottom thumbnail");
}

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { product, catalogProducts } = await getShopProductPageData(id);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Breadcrumb product={product} catalogProducts={catalogProducts} />
      <ProductSection product={product} thumbnailPosition="bottom" />
<ProductDescription product={product} />
      <RelatedProducts currentProduct={product} catalogProducts={catalogProducts} />
    </>
  );
}
