"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Controller, EffectFade, Navigation } from "swiper/modules";
import { fashion2ThumbsSlides } from "@/data/products/lookbook";
import AddToCartButton from "@/components/common/AddToCartButton";

function formatPrice(value: number): string {
  return "$" + value.toFixed(2).replace(".", ",");
}

function ProductThumbs() {
  const mainRef = useRef<SwiperType | null>(null);
  const thumbRef = useRef<SwiperType | null>(null);
  const [linked, setLinked] = useState(false);

  useEffect(() => {
    if (!linked || !mainRef.current || !thumbRef.current) return;
    const main = mainRef.current;
    const thumb = thumbRef.current;
    main.controller.control = thumb;
    thumb.controller.control = main;
    return () => {
      try {
        if (main.controller) main.controller.control = undefined;
        if (thumb.controller) thumb.controller.control = undefined;
      } catch {
        /* instances may already be destroyed */
      }
    };
  }, [linked]);

  return (
    <section className="section-thumbs-v2 tf-sw-thumbs">
      <div className="col-right">
        <Swiper
          modules={[Controller, EffectFade]}
          effect="fade"
          onSwiper={(sw) => {
            mainRef.current = sw;
            setLinked((p) => p || !!thumbRef.current);
          }}
          dir="ltr"
          className="swiper sw-thumb"
        >
          {fashion2ThumbsSlides.map((slide) => (
            <SwiperSlide key={slide.mainImg}>
              <div className="sw-image">
                <Image
                  src={`${slide.mainImg}`}
                  alt=""
                  width={960}
                  height={960}
                  loading="lazy"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="col-left">
        <div className="sect-heading type-2 wow fadeInUp">
          <h3 className="s-title">{fashion2ThumbsSlides[0].product.name}</h3>
          <p className="cl-text-2">
            {fashion2ThumbsSlides[0].product.name} top&apos;s minimal design
            focuses on user needs and allows to adapt and support many
            environments.
          </p>
        </div>
        <div dir="ltr" className="swiper sw-main-thumb">
          <Swiper
            modules={[Controller, Navigation]}
            onSwiper={(sw) => {
              thumbRef.current = sw;
              setLinked((p) => p || !!mainRef.current);
            }}
            navigation={{
              nextEl: ".tes_thumb .nav-next-swiper",
              prevEl: ".tes_thumb .nav-prev-swiper",
            }}
            className="sw-main-thumb-inner"
          >
            {fashion2ThumbsSlides.map((slide) => (
              <SwiperSlide key={slide.product.img}>
                <div className="thumbs-prd wow fadeInUp">
                  <div className="prd-image">
                    <Image
                      src={`${slide.product.img}`}
                      alt={slide.product.name}
                      width={330}
                      height={440}
                      loading="lazy"
                    />
                  </div>
                  <div className="prd-mini">
                    <div className="mini-image">
                      <Image
                        src={`${slide.product.img}`}
                        alt={slide.product.name}
                        width={88}
                        height={100}
                        loading="lazy"
                      />
                    </div>
                    <div className="mini-infor">
                      <Link
                        href={`/product-detail/${slide.product.id}`}
                        className="info_name text-body-1 fw-medium link-underline-primary text-line-clamp-2"
                      >
                        {slide.product.name}
                      </Link>
                      <div className="info_price price-wrap">
                        <span className="price-new text-primary fw-semibold">
                          {formatPrice(slide.product.price)}
                        </span>
                        {slide.product.priceOld && (
                          <span className="price-old text-caption-01 cl-text-3">
                            {formatPrice(slide.product.priceOld)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mini-action">
                      <AddToCartButton
                        variant="tooltip"
                        className="btn-action hover-tooltip tooltip-left box-icon"
                      />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="tes_thumb">
            <div className="tf-sw-nav-circle nav-prev-swiper">
              <i className="icon icon-CaretLeft" aria-hidden />
            </div>
            <div className="tf-sw-nav-circle nav-next-swiper">
              <i className="icon icon-CaretRightThin" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductThumbs;
