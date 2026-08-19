import type { ShopProduct } from "@/types/shopFilter";

export function shopMetaFor(product: ShopProduct) {
  return {
    brand: product.filterBrands?.[0] ?? "",
    availability: product.inStock === false ? "Out of stock" : "In Stock",
  };
}
