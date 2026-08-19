"use client";

import { useMemo, useState } from "react";

import TfSwiper from "@/components/ui/TfSwiper";
import ProductCard from "@/components/ui/ProductCard";
import { productTabPodProducts } from "@/data/products/products";

/** Tab ids must match `filterTabIds` on `productTabPodProducts` in data */
const POD_TABS = [
  { id: "hot", label: "What's Hot?" },
  { id: "seller", label: "Best Sellers" },
  { id: "arrival", label: "Just Arrivals" },
];

const DEFAULT_TAB_ID = "hot";

function ProductTab() {
  const [activeTabId, setActiveTabId] = useState(DEFAULT_TAB_ID);

  const visible = useMemo(
    () =>
      productTabPodProducts.filter((p) =>
        p.filterTabIds?.includes(activeTabId),
      ),
    [activeTabId],
  );

  return (
    <div className="flat-spacing pt-0 flat-animate-tab">
      <div className="container">
        <div className="sect-heading type-2 wow fadeInUp">
          <ul
            className="tab-btn-wrap-v1 style-2 justify-content-sm-center"
            role="tablist"
          >
            {POD_TABS.map((tab) => (
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
                  <span className="h3 fw-medium">{tab.label}</span>
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
              preview={4}
              tablet={3}
              mobileSm={2}
              mobile={2}
              spaceLg={30}
              spaceMd={15}
              space={10}
              pagination={2}
              paginationSm={2}
              paginationMd={3}
              paginationLg={4}
              paginationClassName="sw-dot-default tf-sw-pagination"
            >
              {visible.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  wrapperClass="square"
                  imgWidth={330}
                  imgHeight={330}
                  actionBotLabel="Add to Cart"
                  actionBotHref="#shoppingCart"
                  actionBotDataToggle="offcanvas"
                />
              ))}
            </TfSwiper>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductTab;
