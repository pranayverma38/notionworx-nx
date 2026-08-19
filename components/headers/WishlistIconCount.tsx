"use client";

import { useContextElement } from "@/context/Context";

export default function WishlistIconCount() {
  const { wishList } = useContextElement();
  const count = wishList?.length || 0;

  return <span className="count"> {count} </span>;
}
