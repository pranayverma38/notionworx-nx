"use client";

import Link from "next/link";
import React, { useMemo, useState } from "react";

import TfSwiper from "@/components/ui/TfSwiper";
import ProductCard from "@/components/ui/ProductCard";
import {
  bestSellerElectronicsHeadphone,
  bestSellerElectronicsMouse,
} from "@/data/products/products";

/** Tab ids must match `filterTabIds` on best-seller products in data */
const BEST_SELLER_ELECTRONICS_TABS: { id: string; label: string }[] = [
  { id: "headphone", label: "Headphone" },
  { id: "mouse", label: "Mouse" },
  { id: "keyboard", label: "Keyboard" },
  { id: "mousepad", label: "Mousepad" },
  { id: "cables", label: "Cables" },
  { id: "networking", label: "Networking" },
];

const BEST_SELLER_ELECTRONICS_DEFAULT_TAB_ID = "headphone";

const bestSellerElectronicsAllProducts = [
  ...bestSellerElectronicsHeadphone,
  ...bestSellerElectronicsMouse,
];

function BestSeller() {
  const [activeTabId, setActiveTabId] = useState(
    BEST_SELLER_ELECTRONICS_DEFAULT_TAB_ID,
  );

  const visible = useMemo(
    () =>
      bestSellerElectronicsAllProducts.filter((p) =>
        p.filterTabIds?.includes(activeTabId),
      ),
    [activeTabId],
  );

  return (
    <section className="flat-spacing pt-0 flat-animate-tab">
      <div className="container">
        <div className="sect-heading d-block d-md-flex type-2 has-col-right wow fadeInUp">
          <div>
            <h3 className="s-title">Best Sellers Products</h3>
            <div className="overflow-auto">
              <ul className="tab-btn-wrap-v3" role="tablist">
                {BEST_SELLER_ELECTRONICS_TABS.map((tab, index) => (
                  <React.Fragment key={tab.id}>
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
                  </React.Fragment>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-right">
            <Link
              href="/shop-default"
              className="tf-btn-line-2 py-4 style-primary"
            >
              <span className="fw-semibold">View All Products</span>
            </Link>
          </div>
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
    </section>
  );
}

export default BestSeller;
