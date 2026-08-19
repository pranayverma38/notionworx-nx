"use client";

import ProductCard from "@/components/ui/ProductCard";
import { clearAllFilters } from "./filterActions";
import { useShop } from "./ShopContext";
import { ShopAppliedFilters } from "./ShopAppliedFilters";
import { ShopEmptyFilters } from "./ShopListingUi";
import { ShopListingFooters, useShopProgressiveLoad } from "./ShopListingFooters";
import { shopMetaFor } from "./shopProductMeta";
import { resolveGridProductCardVariant } from "./shopLayoutUtils";

export function ShopProductSection() {
  const {
    state,
    dispatch,
    viewMode,
    gridCols,
    hasNoFilteredItems,
    variants,
    pagedVisibleProducts,
    progressive,
    infiniteScroll,
  } = useShop();

  const { visibleProducts, loadMore } = useShopProgressiveLoad({
    enabled: progressive,
    infiniteScroll,
    sorted: state.sorted,
    itemPerPage: state.itemPerPage,
    pagedSlice: pagedVisibleProducts,
    hasNoFilteredItems,
    viewMode,
  });

  const gridCardVariant = resolveGridProductCardVariant(variants);
  const onClear = () => clearAllFilters(dispatch);

  return (
    <div className="wrapper-control-shop gridLayout-wrapper">
      <ShopAppliedFilters state={state} dispatch={dispatch} />

      <div
        className={`tf-list-layout wrapper-shop ${viewMode === "list" ? "" : "d-none"}`}
        id="listLayout"
      >
        {hasNoFilteredItems ? (
          <ShopEmptyFilters onClear={onClear} />
        ) : (
          visibleProducts.map((product, i) => (
            <ProductCard
              key={`${product.id}-list-${i}`}
              product={product}
              variant="shopList"
              wrapperClass={product.cardVariant}
              cardClass=""
              shopMeta={shopMetaFor(product)}
            />
          ))
        )}
      </div>

      <div
        className={`wrapper-shop tf-grid-layout ${gridCols} ${viewMode === "grid" ? "" : "d-none"}`}
        id="gridLayout"
      >
        {hasNoFilteredItems ? (
          <div className="wd-full">
            <ShopEmptyFilters onClear={onClear} />
          </div>
        ) : (
          visibleProducts.map((product, i) => (
            <ProductCard
              key={`${product.id}-grid-${i}`}
              product={product}
              wrapperClass={product.cardVariant}
              variant={gridCardVariant}
              cardClass="grid"
              shopMeta={shopMetaFor(product)}
            />
          ))
        )}
        <ShopListingFooters layout="grid" loadMore={loadMore} />
      </div>

      <ShopListingFooters layout="list" loadMore={loadMore} />
    </div>
  );
}
