"use client";

import { VariantSizeLabel } from "./VariantSizeLabel";
import { cx } from "./cx";
import type { SizePickerProps } from "./types";

export function SizePickerDropdown({
  sizes,
  currentSize,
  setCurrentSize,
}: SizePickerProps) {
  return (
    <div className="variant-picker-item variant-size">
      <VariantSizeLabel currentSize={currentSize} />
      <div className="tf-variant-dropdown full" data-bs-toggle="dropdown">
        <div className="btn-select">
          <span className="text-sort-value value-currentSize text-capitalize">
            {currentSize}
          </span>
          <span className="icon icon-CaretDown" />
        </div>
        <div className="dropdown-menu">
          {sizes.map((size) => {
            const active = currentSize === size.value;
            return (
              <div
                key={size.value}
                className={cx("select-item size-btn", active && "active")}
                onClick={() => setCurrentSize(size.value)}
              >
                <span className="text-value-item">{size.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
