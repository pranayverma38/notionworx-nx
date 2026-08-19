"use client";

import { useEffect, useId } from "react";
import { shopFilterDisabledBrands } from "@/data/products/shopDefaultProducts";
import { AvailabilityDropdownPanel } from "./filter/dropdown/AvailabilityDropdownPanel";
import { BrandDropdownPanel } from "./filter/dropdown/BrandDropdownPanel";
import { CategoryDropdownPanel } from "./filter/dropdown/CategoryDropdownPanel";
import { ColorDropdownPanel } from "./filter/dropdown/ColorDropdownPanel";
import { FilterDropdownOffcanvasLink } from "./filter/dropdown/FilterDropdownOffcanvasLink";
import { PriceDropdownPanel } from "./filter/dropdown/PriceDropdownPanel";
import { SizeDropdownPanel } from "./filter/dropdown/SizeDropdownPanel";
import { useFacetOptions } from "./filter/useFacetOptions";
import type { ShopFilterBodyProps } from "./filter/types";

export default function ShopFilterDropdown({
  state,
  dispatch,
  getFilterCount,
  sourceProducts,
}: ShopFilterBodyProps) {
  const idBase = useId().replace(/:/g, "");
  const cId = `shop-dd-${idBase}`;
  const { brands, categories, colors } = useFacetOptions(sourceProducts);
  const priceMax = Math.max(1, state.defaultPriceRange[1]);

  useEffect(() => {
    const next = state.brands.filter((br) => !shopFilterDisabledBrands.has(br));
    if (next.length !== state.brands.length) {
      dispatch({ type: "SET_BRANDS", payload: next });
    }
  }, [state.brands, dispatch]);

  return (
    <div className="tf-filter-dropdown">
      <FilterDropdownOffcanvasLink />
      <div className="meta-dropdown-filter">
        <CategoryDropdownPanel
          categories={categories}
          state={state}
          dispatch={dispatch}
          getFilterCount={getFilterCount}
        />
        <PriceDropdownPanel
          state={state}
          dispatch={dispatch}
          priceMax={priceMax}
        />
        <SizeDropdownPanel cId={cId} state={state} dispatch={dispatch} />
        <ColorDropdownPanel
          cId={cId}
          colors={colors}
          state={state}
          dispatch={dispatch}
          getFilterCount={getFilterCount}
        />
        <AvailabilityDropdownPanel
          cId={cId}
          state={state}
          dispatch={dispatch}
          getFilterCount={getFilterCount}
        />
        <BrandDropdownPanel
          cId={cId}
          brands={brands}
          state={state}
          dispatch={dispatch}
          getFilterCount={getFilterCount}
        />
      </div>
    </div>
  );
}
