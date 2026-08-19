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

export function BrandDropdownPanel({
  cId,
  brands,
  state,
  dispatch,
  getFilterCount,
}: Props) {
  return (
    <div className="dropup dropdown-filter">
      <div
        className="dropdown-toggle"
        id="drop-filter-brand"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        role="button"
        tabIndex={0}
      >
        <span className="text-value">Brand</span>
        <span className="icon icon-CaretDown" />
      </div>
      <div className="dropdown-menu">
        <ul className="filter-group-check">
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
