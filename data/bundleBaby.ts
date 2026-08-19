import type { ProductCardItem } from "@/types/productCard";
import { bundleBabyPinProducts } from "@/data/products/products";

export interface BundleBabyPin {
  position: string;
  product: ProductCardItem;
}

export interface BundleBabySlide {
  img: string;
  pins: BundleBabyPin[];
}

/** Two bundle banner slides with pins (position4, position5). */
export const bundleBabySlides: BundleBabySlide[] = [
  {
    img: "/assets/images/section/banner-lookbook-6.jpg",
    pins: [
      {
        position: "position4",
        product: bundleBabyPinProducts[0],
      },
      {
        position: "position5",
        product: bundleBabyPinProducts[1],
      },
    ],
  },
  {
    img: "/assets/images/section/banner-lookbook-7.jpg",
    pins: [
      {
        position: "position4",
        product: bundleBabyPinProducts[2],
      },
      {
        position: "position5",
        product: bundleBabyPinProducts[3],
      },
    ],
  },
];
