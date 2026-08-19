import type { ColorOption, SizeOption } from "@/context/ProductContext";

export type ProductVariantColorType =
  | "image"
  | "swatch"
  | "rounded"
  | "rounded-color"
  | "image-rounded"
  | "dropdown"
  | "dropdown-color";

export type ProductVariantSizeType = "button" | "dropdown";

export type ColorPickerProps = {
  colors: ColorOption[];
  currentColor: string;
  setCurrentColor: (value: string) => void;
};

export type SizePickerProps = {
  sizes: SizeOption[];
  currentSize: string;
  setCurrentSize: (value: string) => void;
};
