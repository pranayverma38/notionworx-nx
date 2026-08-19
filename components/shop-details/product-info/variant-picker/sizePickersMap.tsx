"use client";

import type { ComponentType } from "react";
import { SizePickerButtons } from "./SizePickerButtons";
import { SizePickerDropdown } from "./SizePickerDropdown";
import type { ProductVariantSizeType, SizePickerProps } from "./types";

export const SIZE_PICKERS: Record<
  ProductVariantSizeType,
  ComponentType<SizePickerProps>
> = {
  button: SizePickerButtons,
  dropdown: SizePickerDropdown,
};
