"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { electronicsThumbsSlides } from "@/data/products/lookbook";
import AddToCartButton from "@/components/common/AddToCartButton";
import TfSwiper from "@/components/ui/TfSwiper";
import type { Swiper as SwiperType } from "swiper";

function formatPrice(value: number): string {
  return "$" + value.toFixed(2).replace(".", ",");
}

function ProductThumbs() {
  const [swiperRef, setSwiperRef] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleThumbClick = (index: number) => {
    if (swiperRef) {
      swiperRef.slideTo(index);
    }
  };

  return (
    <section className="themesFlat">
      <div className="container">
        <div className="banner-thumbs-product slider-thumb-wrap">
          <div className="col-left text-center flat-spacing">
            <div className="sect-heading type-2 wow fadeInUp">
              <h3 className="s-title">
                Thoughtfully Crafted Tech <br className="d-none d-xl-block" />
                For Modern Living
              </h3>
              <p className="s-desc text-body-1 cl-text-2">
                Discover innovative essentials packed with smart features.
              </p>
            </div>
            <div className="img-list wow fadeInUp">
              {electronicsThumbsSlides.map((slide, index) => (
                <div
                  key={slide.thumbImg}
                  className={`img_item btn-thumbs cs-pointer ${
                    activeIndex === index ? "active" : ""
                  }`}
                  onClick={() => handleThumbClick(index)}
                >
                  <Image
                    src={`${slide.thumbImg}`}
                    alt=""
                    width={120}
                    height={120}
                  />
                </div>
              ))}
            </div>
            <div className="wow fadeInUp">
              <Link href="/shop-default" className="tf-btn animate-btn">
                View All Products
              </Link>
            </div>
          </div>
          <div className="col-right">
            <TfSwiper
              className="slider-content-thumb swiper-tesimonial"
              paginationClassName="d-none"
              onSwiper={setSwiperRef}
              onSlideChange={(swiper: SwiperType) =>
                setActiveIndex(swiper.activeIndex)
              }
              speed={1000}
            >
              {electronicsThumbsSlides.map((slide) => (
                <div key={slide.mainImg} className="wg-thumb-v1">
                  <div className="thumb-image">
                    <Image
                      src={`${slide.mainImg}`}
                      alt=""
                      width={705}
                      height={546}
                      loading="lazy"
                    />
                  </div>
                  <div className="thumb-prd">
                    <div className="prd_image">
                      <Image
                        src={`${slide.product.img}`}
                        alt={slide.product.name}
                        width={88}
                        height={88}
                        loading="lazy"
                      />
                    </div>
                    <div className="prd_info">
                      <Link
                        href={`/product-detail/${slide.product.id}`}
                        className="name fw-medium link lh-24 text-line-clamp-2"
                      >
                        {slide.product.name}
                      </Link>
                      <div className="price-wrap">
                        <span className="price-new text-primary fw-semibold">
                          {formatPrice(slide.product.price)}
                        </span>
                        {slide.product.priceOld != null && (
                          <span className="price-old text-caption-01 cl-text-3">
                            {formatPrice(slide.product.priceOld)}
                          </span>
                        )}
                      </div>
                    </div>
                    <AddToCartButton variant="tooltip" label="Add to cart" />
                  </div>
                </div>
              ))}
            </TfSwiper>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductThumbs;
