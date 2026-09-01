"use client";

import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const { addProductToCart, isAddedToCartProducts, setQuickAddItem } =
    useContextElement();
  const isAdded = product ? isAddedToCartProducts(product.id) : false;
  const isQuickAddTrigger = href === "#quickAdd";
  const requiresConfiguration = Boolean(
    product?.addOnGroups?.length ||
      (product?.sizeVariants?.length != null && product.sizeVariants.length > 1),
  );
  const resolvedLabel = requiresConfiguration ? "Customize" : label;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product) return;

    if (requiresConfiguration) {
      router.push(`/product-detail/${product.id}`);
      return;
    }

    if (isQuickAddTrigger) {
      setQuickAddItem(product.id);
      return;
    }

    if (product) {
      addProductToCart(product, quantity);
    }

    router.push("/view-cart");
  };

  const activeClass = !isQuickAddTrigger && isAdded ? "added" : "";

  /** Bootstrap 5 needs `data-bs-target` on `<button>`; anchors used to rely on `href`. */
  const bsTarget =
    !requiresConfiguration &&
    isQuickAddTrigger &&
    href.startsWith("#") &&
    href.length > 1
      ? href
      : undefined;
  const bsToggle = !requiresConfiguration && isQuickAddTrigger ? dataToggle : undefined;

  if (variant === "tooltip") {
    return (
      <button
        type="button"
        onClick={handleClick}
        data-bs-toggle={bsToggle}
        data-bs-target={bsTarget}
        suppressHydrationWarning
        className={`tf-btn-reset ${className || "hover-tooltip tooltip-left btn-action"} ${activeClass}`.trim()}
      >
        <i className="icon icon-Handbag" aria-hidden />
        <span className="tooltip" suppressHydrationWarning>
          {!requiresConfiguration && !isQuickAddTrigger && isAdded
            ? "Added"
            : resolvedLabel}
        </span>
      </button>
    );
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        data-bs-toggle={bsToggle}
        data-bs-target={bsTarget}
        suppressHydrationWarning
        className={`tf-btn-reset ${className || "btn-action"} ${activeClass}`.trim()}
      >
        <i className="icon icon-Handbag" aria-hidden />
        <span className="text fw-semibold ml-1" suppressHydrationWarning>
          {!requiresConfiguration && !isQuickAddTrigger && isAdded
            ? "Added"
            : resolvedLabel}
        </span>
      </button>
    );
  }

  // default
  return (
    <button
      type="button"
      onClick={handleClick}
      data-bs-toggle={bsToggle}
      data-bs-target={bsTarget}
      suppressHydrationWarning
      className={`tf-btn-reset ${className || "tf-btn btn-white small w-100"} ${activeClass}`.trim()}
    >
      {!requiresConfiguration && !isQuickAddTrigger && isAdded
        ? "Added to Cart"
        : resolvedLabel}
    </button>
  );
}
