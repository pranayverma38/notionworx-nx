"use client";

import { useContextElement, Product } from "@/context/Context";

interface AddToCartButtonProps {
  product?: Product;
  quantity?: number;
  href?: string;
  dataToggle?: "modal" | "offcanvas";
  className?: string;
  label?: string;
  variant?: "default" | "icon" | "tooltip";
}

export default function AddToCartButton({
  product,
  quantity = 1,
  href = "#shoppingCart",
  dataToggle = "offcanvas",
  className,
  label = "Add to Cart",
  variant = "default",
}: AddToCartButtonProps) {
  const { addProductToCart, isAddedToCartProducts, setQuickAddItem } =
    useContextElement();
  const isAdded = product ? isAddedToCartProducts(product.id) : false;
  const isQuickAddTrigger = href === "#quickAdd";

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product) return;

    if (isQuickAddTrigger) {
      setQuickAddItem(product.id);
      return;
    }

    if (product) {
      addProductToCart(product, quantity);
    }
  };

  const activeClass = !isQuickAddTrigger && isAdded ? "added" : "";

  /** Bootstrap 5 needs `data-bs-target` on `<button>`; anchors used to rely on `href`. */
  const bsTarget = href.startsWith("#") && href.length > 1 ? href : undefined;

  if (variant === "tooltip") {
    return (
      <button
        type="button"
        onClick={handleClick}
        data-bs-toggle={dataToggle}
        data-bs-target={bsTarget}
        suppressHydrationWarning
        className={`tf-btn-reset ${className || "hover-tooltip tooltip-left btn-action"} ${activeClass}`.trim()}
      >
        <i className="icon icon-Handbag" aria-hidden />
        <span className="tooltip" suppressHydrationWarning>
          {!isQuickAddTrigger && isAdded ? "Added" : label}
        </span>
      </button>
    );
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        data-bs-toggle={dataToggle}
        data-bs-target={bsTarget}
        suppressHydrationWarning
        className={`tf-btn-reset ${className || "btn-action"} ${activeClass}`.trim()}
      >
        <i className="icon icon-Handbag" aria-hidden />
        <span className="text fw-semibold ml-1" suppressHydrationWarning>
          {!isQuickAddTrigger && isAdded ? "Added" : label}
        </span>
      </button>
    );
  }

  // default
  return (
    <button
      type="button"
      onClick={handleClick}
      data-bs-toggle={dataToggle}
      data-bs-target={bsTarget}
      suppressHydrationWarning
      className={`tf-btn-reset ${className || "tf-btn btn-white small w-100"} ${activeClass}`.trim()}
    >
      {!isQuickAddTrigger && isAdded ? "Added to Cart" : label}
    </button>
  );
}
