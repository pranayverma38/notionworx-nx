"use client";

import { useMemo, useState } from "react";

import TfSwiper from "@/components/ui/TfSwiper";
import ProductCard from "@/components/ui/ProductCard";
import { productsFashion2 } from "@/data/products/products";

/** Tab ids must match `filterTabIds` on `productsFashion2` in data */
const PRODUCTS_FASHION2_TABS: { id: string; label: string }[] = [
  { id: "new", label: "New Arrivals" },
  { id: "best", label: "Best Sellers" },
  { id: "sale", label: "On Sale" },
];

const PRODUCTS_FASHION2_DEFAULT_TAB_ID = "new";

/** Same as former index 1–3 → Add to Cart / offcanvas; others Quick Add / modal */
const ADD_TO_CART_PRODUCT_IDS = new Set<number>([93, 94, 95]);

function Products() {
  const [activeTabId, setActiveTabId] = useState(PRODUCTS_FASHION2_DEFAULT_TAB_ID);

  const visible = useMemo(
    () =>
      productsFashion2.filter((p) => p.filterTabIds?.includes(activeTabId)),
    [activeTabId],
  );

  return (
    <div className="flat-spacing pt-0 flat-animate-tab">
      <div className="container">
        <div className="sect-heading type-2 overflow-auto text-nowrap">
          <ul
            className="tab-btn-wrap-v3 style-4 justify-content-sm-center mb-0"
            role="tablist"
          >
            {PRODUCTS_FASHION2_TABS.map((tab) => (
              <li key={tab.id} className="nav-tab-item" role="presentation">
                <a
                  href="#"
                  role="tab"
                  aria-selected={tab.id === activeTabId}
                  className={`tf-btn-tab py-4 ${tab.id === activeTabId ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTabId(tab.id);
                  }}
                >
                  <span className="h4">{tab.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="tab-content">
          <div
            className="tab-pane fade active show"
            role="tabpanel"
            id={activeTabId}
          >
            <TfSwiper
              key={activeTabId}
              className="wrap-sw-over"
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
              grid={2}
              paginationClassName="sw-dot-default tf-sw-pagination"
            >
              {visible.map((product) => {
                const addToCart = ADD_TO_CART_PRODUCT_IDS.has(product.id);
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    imgWidth={330}
                    imgHeight={440}
                    actionBotLabel={addToCart ? "Add to Cart" : "Quick Add"}
                    actionBotHref={addToCart ? "#shoppingCart" : "#quickAdd"}
                    actionBotDataToggle={addToCart ? "offcanvas" : "modal"}
                  />
                );
              })}
            </TfSwiper>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
