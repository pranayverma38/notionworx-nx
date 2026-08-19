"use client";

import type { Dispatch } from "react";
import type { FilterAction, FilterState, ShopProduct } from "@/types/shopFilter";
import { toggleCategory } from "../../filterActions";

type Props = {
  cId: string;
  categories: string[];
  state: FilterState;
  dispatch: Dispatch<FilterAction>;
  getFilterCount: (fn: (p: ShopProduct) => boolean) => number;
};

export function CategoryFacetSidebar({
  cId,
  categories,
  state,
  dispatch,
  getFilterCount,
}: Props) {
  return (
    <div className="widget-facet">
      <div
        className="facet-title"
        data-bs-target={`#${cId}-category`}
        role="button"
        data-bs-toggle="collapse"
        aria-expanded="true"
        aria-controls={`${cId}-category`}
      >
        <h6>Product Categories</h6>
        <span className="icon icon-CaretDown" />
      </div>
      <div id={`${cId}-category`} className="collapse show">
        <ul className="collapse-body filter-group-check group-category">
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
