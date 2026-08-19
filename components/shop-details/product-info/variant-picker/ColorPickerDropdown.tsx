"use client";

import { VariantColorLabel } from "./VariantColorLabel";
import { cx } from "./cx";
import type { ColorPickerProps } from "./types";

export function ColorPickerDropdown({
  colors,
  currentColor,
  setCurrentColor,
}: ColorPickerProps) {
  return (
    <div className="variant-picker-item variant-color">
      <VariantColorLabel currentColor={currentColor} />
      <div className="tf-variant-dropdown full" data-bs-toggle="dropdown">
        <div className="btn-select">
          <span className="text-sort-value value-currentColor text-capitalize">
            {currentColor}
          </span>
          <span className="icon icon-CaretDown" />
        </div>
        <div className="dropdown-menu">
          {colors.map((color) => {
            const active = currentColor === color.label.toLowerCase();
            return (
              <div
                key={color.label}
                className={cx("select-item color-btn", active && "active")}
                onClick={() => setCurrentColor(color.label.toLowerCase())}
              >
                <span className="text-value-item">{color.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
