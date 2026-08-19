"use client";

import { VariantColorLabel } from "./VariantColorLabel";
import { cx } from "./cx";
import type { ColorPickerProps } from "./types";

export function ColorPickerSwatch({
  colors,
  currentColor,
  setCurrentColor,
}: ColorPickerProps) {
  return (
    <div className="variant-picker-item variant-color">
      <VariantColorLabel currentColor={currentColor} />
      <div className="variant-picker-values">
        {colors.map((color) => {
          const isActive = currentColor === color.label.toLowerCase();
          const swatchClass = color.swatchClass || "bg-black";
          return (
            <div
              key={color.label}
              className={cx(
                "hover-tooltip tooltip-bot color-btn",
                isActive && "active"
              )}
              onClick={() => setCurrentColor(color.label.toLowerCase())}
            >
              <span className={`check-color ${swatchClass}`} />
              <span className="tooltip">{color.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
