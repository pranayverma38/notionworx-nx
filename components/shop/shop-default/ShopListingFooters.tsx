"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import type { ShopProduct } from "@/types/shopFilter";
import { setCurrentPage } from "./filterActions";
import { useShop } from "./ShopContext";
import { ShopLoadMoreButton, ShopPagination } from "./ShopListingUi";

type LoadMoreState = {
  loading: boolean;
  onLoadMore: () => void;
  sentinelRef: RefObject<HTMLDivElement | null>;
  infiniteScroll: boolean;
};

export function useShopProgressiveLoad(args: {
  enabled: boolean;
  infiniteScroll: boolean;
  sorted: ShopProduct[];
  itemPerPage: number;
  pagedSlice: ShopProduct[];
  hasNoFilteredItems: boolean;
  viewMode: "grid" | "list";
}) {
  const {
    enabled,
    infiniteScroll,
    sorted,
    itemPerPage,
    pagedSlice,
    hasNoFilteredItems,
    viewMode,
  } = args;

  const sortedKey = useMemo(() => sorted.map((p) => p.id).join("|"), [sorted]);

  const [progress, setProgress] = useState<{ key: string; batches: number }>(
    () => ({ key: sortedKey, batches: 0 }),
  );
  if (progress.key !== sortedKey) {
    setProgress({ key: sortedKey, batches: 0 });
  }

  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const visibleCount = Math.min(
    itemPerPage * (1 + progress.batches),
    sorted.length,
  );

  const visibleProducts = useMemo(() => {
    if (!enabled) return pagedSlice;
    return sorted.slice(0, visibleCount);
  }, [enabled, sorted, visibleCount, pagedSlice]);

  const active = enabled && !hasNoFilteredItems;
  const canLoadMore = active && visibleCount < sorted.length;
  const showRow = active && (canLoadMore || loading);

  const onLoadMore = useCallback(() => {
    if (!canLoadMore || loading) return;
    setLoading(true);
    setProgress((p) =>
      p.key !== sortedKey ? p : { ...p, batches: p.batches + 1 },
    );
    window.setTimeout(() => setLoading(false), 450);
  }, [canLoadMore, loading, sortedKey]);

  useEffect(() => {
    if (!infiniteScroll) return;
    const el = sentinelRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        onLoadMore();
      },
      { root: null, rootMargin: "180px 0px 80px 0px", threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [infiniteScroll, sortedKey, visibleCount, viewMode, onLoadMore]);

  const loadMore: LoadMoreState | null =
    enabled && showRow
      ? {
          loading,
          onLoadMore,
          sentinelRef,
          infiniteScroll,
        }
      : null;

  return { visibleProducts, loadMore };
}

function rowClass(list: boolean) {
  return `wd-full justify-content-center${list ? " mt-24" : ""}`;
}

function rowStyle(list: boolean) {
  return list ? undefined : { gridColumn: "1 / -1" as const };
}

export function ShopListingFooters({
  layout,
  loadMore,
}: {
  layout: "grid" | "list";
  loadMore?: LoadMoreState | null;
}) {
  const {
    viewMode,
    state,
    dispatch,
    hasNoFilteredItems,
    showPaginationFooter,
    totalPages,
    pageItems,
  } = useShop();

  if (viewMode !== layout || hasNoFilteredItems) return null;

  const list = layout === "list";

  return (
    <>
      {showPaginationFooter && (
        <div className={rowClass(list)} style={rowStyle(list)}>
          <ShopPagination
            currentPage={state.currentPage}
            totalPages={totalPages}
            pageItems={pageItems}
            onPageChange={(p) => setCurrentPage(p, dispatch)}
          />
        </div>
      )}
      {loadMore && (
        <div
          ref={loadMore.infiniteScroll ? loadMore.sentinelRef : undefined}
          className={rowClass(list)}
          style={rowStyle(list)}
        >
          <ShopLoadMoreButton
            loading={loadMore.loading}
            onClick={loadMore.onLoadMore}
            autoTrigger={loadMore.infiniteScroll}
          />
        </div>
      )}
    </>
  );
}
