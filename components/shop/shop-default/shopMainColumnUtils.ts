/** Shared class names and labels for shop toolbar / main column (no React). */

export function toolbarStickyClass(showDesktopSidebar: boolean): string {
  return showDesktopSidebar
    ? "tf-shop-control"
    : "tf-shop-control sticky-top no-offset";
}

export function filterDrawerControlClass(showDesktopSidebar: boolean): string {
  const base =
    "tf-shop-control wrapper-filter-dropdown position-relative";
  return showDesktopSidebar ? base : `${base} sticky-top no-offset`;
}

export function offcanvasFilterTriggerClass(isSidebar: boolean): string {
  return isSidebar ? "tf-btn-filter d-xl-none" : "tf-btn-filter";
}

export function offcanvasFilterTriggerLabel(isSidebar: boolean): string {
  return isSidebar ? "Show All Filter" : "Show Filters";
}
