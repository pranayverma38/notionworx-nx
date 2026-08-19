"use client";

import { useContextElement, Product } from "@/context/Context";

interface QuickViewButtonProps {
  product?: Product;
  className?: string;
}

export default function QuickViewButton({
  product,
  className,
}: QuickViewButtonProps) {
  const { setQuickViewItem } = useContextElement();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product) {
      setQuickViewItem(product);
    }
  };

  return (
    <a
      href="#quickView"
      onClick={handleClick}
      data-bs-toggle="offcanvas"
      suppressHydrationWarning
      className={className || "hover-tooltip tooltip-left box-icon"}
    >
      <span className="icon icon-Eye" aria-hidden />
      <span className="tooltip">Quick view</span>
    </a>
  );
}
