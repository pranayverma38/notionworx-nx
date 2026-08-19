"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { ComponentProps } from "react";
import ShopFilterBody from "./ShopFilterBody";

type FilterProps = ComponentProps<typeof ShopFilterBody>;

type Props = {
  filterBodyProps: FilterProps;
  layoutSwitch: ReactNode;
  sortingDropdown: ReactNode;
  controlClassName: string;
};

/** Toolbar + inline filter drawer (theme `filter-drawer-wrap`). Closed until the user opens it. */
export default function ShopFilterDrawer({
  filterBodyProps,
  layoutSwitch,
  sortingDropdown,
  controlClassName,
}: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!drawerOpen) return;

    const handlePointerDownOutside = (event: PointerEvent) => {
      const root = rootRef.current;
      const target = event.target as Node | null;
      if (!root || !target) return;
      if (!root.contains(target)) {
        setDrawerOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDownOutside, true);
    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDownOutside,
        true,
      );
    };
  }, [drawerOpen]);

  return (
    <div ref={rootRef} className={controlClassName}>
      <button
        type="button"
        className={`btn-filterDropdown tf-btn-filter${drawerOpen ? " active" : ""}`}
        aria-expanded={drawerOpen}
        onClick={() => setDrawerOpen((o) => !o)}
      >
        <span
          className={`icon ${drawerOpen ? "icon-X2" : "icon-filter"}`}
          aria-hidden
        />
        <span className="text">Show Filters</span>
      </button>
      {layoutSwitch}
      {sortingDropdown}
      <div
        className={`filter-drawer-wrap canvas-sidebar sidebar-filter canvas-filter left${drawerOpen ? " show" : ""}`}
      >
        <div className="canvas-wrapper">
          <div className="canvas-header">
            <h4 className="title d-none d-xl-block">Filters</h4>
            <h5 className="title d-xl-none">Filters</h5>
            <button
              type="button"
              className="btn p-0 border-0 bg-transparent lh-1 d-xl-none"
              aria-label="Close filters"
              onClick={() => setDrawerOpen(false)}
            >
              <span className="icon-X2 fs-24 close-filter" aria-hidden />
            </button>
          </div>
          <div className="canvas-body">
            <ShopFilterBody {...filterBodyProps} />
          </div>
        </div>
      </div>
    </div>
  );
}
