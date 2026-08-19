"use client";

import Image from "next/image";
import Link from "next/link";
import { lookbookBanners, lookbookInfiniteItems } from "@/data/products/lookbook";
import {
  lookbookDropdownPlacementClass,
  useIsNarrowLookbookDropdownViewport,
} from "@/hooks/useLookbookDropdownPlacement";
import { lookbookPinProducts } from "@/data/products/products";

function formatPrice(value: number): string {
  return "$" + value.toFixed(2).replace(".", ",");
}

function Lookbook() {
  const narrowDrop = useIsNarrowLookbookDropdownViewport();
  let pinIndex = 0;

  return (
    <>
      <div className="themesFlat">
        <div className="tf-grid-layout xl-col-2 gap-10 mb-10">
          {lookbookBanners.map((banner, bannerIdx) => (
            <div
              key={bannerIdx}
              className="banner-lookbook wrap-lookbook_hover"
            >
              <Image
                className="img-banner"
                src={`${banner.img}`}
                alt=""
                width={955}
                height={640}
                loading="lazy"
              />
              {banner.pinPositions.map((position) => {
                const product = lookbookPinProducts[pinIndex++];
                const dropClass =
                  position === "position1" ? "dropend" : "dropstart";
                return (
                  <div
                    key={`${bannerIdx}-${position}`}
                    className={`lookbook-item ${position}`}
                  >
                    <div
                      className={`dropdown dropup-center dropdown-custom ${lookbookDropdownPlacementClass(dropClass, narrowDrop)}`}
                    >
                      <div
                        role="button"
                        tabIndex={0}
                        className="tf-pin-btn bundle-pin-item swiper-button"
                        data-slide={0}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        {...(position === "position2" && { id: "pin2" })}
                      >
                        <span />
                      </div>
                      <div className="dropdown-menu">
                        <div className="lookbook-product">
                          <Link href={`/product-detail/${product.id}`} className="image">
                            <Image
                              src={`${product.img}`}
                              alt={product.name}
                              width={88}
                              height={88}
                            />
                          </Link>
                          <div className="content">
                            <Link
                              href={`/product-detail/${product.id}`}
                              className="name-prd link fw-medium lh-24 text-line-clamp-2"
                            >
                              {product.name}
                            </Link>
                            <div className="price-wrap">
                              <span className="price-new text-primary fw-semibold">
                                {formatPrice(product.price)}
                              </span>
                              {product.priceOld != null && (
                                <span className="price-old text-caption-01 cl-text-3">
                                  {formatPrice(product.priceOld)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="bg-main-2">
          <div className="infiniteSlide-cls wow fadeInUp">
            <div className="infiniteslide_wrap">
              <div className="infiniteSlide infinite-slider infiniteSlide-wrapper">
                {[
                  ...lookbookInfiniteItems,
                  ...lookbookInfiniteItems,
                  ...lookbookInfiniteItems,
                ].map((item,i) => (
                  <div
                    key={i}
                    className="infiniteSlide-item"
                  >
                    <Link href="/shop-default" className="cls-wrap">
                      <h4>{item.title}</h4>
                      <div className="img-cls">
                        <Image
                          src={`${item.img}`}
                          alt=""
                          width={80}
                          height={80}
                          loading="lazy"
                        />
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Lookbook;
