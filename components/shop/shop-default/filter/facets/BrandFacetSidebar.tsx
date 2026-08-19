"use client";

import type { Dispatch } from "react";
import type { FilterAction, FilterState, ShopProduct } from "@/types/shopFilter";
import { shopFilterDisabledBrands } from "@/data/products/shopDefaultProducts";
import { toggleBrand } from "../../filterActions";
import { slug } from "../utils";

type Props = {
  cId: string;
  brands: string[];
  state: FilterState;
  dispatch: Dispatch<FilterAction>;
  getFilterCount: (fn: (p: ShopProduct) => boolean) => number;
};

export function BrandFacetSidebar({
  cId,
  brands,
  state,
  dispatch,
  getFilterCount,
}: Props) {
  return (
    <div className="widget-facet">
      <div
        className="facet-title"
        data-bs-target={`#${cId}-brand`}
        role="button"
        data-bs-toggle="collapse"
        aria-expanded="true"
        aria-controls={`${cId}-brand`}
      >
        <h6>Brands</h6>
        <span className="icon icon-CaretDown" />
      </div>
      <div id={`${cId}-brand`} className="collapse show">
        <ul className="collapse-body filter-group-check">
          {brands.map((brand) => {
            const count = getFilterCount((p) =>
              Boolean(p.filterBrands?.includes(brand)),
            );
            const id = `${cId}-brand-${slug(brand)}`;
            const checked = state.brands.includes(brand);
            const disabledByCount = count === 0;
            const disabledByPolicy = shopFilterDisabledBrands.has(brand);
            const isDisabled = disabledByCount || disabledByPolicy;
            return (
              <li
                key={brand}
                className={`list-item ${isDisabled ? "disabled" : ""}`.trim()}
              >
                <input
                  type="checkbox"
                  name={`brand-${cId}`}
                  className="tf-check style-2"
                  id={id}
                  checked={checked}
                  disabled={isDisabled}
                  onChange={() => {
                    if (!isDisabled) {
                      toggleBrand(brand, dispatch, state.brands);
                    }
                  }}
                />
                <label htmlFor={id} className="label">
                  <span className="brand-text">{brand}</span>
                  <span className="count">({count})</span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
