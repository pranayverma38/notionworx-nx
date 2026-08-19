import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { heroConstructionSlides } from "@/data/heros";
import React from "react";

const INFINITE_STRIP_TEXTS = [
  "FREE SHIPPING ON ALL ORDERS OVER $20.00",
  "RETURNS ARE FREE WITHIN 14 DAYS",
  "SECURE PAYMENT WITH EVERY PURCHASE",
  "FREE SHIPPING ON ALL ORDERS OVER $20.00",
  "RETURNS ARE FREE WITHIN 14 DAYS",
];

function Hero() {
  return (
    <div className="tf-slideshow tf-btn-swiper-main">
      <div className="infiniteSlide-text-v03 mb-40">
        <div className="infiniteslide_wrap">
          <div className="infiniteSlide infinite-slider infiniteSlide-wrapper">
            {[
              ...INFINITE_STRIP_TEXTS,
              ...INFINITE_STRIP_TEXTS,
              ...INFINITE_STRIP_TEXTS,
              ...INFINITE_STRIP_TEXTS,
              ...INFINITE_STRIP_TEXTS,
              ...INFINITE_STRIP_TEXTS,
            ].map((text, i) => (
              <React.Fragment key={i}>
                <p className="text fw-medium">{text}</p>
                <i className="icon-Star2" aria-hidden />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      <div className="container-full">
        <TfSwiper
          loop
          effect="fade"
          auto
          delay={3000}
          preview={1}
          tablet={1}
          mobile={1}
          spaceLg={30}
          spaceMd={20}
          space={15}
          className="sw-slide-show slider_effect_fade"
          paginationClassName="sw-line-default tf-sw-pagination"
        >
          {heroConstructionSlides.map((slide) => {
            const contentCls = slide.contentClassName ?? "";
            return (
              <div
                key={slide.img}
                className="slider-wrap slideshow-wrap rounded-20 overflow-hidden"
              >
                <div className="sld_image">
                  <Image
                    src={`${slide.img}`}
                    alt={slide.alt ?? "Slider"}
                    width={1770}
                    height={680}
                    loading="eager"
                    className="lazyload scale-item scale-item-1"
                  />
                </div>
                <div className="sld_content type-4">
                  <div className="content-sld_wrap">
                    <h6 className={`mb-12 fade-item fade-item-1 ${contentCls}`}>
                      {slide.subtitle}
                    </h6>
                    <div
                      className={`h1 mb-20 fade-item fade-item-2 ${contentCls}`.trim()}
                    >
                      {slide.title}
                    </div>
                    {slide.desc != null && (
                      <p
                        className={`text-body-1 fade-item fade-item-3 mb-32 ${contentCls}`.trim()}
                      >
                        {slide.desc}
                      </p>
                    )}
                    <div className="fade-item fade-item-4">
                      <Link
                        href="/shop-default"
                        className="tf-btn btn-white animate-btn animate-dark"
                      >
                        {slide.ctaText}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </TfSwiper>
      </div>
    </div>
  );
}

export default Hero;
