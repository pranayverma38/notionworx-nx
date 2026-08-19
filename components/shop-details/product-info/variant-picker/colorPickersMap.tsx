"use client";

import type { ComponentType } from "react";
import { ColorPickerDropdown } from "./ColorPickerDropdown";
import { ColorPickerDropdownColor } from "./ColorPickerDropdownColor";
import { ColorPickerImage } from "./ColorPickerImage";
import { ColorPickerImageRounded } from "./ColorPickerImageRounded";
import { ColorPickerRounded } from "./ColorPickerRounded";
import { ColorPickerRoundedColor } from "./ColorPickerRoundedColor";
import { ColorPickerSwatch } from "./ColorPickerSwatch";
import type { ColorPickerProps, ProductVariantColorType } from "./types";

export const COLOR_PICKERS: Record<
  ProductVariantColorType,
  ComponentType<ColorPickerProps>
> = {
  image: ColorPickerImage,
  "image-rounded": ColorPickerImageRounded,
  swatch: ColorPickerSwatch,
  rounded: ColorPickerRounded,
  "rounded-color": ColorPickerRoundedColor,
  dropdown: ColorPickerDropdown,
  "dropdown-color": ColorPickerDropdownColor,
};
