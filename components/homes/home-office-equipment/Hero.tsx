"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";

import TfSwiper from "@/components/ui/TfSwiper";
import { heroOfficeEquipmentSlides } from "@/data/heros";

function Hero() {
  const totalOriginalSlides = heroOfficeEquipmentSlides.length;
  const slidesForLoop = [
    ...heroOfficeEquipmentSlides,
    ...heroOfficeEquipmentSlides,
    ...heroOfficeEquipmentSlides,
  ];
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeDotIndex, setActiveDotIndex] = useState(0);
  const [activeLoopIndex, setActiveLoopIndex] = useState(0);

  const handlePrev = () => swiperRef.current?.slidePrev();
  const handleNext = () => swiperRef.current?.slideNext();

  const handleBulletClick = (index: number) => {
    const swiper = swiperRef.current;
    if (!swiper) return;
    if (typeof swiper.slideToLoop === "function") {
      swiper.slideToLoop(index);
      return;
    }
    swiper.slideTo(index);
  };

  const handleSlideChange = (swiper: SwiperType) => {
    const currentLoopIndex = swiper.realIndex;
    setActiveLoopIndex(currentLoopIndex);
    setActiveDotIndex(currentLoopIndex % totalOriginalSlides);
  };

  return (
    <div
      id="home-office-hero"
      className="tf-slideshow tf-btn-swiper-main mt-20"
    >
      <TfSwiper
        laptop={1.1}
        preview={1.1}
        tablet={1.1}
        mobileSm={1.1}
        mobile={1.15}
        spaceLg={20}
        spaceMd={15}
        space={10}
        loop
        auto
        delay={3000}
        speed={700}
        init={Math.floor(slidesForLoop.length / 2)}
        center
        className="sw-slide-show"
        paginationDisabled
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          handleSlideChange(swiper);
        }}
        onSlideChange={handleSlideChange}
      >
        {slidesForLoop.map((slide, i) => (
          <div key={i} className="slideshow-wrap">
            <div className="sld_image radius-16">
              <Image
                className="scale-item scale-item-1"
                src={`${slide.img}`}
                alt={slide.alt ?? "Image"}
                width={1770}
                height={620}
                loading="lazy"
              />
            </div>
            <div className="sld_content top-50">
              <div className="container">
                <div className="content-sld_wrap text-center">
                  <div className="heading mb-28">
                    {slide.subtitle != null && (
                      <p className="sub-text_sld lh-24 text-white fade-item fade-item-1">
                        {slide.subtitle}
                      </p>
                    )}
                    <p className="title_sld h1 text-white fade-item fade-item-2">
                      {slide.title}
                    </p>
                  </div>
                  <div className="fade-item fade-item-3">
                    <Link href="/shop-default" className="tf-btn btn-white">
                      {slide.ctaText}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </TfSwiper>
      <div className="sw-line-default tf-sw-pagination hero-pagination">
        {Array.from({ length: totalOriginalSlides }).map((_, dotIndex) => (
            <button
              key={dotIndex}
              type="button"
              className={`swiper-pagination-bullet${
                activeDotIndex === dotIndex
                  ? " swiper-pagination-bullet-active"
                  : ""
              }`}
              aria-label={`Go to slide ${dotIndex + 1}`}
              onClick={() => {
                const dotOffset = dotIndex - activeDotIndex;
                const targetLoopIndex = activeLoopIndex + dotOffset;
                handleBulletClick(targetLoopIndex);
              }}
            />
          ))}
      </div>
      <div className="group-nav-action pst-2">
        <div className="container-full">
          <div className="gr-nav_wrap d-flex align-items-center justify-content-between">
            <button
              type="button"
              className="tf-sw-nav-2 style-3 style-large text-white d-lg-flex d-none nav-prev-swiper"
              onClick={handlePrev}
            >
              <i className="icon icon-ArrowLeft" aria-hidden />
            </button>
            <button
              type="button"
              className="tf-sw-nav-2 style-3 style-large text-white d-lg-flex d-none nav-next-swiper"
              onClick={handleNext}
            >
              <i className="icon icon-ArrowRight" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
