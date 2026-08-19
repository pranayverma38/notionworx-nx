"use client";

import { useProduct } from "@/context/ProductContext";
import { COLOR_PICKERS } from "./colorPickersMap";
import { SIZE_PICKERS } from "./sizePickersMap";
import type { ProductVariantColorType, ProductVariantSizeType } from "./types";

export type { ProductVariantColorType, ProductVariantSizeType } from "./types";

export function ProductVariantPicker({
  colorType = "image",
  sizeType = "button",
}: {
  colorType?: ProductVariantColorType;
  sizeType?: ProductVariantSizeType;
} = {}) {
  const {
    currentColor,
    setCurrentColor,
    currentSize,
    setCurrentSize,
    colors,
    sizes,
  } = useProduct();

  const ColorPicker = COLOR_PICKERS[colorType];
  const SizePicker = SIZE_PICKERS[sizeType];

  return (
    <>
      {colors.length > 0 && (
        <ColorPicker
          colors={colors}
          currentColor={currentColor}
          setCurrentColor={setCurrentColor}
        />
      )}
      {sizes.length > 0 && (
        <SizePicker
          sizes={sizes}
          currentSize={currentSize}
          setCurrentSize={setCurrentSize}
        />
      )}
    </>
  );
}
