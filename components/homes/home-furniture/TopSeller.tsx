"use client";

import { Fragment, useMemo, useState } from "react";

import TfSwiper from "@/components/ui/TfSwiper";
import ProductCard from "@/components/ui/ProductCard";
import { topSellerFurnitureProducts } from "@/data/products/products";

/** Tab ids must match `filterTabIds` on `topSellerFurnitureProducts` in data */
const TOP_SELLER_TABS = [
  { id: "bedside", label: "Bedside Tables" },
  { id: "beds", label: "Beds by Size" },
  { id: "bedroom", label: "Bedroom Furniture" },
  { id: "lamps", label: "Table Lamps" },
  { id: "storage", label: "Storage Beds" },
  { id: "accessories", label: "Accessories" },
];

const DEFAULT_TAB_ID = "bedside";

function TopSeller() {
  const [activeTabId, setActiveTabId] = useState(DEFAULT_TAB_ID);

  const visible = useMemo(
    () =>
      topSellerFurnitureProducts.filter((p) =>
        p.filterTabIds?.includes(activeTabId),
      ),
    [activeTabId],
  );

  return (
    <section className="flat-spacing flat-animate-tab">
      <div className="container">
        <div className="sect-heading text-center type-2 wow fadeInUp">
          <h3 className="s-title mb-lg-20">Top Sellers You Can&apos;t Miss</h3>
          <ul
            className="tab-btn-wrap-v3 overflow-auto justify-content-lg-center text-nowrap"
            role="tablist"
          >
            {TOP_SELLER_TABS.map((tab, index) => (
              <Fragment key={tab.id}>
                {index > 0 && <li className="spread">/</li>}
                <li className="nav-tab-item" role="presentation">
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
                    <span className="fw-medium">{tab.label}</span>
                  </a>
                </li>
              </Fragment>
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
              spaceMd={20}
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
    </section>
  );
}

export default TopSeller;
