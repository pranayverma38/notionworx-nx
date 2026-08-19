"use client";

import ShopFilterBody from "./ShopFilterBody";
import { useShop } from "./ShopContext";

/** Mobile / narrow layout: filters in Bootstrap offcanvas `#filterShop`. */
export function ShopOffcanvas() {
  const { filterBodyProps } = useShop();

  return (
    <div
      className="offcanvas offcanvas-start canvas-filter"
      id="filterShop"
      tabIndex={-1}
    >
      <div className="canvas-wrapper">
        <div className="canvas-header">
          <div className="h5 title">Filters</div>
          <button
            type="button"
            className="btn p-0 border-0 bg-transparent lh-1"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          >
            <span
              className="icon-X2 fs-24 link icon-close-popup"
              aria-hidden
            />
          </button>
        </div>
        <div className="canvas-body">
          <ShopFilterBody {...filterBodyProps} />
        </div>
      </div>
    </div>
  );
}
