"use client";

import {
  createContext,
  useContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { FilterAction, FilterState, ShopProduct } from "@/types/shopFilter";
import type { ShopFilterBodyProps } from "./filter/types";
import type { GridCols } from "./shopGridCols";
import type { ShopLayoutVariant } from "./shopLayoutUtils";

export type ShopContextValue = {
  variants: ShopLayoutVariant[];
  sidebarPlacement?: "leftSidebar" | "rightSidebar";
  showDesktopSidebar: boolean;
  setWideEnoughForSidebar: Dispatch<SetStateAction<boolean>>;
  viewMode: "grid" | "list";
  setViewMode: (v: "grid" | "list") => void;
  gridCols: GridCols;
  setGridCols: Dispatch<SetStateAction<GridCols>>;
  sortOpen: boolean;
  setSortOpen: Dispatch<SetStateAction<boolean>>;
  sortLabel: string;
  state: FilterState;
  dispatch: Dispatch<FilterAction>;
  hasNoFilteredItems: boolean;
  showPaginationFooter: boolean;
  progressive: boolean;
  infiniteScroll: boolean;
  filterBodyProps: ShopFilterBodyProps;
  pagedVisibleProducts: ShopProduct[];
  totalPages: number;
  pageItems: number[];
};

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({
  value,
  children,
}: {
  value: ShopContextValue;
  children: ReactNode;
}) {
  return (
    <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
  );
}

export function useShop(): ShopContextValue {
  const ctx = useContext(ShopContext);
  if (ctx == null) {
    throw new Error("useShop must be used within <ShopProvider>");
  }
  return ctx;
}
