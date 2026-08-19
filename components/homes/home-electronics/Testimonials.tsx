"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Controller, Navigation, Pagination } from "swiper/modules";
import { testimonialElectronicsSlides } from "@/data/testimonials";
import { formatPrice } from "@/utils/formatPrice";

function Testimonials() {
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

  return (
    <section
      id="testimonials-electronics"
      className="section-testimonial-thumbs flat-spacing tf-sw-thumbs"
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-xl-5">
            <div className="col-left">
              <div dir="ltr" className="swiper sw-thumb">
                <Swiper
                  modules={[Controller]}
                  slidesPerView={1}
                  watchSlidesProgress
                  speed={800}
                  onSwiper={onThumbSwiper}
                  className="sw-thumb-inner"
                >
                  {testimonialElectronicsSlides.map((slide, index) => (
                    <SwiperSlide key={index}>
                      <div className="sw-image">
                        {slide.authorImg && (
                          <Image
                            loading="lazy"
                            width={520}
                            height={520}
                            src={`${slide.authorImg}`}
                            alt={slide.authorAlt ?? "Image"}
                          />
                        )}
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-xl-6">
            <div className="col-right tes_thumb">
              <div dir="ltr" className="swiper sw-main-thumb">
                <Swiper
                  modules={[Controller, Navigation, Pagination]}
                  slidesPerView={1}
                  speed={800}
                  onSwiper={onMainSwiper}
                  navigation={{
                    nextEl: "#testimonials-electronics .nav-next-swiper",
                    prevEl: "#testimonials-electronics .nav-prev-swiper",
                  }}
                  pagination={{
                    el: "#testimonials-electronics .sw-pg-thumb",
                    clickable: true,
                  }}
                  className="sw-main-thumb-inner"
                >
                  {testimonialElectronicsSlides.map((slide, index) => (
                    <SwiperSlide key={index}>
                      <div className="testimonial-v01 style-5">
                        <div className="tes-content">
                          <div className="star-wrap d-flex align-items-center">
                            <i className="icon icon-Star fs-24" />
                            <i className="icon icon-Star fs-24" />
                            <i className="icon icon-Star fs-24" />
                            <i className="icon icon-Star fs-24" />
                            <i className="icon icon-Star fs-24" />
                          </div>
                          <div className="tes_author">
                            <h5 className="author-name">{slide.authorName}</h5>
                            <div className="br-line" />
                            {slide.verifiedLabel && (
                              <div className="author-verified">
                                <i className="icon icon-CheckCircle1" />
                                <span className="cl-text-2">
                                  {slide.verifiedLabel}
                                </span>
                              </div>
                            )}
                          </div>
                          <p className="tes_text h4 text-capitalize">
                            {slide.quote}
                          </p>
                          {slide.product && (
                            <div className="tes_product">
                              <div className="product-image flex-shrink-0">
                                <Image
                                  loading="lazy"
                                  width={60}
                                  height={60}
                                  src={`${slide.product.img}`}
                                  alt="Image"
                                />
                              </div>
                              <div className="product-infor">
                                <Link
                                  href={`/product-detail/${slide.product.id}`}
                                  className="link fw-medium lh-24 text-line-clamp-2"
                                >
                                  {slide.product.name}
                                </Link>
                                <p className="prd_price fw-semibold text-primary">
                                  {formatPrice(slide.product.price)}
                                </p>
                                {slide.product.priceOld != null && (
                                  <span className="price-old text-caption-01 cl-text-3">
                                    {formatPrice(slide.product.priceOld)}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="sw-line-default style-2 sw-pg-thumb d-xxl-none mt-30" />
              </div>
              <div className="group-action-nav">
                <div className="tf-sw-nav-2 nav-prev-swiper">
                  <i className="icon icon-ArrowLeft" />
                </div>
                <div className="tf-sw-nav-2 nav-next-swiper">
                  <i className="icon icon-ArrowRight" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
