"use client";

import Link from "next/link";
import { useContextElement, Product } from "@/context/Context";

interface WishlistButtonProps {
  product?: Product;
  variant?: "default" | "button" | "toolbar";
  className?: string;
}

export default function WishlistButton({
  product,
  variant = "default",
  className,
}: WishlistButtonProps) {
  const { addToWishlist, isAddedtoWishlist } = useContextElement();
  const isAdded = product ? isAddedtoWishlist(product.id) : false;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product) {
      addToWishlist(product);
    }
  };

  if (variant === "toolbar") {
    return (
      <Link href="/wishlist">
        <span className="toolbar-icon">
          <i className="icon icon-HeartStraight" />
        </span>
        <span className="toolbar-label">Wishlist</span>
      </Link>
    );
  }

  const baseClass =
    variant === "button"
      ? "hover-tooltip box-icon btn-add-wishlist"
      : "hover-tooltip tooltip-left box-icon";
  const activeClass = isAdded ? "active" : "";

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`tf-btn-reset ${className || baseClass} ${activeClass}`.trim()}
      suppressHydrationWarning
      aria-label={isAdded ? "Remove from Wishlist" : "Add to Wishlist"}
    >
      <span
        className={`icon ${isAdded ? "icon-trash" : "icon-heart"}`}
        aria-hidden
        suppressHydrationWarning
      />
      <span className="tooltip" suppressHydrationWarning>
        {isAdded ? "Remove from Wishlist" : "Add to Wishlist"}
      </span>
    </button>
  );
}
