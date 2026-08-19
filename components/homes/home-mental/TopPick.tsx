"use client";

import { useMemo, useState } from "react";

import TfSwiper from "@/components/ui/TfSwiper";
import ProductCard from "@/components/ui/ProductCard";
import { topPickMentalProducts } from "@/data/products/products";

/** Tab ids must match `filterTabIds` on `topPickMentalProducts` in data */
const TOP_PICK_MENTAL_TABS: { id: string; label: string }[] = [
  { id: "medications", label: "Medications" },
  { id: "devices", label: "Devices" },
  { id: "wellness", label: "Wellness" },
  { id: "offers", label: "Offers" },
];

const TOP_PICK_MENTAL_DEFAULT_TAB_ID = "medications";

function TopPick() {
  const [activeTabId, setActiveTabId] = useState(TOP_PICK_MENTAL_DEFAULT_TAB_ID);

  const visibleProducts = useMemo(
    () =>
      topPickMentalProducts.filter((p) =>
        p.filterTabIds?.includes(activeTabId),
      ),
    [activeTabId],
  );

  return (
    <section className="flat-spacing flat-animate-tab">
      <div className="container">
        <div className="sect-heading type-2 has-col-right">
          <div className="wow fadeInUp">
            <h3 className="s-title">Top Picks This Week</h3>
            <p className="s-desc text-body-1 cl-text-2">
              Weekly Favorites Selected With Care To Support Your Wellbeing.
            </p>
          </div>
          <div
            className="col-right overflow-auto wow fadeInUp"
            data-wow-delay="0.1s"
          >
            <ul className="tab-btn-wrap-v2" role="tablist">
              {TOP_PICK_MENTAL_TABS.map((tab) => (
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
                    <span className="fw-semibold">{tab.label}</span>
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
              className="wrap-sw-over"
              preview={4}
              tablet={3}
              mobileSm={2}
              mobile={2}
              spaceLg={16}
              spaceMd={16}
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
                  cardClass="product-style_stroke"
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

export default TopPick;
