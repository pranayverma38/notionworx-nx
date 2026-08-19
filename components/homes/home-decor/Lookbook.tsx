"use client";

import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import {
  lookbookDropdownPlacementClass,
  useIsNarrowLookbookDropdownViewport,
} from "@/hooks/useLookbookDropdownPlacement";
import {
  lookbookDecorSlides,
  lookbookDecorBrands,
} from "@/data/products/lookbook";
import React from "react";

function formatPrice(value: number): string {
  return "$" + value.toFixed(2).replace(".", ",");
}

function Lookbook() {
  const narrowDrop = useIsNarrowLookbookDropdownViewport();

  return (
    <div>
      <div className="container-full-3">
        <div id="lookbook-decor">
          <TfSwiper
            className="swiper-type-number rounded-top-20"
            paginationTypeFraction
            paginationClassName="#lookbook-decor-fraction"
            externalNavSelectors={{
              prevEl: "#lookbook-decor .nav-prev-swiper",
              nextEl: "#lookbook-decor .nav-next-swiper",
            }}
            footerSlot={
              <div className="box-nav-pag">
                <p className="title lh-24">Shop The Look</p>
                <div className="nav-pag_wrap">
                  <div className="nav-prev-swiper">
                    <i className="icon icon-ArrowLeft" aria-hidden />
                  </div>
                  <div
                    id="lookbook-decor-fraction"
                    className="pagination-fraction text-body-1"
                  />
                  <div className="nav-next-swiper">
                    <i className="icon icon-ArrowRight" aria-hidden />
                  </div>
                </div>
              </div>
            }
          >
            {lookbookDecorSlides.map((slide) => (
              <div
                key={slide.img}
                className="banner-lookbook wrap-lookbook_hover style-2"
              >
                <Image
                  className="img-banner"
                  src={`${slide.img}`}
                  alt=""
                  width={1920}
                  height={640}
                  loading="lazy"
                />
                {slide.pins.map((pin) => {
                  const dropClass =
                    pin.position === "position4" ? "dropend" : "dropstart";
                  const { product } = pin;
                  return (
                    <div
                      key={pin.position}
                      className={`lookbook-item ${pin.position}`}
                    >
                      <div
                        className={`dropdown dropup-center dropdown-custom ${lookbookDropdownPlacementClass(dropClass, narrowDrop)}`}
                      >
                        <div
                          role="button"
                          tabIndex={0}
                          className="tf-pin-btn bundle-pin-item"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <span />
                        </div>
                        <div className="dropdown-menu pst-2">
                          <div className="lookbook-product">
                            <Link
                              href={`/product-detail/${product.id}`}
                              className="image"
                            >
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
          </TfSwiper>
        </div>
        <div className="infiniteSlide-brand style-2 wow fadeInUp ">
          <div className="infiniteslide_wrap">
            <div className="infiniteSlide infinite-slider infiniteSlide-wrapper">
              {Array.from({ length: 4 }).map((_, index) => (
                <React.Fragment key={index}>
                  {lookbookDecorBrands.map((brand) => (
                    <div key={brand.img} className="infiniteSlide-item">
                      <div className="img-brand">
                        <Image
                          src={`${brand.img}`}
                          alt=""
                          width={brand.width}
                          height={brand.height}
                        />
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Lookbook;
