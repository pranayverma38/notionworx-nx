"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import TfSwiper from "@/components/ui/TfSwiper";
import ProductCard from "@/components/ui/ProductCard";
import { topPickHeadphoneProducts } from "@/data/products/products";

/** Tab ids must match `filterTabIds` on `topPickHeadphoneProducts` in data */
const TOP_PICK_TABS = [
  { id: "new", label: "New" },
  { id: "popular", label: "Popular" },
  { id: "sale", label: "Sale" },
  { id: "gaming", label: "Gaming" },
  { id: "wireless", label: "Wireless" },
];

const DEFAULT_TAB_ID = "new";

const BANNER = {
  img: "/assets/images/section/banner-41.jpg",
  title: "Peak Audio",
  desc: "Experience peak audio performance with this top Amerce collection.",
};

function TopPick() {
  const [activeTabId, setActiveTabId] = useState(DEFAULT_TAB_ID);

  const visible = useMemo(
    () =>
      topPickHeadphoneProducts.filter((p) =>
        p.filterTabIds?.includes(activeTabId),
      ),
    [activeTabId],
  );

  return (
    <section className="section-top-pick flat-animate-tab">
      <div className="container">
        <div className="sect-heading type-2 has-col-right">
          <div className="wow fadeInUp">
            <h3 className="s-title">Explore The Collection</h3>
            <p className="s-desc text-body-1 cl-text-2">
              Browse smart audio solutions, from ANC to active models.
            </p>
          </div>
          <div
            className="col-right overflow-auto wow fadeInUp"
            data-wow-delay="0.1s"
          >
            <ul className="tab-btn-wrap-v2 style-3" role="tablist">
              {TOP_PICK_TABS.map((tab) => (
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
        <div className="row">
          <div className="col-lg-3">
            <div className="banner-image-text type-abs style-16">
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
                  className="title h4 fw-medium text-white link mb-3"
                >
                  {BANNER.title}
                </Link>
                <p className="desc text-caption-01 text-white mb-12">
                  {BANNER.desc}
                </p>
                <Link
                  href="/shop-default"
                  className="btn-action tf-btn-line-2 style-white"
                >
                  <span className="fw-semibold">Shop Now</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-9">
            <div className="tab-content">
              <div
                className="tab-pane fade active show"
                role="tabpanel"
                id={activeTabId}
              >
                <TfSwiper
                  key={activeTabId}
                  className="wrap-sw-over"
                  preview={3}
                  tablet={3}
                  mobileSm={2}
                  mobile={1}
                  spaceLg={30}
                  spaceMd={16}
                  space={10}
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
                      cardClass="style-5"
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
      </div>
    </section>
  );
}

export default TopPick;
