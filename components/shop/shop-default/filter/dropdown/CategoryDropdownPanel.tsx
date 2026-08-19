"use client";

import type { Dispatch } from "react";
import type { FilterAction, FilterState, ShopProduct } from "@/types/shopFilter";
import { toggleCategory } from "../../filterActions";

type Props = {
  categories: string[];
  state: FilterState;
  dispatch: Dispatch<FilterAction>;
  getFilterCount: (fn: (p: ShopProduct) => boolean) => number;
};

export function CategoryDropdownPanel({
  categories,
  state,
  dispatch,
  getFilterCount,
}: Props) {
  return (
    <div className="dropup dropdown-filter">
      <div
        className="dropdown-toggle"
        id="drop-filter-categories"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        role="button"
        tabIndex={0}
      >
        <span className="text-value">Categories</span>
        <span className="icon icon-CaretDown" />
      </div>
      <div className="dropdown-menu">
        <ul className="filter-group-check group-category">
          {categories.map((cat) => {
            const count = getFilterCount((p) =>
              Boolean(p.filterCategory?.includes(cat)),
            );
            const active = state.categories.includes(cat);
            return (
              <li key={cat} className="list-item">
                <button
                  type="button"
                  className={`label link w-100 text-start border-0 bg-transparent p-0 ${active ? "fw-semibold" : ""}`}
                  onClick={() =>
                    toggleCategory(cat, dispatch, state.categories)
                  }
                >
                  <span className="cate-text">{cat}</span>
                  <span className="count">({count})</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
