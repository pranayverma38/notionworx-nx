"use client";

import type { Dispatch } from "react";
import type { FilterAction, FilterState } from "@/types/shopFilter";
import {
  clearAllFilters,
  setAvailability,
  setPriceRange,
  toggleBrand,
  toggleCategory,
  toggleColor,
  toggleSize,
} from "./filterActions";
import { hasActiveShopFilters } from "./hasActiveShopFilters";

type Props = {
  state: FilterState;
  dispatch: Dispatch<FilterAction>;
};

export function ShopAppliedFilters({ state, dispatch }: Props) {
  const n = state.sorted.length;
  const filterActive = hasActiveShopFilters(state);
  const productFoundLabel = n === 1 ? "Product found" : "Products found";
  const priceDefault =
    state.price[0] === state.defaultPriceRange[0] &&
    state.price[1] === state.defaultPriceRange[1];
  if (!filterActive) return null;

  return (
    <div className="meta-filter-shop active">
      <div id="product-count-grid" className="count-text text-caption-01">
        <span className="count">{n}</span> {productFoundLabel}
      </div>
      <div id="product-count-list" className="count-text text-caption-01">
        <span className="count">{n}</span> {productFoundLabel}
      </div>
      <div className="br-line type-vertical" />
      <div id="applied-filters">
        {state.categories.map((c) => (
          <span
            key={`cat-${c}`}
            className="filter-tag remove-tag"
            data-filter="category"
            role="button"
            tabIndex={0}
            onClick={() => toggleCategory(c, dispatch, state.categories)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleCategory(c, dispatch, state.categories);
              }
            }}
          >
            <span className="icon icon-X2" aria-hidden />
            {c}
          </span>
        ))}
        {state.brands.map((b) => (
          <span
            key={`brand-${b}`}
            className="filter-tag remove-tag"
            data-filter="brand"
            role="button"
            tabIndex={0}
            onClick={() => toggleBrand(b, dispatch, state.brands)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleBrand(b, dispatch, state.brands);
              }
            }}
          >
            <span className="icon icon-X2" aria-hidden />
            {b}
          </span>
        ))}
        {state.colors.map((c) => (
          <span
            key={`color-${c}`}
            className="filter-tag remove-tag"
            data-filter="color"
            role="button"
            tabIndex={0}
            onClick={() => toggleColor(c, dispatch, state.colors)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleColor(c, dispatch, state.colors);
              }
            }}
          >
            <span className="icon icon-X2" aria-hidden />
            {c}
          </span>
        ))}
        {state.sizes.map((s) => (
          <span
            key={`size-${s}`}
            className="filter-tag remove-tag"
            data-filter="size"
            role="button"
            tabIndex={0}
            onClick={() => toggleSize(s, dispatch, state.sizes)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleSize(s, dispatch, state.sizes);
              }
            }}
          >
            <span className="icon icon-X2" aria-hidden />
            {s}
          </span>
        ))}
        {state.availability === "inStock" && (
          <span
            className="filter-tag remove-tag"
            data-filter="availability"
            role="button"
            tabIndex={0}
            onClick={() => setAvailability("all", dispatch)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setAvailability("all", dispatch);
              }
            }}
          >
            <span className="icon icon-X2" aria-hidden />
            In stock
          </span>
        )}
        {state.availability === "outStock" && (
          <span
            className="filter-tag remove-tag"
            data-filter="availability"
            role="button"
            tabIndex={0}
            onClick={() => setAvailability("all", dispatch)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setAvailability("all", dispatch);
              }
            }}
          >
            <span className="icon icon-X2" aria-hidden />
            Out of stock
          </span>
        )}
        {!priceDefault && (
          <span
            className="filter-tag remove-tag"
            data-filter="price"
            role="button"
            tabIndex={0}
            onClick={() =>
              setPriceRange(
                [...state.defaultPriceRange] as [number, number],
                dispatch,
              )
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setPriceRange(
                  [...state.defaultPriceRange] as [number, number],
                  dispatch,
                );
              }
            }}
          >
            <span className="icon icon-X2" aria-hidden />
            ${Math.round(state.price[0])} – ${Math.round(state.price[1])}
          </span>
        )}
      </div>
      <button
        id="remove-all"
        type="button"
        className="remove-all-filters"
        onClick={() => clearAllFilters(dispatch)}
      >
        <i className="icon icon-X2" />
        Clear all
      </button>
    </div>
  );
}
