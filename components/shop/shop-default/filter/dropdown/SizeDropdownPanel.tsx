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

export function SizeDropdownPanel({ cId, state, dispatch }: Props) {
  return (
    <div className="dropup dropdown-filter">
      <div
        className="dropdown-toggle"
        id="drop-filter-size"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        role="button"
        tabIndex={0}
      >
        <span className="text-value">Size</span>
        <span className="icon icon-CaretDown" />
      </div>
      <div className="dropdown-menu">
        <ul className="filter-group-size">
          {SIZE_ITEMS.map((item) => {
            const checked = state.sizes.includes(item.value);
            return (
              <li key={item.id}>
                <input
                  className="ip-size d-none"
                  type="checkbox"
                  name="size"
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
