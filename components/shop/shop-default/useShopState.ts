"use client";

import { useEffect, useMemo, useReducer } from "react";
import { filterReducer, staticInitialState } from "./filterReducer";
import type { FilterState, ShopProduct } from "@/types/shopFilter";

type UseShopStateOptions = {
  defaultTags?: string[];
  itemPerPage?: number;
  products: ShopProduct[];
};

function maxCatalogPrice(products: ShopProduct[]): number {
  if (!products.length) return 1000;
  return Math.max(...products.map((p) => p.price), 1);
}

export function useShopState({
  defaultTags = [],
  itemPerPage: itemPerPageProp = 0,
  products: sourceProducts,
}: UseShopStateOptions) {
  const priceMax = maxCatalogPrice(sourceProducts);
  const defaultPriceRange: [number, number] = [0, Math.ceil(priceMax)];

  const initial: FilterState = {
    ...staticInitialState,
    defaultPriceRange,
    price: [...defaultPriceRange] as [number, number],
    filtered: sourceProducts,
    sorted: sourceProducts,
    itemPerPage: itemPerPageProp ? itemPerPageProp : 12,
    tags: defaultTags,
  };

  const [state, dispatch] = useReducer(filterReducer, initial);

  useEffect(() => {
    dispatch({ type: "FILTER_PRODUCTS", payload: sourceProducts });
  }, [
    state.brands,
    state.categories,
    state.colors,
    state.sizes,
    state.activeFilterOnSale,
    state.availability,
    state.services,
    state.ratings,
    state.price,
    state.tags,
    sourceProducts,
  ]);

  useEffect(() => {
    dispatch({ type: "SORT_PRODUCTS" });
  }, [state.sortingOption, state.filtered]);

  const visibleProducts = useMemo(() => {
    return state.sorted.slice(
      (state.currentPage - 1) * state.itemPerPage,
      state.currentPage * state.itemPerPage,
    );
  }, [state.sorted, state.currentPage, state.itemPerPage]);

  function getFilterCount(filterFunction: (product: ShopProduct) => boolean) {
    return sourceProducts.filter((product) => filterFunction(product)).length;
  }

  const hasNoFilteredItems = state.sorted.length === 0;
  const hasMultiplePages = state.sorted.length > state.itemPerPage;
  const fromResult = hasNoFilteredItems
    ? 0
    : (state.currentPage - 1) * state.itemPerPage + 1;
  const toResult = hasNoFilteredItems
    ? 0
    : Math.min(state.currentPage * state.itemPerPage, state.sorted.length);

  return {
    state,
    dispatch,
    visibleProducts,
    getFilterCount,
    hasNoFilteredItems,
    hasMultiplePages,
    fromResult,
    toResult,
  };
}
