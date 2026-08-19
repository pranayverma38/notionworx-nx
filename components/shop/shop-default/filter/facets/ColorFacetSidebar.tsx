"use client";

import type { Dispatch } from "react";
import type { FilterAction, FilterState, ShopProduct } from "@/types/shopFilter";
import { toggleColor } from "../../filterActions";
import { COLOR_SWATCH } from "../constants";
import { slug } from "../utils";

type Props = {
  cId: string;
  colors: string[];
  state: FilterState;
  dispatch: Dispatch<FilterAction>;
  getFilterCount: (fn: (p: ShopProduct) => boolean) => number;
};

export function ColorFacetSidebar({
  cId,
  colors,
  state,
  dispatch,
  getFilterCount,
}: Props) {
  return (
    <div className="widget-facet">
      <div
        className="facet-title"
        data-bs-target={`#${cId}-color`}
        role="button"
        data-bs-toggle="collapse"
        aria-expanded="true"
        aria-controls={`${cId}-color`}
      >
        <h6>Colors</h6>
        <span className="icon icon-CaretDown" />
      </div>
      <div id={`${cId}-color`} className="collapse show">
        <ul className="collapse-body filter-group-check group-check-color">
          {colors.map((colorName, idx) => {
            const id = `${cId}-color-${slug(colorName)}-${idx}`;
            const swatch = COLOR_SWATCH[colorName] ?? "bg-sage-gray";
            const count = getFilterCount((p) =>
              Boolean(p.filterColor?.includes(colorName)),
            );
            const checked = state.colors.includes(colorName);
            return (
              <li key={id} className="list-item">
                <fieldset className="field-color">
                  <input
                    type="checkbox"
                    name={`color-${cId}`}
                    className="tf-check"
                    id={id}
                    checked={checked}
                    onChange={() =>
                      toggleColor(colorName, dispatch, state.colors)
                    }
                  />
                  <label htmlFor={id} className={`color ${swatch}`} />
                </fieldset>
                <label htmlFor={id} className="label">
                  <span className="color-text">{colorName}</span>
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
