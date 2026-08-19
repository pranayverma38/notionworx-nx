"use client";

import Image from "next/image";
import Link from "next/link";
import { lookbookOfficePins } from "@/data/products/lookbook";
import {
  lookbookDropdownPlacementClass,
  useIsNarrowLookbookDropdownViewport,
} from "@/hooks/useLookbookDropdownPlacement";

function formatPrice(value: number): string {
  return "$" + value.toFixed(2).replace(".", ",");
}

function Lookbook() {
  const narrowDrop = useIsNarrowLookbookDropdownViewport();
  const slide = lookbookOfficePins[0];
  return (
    <div className="px-20">
      <div className="banner-lookbook style-3 wrap-lookbook_hover">
        <Image
          className="img-banner radius-16"
          src={`${slide.img}`}
          alt=""
          width={935}
          height={640}
          loading="lazy"
        />
        {slide.pins.map((pin) => (
          <div key={pin.position} className={`lookbook-item ${pin.position}`}>
            <div
              className={`dropdown dropup-center dropdown-custom ${lookbookDropdownPlacementClass("dropstart", narrowDrop)}`}
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
        ))}
      </div>
    </div>
  );
}

export default Lookbook;
