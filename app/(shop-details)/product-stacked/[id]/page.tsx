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
import type { ProductSingleImage } from "@/types/productCard";

/**
 * Stacked grid: first row full width, then two columns (`.grid-img_stacked`).
 * Matches demo markup (no `detail-1_4` slide).
 */
const productStackedImages: ProductSingleImage[] = [
  {
    src: "/assets/images/product/single/detail-1.jpg",
    dataColor: "green",
    dataSize: "L",
  },
  {
    src: "/assets/images/product/single/detail-1_2.jpg",
    dataColor: "green",
    dataSize: "S",
  },
  {
    src: "/assets/images/product/single/detail-1_3.jpg",
    dataColor: "green",
    dataSize: "L",
  },
  {
    src: "/assets/images/product/single/detail-1_5.jpg",
    dataColor: "gray",
    dataSize: "M",
  },
  {
    src: "/assets/images/product/single/detail-1_6.jpg",
    dataColor: "gray",
    dataSize: "XL",
  },
  {
    src: "/assets/images/product/single/detail-1_7.jpg",
    dataColor: "black",
    dataSize: "M",
  },
  {
    src: "/assets/images/product/single/detail-1_8.jpg",
    dataColor: "black",
    dataSize: "L",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return await buildShopProductMetadata(id, "Product stacked");
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

  const pageProduct = {
    ...product,
    img: productStackedImages[0].src,
  };

  return (
    <>
      <Breadcrumb product={pageProduct} catalogProducts={catalogProducts} />
      <ProductSection
        product={pageProduct}
        mediaLayout="stacked"
        extraImages={productStackedImages}
        initialColor="green"
        initialSize="L"
      />
<ProductDescription product={pageProduct} />
      <RelatedProducts currentProduct={pageProduct} catalogProducts={catalogProducts} />
    </>
  );
}
