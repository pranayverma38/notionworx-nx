"use client";

export function VariantSizeLabel({ currentSize }: { currentSize: string }) {
  return (
    <div className="variant-picker-label">
      <div>
        Size:
        <span className="variant-picker-label-value value-currentSize text-capitalize fw-medium">
          {" "}
          {currentSize}
        </span>
      </div>
      <a
        href="#findSize"
        data-bs-toggle="modal"
        className="tf-btn-line-2 style-primary text-caption-01 fw-semibold"
      >
        Size Guide
      </a>
    </div>
  );
}
