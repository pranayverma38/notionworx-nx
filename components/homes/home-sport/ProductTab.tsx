"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { sportProductTabItems } from "@/data/sportProductTab";

function formatPrice(value: number): string {
  return "$" + value.toFixed(2).replace(".", ",");
}

const DEFAULT_TAB_ID = "feet-1";

function ProductTab() {
  const [activeTabId, setActiveTabId] = useState(DEFAULT_TAB_ID);

  const activeItem = useMemo(
    () => sportProductTabItems.find((t) => t.id === activeTabId),
    [activeTabId],
  );

  return (
    <div className="flat-spacing">
      <div className="banner-collect-v03 flat-animate-tab-2">
        <div className="container">
          <div className="row align-items-center gy-5 flex-wrap-reverse">
            <div className="col-md-6">
              <div className="col-left wow fadeInUp">
                <div className="heading">
                  <h3 className="mb-8">Burn On Your Feet</h3>
                  <p className="text-body-1 cl-text-2">
                    Speed comfort endurance balance.
                  </p>
                </div>
                <ul className="tab-btn-wrap-v3 style-3" role="tablist">
                  {sportProductTabItems.map((tab) => (
                    <li
                      key={tab.id}
                      className="nav-tab-item"
                      role="presentation"
                    >
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
                        <span className="text h5 fw-medium">{tab.label}</span>
                        <i className="icon icon-ArrowUpRight fs-24" aria-hidden />
                      </a>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/shop-default"
                  className="tf-btn-line-2 py-4 fw-semibold style-primary"
                >
                  View More
                </Link>
              </div>
            </div>
            <div className="col-md-6">
              <div className="col-right">
                <div className="tab-content">
                  {activeItem && (
                    <div
                      key={activeItem.id}
                      className="tab-pane fade active show"
                      role="tabpanel"
                      id={activeItem.id}
                    >
                      <div className="banner-v06">
                        <div className="bn_image">
                          <Image
                            src={`${activeItem.img}`}
                            alt=""
                            width={700}
                            height={700}
                            loading="lazy"
                          />
                        </div>
                        <div className="bn_content">
                          <div className="prd_info d-grid">
                            <Link
                              href={`/product-detail/${activeItem.id}`}
                              className="info__name fw-medium link lh-24 text-line-clamp-1"
                            >
                              {activeItem.name}
                            </Link>
                            <div className="info__price price-wrap">
                              <span className="price-new fw-medium">
                                {formatPrice(activeItem.price)}
                              </span>
                              <span className="price-old cl-text-2">
                                {formatPrice(activeItem.priceOld)}
                              </span>
                            </div>
                          </div>
                          <a
                            href="#shoppingCart"
                            data-bs-toggle="offcanvas"
                            className="tf-btn small animate-btn text-nowrap"
                          >
                            Add to cart
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductTab;
