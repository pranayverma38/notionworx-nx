import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { heroSlides } from "@/data/heros";

function Hero() {
  return (
    <div className="tf-slideshow tf-btn-swiper-main hover-sw-nav">
      <TfSwiper
        loop
        effect="fade"
        auto
        delay={3000}
        className="sw-slide-show slider_effect_fade"
        externalNavSelectors={{
          nextEl: ".tf-btn-swiper-main .nav-next-swiper",
          prevEl: ".tf-btn-swiper-main .nav-prev-swiper",
        }}
        paginationClassName="sw-line-default tf-sw-pagination"
      >
        {heroSlides.map((slide) => {
          const titleParts = slide.title.split("\n");
          return (
            <div key={slide.img} className="slideshow-wrap">
              <div className="sld_image">
                { }
                <Image
                  loading="lazy"
                  width={1920}
                  height={730}
                  src={`${slide.img}`}
                  alt={slide.alt ?? "Image"}
                />
              </div>
              <div className="sld_content pst-5">
                <div className="container">
                  <div className="content-sld_wrap text-center">
                    <div className="heading">
                      <p className="sub-text_sld text-body-1 text-white fade-item fade-item-1 mb-15">
                        {slide.subtitle}
                      </p>
                      <p className="title_sld text-display fw-medium text-white fade-item fade-item-2">
                        {titleParts[0]}
                        {titleParts[1] != null && (
                          <>
                            <br className="d-none d-sm-block" />
                            {titleParts[1]}
                          </>
                        )}
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
          );
        })}
      </TfSwiper>
      <div className="group-nav-action">
        <div className="container-full">
          <div className="d-flex align-items-center justify-content-between">
            <button
              type="button"
              className="tf-sw-nav text-white link nav-prev-swiper"
              aria-label="Previous"
            >
              <i className="icon icon-ArrowLongLeft" />
            </button>
            <button
              type="button"
              className="tf-sw-nav text-white link nav-next-swiper"
              aria-label="Next"
            >
              <i className="icon icon-ArrowLongRight" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
