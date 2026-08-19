"use client";

import ShopFilterBody from "./ShopFilterBody";
import { useShop } from "./ShopContext";

type Props = {
  side: "left" | "right";
};

/** Desktop `xl+` sidebar filters (theme `canvas-sidebar`). */
export function DesktopFilterSidebar({ side }: Props) {
  const { filterBodyProps } = useShop();

  return (
    <div className={`canvas-sidebar sidebar-filter canvas-filter ${side}`}>
      <div className="canvas-wrapper">
        <div className="canvas-header">
          <h4 className="title d-none d-xl-block">Filters</h4>
          <h5 className="title d-xl-none">Filters</h5>
          <button
            type="button"
            className="btn p-0 border-0 bg-transparent lh-1 d-xl-none"
            aria-label="Close"
          >
            <span className="icon-X2 fs-24 close-filter" aria-hidden />
          </button>
        </div>
        <div className="canvas-body">
          <ShopFilterBody {...filterBodyProps} />
        </div>
      </div>
    </div>
  );
}
