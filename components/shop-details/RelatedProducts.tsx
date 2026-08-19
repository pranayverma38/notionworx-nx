"use client";

import { useMemo, useState } from "react";

import { products, topPicsProducts } from "@/data/products/products";
import type { ProductCardItem } from "@/types/productCard";
import ProductCard from "../ui/ProductCard";
import TfSwiper from "../ui/TfSwiper";

/** Tab ids must match `filterTabIds` on `topPicsProducts` in data */
const RELATED_TABS = [
  { id: "related", label: "Related Products" },
  { id: "recently", label: "Recently Viewed" },
];

const DEFAULT_TAB_ID = "related";

export default function RelatedProducts({
  currentProduct,
}: {
  currentProduct?: ProductCardItem;
}) {
  const [activeTabId, setActiveTabId] = useState(DEFAULT_TAB_ID);

  const fallbackVisible = useMemo(
    () => topPicsProducts.filter((p) => p.filterTabIds?.includes(activeTabId)),
    [activeTabId],
  );

  const visible = useMemo(() => {
    if (!currentProduct) {
      return fallbackVisible;
    }

    const related = products.filter((product) => {
      if (product.id === currentProduct.id) return false;
      if (!currentProduct.category) return false;
      return product.filterCategory?.includes(currentProduct.category);
    });

    if (!related.length) {
      return fallbackVisible;
    }

    return activeTabId === "recently"
      ? related.slice(4, 12)
      : related.slice(0, 8);
  }, [activeTabId, currentProduct, fallbackVisible]);

  return (
    <div className="flat-spacing flat-animate-tab pt-0">
      <div className="container">
        <ul
          className="tab-btn-wrap-v1 style-2 justify-content-sm-center"
          role="tablist"
        >
          {RELATED_TABS.map((tab) => (
            <li key={tab.id} className="nav-tab-item" role="presentation">
              <a
                href="#"
                role="tab"
                aria-selected={tab.id === activeTabId}
                className={`tf-btn-tab ${tab.id === activeTabId ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTabId(tab.id);
                }}
              >
                <span className="h4 fw-medium">{tab.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="tab-content">
          <div
            className="tab-pane fade active show"
            role="tabpanel"
            id={activeTabId}
          >
            <TfSwiper
              key={activeTabId}
              preview={4}
              tablet={3}
              mobileSm={2}
              mobile={2}
              spaceLg={30}
              spaceMd={20}
              space={10}
              pagination={2}
              paginationSm={2}
              paginationMd={3}
              paginationLg={4}
              className="wrap-sw-over"
              paginationClassName="sw-dot-default tf-sw-pagination"
            >
              {visible.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </TfSwiper>
          </div>
        </div>
      </div>
    </div>
  );
}
