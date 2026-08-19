import type { ProductCardItem, ShopProductFacetFields } from "@/types/productCard";

export type { ShopProductFacetFields } from "@/types/productCard";

/** Catalog row for shop: card data + facets used by the filter reducer (Unimart-style). */
export type ShopProduct = ProductCardItem & ShopProductFacetFields;

export type AvailabilityFilter = "all" | "inStock" | "outStock";

export type SortingOption =
  | "Sort by (Default)"
  | "Price Ascending"
  | "Price Descending"
  | "Title Ascending"
  | "Title Descending";

export interface FilterState {
  defaultPriceRange: [number, number];
  price: [number, number];
  colors: string[];
  /** Selected size facet values (multi). */
  sizes: string[];
  tags: string[];
  activeFilterOnSale: boolean;
  availability: AvailabilityFilter;
  brands: string[];
  categories: string[];
  ratings: number[];
  services: string[];
  filtered: ShopProduct[];
  sortingOption: SortingOption;
  sorted: ShopProduct[];
  currentPage: number;
  itemPerPage: number;
}

export type FilterAction =
  | { type: "SET_PRICE"; payload: [number, number] }
  | { type: "SET_COLORS"; payload: string[] }
  | { type: "SET_TAGS"; payload: string[] }
  | { type: "SET_SIZES"; payload: string[] }
  | { type: "SET_BRANDS"; payload: string[] }
  | { type: "SET_CATEGORIES"; payload: string[] }
  | { type: "SET_RATINGS"; payload: number[] }
  | { type: "SET_SERVICES"; payload: string[] }
  | { type: "SET_AVAILABILITY"; payload: AvailabilityFilter }
  | { type: "SET_CURRENT_PAGE"; payload: number }
  | { type: "SET_ITEM_PER_PAGE"; payload: number }
  | { type: "FILTER_PRODUCTS"; payload: ShopProduct[] }
  | { type: "SET_SORTING_OPTION"; payload: SortingOption }
  | { type: "SORT_PRODUCTS" }
  | { type: "TOGGLE_FILTER_ON_SALE" }
  | { type: "CLEAR_FILTER" };
