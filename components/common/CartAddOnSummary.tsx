"use client";

import type { CartProduct } from "@/context/Context";
import { getSelectedProductAddOnOptions } from "@/lib/product-addons";
import { formatPrice } from "@/utils/formatPrice";

export default function CartAddOnSummary({
  item,
  showPricing = true,
  className,
}: {
  item: CartProduct;
  showPricing?: boolean;
  className?: string;
}) {
  const selectedOptions = getSelectedProductAddOnOptions(
    item.addOnGroups,
    item.addOnSelections,
  );

  if (!selectedOptions.length) {
    return null;
  }

  return (
    <div
      className={className}
      style={{
        display: "grid",
        gap: 6,
        marginTop: 8,
      }}
    >
      {selectedOptions.map((option) => {
        const label = option.subgroupTitle || option.groupTitle;

        return (
          <div
            key={`${option.groupId}:${option.subgroupId ?? ""}:${option.id}`}
            style={{
              display: "grid",
              gap: 2,
              fontSize: "0.76rem",
              lineHeight: 1.45,
              color: "#4b5563",
            }}
          >
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <span style={{ color: "#6b7280" }}>{label}:</span>
              <span style={{ fontWeight: 600, color: "#111827" }}>
                {option.title}
              </span>
              <span>x{option.quantity}</span>
              {showPricing ? (
                <span style={{ color: "#166534", fontWeight: 600 }}>
                  {formatPrice(option.price.surcharge)} each
                </span>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
