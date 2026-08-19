"use client";

import type { Dispatch } from "react";
import type { FilterAction, FilterState } from "@/types/shopFilter";
import { toggleSize } from "../../filterActions";
import { SIZE_ITEMS } from "../constants";

type Props = {
  cId: string;
  state: FilterState;
  dispatch: Dispatch<FilterAction>;
};

export function SizeFacetSidebar({ cId, state, dispatch }: Props) {
  return (
    <div className="widget-facet">
      <div
        className="facet-title"
        data-bs-target={`#${cId}-size`}
        role="button"
        data-bs-toggle="collapse"
        aria-expanded="true"
        aria-controls={`${cId}-size`}
      >
        <h6>Size</h6>
        <span className="icon icon-CaretDown" />
      </div>
      <div id={`${cId}-size`} className="collapse show">
        <ul className="collapse-body filter-group-size">
          {SIZE_ITEMS.map((item) => {
            const checked = state.sizes.includes(item.value);
            return (
              <li key={item.id}>
                <input
                  className="ip-size d-none"
                  type="checkbox"
                  name={`size-${cId}`}
                  id={`${cId}-${item.id}`}
                  checked={checked}
                  onChange={() =>
                    toggleSize(item.value, dispatch, state.sizes)
                  }
                />
                <label
                  htmlFor={`${cId}-${item.id}`}
                  className={`label-size ${item.overSize ? "over-size" : ""}`.trim()}
                >
                  <span className="size-text fw-medium">{item.label}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
