"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import TfSwiper from "@/components/ui/TfSwiper";
import { lookbookJewelry } from "@/data/products/lookbook";
import {
  lookbookDropdownPlacementClass,
  useIsNarrowLookbookDropdownViewport,
} from "@/hooks/useLookbookDropdownPlacement";
import { formatPrice } from "@/utils/formatPrice";

/** Scroll `element` to the top of `container` without moving the page (unlike `scrollIntoView`). */
function scrollWithinContainer(
  container: HTMLElement,
  element: HTMLElement,
  behavior: ScrollBehavior = "smooth",
) {
  const c = container.getBoundingClientRect();
  const e = element.getBoundingClientRect();
  const delta = e.top - c.top + container.scrollTop;
  container.scrollTo({ top: delta, behavior });
}

function Lookbook() {
  const narrowDrop = useIsNarrowLookbookDropdownViewport();
  const { leftImg, bannerImg, pins, products } = lookbookJewelry;
  const swiperRef = useRef<SwiperType | null>(null);
  const productListRef = useRef<HTMLDivElement | null>(null);
  const productCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredSlideIndex, setHoveredSlideIndex] = useState<number | null>(
    null,
  );

  const scrollListToProduct = useCallback((slideIndex: number) => {
    const list = productListRef.current;
    const card = productCardRefs.current[slideIndex];
    if (!list || !card) return;
    scrollWithinContainer(list, card);
  }, []);

  const handleHoverEnter = useCallback(
    (slideIndex: number) => {
      setHoveredSlideIndex(slideIndex);
      const swiper = swiperRef.current;
      if (swiper && !swiper.destroyed) {
        swiper.slideTo(slideIndex);
      } else {
        scrollListToProduct(slideIndex);
      }
    },
    [scrollListToProduct],
  );

  const handleHoverLeave = useCallback(() => {
    setHoveredSlideIndex(null);
  }, []);

  return (
    <section className="section-lookbook-hover-v03 flat-spacing">
      <div className="container">
        <div className="row">
          <div className="col-xl-8 col-md-6">
            <div className="tf-grid-layout xl-col-2 gap-10 h-100">
              <div className="w-100 h-100 d-none d-xl-block">
                <Image
                  className="img-cover"
                  src={`${leftImg}`}
                  alt="lookbook"
                  width={455}
                  height={606}
                  loading="lazy"
                />
              </div>
              <div className="banner-lookbook wrap-lookbook_hover w-100 h-100">
                <Image
                  className="img-banner"
                  src={`${bannerImg}`}
                  alt=""
                  width={955}
                  height={640}
                  loading="lazy"
                />
                {pins.map((pin) => {
                  const slideIndex = products.findIndex(
                    (p) => `#${p.id}` === pin.dataTarget,
                  );
                  return (
                    <div
                      key={pin.position}
                      className={`lookbook-item ${pin.position}`}
                    >
                      <div
                        className={`dropdown dropup-center dropdown-custom ${lookbookDropdownPlacementClass("dropend", narrowDrop)}`}
                      >
                        <div
                          role="button"
                          tabIndex={0}
                          className="tf-pin-btn bundle-pin-item swiper-button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          onMouseEnter={() => {
                            if (slideIndex >= 0) handleHoverEnter(slideIndex);
                          }}
                          onMouseLeave={handleHoverLeave}
                        >
                          <span />
                        </div>
                        <div className="dropdown-menu">
                          <div className="lookbook-product">
                            <Link href={`/product-detail/${pin.product.id}`} className="image">
                              <Image
                                src={`${pin.product.img}`}
                                alt={pin.product.name}
                                width={88}
                                height={88}
                              />
                            </Link>
                            <div className="content">
                              <Link
                                href={`/product-detail/${pin.product.id}`}
                                className="name-prd link fw-medium lh-24 text-line-clamp-2"
                              >
                                {pin.product.name}
                              </Link>
                              <div className="price-wrap">
                                <span className="price-new text-primary fw-semibold">
                                  {formatPrice(pin.product.price)}
                                </span>
                                {pin.product.priceOld != null && (
                                  <span className="price-old text-caption-01 cl-text-3">
                                    {formatPrice(pin.product.priceOld)}
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
            </div>
          </div>
          <div className="col-xl-4 col-md-6">
            <div className="heading mb-36">
              <h3 className="mb-8">Jewellery Lookbook</h3>
              <p className="cl-text-2 text-body-1 ">
                Discover our curated jewellery sets
              </p>
            </div>
            <div ref={productListRef} className="wrap-product">
              <TfSwiper
                mobileOnly
                mobileOnlyMaxWidth={767}
                mobileOnlyFallbackClassName="d-flex flex-column gap-20"
                preview={1}
                tablet={2}
                mobile={1}
                space={15}
                paginationClassName="sw-dot-default tf-sw-mobile sw-pagination-mb d-flex d-md-none"
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
              >
                {products.map((prd, index) => (
                  <div
                    key={prd.id}
                    id={prd.id}
                    ref={(el) => {
                      productCardRefs.current[index] = el;
                    }}
                    className={`card-product product-style_mini_list-v2 ${
                      hoveredSlideIndex !== null
                        ? index === hoveredSlideIndex
                          ? "is-active"
                          : "is-dim"
                        : ""
                    }`}
                   
                  >
                    <div className="card-product_wrapper">
                      <Link href={`/product-detail/${prd.product.id}`} className="product-img">
                        <Image
                          className="img-product"
                          src={`${prd.product.img}`}
                          alt={prd.product.name}
                          width={140}
                          height={140}
                          loading="lazy"
                        />
                        <Image
                          className="img-hover"
                          src={`${prd.product.img}`}
                          alt={prd.product.name}
                          width={140}
                          height={140}
                          loading="lazy"
                        />
                      </Link>
                    </div>
                    <div className="card-product_info">
                      <Link
                        href={`/product-detail/${prd.product.id}`}
                        className="name-product text-body-1 fw-medium link-underline-text"
                      >
                        {prd.product.name}
                      </Link>
                      <div
                        className={`price-wrap mb-16 ${prd.id === "prd-2" ? "font-outfit" : ""}`}
                      >
                        <span className="price-new text-primary fw-semibold">
                          {formatPrice(prd.product.price)}
                        </span>
                        {prd.product.priceOld && (
                          <span className="price-old text-caption-01 cl-text-2">
                            {formatPrice(prd.product.priceOld)}
                          </span>
                        )}
                      </div>
                      <Link
                        href={`/product-detail/${prd.product.id}`}
                        className="tf-btn animate-btn"
                      >
                        <span className="text fw-semibold">View Product</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </TfSwiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Lookbook;
