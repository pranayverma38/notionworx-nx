"use client";

import type { Dispatch } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import type { FilterAction, FilterState } from "@/types/shopFilter";
import { setPriceRange } from "../../filterActions";

type Props = {
  state: FilterState;
  dispatch: Dispatch<FilterAction>;
  priceMax: number;
};

export function PriceDropdownPanel({ state, dispatch, priceMax }: Props) {
  const onPriceSliderChange = (value: number | number[]) => {
    if (!Array.isArray(value)) return;
    const [a, b] = value;
    const lo = Math.max(0, Math.min(a, b));
    const hi = Math.min(priceMax, Math.max(a, b));
    setPriceRange([lo, hi], dispatch);
  };

  return (
    <div className="dropup dropdown-filter">
      <div
        className="dropdown-toggle"
        id="drop-filter-price"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        role="button"
        tabIndex={0}
      >
        <span className="text-value">Price</span>
        <span className="icon icon-CaretDown" />
      </div>
      <div className="dropdown-menu">
        <div className="widget-price filter-price">
          <div
            className="price-val-range"
            id="price-value-range"
            data-min={0}
            data-max={priceMax}
          >
            <Slider
              range
              min={0}
              max={priceMax}
              step={1}
              allowCross={false}
              value={[state.price[0], state.price[1]]}
              onChange={onPriceSliderChange}
              ariaLabelForHandle={["Minimum price", "Maximum price"]}
            />
          </div>
          <div className="price-box tf-grid-layout tf-col-2">
            <div className="box-wrap">
              <div className="price-val_wrap">
                <span className="cl-text-2 text-body-1">$</span>
                <div className="price-val" id="price-min-value">
                  {Math.round(state.price[0])}
                </div>
              </div>
            </div>
            <div className="box-wrap">
              <div className="price-val_wrap">
                <span className="cl-text-2 text-body-1">$</span>
                <div className="price-val" id="price-max-value">
                  {Math.round(state.price[1])}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
