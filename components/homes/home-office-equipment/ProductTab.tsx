"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import TfSwiper from "@/components/ui/TfSwiper";
import ProductCard from "@/components/ui/ProductCard";
import { productTabOfficeProducts } from "@/data/products/products";

/** Tab ids must match `filterTabIds` on `productTabOfficeProducts` in data */
const OFFICE_TABS = [
  {
    id: "desk",
    label: "Desks",
    img: "/assets/images/category/png/cate-13.png",
  },
  {
    id: "chair",
    label: "Chairs",
    img: "/assets/images/category/png/cate-14.png",
  },
  {
    id: "arm",
    label: "Monitor Arms",
    img: "/assets/images/category/png/cate-15.png",
  },
  {
    id: "mouseKey",
    label: "Mouses & Keyboards",
    img: "/assets/images/category/png/cate-16.png",
  },
  {
    id: "access",
    label: "Accessories",
    img: "/assets/images/category/png/cate-17.png",
  },
];

const DEFAULT_TAB_ID = "desk";

function ProductTab() {
  const [activeTabId, setActiveTabId] = useState(DEFAULT_TAB_ID);

  const visible = useMemo(
    () =>
      productTabOfficeProducts.filter((p) =>
        p.filterTabIds?.includes(activeTabId),
      ),
    [activeTabId],
  );

  return (
    <section className="bg-main flat-spacing flat-animate-tab mx-15 mx-xl-20 radius-20">
      <div className="container-full full-v2">
        <div className="sect-heading type-2 text-center wow fadeInUp">
          <h3 className="s-title">Best Sellers</h3>
          <p className="s-desc text-body-1 cl-text-2">
            Best-selling products are categorized into different sections.
          </p>
        </div>
        <div className="grid-cls-v4">
          <div className="item1">
            <ul className="tab-btn-wrap-v4 wow fadeInUp" role="tablist">
              {OFFICE_TABS.map((tab) => (
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
                    <div className="img">
                      <Image
                        src={`${tab.img}`}
                        alt=""
                        width={62}
                        height={62}
                        loading="lazy"
                      />
                    </div>
                    <span className="text h6">{tab.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="item2">
            <div className="tab-content">
              <div
                className="tab-pane fade active show"
                role="tabpanel"
                id={activeTabId}
              >
                <TfSwiper
                  key={activeTabId}
                  laptop={4}
                  preview={3}
                  tablet={3}
                  mobileSm={2}
                  mobile={1}
                  spaceLg={26}
                  spaceMd={20}
                  space={10}
                  pagination={1}
                  paginationSm={2}
                  paginationMd={3}
                  paginationLg={4}
                  paginationClassName="sw-line-default style-2 tf-sw-pagination"
                >
                  {visible.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      wrapperClass="square"
                      imgWidth={330}
                      imgHeight={440}
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

export default ProductTab;
