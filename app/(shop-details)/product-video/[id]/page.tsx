
import Breadcrumb from "@/components/shop-details/Breadcrumb";
import { ProductSingleImage } from "@/types/productCard";
import ProductDescription from "@/components/shop-details/ProductDescription";
import RelatedProducts from "@/components/shop-details/RelatedProducts";
import ProductSection from "@/components/shop-details/ProductSection";
import { products } from "@/data/products/products";
import type { Metadata } from "next";
import { buildShopProductMetadata } from "@/lib/metadata/shop-product";

const videoImages: ProductSingleImage[] = [
  {
    src: "/assets/images/product/single/detail-1.jpg",
    dataColor: "green",
    dataSize: "S",
  },
  {
    src: "/assets/images/product/single/detail-1_3.jpg",
    dataColor: "green",
    dataSize: "M",
    video: "/assets/images/video/video-product.mp4",
  },
  {
    src: "/assets/images/product/single/detail-1_2.jpg",
    dataColor: "green",
    dataSize: "L",
  },
  {
    src: "/assets/images/product/single/detail-1_4.jpg",
    dataColor: "green",
    dataSize: "XL",
  },
  {
    src: "/assets/images/product/single/detail-1_5.jpg",
    dataColor: "gray",
    dataSize: "M",
  },
  {
    src: "/assets/images/product/single/detail-1_6.jpg",
    dataColor: "gray",
    dataSize: "M",
  },
  {
    src: "/assets/images/product/single/detail-1_7.jpg",
    dataColor: "black",
    dataSize: "L",
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
  return buildShopProductMetadata(id, "Video");
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
      <ProductSection product={product} extraImages={videoImages} />
<ProductDescription />
      <RelatedProducts />
    </>
  );
}
