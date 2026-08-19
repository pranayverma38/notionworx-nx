"use client";

import { useMemo, useState } from "react";

import TfSwiper from "@/components/ui/TfSwiper";
import ProductCard from "@/components/ui/ProductCard";
import { babyHighlightsNewProducts } from "@/data/products/products";

/** Tab ids must match `filterTabIds` on `babyHighlightsNewProducts` in data */
const BABY_HIGHLIGHTS_TABS = [
  { id: "new", label: "New" },
  { id: "popular", label: "Popular" },
  { id: "sale", label: "Sale" },
  { id: "baby", label: "Baby" },
  { id: "kids", label: "Kids" },
] as const;

const DEFAULT_TAB_ID = "new";

function TopPicksThisWeek() {
  const [activeTabId, setActiveTabId] = useState<string>(DEFAULT_TAB_ID);

  const visible = useMemo(
    () =>
      babyHighlightsNewProducts.filter((p) =>
        p.filterTabIds?.includes(activeTabId),
      ),
    [activeTabId],
  );

  return (
    <section className="flat-spacing flat-animate-tab">
      <div className="container">
        <div className="sect-heading type-2 has-col-right">
          <div className="wow fadeInUp">
            <h3 className="s-title">This Week&apos;s Highlights</h3>
            <p className="s-desc text-body-1 cl-text-2">
              Discover our most-loved baby essentials picked for comfort,
              safety, and style.
            </p>
          </div>
          <div
            className="col-right overflow-auto wow fadeInUp"
            data-wow-delay="0.1s"
          >
            <ul className="tab-btn-wrap-v2 style-2" role="tablist">
              {BABY_HIGHLIGHTS_TABS.map((tab) => (
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
            aria-labelledby={`${activeTabId}-tab`}
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
              grid={2}
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

export default TopPicksThisWeek;
