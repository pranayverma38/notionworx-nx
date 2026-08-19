"use client";

import type { Dispatch } from "react";
import type { FilterAction, FilterState, ShopProduct } from "@/types/shopFilter";
import { setAvailability } from "../../filterActions";

type Props = {
  cId: string;
  state: FilterState;
  dispatch: Dispatch<FilterAction>;
  getFilterCount: (fn: (p: ShopProduct) => boolean) => number;
};

export function AvailabilityDropdownPanel({
  cId,
  state,
  dispatch,
  getFilterCount,
}: Props) {
  return (
    <div className="dropup dropdown-filter">
      <div
        className="dropdown-toggle"
        id="drop-filter-available"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        role="button"
        tabIndex={0}
      >
        <span className="text-value">Availability</span>
        <span className="icon icon-CaretDown" />
      </div>
      <div className="dropdown-menu">
        <ul className="filter-group-check">
          <li className="list-item">
            <input
              type="radio"
              name={`availability-${cId}`}
              className="tf-check style-2"
              id={`${cId}-inStock`}
              checked={state.availability === "inStock"}
              onChange={() => setAvailability("inStock", dispatch)}
            />
            <label htmlFor={`${cId}-inStock`} className="label">
              <span className="cate-text">In stock</span>
              <span className="count">
                (
                {getFilterCount((p) => {
                  if (p.isStockOut === true) return false;
                  if (p.inStock === false) return false;
                  return true;
                })}
                )
              </span>
            </label>
          </li>
          <li className="list-item">
            <input
              type="radio"
              name={`availability-${cId}`}
              className="tf-check style-2"
              id={`${cId}-outStock`}
              checked={state.availability === "outStock"}
              onChange={() => setAvailability("outStock", dispatch)}
            />
            <label htmlFor={`${cId}-outStock`} className="label">
              <span className="cate-text">Out of stock</span>
              <span className="count">
                (
                {getFilterCount((p) =>
                  Boolean(p.isStockOut === true || p.inStock === false),
                )}
                )
              </span>
            </label>
          </li>
        </ul>
      </div>
    </div>
  );
}
