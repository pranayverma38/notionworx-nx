"use client";

import { ShopProductSection } from "./ShopProductSection";
import { ShopToolbar } from "./ShopToolbar";

export function ShopMainColumn() {
  return (
    <>
      <ShopToolbar />
      <ShopProductSection />
    </>
  );
}
