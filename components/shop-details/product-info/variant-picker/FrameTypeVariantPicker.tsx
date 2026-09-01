"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { formatPrice } from "@/utils/formatPrice";

import type { SizePickerProps } from "./types";

function isHexAluminum(value: string) {
  return /hex alumin(?:um|ium)/i.test(value);
}

function getFrameTypeSurcharge(
  sizes: SizePickerProps["sizes"],
  selectedValue: string,
): number | undefined {
  const selectedOption = sizes.find((size) => size.value === selectedValue);
  if (!selectedOption || !isHexAluminum(selectedOption.value)) {
    return undefined;
  }

  const selectedPrice =
    typeof selectedOption.price === "number"
      ? selectedOption.price
      : typeof selectedOption.price === "string"
        ? Number(selectedOption.price)
        : undefined;
  const basePrice = Math.min(
    ...sizes
      .map((size) => {
        if (typeof size.price === "number") {
          return size.price;
        }
        if (typeof size.price === "string" && size.price.trim()) {
          return Number(size.price);
        }
        return Number.POSITIVE_INFINITY;
      })
      .filter((price) => Number.isFinite(price)),
  );

  if (
    typeof selectedPrice !== "number" ||
    !Number.isFinite(selectedPrice) ||
    !Number.isFinite(basePrice) ||
    selectedPrice <= basePrice
  ) {
    return undefined;
  }

  return Number((selectedPrice - basePrice).toFixed(2));
}

export function FrameTypeVariantPicker({
  sizes,
  currentSize,
  setCurrentSize,
}: SizePickerProps) {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const selectedOption = sizes.find((size) => size.value === currentSize) ?? sizes[0];
  const surcharge = useMemo(
    () => getFrameTypeSurcharge(sizes, selectedOption?.value ?? ""),
    [selectedOption?.value, sizes],
  );

  return (
    <section className="product-addons__frame-group">
      <div className="product-addons__frame-header">
        <p className="product-addons__frame-label">Frame Type</p>
        <button
          type="button"
          className="product-addons__frame-info"
          aria-label="Open frame type reference"
          onClick={() => setIsInfoOpen(true)}
        >
          i
        </button>
      </div>
      <div className="product-addons__frame-toggle" role="group" aria-label="Frame Type">
        {sizes.map((size) => {
          const isActive = currentSize === size.value;

          return (
            <button
              key={size.value}
              type="button"
              className={`product-addons__frame-button${isActive ? " is-active" : ""}`}
              onClick={() => setCurrentSize(size.value)}
              aria-pressed={isActive}
            >
              {size.value}
            </button>
          );
        })}
      </div>
      {selectedOption && isHexAluminum(selectedOption.value) && typeof surcharge === "number" ? (
        <p className="product-addons__frame-note">
          {selectedOption.value} adds {formatPrice(surcharge)} per unit.
        </p>
      ) : null}
      {isInfoOpen ? (
        <div
          className="product-addons__info-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Frame type reference"
        >
          <button
            type="button"
            className="product-addons__info-backdrop"
            aria-label="Close frame type reference"
            onClick={() => setIsInfoOpen(false)}
          />
          <div className="product-addons__info-dialog">
            <div className="product-addons__info-dialog-header">
              <h5 className="product-addons__info-title">Frame Type Reference</h5>
              <button
                type="button"
                className="product-addons__info-close"
                aria-label="Close frame type reference"
                onClick={() => setIsInfoOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="product-addons__info-image-wrap">
              <Image
                src="/assets/images/frame-type/frame-type-info.jpeg"
                alt="Frame type reference"
                width={1536}
                height={1024}
                className="product-addons__info-image"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
