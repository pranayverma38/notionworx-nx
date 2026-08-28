"use client";

import { useMemo, useState } from "react";

import TfSwiper from "@/components/ui/TfSwiper";
import ProductCard from "@/components/ui/ProductCard";
import { products } from "@/data/products/products";
import type { ProductCardItem } from "@/types/productCard";

const TOP_PICK_COLLECTION_TABS = [
  {
    id: "food-booths",
    label: "Food Booths",
    collectionTitle:
      "Custom Food Booths – 5x5, 10x10, 10x15 & 10x20 Canopy Tents",
  },
  {
    id: "trade-show-essentials",
    label: "Trade Show Essentials",
    collectionTitle:
      "Trade Show Essentials – 10x10, 10x15 & 10x20 Custom Canopy Tents for Events & Exhibits",
  },
] as const;

const DEFAULT_TAB_ID = TOP_PICK_COLLECTION_TABS[0].id;

function belongsToCollection(
  product: ProductCardItem,
  collectionTitle: string,
): boolean {
  return (
    product.category === collectionTitle ||
    product.badgeLabel === collectionTitle ||
    product.filterCategory?.includes(collectionTitle) === true
  );
}

function TopPicksThisWeek() {
  const [activeTabId, setActiveTabId] = useState<string>(DEFAULT_TAB_ID);

  const visible = useMemo(
    () => {
      const activeCollection = TOP_PICK_COLLECTION_TABS.find(
        (tab) => tab.id === activeTabId,
      );

      if (!activeCollection) {
        return [];
      }

      return products
        .filter((product) =>
          belongsToCollection(product, activeCollection.collectionTitle),
        )
        .slice(0, 8);
    },
    [activeTabId],
  );

  return (
    <section className="flat-spacing flat-animate-tab">
      <div className="container">
        <div className="sect-heading type-2 has-col-right">
          <div className="wow fadeInUp">
            <h3 className="s-title">Boost Your Brand Visibility!</h3>
          </div>
          <div
            className="col-right overflow-auto wow fadeInUp"
            data-wow-delay="0.1s"
          >
            <ul className="tab-btn-wrap-v2" role="tablist">
              {TOP_PICK_COLLECTION_TABS.map((tab) => (
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
              {visible.map((product) => (
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

export default TopPicksThisWeek;
