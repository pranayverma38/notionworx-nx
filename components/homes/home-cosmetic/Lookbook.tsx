"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import TfSwiper from "@/components/ui/TfSwiper";
import ProductCard from "@/components/ui/ProductCard";
import {
  lookbookCosmeticProducts,
  lookbookCosmeticBanner,
} from "@/data/products/lookbook";
import {
  lookbookDropdownPlacementClass,
  useIsNarrowLookbookDropdownViewport,
} from "@/hooks/useLookbookDropdownPlacement";

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

  const slideClassName = lookbookCosmeticProducts.map((_, index) => {
    const base = `bundle-hover-item pin${index + 1}`;
    if (hoveredSlideIndex !== null && hoveredSlideIndex !== index) {
      return `${base} no-hover`;
    }
    return base;
  });

  return (
    <section className="section-lookbook-hover flat-spacing tf-lookbook-hover bg-main">
      <div className="container">
        <div className="row gy-4 flex-wrap-reverse">
          <div className="col-lg-6">
            <div className="col-left">
              <div className="mb-32 wow fadeInUp">
                <h3 className="mb-12">Combo Collection</h3>
                <p className="cl-text-2">
                  Explore curated sets designed to blend trend and timeless
                  elegance.
                </p>
              </div>
              <div
                className={`bundle-hover-wrap mb-32 lg-mx-auto${hoveredSlideIndex !== null ? " has-hover" : ""}`}
              >
                <TfSwiper
                  className="swiper-lookbook"
                  preview={2}
                  tablet={2}
                  mobileSm={2}
                  mobile={2}
                  spaceLg={30}
                  spaceMd={20}
                  space={10}
                  slideClassName={slideClassName}
                  onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                  }}
                >
                  {lookbookCosmeticProducts.map((product, index) => (
                    <div key={`${product.img}-${index}`}>
                      <ProductCard
                        product={product}
                        imgWidth={330}
                        imgHeight={440}
                        actionBotLabel={
                          index === 1 ? "Quick Add" : "Add to Cart"
                        }
                        actionBotHref={
                          index === 1 ? "#quickAdd" : "#shoppingCart"
                        }
                        actionBotDataToggle={
                          index === 1 ? "modal" : "offcanvas"
                        }
                      />
                    </div>
                  ))}
                </TfSwiper>
              </div>
              <div className="wow fadeInUp">
                <a
                  href="#shoppingCart"
                  data-bs-toggle="offcanvas"
                  className="tf-btn animate-btn gap-8"
                >
                  Buy At A Discount - $69.99
                  <i className="icon icon-ArrowUpRight fs-24" aria-hidden />
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="col-right banner-lookbook wrap-lookbook_hover">
              <Image
                className="img-banner"
                src={`${lookbookCosmeticBanner.img}`}
                alt=""
                width={700}
                height={700}
                loading="lazy"
              />
              <div className="lookbook-item position1">
                <div
                  className={`dropdown dropup-center dropdown-custom ${lookbookDropdownPlacementClass("dropend", narrowDrop)}`}
                >
                  <div
                    role="button"
                    tabIndex={0}
                    className="tf-pin-btn bundle-pin-item swiper-button"
                    id="pin1"
                    onMouseEnter={() => handleHoverEnter(0)}
                    onMouseLeave={handleHoverLeave}
                  >
                    <span />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Lookbook;
