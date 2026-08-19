"use client";
import {
  ProductProvider,
  useProduct,
  ColorOption,
  SizeOption,
} from "@/context/ProductContext";
import ProductMedia from "@/components/shop-details/ProductMedia";
import ProductMediaGrid from "@/components/shop-details/ProductMediaGrid";
import ProductInfo from "@/components/shop-details/ProductInfo";
import ProductInfoGrouped from "@/components/shop-details/ProductInfoGrouped";
import ProductInfoAffiliate from "@/components/shop-details/ProductInfoAffiliate";
import ProductInfoOutOfStock from "@/components/shop-details/ProductInfoOutOfStock";
import ProductInfoTogether from "@/components/shop-details/ProductInfoTogether";
import ProductInfoCountdown from "@/components/shop-details/ProductInfoCountdown";
import ProductInfoVolumeDiscount from "@/components/shop-details/ProductInfoVolumeDiscount";
import ProductInfoAvailable from "@/components/shop-details/ProductInfoAvailable";
import ProductInfoPreOrder from "@/components/shop-details/ProductInfoPreOrder";
import ProductInfoDeals from "@/components/shop-details/ProductInfoDeals";
import ProductInfoCustomerNote from "@/components/shop-details/ProductInfoCustomerNote";
import ProductInfoBuyXGetY from "@/components/shop-details/ProductInfoBuyXGetY";
import ProductInfoSwatchColor from "@/components/shop-details/ProductInfoSwatchColor";
import ProductInfoSwatchRounded from "@/components/shop-details/ProductInfoSwatchRounded";
import ProductInfoSwatchRoundedColor from "@/components/shop-details/ProductInfoSwatchRoundedColor";
import ProductInfoSwatchRoundedImage from "@/components/shop-details/ProductInfoSwatchRoundedImage";
import ProductInfoSwatchDropdown from "@/components/shop-details/ProductInfoSwatchDropdown";
import ProductInfoSwatchDropdownColor from "@/components/shop-details/ProductInfoSwatchDropdownColor";
import { ProductCardItem, ProductSingleImage } from "@/types/productCard";

function ProductSectionInner({
  product,
  layout = "default",
  mediaLayout = "slider",
  parentClass = "section-product-single tf-main-product section-image-zoom",
}: {
  product: ProductCardItem;
  layout?:
    | "default"
    | "grouped"
    | "affiliate"
    | "out-of-stock"
    | "together"
    | "countdown"
    | "volume-discount"
    | "available"
    | "pre-order"
    | "deals"
    | "customer-note"
    | "buyx-gety"
    | "swatch-color"
    | "swatch-rounded"
    | "swatch-rounded-color"
    | "swatch-rounded-image"
    | "swatch-dropdown"
    | "swatch-dropdown-color";
  mediaLayout?: "slider" | "grid" | "grid-2" | "stacked";
  parentClass?: string;
}) {
  const { isZooming } = useProduct();

  return (
    <section className={`${parentClass} ${isZooming ? "zoom-active" : ""}`}>
      <div className="container">
        <div className="row">
          {mediaLayout === "grid" ? (
            <ProductMediaGrid product={product} />
          ) : mediaLayout === "grid-2" ? (
            <ProductMediaGrid product={product} variant="grid2" />
          ) : mediaLayout === "stacked" ? (
            <ProductMediaGrid product={product} variant="stacked" />
          ) : (
            <ProductMedia product={product} />
          )}
          {layout === "grouped" ? (
            <ProductInfoGrouped product={product} />
          ) : layout === "affiliate" ? (
            <ProductInfoAffiliate product={product} />
          ) : layout === "out-of-stock" ? (
            <ProductInfoOutOfStock product={product} />
          ) : layout === "together" ? (
            <ProductInfoTogether product={product} />
          ) : layout === "countdown" ? (
            <ProductInfoCountdown product={product} />
          ) : layout === "volume-discount" ? (
            <ProductInfoVolumeDiscount product={product} />
          ) : layout === "available" ? (
            <ProductInfoAvailable product={product} />
          ) : layout === "pre-order" ? (
            <ProductInfoPreOrder product={product} />
          ) : layout === "deals" ? (
            <ProductInfoDeals product={product} />
          ) : layout === "customer-note" ? (
            <ProductInfoCustomerNote product={product} />
          ) : layout === "buyx-gety" ? (
            <ProductInfoBuyXGetY product={product} />
          ) : layout === "swatch-color" ? (
            <ProductInfoSwatchColor product={product} />
          ) : layout === "swatch-rounded" ? (
            <ProductInfoSwatchRounded product={product} />
          ) : layout === "swatch-rounded-color" ? (
            <ProductInfoSwatchRoundedColor product={product} />
          ) : layout === "swatch-rounded-image" ? (
            <ProductInfoSwatchRoundedImage product={product} />
          ) : layout === "swatch-dropdown" ? (
            <ProductInfoSwatchDropdown product={product} />
          ) : layout === "swatch-dropdown-color" ? (
            <ProductInfoSwatchDropdownColor product={product} />
          ) : (
            <ProductInfo product={product} />
          )}
        </div>
      </div>
    </section>
  );
}

const demoImages: ProductSingleImage[] = [
  {
    src: "/assets/images/product/single/detail-1_2.jpg",
    dataColor: "green",
    dataSize: "S",
  },
  {
    src: "/assets/images/product/single/detail-1_3.jpg",
    dataColor: "green",
    dataSize: "M",
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

const demoColors: ColorOption[] = [
  {
    label: "Green",
    swatchClass: "bg-warm-brown",
    img: "/assets/images/product/single/img_square/detail-1_2.jpg",
  },
  {
    label: "Gray",
    swatchClass: "bg-dark-gray",
    img: "/assets/images/product/single/img_square/detail-1_5.jpg",
  },
  {
    label: "Black",
    swatchClass: "bg-black",
    img: "/assets/images/product/single/img_square/detail-1_7.jpg",
  },
];

const demoSizes: SizeOption[] = [
  { value: "S" },
  { value: "M" },
  { value: "L" },
  { value: "XL" },
  { value: "XXL" },
];

export default function ProductSection({
  product,
  thumbnailPosition = "left",
  zoomType = "default",
  initialColor = "green",
  initialSize = "S",
  initialQuantity = 1,
  extraImages = demoImages,
  colors = demoColors,
  sizes: sizesProp = demoSizes,
  layout = "default",
  mediaLayout = "slider",
  parentClass = "section-product-single tf-main-product section-image-zoom",
}: {
  product: ProductCardItem;
  parentClass?: string;
  thumbnailPosition?: "bottom" | "left" | "right";
  zoomType?: "default" | "inner" | "magnifying" | "none";
  initialColor?: string;
  initialSize?: string;
  initialQuantity?: number;
  extraImages?: ProductSingleImage[];
  colors?: ColorOption[];
  sizes?: (string | SizeOption)[];
  layout?:
    | "default"
    | "grouped"
    | "affiliate"
    | "out-of-stock"
    | "together"
    | "countdown"
    | "volume-discount"
    | "available"
    | "pre-order"
    | "deals"
    | "customer-note"
    | "buyx-gety"
    | "swatch-color"
    | "swatch-rounded"
    | "swatch-rounded-color"
    | "swatch-rounded-image"
    | "swatch-dropdown"
    | "swatch-dropdown-color";
  mediaLayout?: "slider" | "grid" | "grid-2" | "stacked";
}) {
  const sizes: SizeOption[] = sizesProp.map((s) =>
    typeof s === "string" ? { value: s } : s,
  );

  return (
    <ProductProvider
      initialColor={initialColor}
      initialSize={initialSize}
      initialQuantity={initialQuantity}
      extraImages={extraImages}
      colors={colors}
      sizes={sizes}
      thumbnailPosition={thumbnailPosition}
      zoomType={zoomType}
    >
      <ProductSectionInner
        parentClass={parentClass}
        product={product}
        layout={layout}
        mediaLayout={mediaLayout}
      />
    </ProductProvider>
  );
}
