import type { FilterState } from "@/types/shopFilter";

/** True if any facet or price range differs from the default “no filter” state. */
export function hasActiveShopFilters(state: FilterState): boolean {
  const atDefaultPrice =
    state.price[0] === state.defaultPriceRange[0] &&
    state.price[1] === state.defaultPriceRange[1];
  return (
    state.colors.length > 0 ||
    state.categories.length > 0 ||
    state.brands.length > 0 ||
    state.sizes.length > 0 ||
    state.availability !== "all" ||
    !atDefaultPrice
  );
}
