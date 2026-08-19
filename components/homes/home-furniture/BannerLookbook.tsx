"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import {
  lookbookFurnitureBanner,
  lookbookFurnitureBundle,
} from "@/data/products/lookbook";
import { formatPrice } from "@/utils/formatPrice";
import { useContextElement } from "@/context/store";
import {
  lookbookDropdownPlacementClass,
  useIsNarrowLookbookDropdownViewport,
} from "@/hooks/useLookbookDropdownPlacement";

function BannerLookbook() {
  const narrowDrop = useIsNarrowLookbookDropdownViewport();
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [hoveredSlideIndex, setHoveredSlideIndex] = useState<number | null>(
    null,
  );

  const handleHoverEnter = useCallback((slideIndex: number) => {
    setHoveredSlideIndex(slideIndex);
    itemRefs.current[slideIndex]?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, []);

  const handleHoverLeave = useCallback(() => {
    setHoveredSlideIndex(null);
  }, []);

  const { addProductToCart } = useContextElement();
  const [selectedIds, setSelectedIds] = useState<Set<number | string>>(
    new Set(lookbookFurnitureBundle.map((item) => item.id)),
  );

  const handleToggle = (id: number | string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectedProducts = lookbookFurnitureBundle.filter((item) =>
    selectedIds.has(item.id),
  );

  const subtotal = selectedProducts.reduce((acc, item) => acc + item.price, 0);

  const handleAddToCartAll = () => {
    selectedProducts.forEach((product) => {
      addProductToCart(product, 1);
    });
  };

  return (
    <section className="flat-spacing tf-lookbook-hover lookbook-hover-v2">
      <div className="container">
        <div className="row gy-30">
          <div className="col-lg-6">
            <div className="banner-lookbook wrap-lookbook_hover">
              <Image
                className="img-banner"
                src={`${lookbookFurnitureBanner.img}`}
                alt=""
                width={885}
                height={720}
                loading="lazy"
              />
              {lookbookFurnitureBanner.pins.map((pin, index) => {
                const dropClass = index === 0 ? "dropend" : "dropstart";
                const slideIndex = index;
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
                        className={`tf-pin-btn ${index === 0 ? "style-2 " : ""}bundle-pin-item swiper-button`}
                        data-slide={slideIndex}
                        id={
                          index === 0 ? "pin2" : index === 1 ? "pin1" : "pin3"
                        }
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        onMouseEnter={() => handleHoverEnter(slideIndex)}
                        onMouseLeave={handleHoverLeave}
                      >
                        <span />
                      </div>
                      <div className="dropdown-menu">
                        <div className="lookbook-product">
                          <Link
                            href={`/product-detail/${pin.product.id}`}
                            className="image"
                          >
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
                              className="name-prd text-body-1 fw-medium link-underline-primary text-line-clamp-2"
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
          <div className="col-lg-6">
            <div
              className={`bundle-hover-wrap${hoveredSlideIndex !== null ? " has-hover" : ""}`}
            >
              <div className="sect-heading type-2 wow fadeInUp">
                <h3 className="s-title">Bundle &amp; Save</h3>
                <p className="s-desc cl-text-2 text-body-1">
                  Thoughtfully paired pieces to save more.
                </p>
              </div>
              <ul className="bundle-list wow fadeInUp">
                {lookbookFurnitureBundle.map((item, index) => {
                  const pinClass = `bundle-prd-v2 bundle-hover-item pin${index + 1}`;
                  const noHover =
                    hoveredSlideIndex !== null && hoveredSlideIndex !== index
                      ? " no-hover"
                      : "";
                  return (
                    <li
                      key={`${item.id}-${index}`}
                      ref={(el) => {
                        itemRefs.current[index] = el;
                      }}
                      className={`${pinClass}${noHover}${!selectedIds.has(item.id) ? " opacity-50" : ""}`.trim()}
                    >
                      <div
                        className="prd-order"
                        onClick={() => handleToggle(item.id)}
                        aria-pressed={selectedIds.has(item.id)}
                        aria-label={`${selectedIds.has(item.id) ? "Exclude" : "Include"} ${item.name} from bundle`}
                      >
                        <span>{index + 1}</span>
                      </div>
                      <div className="prd-image">
                        <Image
                          src={`${item.img}`}
                          alt={item.name}
                          width={100}
                          height={100}
                          loading="lazy"
                        />
                      </div>
                      <div className="prd-info">
                        <Link
                          href={`/product-detail/${item.id}`}
                          className="info_name fw-medium link link-underline text-line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <div className="info_typo d-flex">
                          <div className="type-select has-icon fw-medium">
                            <select className="">
                              <option>Gray</option>
                              <option>Dark</option>
                              <option>Beige</option>
                              <option>Taupe</option>
                              <option>Sage</option>
                            </select>
                            <i className="icon icon-CaretDown" aria-hidden />
                          </div>
                          <div className="br-line type-vertical" />
                          <div className="type-select has-icon fw-medium">
                            <select className="">
                              <option>Wood</option>
                              <option>Silk</option>
                            </select>
                            <i className="icon icon-CaretDown" aria-hidden />
                          </div>
                        </div>
                      </div>
                      <div className="prd-price price-wrap">
                        <span className="price-new text-primary fw-semibold">
                          {formatPrice(item.price)}
                        </span>
                        {item.priceOld != null && (
                          <span className="price-old text-caption-01 cl-text-3">
                            {formatPrice(item.priceOld)}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
              <a
                href="#shoppingCart"
                data-bs-toggle="offcanvas"
                suppressHydrationWarning
                data-bs-target="#shoppingCart"
                className={`tf-btn animate-btn w-100 ${selectedIds.size === 0 ? "disabled" : ""}`}
                onClick={handleAddToCartAll}
                style={
                  selectedIds.size === 0
                    ? { pointerEvents: "none", opacity: 0.5 }
                    : {}
                }
              >
                Add All To Cart ({selectedIds.size})
                <span className="br-line type-vertical bg-white" />
                <span>{formatPrice(subtotal)}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BannerLookbook;
