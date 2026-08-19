import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { heroOrganicSlides } from "@/data/heros";

function Hero() {
  return (
    <div className="tf-slideshow tf-btn-swiper-main hover-sw-nav">
      <TfSwiper
        effect="fade"
        loop
        auto
        delay={3000}
        className="sw-slide-show slider_effect_fade"
        paginationClassName="#hero-organic-pagination"
        footerSlot={
          <div
            id="hero-organic-pagination"
            className="sw-line-default tf-sw-pagination"
          />
        }
      >
        {heroOrganicSlides.map((slide) => (
          <div key={slide.img} className="slideshow-wrap">
            <div className="sld_image">
              <Image
                src={`${slide.img}`}
                alt={slide.alt ?? "Image"}
                width={1920}
                height={810}
                loading="lazy"
              />
            </div>
            <div className="sld_content pst-3">
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
    </div>
  );
}

export default Hero;
