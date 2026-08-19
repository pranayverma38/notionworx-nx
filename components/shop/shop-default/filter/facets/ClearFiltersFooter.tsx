"use client";

import type { Dispatch } from "react";
import type { FilterAction } from "@/types/shopFilter";
import { clearAllFilters } from "../../filterActions";

type Props = {
  dispatch: Dispatch<FilterAction>;
};

export function ClearFiltersFooter({ dispatch }: Props) {
  return (
    <div className="mt-24">
      <button
        type="button"
        className="tf-btn btn-outline btn-sm w-100"
        onClick={() => clearAllFilters(dispatch)}
      >
        Clear all filters
      </button>
    </div>
  );
}
