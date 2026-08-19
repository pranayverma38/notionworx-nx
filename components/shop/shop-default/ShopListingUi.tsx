"use client";

import { useEffect, type Dispatch, type KeyboardEvent, type SetStateAction } from "react";
import type { FilterAction, FilterState } from "@/types/shopFilter";
import type { SortingOption } from "@/types/shopFilter";
import { SORT_OPTIONS } from "./ShopFilterBody";
import { setSorting } from "./filterActions";
import { useShop } from "./ShopContext";
import { clampGridColsForWidth, type GridCols } from "./shopGridCols";
import { SHOP_SIDEBAR_DESKTOP_MIN_PX } from "./shopLayoutUtils";

export type { GridCols };

export function ShopLayoutSwitch({
  viewMode,
  setViewMode,
}: {
  viewMode: "grid" | "list";
  setViewMode: (v: "grid" | "list") => void;
}) {
  const { gridCols, setGridCols, setWideEnoughForSidebar } = useShop();

  useEffect(() => {
    const onResize = () => {
      setGridCols((prev) => {
        const next = clampGridColsForWidth(window.innerWidth, prev);
        return next === prev ? prev : next;
      });
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [setGridCols]);

  useEffect(() => {
    const mq = window.matchMedia(
      `(min-width: ${SHOP_SIDEBAR_DESKTOP_MIN_PX}px)`,
    );
    const sync = () => setWideEnoughForSidebar(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [setWideEnoughForSidebar]);

  const keyActivate = (e: KeyboardEvent, fn: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fn();
    }
  };

  return (
    <ul className="tf-control-layout">
      <li
        className={`tf-view-layout-switch sw-layout-list list-layout ${viewMode === "list" ? "active" : ""}`}
        data-value-layout="list"
        role="button"
        tabIndex={0}
        onClick={() => setViewMode("list")}
        onKeyDown={(e) => keyActivate(e, () => setViewMode("list"))}
      >
        <i className="icon-List" />
      </li>
      {(
        [
          ["tf-col-2", "sw-layout-2", "icon-grid-2"],
          ["tf-col-3", "sw-layout-3 d-none d-md-flex", "icon-grid-3"],
          ["tf-col-4", "sw-layout-4 d-none d-lg-flex", "icon-grid-4"],
        ] as const
      ).map(([col, cls, icon]) => (
        <li
          key={col}
          className={`tf-view-layout-switch ${cls} ${gridCols === col && viewMode === "grid" ? "active" : ""}`}
          data-value-layout={col}
          role="button"
          tabIndex={0}
          onClick={() => {
            setViewMode("grid");
            setGridCols(col);
          }}
          onKeyDown={(e) =>
            keyActivate(e, () => {
              setViewMode("grid");
              setGridCols(col);
            })
          }
        >
          <i className={icon} />
        </li>
      ))}
    </ul>
  );
}

export function ShopSortDropdown({
  sortOpen,
  setSortOpen,
  sortLabel,
  state,
  dispatch,
}: {
  sortOpen: boolean;
  setSortOpen: Dispatch<SetStateAction<boolean>>;
  sortLabel: string;
  state: FilterState;
  dispatch: Dispatch<FilterAction>;
}) {
  return (
    <div className="tf-control-sorting position-relative">
      <div className={`tf-dropdown-sort ${sortOpen ? "show" : ""}`}>
        <div
          className="btn-select"
          role="button"
          tabIndex={0}
          aria-expanded={sortOpen}
          onClick={() => setSortOpen((o) => !o)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setSortOpen((o) => !o);
            }
          }}
        >
          <span className="text-sort-value">{sortLabel}</span>
          <span className="icon icon-CaretDown" />
        </div>
        {sortOpen && (
          <div className="dropdown-menu show position-absolute end-0">
            {SORT_OPTIONS.map((opt) => (
              <div
                key={opt.value}
                role="button"
                tabIndex={0}
                className={`select-item ${state.sortingOption === opt.value ? "active" : ""} ${opt.value === SORT_OPTIONS[0]?.value ? "remove-all-filters" : ""}`.trim()}
                data-sort-value={opt.value}
                onClick={() => {
                  setSorting(opt.value as SortingOption, dispatch);
                  setSortOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSorting(opt.value as SortingOption, dispatch);
                    setSortOpen(false);
                  }
                }}
              >
                <span className="text-value-item">{opt.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ShopPagination({
  currentPage,
  totalPages,
  pageItems,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  pageItems: number[];
  onPageChange: (p: number) => void;
}) {
  return (
    <div className="tf-page-pagination">
      <button
        type="button"
        className="pag-item"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <i className="icon icon-CaretLeft" />
      </button>
      {pageItems.map((p) => (
        <button
          key={p}
          type="button"
          className={`pag-item ${currentPage === p ? "active" : ""}`}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        className="pag-item"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        <i className="icon icon-CaretRightThin" />
      </button>
    </div>
  );
}

export function ShopLoadMoreButton({
  loading,
  onClick,
  autoTrigger = false,
}: {
  loading: boolean;
  onClick: () => void;
  autoTrigger?: boolean;
}) {
  return (
    <div
      className="wd-full justify-content-center"
      style={{ display: "flex" }}
    >
      <button
        type="button"
        className={`btn-loadmore tf-btn animate-btn tf-loading loadmore${loading ? " loading" : ""}`}
        id={autoTrigger ? "loadMoreBtnInfinity" : "loadMoreBtn"}
        onClick={onClick}
        disabled={loading}
        aria-busy={loading}
        aria-label={
          autoTrigger
            ? loading
              ? "Loading more products"
              : "More products load when this is in view"
            : undefined
        }
        title={autoTrigger ? "More products load automatically when visible" : undefined}
      >
        <span className="text">Load More</span>
        <div className="spinner-circle" aria-hidden>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <span key={n} className={`spinner-circle${n} spinner-child`} />
          ))}
        </div>
      </button>
    </div>
  );
}

export function ShopEmptyFilters({ onClear }: { onClear: () => void }) {
  return (
    <div className="text-center py-40">
      <p className="text-body-1 mb-16">No products match your filters.</p>
      <button type="button" className="tf-btn" onClick={onClear}>
        Clear filters
      </button>
    </div>
  );
}
