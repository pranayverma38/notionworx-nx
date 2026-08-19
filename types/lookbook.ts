import type { ProductCardItem } from "@/types/productCard";

/** One banner image with pin positions (e.g. "position1", "position2"). Pin products come from lookbookPinProducts by index. */
export interface LookbookBanner {
  img: string;
  /** CSS position classes for each pin (e.g. "position1", "position2"). Length = number of pins on this banner. */
  pinPositions: string[];
}

/** One item in the infinite strip (e.g. "Style in Motion"). */
export interface LookbookInfiniteItem {
  title: string;
  img: string;
}

/** Slide with banner image and pins that each have their own product (construction/bag lookbooks). */
export interface LookbookSlideWithPins {
  img: string;
  pins: { position: string; product: ProductCardItem }[];
}
