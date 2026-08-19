"use client";

import { useMemo, useState } from "react";

import TfSwiper from "@/components/ui/TfSwiper";
import ProductCard from "@/components/ui/ProductCard";
import { featuredAutoProducts } from "@/data/products/products";

/** Tab ids must match `filterTabIds` on `featuredAutoProducts` in data */
const FEATURED_AUTO_TABS: { id: string; label: string }[] = [
  { id: "brake", label: "Brake Pads" },
  { id: "air", label: "Air Filters" },
  { id: "roto", label: "Brake Rotors" },
  { id: "hydraulic", label: "Brake Hydraulics" },
];

const FEATURED_AUTO_DEFAULT_TAB_ID = "brake";

function FeaturedProducts() {
  const [activeTabId, setActiveTabId] = useState(FEATURED_AUTO_DEFAULT_TAB_ID);

  const visibleProducts = useMemo(
    () =>
      featuredAutoProducts.filter((p) =>
        p.filterTabIds?.includes(activeTabId),
      ),
    [activeTabId],
  );

  return (
    <section className="flat-spacing flat-animate-tab">
      <div className="container">
        <div className="sect-heading type-2 has-col-right">
          <div className="wow fadeInUp">
            <h3 className="s-title">Featured Products</h3>
            <p className="s-desc text-body-1 cl-text-2">
              Weekly Favorites Selected With Care To Support Your Wellbeing.
            </p>
          </div>
          <div
            className="col-right overflow-auto wow fadeInUp"
            data-wow-delay="0.1s"
          >
            <ul className="tab-btn-wrap-v2 style-2 text-nowrap" role="tablist">
              {FEATURED_AUTO_TABS.map((tab) => (
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
                    <span className="fw-medium">{tab.label}</span>
                  </a>
                </li>
              ))}
            </ul>
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
              laptop={5}
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
              {visibleProducts.map((product) => (
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

export default FeaturedProducts;
