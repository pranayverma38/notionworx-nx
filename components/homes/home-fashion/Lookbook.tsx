"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import TfSwiper from "@/components/ui/TfSwiper";
import WishlistButton from "@/components/common/WishlistButton";
import CompareButton from "@/components/common/CompareButton";
import QuickViewButton from "@/components/common/QuickViewButton";
import {
  lookbookFashionSlides,
  lookbookFashionBannerPins,
} from "@/data/products/lookbook";
import {
  lookbookDropdownPlacementClass,
  useIsNarrowLookbookDropdownViewport,
} from "@/hooks/useLookbookDropdownPlacement";
import { formatPrice } from "@/utils/formatPrice";

function Lookbook() {
  const narrowDrop = useIsNarrowLookbookDropdownViewport();
  const swiperRef = useRef<SwiperType | null>(null);
  const [hoveredSlideIndex, setHoveredSlideIndex] = useState<number | null>(
    null,
  );

  const handleHoverEnter = useCallback((slideIndex: number) => {
    setHoveredSlideIndex(slideIndex);
    swiperRef.current?.slideTo(slideIndex);
  }, []);

  const handleHoverLeave = useCallback(() => {
    setHoveredSlideIndex(null);
  }, []);

  const slideClassName = lookbookFashionSlides.map((_, index) => {
    const base = `bundle-hover-item pin${index + 1} wow fadeInUp`;
    if (hoveredSlideIndex !== null && hoveredSlideIndex !== index) {
      return `${base} no-hover`;
    }
    return base;
  });

  return (
    <div id="home-fashion-lookbook" className="section-lookbook-hover-v02">
      <div className="wrap">
        <div className="box-left">
          <div
            className={`bundle-hover-wrap lg-mx-auto${hoveredSlideIndex !== null ? " has-hover" : ""}`}
          >
            <TfSwiper
              className="swiper-lookbook"
              paginationDisabled
              preview={1}
              tablet={1}
              mobileSm={1}
              mobile={1}
              spaceLg={30}
              spaceMd={20}
              space={10}
              slideClassName={slideClassName}
              externalNavSelectors={{
                prevEl: "#home-fashion-lookbook .box-left .lookbook-nav.nav-prev-swiper",
                nextEl: "#home-fashion-lookbook .box-left .lookbook-nav.nav-next-swiper",
              }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              footerSlot={
                <>
                  <button
                    type="button"
                    className="tf-sw-nav-2 lookbook-nav nav-prev-swiper"
                    aria-label="Previous"
                  >
                    <i className="icon icon-ArrowLeft" aria-hidden />
                  </button>
                  <button
                    type="button"
                    className="tf-sw-nav-2 lookbook-nav nav-next-swiper"
                    aria-label="Next"
                  >
                    <i className="icon icon-ArrowRight" aria-hidden />
                  </button>
                </>
              }
            >
              {lookbookFashionSlides.map((slide, index) => (
                <div
                  key={slide.product.img}
                  className="card-product"
                  onMouseEnter={() => handleHoverEnter(index)}
                  onMouseLeave={handleHoverLeave}
                >
                  <div className="card-product_wrapper">
                    <Link href={`/product-detail/${slide.product.id}`}      className="product-img">
                      <Image
                        className="img-product"
                        src={`${slide.product.img}`}
                        alt={slide.product.name}
                        width={475}
                        height={383}
                        loading="lazy"
                      />
                      <Image
                        className="img-hover"
                        src={`${slide.product.img}`}
                        alt={slide.product.name}
                        width={475}
                        height={383}
                        loading="lazy"
                      />
                    </Link>
                    <ul className="product-action_list">
                      <li className="wishlist">
                        <WishlistButton />
                      </li>
                      <li className="compare">
                        <CompareButton />
                      </li>
                      <li>
                        <QuickViewButton />
                      </li>
                    </ul>
                  </div>
                  <div className="card-product_info align-items-center gap-0 text-center">
                    <p className="text-label fw-semibold cl-text-3 mb-8">
                      {slide.label}
                    </p>
                    <Link
                      href={`/product-detail/${slide.product.id}`}
                      className="h2 name-product fw-medium link link-underline mb-12"
                    >
                      {slide.product.name}
                    </Link>
                    <p className="cl-text-2 mb-24">{slide.desc}</p>
                    <Link href="/shop-default" className="tf-btn animate-btn">
                      Order Now
                    </Link>
                  </div>
                </div>
              ))}
            </TfSwiper>
          </div>
        </div>
        <div className="box-right banner-lookbook wrap-lookbook_hover">
          <div>
            <Image
              className="img-banner"
              src="/assets/images/section/banner-lookbook-11.jpg"
              alt=""
              width={960}
              height={801}
              loading="lazy"
            />
            {lookbookFashionBannerPins.map((pin) => (
              <div
                key={pin.position}
                className={`lookbook-item ${pin.position}`}
              >
                <div
                  className={`dropdown dropup-center dropdown-custom ${lookbookDropdownPlacementClass("dropstart", narrowDrop)}`}
                >
                  <div
                    role="button"
                    tabIndex={0}
                    className="tf-pin-btn number bundle-pin-item swiper-button"
                    data-slide={pin.slideIndex}
                    id={pin.slideIndex === 0 ? "pin1" : "pin2"}
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    onMouseEnter={() => handleHoverEnter(pin.slideIndex)}
                    onMouseLeave={handleHoverLeave}
                  >
                    {pin.slideIndex + 1}
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
                            <span className="price-old text-caption-01 cl-text-3 ml-2">
                              {formatPrice(pin.product.priceOld)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Lookbook;
