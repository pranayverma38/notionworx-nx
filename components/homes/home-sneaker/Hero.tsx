import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { heroSneakerSlides } from "@/data/heros";

function Hero() {
  return (
    <div className="tf-slideshow tf-btn-swiper-main hover-sw-nav">
      <TfSwiper
        effect="fade"
        loop
        delay={3000}
        className="sw-slide-show slider_effect_fade"
        useExternalNav
        paginationClassName="sw-line-default tf-sw-pagination"
      >
        {heroSneakerSlides.map((slide) => (
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
            <div className="sld_content">
              <div className="container">
                <div className="content-sld_wrap">
                  <div className="heading">
                    {slide.subtitle != null && (
                      <p className="sub-text_sld text-body-1 text-white fade-item fade-item-1 mb-15">
                        {slide.subtitle}
                      </p>
                    )}
                    <p className="title_sld text-display fw-medium text-white fade-item fade-item-2">
                      {slide.title.split("\n").map((part, i) => (
                        <span key={i}>
                          {i > 0 && <br className="d-none d-sm-block" />}
                          {part}
                        </span>
                      ))}
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
      <div className="group-nav-action">
        <div className="container-full">
          <div className="d-flex align-items-center justify-content-between">
            <div className="tf-sw-nav text-white link nav-prev-swiper">
              <i className="icon icon-ArrowLongLeft" aria-hidden />
            </div>
            <div className="tf-sw-nav text-white link nav-next-swiper">
              <i className="icon icon-ArrowLongRight" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
