import { useMemo } from "react";
import type { ShopProduct } from "@/types/shopFilter";

/** Distinct facet values from the catalog (same logic for sidebar + dropdown UIs). */
export function useFacetOptions(sourceProducts: ShopProduct[]) {
  return useMemo(() => {
    const b = new Set<string>();
    const c = new Set<string>();
    const col = new Set<string>();
    for (const p of sourceProducts) {
      p.filterBrands?.forEach((x) => b.add(x));
      p.filterCategory?.forEach((x) => c.add(x));
      p.filterColor?.forEach((x) => col.add(x));
    }
    return {
      brands: [...b].sort(),
      categories: [...c].sort(),
      colors: [...col].sort(),
    };
  }, [sourceProducts]);
}
