"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ShopProduct } from "@/types/shopFilter";

type Args = {
  enabled: boolean;
  infiniteScroll: boolean;
  sorted: ShopProduct[];
  itemPerPage: number;
  pagedSlice: ShopProduct[];
  hasNoFilteredItems: boolean;
  viewMode: "grid" | "list";
};

/**
 * “Load more” / infinite scroll: extra batches, sentinel observer, visible slice.
 * Pagination mode passes `enabled: false` behavior via `pagedSlice` only.
 */
export function useShopProgressiveLoad({
  enabled,
  infiniteScroll,
  sorted,
  itemPerPage,
  pagedSlice,
  hasNoFilteredItems,
  viewMode,
}: Args) {
  const [extraBatches, setExtraBatches] = useState(0);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const sortedKey = useMemo(() => sorted.map((p) => p.id).join("|"), [sorted]);
  useEffect(() => {
    setExtraBatches(0);
  }, [sortedKey]);

  const visibleCount = Math.min(
    itemPerPage * (1 + extraBatches),
    sorted.length,
  );

  const visibleProducts = useMemo(() => {
    if (!enabled) return pagedSlice;
    return sorted.slice(0, visibleCount);
  }, [enabled, sorted, visibleCount, pagedSlice]);

  const canLoadMore =
    enabled && !hasNoFilteredItems && visibleCount < sorted.length;

  const gate = useRef({ canLoadMore: false, loading: false });
  gate.current = { canLoadMore, loading };

  const onLoadMore = useCallback(() => {
    if (!gate.current.canLoadMore || gate.current.loading) return;
    setLoading(true);
    setExtraBatches((n) => n + 1);
    window.setTimeout(() => setLoading(false), 450);
  }, []);

  const onLoadMoreRef = useRef(onLoadMore);
  onLoadMoreRef.current = onLoadMore;

  useEffect(() => {
    if (!infiniteScroll) return;
    const el = sentinelRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        if (!gate.current.canLoadMore || gate.current.loading) return;
        onLoadMoreRef.current();
      },
      { root: null, rootMargin: "180px 0px 80px 0px", threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [infiniteScroll, sortedKey, visibleCount, viewMode, loading]);

  const showLoadMoreFooter =
    enabled && !hasNoFilteredItems && (canLoadMore || loading);

  return {
    visibleProducts,
    loadMoreLoading: loading,
    onLoadMore,
    loadMoreSentinelRef: sentinelRef,
    showLoadMoreFooter,
  };
}
