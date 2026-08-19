"use client";

import { useContextElement, Product } from "@/context/Context";
interface CompareButtonProps {
  product?: Product;
  className?: string;
  icon?: string;
  variant?: "default" | "extra";
  label?: string;
}
export default function CompareButton({
  product,
  className,
  icon = "icon-ArrowsLeftRight",
  variant = "default",
  label = "Compare",
}: CompareButtonProps) {
  const { addToCompareItem, isAddedToCompareItem } = useContextElement();
  const isAdded = product ? isAddedToCompareItem(product.id) : false;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product) {
      addToCompareItem(product);
    }
  };

  const baseClass =
    variant === "extra"
      ? "product-extra-icon link fw-medium"
      : "hover-tooltip tooltip-left box-icon";
  const activeClass = isAdded ? "active" : "";

  return (
    <button
      type="button"
      onClick={handleClick}
      data-bs-toggle="offcanvas"
      data-bs-target="#compare"
      suppressHydrationWarning
      className={`tf-btn-reset ${className || baseClass} ${activeClass}`.trim()}
    >
      <i
        suppressHydrationWarning
        className={`icon ${icon} ${isAdded ? "text-primary" : ""}`}
        aria-hidden
      />{" "}
      <span
        suppressHydrationWarning
        className={variant === "extra" ? "" : "tooltip"}
      >
        {label}
      </span>
    </button>
  );
}
