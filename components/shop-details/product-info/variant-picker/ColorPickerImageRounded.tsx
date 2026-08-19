"use client";

import Image from "next/image";
import { VariantColorLabel } from "./VariantColorLabel";
import { cx } from "./cx";
import type { ColorPickerProps } from "./types";

export function ColorPickerImageRounded({
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
          return (
            <div
              key={color.label}
              className={cx(
                "hover-tooltip tooltip-bot color-btn style-image-circle",
                isActive && "active"
              )}
              onClick={() => setCurrentColor(color.label.toLowerCase())}
            >
              <div className="img">
                <Image
                  loading="lazy"
                  width={60}
                  height={60}
                  src={color.img}
                  alt={color.label}
                />
              </div>
              <span className="tooltip">{color.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
