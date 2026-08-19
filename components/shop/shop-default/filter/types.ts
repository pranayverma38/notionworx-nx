import type { Dispatch } from "react";
import type { FilterAction, FilterState, ShopProduct } from "@/types/shopFilter";

export type ShopFilterBodyProps = {
  state: FilterState;
  dispatch: Dispatch<FilterAction>;
  getFilterCount: (fn: (p: ShopProduct) => boolean) => number;
  sourceProducts: ShopProduct[];
};
