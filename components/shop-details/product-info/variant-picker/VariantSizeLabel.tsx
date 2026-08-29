"use client";

export function VariantSizeLabel({
  label,
  currentSize,
}: {
  label: string;
  currentSize: string;
}) {
  return (
    <div className="variant-picker-label">
      <div>
        {label}:
        <span className="variant-picker-label-value value-currentSize text-capitalize fw-medium">
          {" "}
          {currentSize}
        </span>
      </div>
    </div>
  );
}
