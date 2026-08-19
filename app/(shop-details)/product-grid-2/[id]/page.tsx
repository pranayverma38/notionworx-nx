import Breadcrumb from "@/components/shop-details/Breadcrumb";
import ProductDescription from "@/components/shop-details/ProductDescription";
import RelatedProducts from "@/components/shop-details/RelatedProducts";
import ProductSection from "@/components/shop-details/ProductSection";
import { products } from "@/data/products/products";
import type { Metadata } from "next";
import { buildShopProductMetadata } from "@/lib/metadata/shop-product";
import type { ProductSingleImage } from "@/types/productCard";

/** Gallery rows for the two-column grid (`.grid-img_2`); matches theme markup / scroll `data-*` hooks. */
const productGrid2Images: ProductSingleImage[] = [
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
    src: "/assets/images/product/single/detail-1_4.jpg",
    dataColor: "green",
    dataSize: "S",
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
  return buildShopProductMetadata(id, "Product grid 2");
}

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const base = products.find((p) => p.id === Number(id)) || products[0];
  const product = {
    ...base,
    img: productGrid2Images[0].src,
  };

  return (
    <>
      <Breadcrumb product={product} />
      <ProductSection
        product={product}
        mediaLayout="grid-2"
        extraImages={productGrid2Images}
        initialColor="green"
        initialSize="L"
      />
<ProductDescription />
      <RelatedProducts />
    </>
  );
}
