"use client";

import { useEffect, useId } from "react";
import { shopFilterDisabledBrands } from "@/data/products/shopDefaultProducts";
import { AvailabilityFacetSidebar } from "./filter/facets/AvailabilityFacetSidebar";
import { BrandFacetSidebar } from "./filter/facets/BrandFacetSidebar";
import { CategoryFacetSidebar } from "./filter/facets/CategoryFacetSidebar";
import { ClearFiltersFooter } from "./filter/facets/ClearFiltersFooter";
import { ColorFacetSidebar } from "./filter/facets/ColorFacetSidebar";
import { PriceFacetSidebar } from "./filter/facets/PriceFacetSidebar";
import { SizeFacetSidebar } from "./filter/facets/SizeFacetSidebar";
import { useFacetOptions } from "./filter/useFacetOptions";
import type { ShopFilterBodyProps } from "./filter/types";

export type { ShopFilterBodyProps };
export { COLOR_SWATCH, SIZE_ITEMS, SORT_OPTIONS } from "./filter/constants";
export { slug } from "./filter/utils";

export default function ShopFilterBody({
  state,
  dispatch,
  getFilterCount,
  sourceProducts,
}: ShopFilterBodyProps) {
  const idBase = useId().replace(/:/g, "");
  const cId = `shop-filter-${idBase}`;
  const { brands, categories, colors } = useFacetOptions(sourceProducts);
  const priceMax = Math.max(1, state.defaultPriceRange[1]);

  useEffect(() => {
    const next = state.brands.filter((b) => !shopFilterDisabledBrands.has(b));
    if (next.length !== state.brands.length) {
      dispatch({ type: "SET_BRANDS", payload: next });
    }
  }, [state.brands, dispatch]);

  return (
    <>
      <CategoryFacetSidebar
        cId={cId}
        categories={categories}
        state={state}
        dispatch={dispatch}
        getFilterCount={getFilterCount}
      />
      <div className="br-line" />
      <PriceFacetSidebar
        cId={cId}
        state={state}
        dispatch={dispatch}
        priceMax={priceMax}
      />
      <div className="br-line" />
      <SizeFacetSidebar cId={cId} state={state} dispatch={dispatch} />
      <div className="br-line" />
      <ColorFacetSidebar
        cId={cId}
        colors={colors}
        state={state}
        dispatch={dispatch}
        getFilterCount={getFilterCount}
      />
      <div className="br-line" />
      <AvailabilityFacetSidebar
        cId={cId}
        state={state}
        dispatch={dispatch}
        getFilterCount={getFilterCount}
      />
      <div className="br-line" />
      <BrandFacetSidebar
        cId={cId}
        brands={brands}
        state={state}
        dispatch={dispatch}
        getFilterCount={getFilterCount}
      />
      <ClearFiltersFooter dispatch={dispatch} />
    </>
  );
}
