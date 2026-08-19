"use client";

export function VariantColorLabel({ currentColor }: { currentColor: string }) {
  return (
    <div className="variant-picker-label">
      <div>
        Colors:
        <span className="variant-picker-label-value value-currentColor text-capitalize fw-medium">
          {" "}
          {currentColor}
        </span>
      </div>
    </div>
  );
}
