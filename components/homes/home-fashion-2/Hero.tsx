import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { heroFashion2Slides } from "@/data/heros";

function Hero() {
  return (
    <div className="tf-slideshow tf-btn-swiper-main hover-sw-nav">
      <TfSwiper
        loop
        effect="fade"
        delay={3000}
        className="sw-slide-show slider_effect_fade"
        externalNavSelectors={{
          nextEl: ".tf-btn-swiper-main .nav-next-swiper",
          prevEl: ".tf-btn-swiper-main .nav-prev-swiper",
        }}
        paginationClassName="sw-line-default tf-sw-pagination"
      >
        {heroFashion2Slides.map((slide) => {
          const titleParts = slide.title.split("\n");
          return (
            <div key={slide.img} className="slideshow-wrap">
              <div className="sld_image">
                <Image
                  src={`${slide.img}`}
                  alt={slide.alt ?? "Image"}
                  width={1920}
                  height={730}
                  loading="lazy"
                />
              </div>
              <div className="sld_content pst-5">
                <div className="container">
                  <div className="content-sld_wrap">
                    <div className="heading">
                      <p className="sub-text_sld text-body-1 fade-item fade-item-1 mb-15">
                        {slide.subtitle}
                      </p>
                      <p className="title_sld text-display fw-medium fade-item fade-item-2">
                        {titleParts[0]}
                        {titleParts[1] != null && (
                          <>
                            <br />
                            {titleParts[1]}
                          </>
                        )}
                      </p>
                    </div>
                    <div className="fade-item fade-item-3">
                      <Link href="/shop-default" className="tf-btn animate-btn">
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
            <div className="tf-sw-nav-2 d-lg-flex d-none nav-prev-swiper">
              <i className="icon icon-ArrowLeft" aria-hidden />
            </div>
            <div className="tf-sw-nav-2 d-lg-flex d-none nav-next-swiper">
              <i className="icon icon-ArrowRight" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
