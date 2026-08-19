"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import TfSwiper from "@/components/ui/TfSwiper";
import ProductCard from "@/components/ui/ProductCard";
import {
  lookbookPetBanner,
  lookbookPetPins,
  lookbookPetProducts,
} from "@/data/products/lookbook";
import {
  lookbookDropdownPlacementClass,
  useIsNarrowLookbookDropdownViewport,
} from "@/hooks/useLookbookDropdownPlacement";

/** Slide 0 uses pin2, slide 1 uses pin1 (matches product ↔ pin mapping in static theme). */
function petSlidePinClass(index: number): string {
  return index === 0 ? "pin2" : "pin1";
}

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

  const slideClassName = lookbookPetProducts.map((_, index) => {
    const base = `bundle-hover-item ${petSlidePinClass(index)}`;
    if (hoveredSlideIndex !== null && hoveredSlideIndex !== index) {
      return `${base} no-hover`;
    }
    return base;
  });

  return (
    <section className="">
      <div className="container-full">
        <div className="tf-lookbook-hover lookbook-hover-v1">
          <div className="col-left">
            <div className="banner-lookbook wrap-lookbook_hover">
              <Image
                className="img-banner"
                src={`${lookbookPetBanner.img}`}
                alt=""
                width={885}
                height={720}
                loading="lazy"
              />
              {lookbookPetPins.map((pin, index) => (
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
                      data-slide={pin.slideIndex}
                      id={index === 0 ? "pin1" : "pin2"}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      onMouseEnter={() => handleHoverEnter(pin.slideIndex)}
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
                            className="name-prd link text-body-1 text-line-clamp-2"
                          >
                            {pin.product.name}
                          </Link>
                          <div className="price-wrap">
                            <span className="price-new">
                              $
                              {pin.product.price.toFixed(2).replace(".", ",")}
                            </span>
                            {pin.product.priceOld != null && (
                              <span className="price-old text-caption-01 cl-text-3">
                                $
                                {pin.product.priceOld
                                  .toFixed(2)
                                  .replace(".", ",")}
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
          <div className="col-right">
            <div
              className={`bundle-hover-wrap${hoveredSlideIndex !== null ? " has-hover" : ""}`}
            >
              <div className="sect-heading type-2 text-center wow fadeInUp">
                <h2 className="s-title text-white">
                  Bundle &amp; Save For Pets
                </h2>
                <p className="s-desc cl-text-3 text-body-1">
                  Weekly essentials handpicked to keep your pets happy and
                  healthy.
                </p>
              </div>
              <TfSwiper
                preview={2}
                tablet={2}
                mobileSm={2}
                mobile={2}
                spaceLg={30}
                spaceMd={20}
                space={10}
                className="swiper-lookbook"
                slideClassName={slideClassName}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
              >
                {lookbookPetProducts.map((product, index) => (
                  <div
                    key={`${product.img}-${index}`}
                    onMouseEnter={() => handleHoverEnter(index)}
                    onMouseLeave={handleHoverLeave}
                  >
                    <ProductCard
                      product={product}
                      wrapperClass="square"
                      imgWidth={330}
                      imgHeight={330}
                      actionBotLabel="Add to Cart"
                      actionBotHref="#shoppingCart"
                      actionBotDataToggle="offcanvas"
                      infoClassName="text-center align-items-center"
                      nameLinkClassName="text-white link"
                      starWrapClassName="justify-content-center"
                      wowDelay={index === 1 ? "0.1s" : undefined}
                    />
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
