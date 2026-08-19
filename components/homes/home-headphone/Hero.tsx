import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { heroHeadphoneSlides } from "@/data/heros";
import React from "react";

function Hero() {
  return (
    <div className="tf-slideshow style-2 v2 tf-btn-swiper-main">
      <TfSwiper
        laptop={1.082}
        preview={1}
        tablet={1}
        mobile={1}
        spaceLg={30}
        spaceMd={20}
        space={15}
        loop
        delay={3000}
        center
        className="sw-slide-show tf-swiper"
        externalNavSelectors={{
          nextEl: ".tf-btn-swiper-main .nav-next-swiper",
          prevEl: ".tf-btn-swiper-main .nav-prev-swiper",
        }}
        paginationClassName="sw-line-default tf-sw-pagination d-lg-none"
        footerSlot={
          <>
            <div className="tf-sw-nav-2 d-lg-flex d-none nav-prev-swiper">
              <i className="icon icon-ArrowLeft" aria-hidden />
            </div>
            <div className="tf-sw-nav-2 d-lg-flex d-none nav-next-swiper">
              <i className="icon icon-ArrowRight" aria-hidden />
            </div>
          </>
        }
      >
        {heroHeadphoneSlides.map((slide) => (
          <div key={slide.img} className="slider-wrap slideshow-wrap">
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
            <div className="sld_content type-3">
              <div className="content-sld_wrap">
                <div className="h1 text-white mb-12 fade-item fade-item-1">
                  {slide.subtitle}
                </div>
                {slide.desc != null && (
                  <p className="text-body-1 text-white fade-item fade-item-2 mb-40">
                    {slide.desc}
                  </p>
                )}
                <Link
                  href="/shop-default"
                  className="tf-btn btn-white fade-item fade-item-3"
                >
                  {slide.ctaText}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </TfSwiper>

      {/* Return Shipping */}
      <div className="infiniteSlide-policy-v2 wow fadeInUp">
        <div className="infiniteslide_wrap">
          <div className="infiniteSlide infinite-slider infiniteSlide-wrapper">
            {Array.from({ length: 6 }).map((_, index) => (
              <React.Fragment key={index}>
                <div className="policy-image">
                  <Image
                    src="/assets/images/section/policy-9.jpg"
                    alt="Image"
                    width={160}
                    height={80}
                    loading="lazy"
                  />
                </div>
                <p className="h2 fw-semibold policy-text">
                  Returns free within 14 days
                </p>
                <div className="policy-image">
                  <Image
                    src="/assets/images/section/policy-10.jpg"
                    alt="Image"
                    width={160}
                    height={80}
                    loading="lazy"
                  />
                </div>
                <p className="h2 fw-semibold cl-text-2">
                  Free shipping over $20.00
                </p>
                <div className="policy-image">
                  <Image
                    src="/assets/images/section/policy-11.jpg"
                    alt="Image"
                    width={160}
                    height={80}
                    loading="lazy"
                  />
                </div>
                <p className="policy-text h2 fw-semibold">
                  Returns free within 14 days
                </p>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      {/* /Return Shipping */}
    </div>
  );
}

export default Hero;
