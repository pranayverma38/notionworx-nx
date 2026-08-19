"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import ProductCard from "@/components/ui/ProductCard";
import { topPicksConstructionProducts } from "@/data/products/products";

/** Tab ids must match `filterTabIds` on `topPicksConstructionProducts` in data */
const TOP_PICKS_CONSTRUCTION_TABS: { id: string; label: string }[] = [
  { id: "medications", label: "Medications" },
  { id: "devices", label: "Devices" },
  { id: "wellness", label: "Wellness" },
  { id: "offers", label: "Offers" },
];

const TOP_PICKS_CONSTRUCTION_DEFAULT_TAB_ID = "medications";

const BANNER = {
  img: "/assets/images/section/banner-54.jpg",
  title: "Top Quality",
  titleBreak: "Accessories",
  desc: "Discover Premium Parts to",
  descBreak: "Enhance Performance.",
};

function TopPicksThisWeek() {
  const [activeTabId, setActiveTabId] = useState(
    TOP_PICKS_CONSTRUCTION_DEFAULT_TAB_ID,
  );

  const visible = useMemo(
    () =>
      topPicksConstructionProducts.filter((p) =>
        p.filterTabIds?.includes(activeTabId),
      ),
    [activeTabId],
  );

  return (
    <section className="section-top-pick-v02 flat-animate-tab">
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
              {TOP_PICKS_CONSTRUCTION_TABS.map((tab) => (
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
            <div className="wrap-prd">
              <div className="col-prd-1">
                <div className="banner-image-text type-abs style-18 v2 mb-20">
                  <Link href="/shop-default" className="bn-image img-style">
                    <Image
                      src={`${BANNER.img}`}
                      alt=""
                      width={450}
                      height={608}
                      loading="lazy"
                    />
                  </Link>
                  <div className="bn-content wow fadeInUp">
                    <Link
                      href="/shop-default"
                      className="title text-white h3 fw-medium link mb-8"
                    >
                      {BANNER.title} <br className="d-xxl-block d-none" />{" "}
                      {BANNER.titleBreak}
                    </Link>
                    <p className="desc text-body-1 text-white mb-28">
                      {BANNER.desc} <br className="d-xxl-block d-none" />{" "}
                      {BANNER.descBreak}
                    </p>
                    <Link
                      href="/shop-default"
                      className="tf-btn btn-white hv-primary"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
                <div className="tf-grid-layout tf-col-2 gap-20">
                  {visible.slice(0, 2).map((product) => (
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
                </div>
              </div>
              <div className="col-prd-2">
                <div className="tf-grid-layout tf-col-2 lg-col-3 gap-20">
                  {visible.slice(2, 8).map((product) => (
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TopPicksThisWeek;
