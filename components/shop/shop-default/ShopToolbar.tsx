"use client";

import type { ReactNode } from "react";

import ShopFilterDrawer from "./ShopFilterDrawer";
import ShopFilterDropdown from "./ShopFilterDropdown";
import { ShopLayoutSwitch, ShopSortDropdown } from "./ShopListingUi";
import { useShop } from "./ShopContext";
import {
  filterDrawerControlClass,
  offcanvasFilterTriggerClass,
  offcanvasFilterTriggerLabel,
  toolbarStickyClass,
} from "./shopMainColumnUtils";

function OffcanvasFilterOrder({
  sortFirst,
  filterTrigger,
  layoutSwitch,
  sortingDropdown,
}: {
  sortFirst: boolean;
  filterTrigger: ReactNode;
  layoutSwitch: ReactNode;
  sortingDropdown: ReactNode;
}) {
  if (sortFirst) {
    return (
      <>
        {sortingDropdown}
        {layoutSwitch}
        {filterTrigger}
      </>
    );
  }
  return (
    <>
      {filterTrigger}
      {layoutSwitch}
      {sortingDropdown}
    </>
  );
}

/** Filter drawer, inline dropdown row, or offcanvas filter trigger + sort + layout. */
export function ShopToolbar() {
  const {
    variants,
    sidebarPlacement,
    showDesktopSidebar,
    viewMode,
    setViewMode,
    sortOpen,
    setSortOpen,
    sortLabel,
    state,
    dispatch,
    filterBodyProps,
  } = useShop();

  const isDrawer = variants.includes("filterDrawer");
  const isDropdown =
    variants.includes("filterDropdown") && !isDrawer;
  const isSidebar =
    sidebarPlacement === "leftSidebar" ||
    sidebarPlacement === "rightSidebar";

  const layoutSwitch = (
    <ShopLayoutSwitch viewMode={viewMode} setViewMode={setViewMode} />
  );

  const sortingDropdown = (
    <ShopSortDropdown
      sortOpen={sortOpen}
      setSortOpen={setSortOpen}
      sortLabel={sortLabel}
      state={state}
      dispatch={dispatch}
    />
  );

  if (isDrawer) {
    return (
      <ShopFilterDrawer
        filterBodyProps={filterBodyProps}
        layoutSwitch={layoutSwitch}
        sortingDropdown={sortingDropdown}
        controlClassName={filterDrawerControlClass(showDesktopSidebar)}
      />
    );
  }

  if (isDropdown) {
    return (
      <div className={toolbarStickyClass(showDesktopSidebar)}>
        <ShopFilterDropdown {...filterBodyProps} />
        <div className="tf-shop-change">
          {layoutSwitch}
          {sortingDropdown}
        </div>
      </div>
    );
  }

  const filterTrigger = (
    <a
      href="#filterShop"
      data-bs-toggle="offcanvas"
      className={offcanvasFilterTriggerClass(isSidebar)}
    >
      <span className="icon icon-filter" />
      <span className="text">{offcanvasFilterTriggerLabel(isSidebar)}</span>
    </a>
  );

  const sortFirst = sidebarPlacement === "rightSidebar";

  return (
    <div className={toolbarStickyClass(showDesktopSidebar)}>
      <OffcanvasFilterOrder
        sortFirst={sortFirst}
        filterTrigger={filterTrigger}
        layoutSwitch={layoutSwitch}
        sortingDropdown={sortingDropdown}
      />
    </div>
  );
}
