"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Controller, Navigation, Pagination } from "swiper/modules";
import { newArrivalDecor } from "@/data/newArrivalDecor";
import AddToCartButton from "@/components/common/AddToCartButton";

function formatPrice(value: number): string {
  return "$" + value.toFixed(2).replace(".", ",");
}

function NewArrival() {
  const mainRef = useRef<SwiperType | null>(null);
  const thumbRef = useRef<SwiperType | null>(null);
  const [linked, setLinked] = useState(false);

  const onMainSwiper = (swiper: SwiperType) => {
    mainRef.current = swiper;
    setLinked((prev) => prev || !!thumbRef.current);
  };
  const onThumbSwiper = (swiper: SwiperType) => {
    thumbRef.current = swiper;
    setLinked((prev) => prev || !!mainRef.current);
  };

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

  const { tag, title, description, products, mainImages } = newArrivalDecor;

  return (
    <section className="section-thumbs-arrival flat-spacing">
      <div className="sw-thumbs-arrival tf-sw-thumbs">
        <div className="container">
          <div className="row flex-wrap-reverse gy-4">
            <div className="col-lg-6">
              <div className="col-left h-100">
                <p className="tag mb-8 cl-text-3">{tag}</p>
                <h3 className="title mb-16">{title}</h3>
                <p className="desc mb-32 cl-text-2">{description}</p>
                <div className="mt-auto">
                  <div
                    dir="ltr"
                    className="swiper sw-main-thumb mt-auto pb-20 mb--20"
                  >
                    <Swiper
                      modules={[Controller, Pagination]}
                      grabCursor
                      speed={800}
                      spaceBetween={20}
                      onSwiper={onMainSwiper}
                      pagination={{
                        el: ".sw-pg-thumb-decor",
                        clickable: true,
                      }}
                      className="sw-main-thumb-inner"
                    >
                      {products.map((product) => (
                        <SwiperSlide key={product.img}>
                          <div className="thumbs-prd">
                            <div className="prd-image">
                              <Image
                                src={`${product.img}`}
                                alt={product.name}
                                width={88}
                                height={88}
                                loading="lazy"
                              />
                            </div>
                            <div className="prd-info">
                              <Link
                                href={`/product-detail/${product.id}`}
                                className="info_name text-body-1 link"
                              >
                                {product.name}
                              </Link>
                              <p className="info_price">
                                {formatPrice(product.price)}
                              </p>
                            </div>
                            <div className="prd-action">
                              <AddToCartButton
                                product={product}
                                variant="tooltip"
                              />
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                    <div className="sw-line-default style-2 sw-pg-thumb sw-pg-thumb-decor d-xxl-none mt-30" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6" id="new-arrival-decor-thumb">
              <div className="col-right">
                <div dir="ltr" className="swiper sw-thumb">
                  <Swiper
                    modules={[Controller, Navigation]}
                    slidesPerView={1}
                    watchSlidesProgress
                    speed={800}
                    centeredSlides
                    onSwiper={onThumbSwiper}
                    navigation={{
                      nextEl: "#new-arrival-decor-thumb .nav-next-swiper",
                      prevEl: "#new-arrival-decor-thumb .nav-prev-swiper",
                    }}
                    className="sw-thumb-inner"
                  >
                    {mainImages.map((img) => (
                      <SwiperSlide key={img.img}>
                        <div className="sw-image">
                          <Image
                            src={`${img.img}`}
                            alt=""
                            width={img.width}
                            height={img.height}
                            loading="lazy"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <div className="group-action-nav_thumb">
                    <div className="tf-sw-nav-2 style-2 nav-prev-swiper">
                      <i className="icon icon-ArrowLeft" aria-hidden />
                    </div>
                    <div className="tf-sw-nav-2 style-2 nav-next-swiper">
                      <i className="icon icon-ArrowRight" aria-hidden />
                    </div>
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

export default NewArrival;
