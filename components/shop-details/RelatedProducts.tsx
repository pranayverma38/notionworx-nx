"use client";

import { useMemo, useState } from "react";

import { topPicsProducts } from "@/data/products/products";
import ProductCard from "../ui/ProductCard";
import TfSwiper from "../ui/TfSwiper";

/** Tab ids must match `filterTabIds` on `topPicsProducts` in data */
const RELATED_TABS = [
  { id: "related", label: "Related Products" },
  { id: "recently", label: "Recently Viewed" },
];

const DEFAULT_TAB_ID = "related";

export default function RelatedProducts() {
  const [activeTabId, setActiveTabId] = useState(DEFAULT_TAB_ID);

  const visible = useMemo(
    () =>
      topPicsProducts.filter((p) => p.filterTabIds?.includes(activeTabId)),
    [activeTabId],
  );

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
