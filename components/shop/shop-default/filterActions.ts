import type {
  AvailabilityFilter,
  FilterAction,
  ShopProduct,
  SortingOption,
} from "@/types/shopFilter";
import type { Dispatch } from "react";

export function toggleBrand(
  brand: string,
  dispatch: Dispatch<FilterAction>,
  selectedBrands: string[],
): void {
  const updated = selectedBrands.includes(brand)
    ? selectedBrands.filter((b) => b !== brand)
    : [...selectedBrands, brand];
  dispatch({ type: "SET_BRANDS", payload: updated });
}

export function toggleCategory(
  category: string,
  dispatch: Dispatch<FilterAction>,
  selectedCategories: string[],
): void {
  const updated = selectedCategories.includes(category)
    ? selectedCategories.filter((c) => c !== category)
    : [...selectedCategories, category];
  dispatch({ type: "SET_CATEGORIES", payload: updated });
}

export function toggleColor(
  color: string,
  dispatch: Dispatch<FilterAction>,
  selectedColors: string[],
): void {
  const updated = selectedColors.includes(color)
    ? selectedColors.filter((c) => c !== color)
    : [...selectedColors, color];

  dispatch({ type: "SET_COLORS", payload: updated });
}

export function toggleRating(
  rating: number,
  dispatch: Dispatch<FilterAction>,
  selectedRatings: number[],
): void {
  const updated = selectedRatings.includes(rating)
    ? selectedRatings.filter((r) => r !== rating)
    : [...selectedRatings, rating];
  dispatch({ type: "SET_RATINGS", payload: updated });
}

export function toggleService(
  service: string,
  dispatch: Dispatch<FilterAction>,
  selectedServices: string[],
): void {
  const updated = selectedServices.includes(service)
    ? selectedServices.filter((s) => s !== service)
    : [...selectedServices, service];
  dispatch({ type: "SET_SERVICES", payload: updated });
}

export function toggleTag(
  tag: string,
  dispatch: Dispatch<FilterAction>,
  selectedTags: string[],
): void {
  const updated = selectedTags.includes(tag)
    ? selectedTags.filter((t) => t !== tag)
    : [...selectedTags, tag];

  dispatch({ type: "SET_TAGS", payload: updated });
}

export function toggleSize(
  size: string,
  dispatch: Dispatch<FilterAction>,
  selectedSizes: string[],
): void {
  const updated = selectedSizes.includes(size)
    ? selectedSizes.filter((s) => s !== size)
    : [...selectedSizes, size];
  dispatch({ type: "SET_SIZES", payload: updated });
}

export function setAvailability(
  mode: AvailabilityFilter,
  dispatch: Dispatch<FilterAction>,
): void {
  dispatch({ type: "SET_AVAILABILITY", payload: mode });
}

export function toggleOnSale(dispatch: Dispatch<FilterAction>): void {
  dispatch({ type: "TOGGLE_FILTER_ON_SALE" });
}

export function setPriceRange(
  range: [number, number],
  dispatch: Dispatch<FilterAction>,
): void {
  dispatch({ type: "SET_PRICE", payload: range });
}

export function setSorting(
  option: SortingOption,
  dispatch: Dispatch<FilterAction>,
): void {
  dispatch({ type: "SET_SORTING_OPTION", payload: option });
}

export function applyFilter(
  data: ShopProduct[],
  dispatch: Dispatch<FilterAction>,
): void {
  dispatch({ type: "FILTER_PRODUCTS", payload: data });
  dispatch({ type: "SORT_PRODUCTS" });
}

export function clearAllFilters(dispatch: Dispatch<FilterAction>): void {
  dispatch({ type: "CLEAR_FILTER" });
}

export function setCurrentPage(
  page: number,
  dispatch: Dispatch<FilterAction>,
): void {
  dispatch({ type: "SET_CURRENT_PAGE", payload: page });
}

export function setItemPerPage(
  count: number,
  dispatch: Dispatch<FilterAction>,
): void {
  dispatch({ type: "SET_ITEM_PER_PAGE", payload: count });
}
