"use client";

import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import {
  lookbookDropdownPlacementClass,
  useIsNarrowLookbookDropdownViewport,
} from "@/hooks/useLookbookDropdownPlacement";
import { lookbookSportSlides } from "@/data/products/lookbook";

function formatPrice(value: number): string {
  return "$" + value.toFixed(2).replace(".", ",");
}

function Lookbook() {
  const narrowDrop = useIsNarrowLookbookDropdownViewport();

  return (
    <div className="px-20 flat-spacing pb-0">
      <TfSwiper
        preview={2}
        tablet={2}
        mobileSm={2}
        mobile={1}
        space={10}
        pagination={1}
        paginationSm={1}
        paginationMd={2}
        paginationLg={2}
        paginationClassName="sw-dot-default tf-sw-pagination"
      >
        {lookbookSportSlides.map((slide) => (
          <div key={slide.img} className="banner-lookbook wrap-lookbook_hover">
            <Image
              className="img-banner radius-16"
              src={`${slide.img}`}
              alt=""
              width={935}
              height={640}
              loading="lazy"
            />
            {slide.pins.map((pin) => {
              const dropClass =
                pin.position === "position22" ? "dropend" : "dropstart";
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
      </TfSwiper>
    </div>
  );
}

export default Lookbook;
