"use client";

import { useContextElement } from "@/context/Context";

export default function CartIconCount({ className = "count" }: { className?: string }) {
  const { cartProducts } = useContextElement();
  const count = cartProducts.reduce((sum, p) => sum + p.quantity, 0);

  return <span className={className}> {count} </span>;
}
