"use client";

import { VariantSizeLabel } from "./VariantSizeLabel";
import { cx } from "./cx";
import type { SizePickerProps } from "./types";

export function SizePickerButtons({
  sizes,
  currentSize,
  setCurrentSize,
}: SizePickerProps) {
  return (
    <div className="variant-picker-item variant-size">
      <VariantSizeLabel currentSize={currentSize} />
      <div className="variant-picker-values">
        {sizes.map((size) => {
          const active = currentSize === size.value;
          return (
            <span
              key={size.value}
              className={cx("size-btn", active && "active")}
              onClick={() => setCurrentSize(size.value)}
            >
              {size.value}
            </span>
          );
        })}
      </div>
    </div>
  );
}
