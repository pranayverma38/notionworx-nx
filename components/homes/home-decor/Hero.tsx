import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { heroDecorSlides } from "@/data/heros";

function Hero() {
  return (
    <div className="tf-slideshow">
      <div className="container-full-3">
        <TfSwiper
          loop
          effect="fade"
          auto
          delay={3000}
          className="sw-slide-show slider_effect_fade"
          paginationClassName="sw-line-default tf-sw-pagination d-lg-none"
        >
          {heroDecorSlides.map((slide) => {
            const titleParts = slide.title.split("\n");
            return (
              <div key={slide.img} className="slider-wrap_3">
                <div className="sld-content">
                  <div className="sld-image_left">
                    <Image
                      src={`${slide.img}`}
                      alt={slide.alt ?? "Image"}
                      width={920}
                      height={730}
                      className="scale-item"
                      loading="lazy"
                    />
                  </div>
                  <div className="content-sld_wrap">
                    <p className="text-sub_sld text-body-1 text-white fade-item fade-item-1">
                      {slide.subtitle}
                    </p>
                    <p className="title_sld text-display fw-medium text-white fade-item fade-item-2">
                      {titleParts[0]}
                      {titleParts.slice(1).map((part, i) => (
                        <span key={i}>
                          <br className="d-none d-xxl-block" />
                          {part}
                        </span>
                      ))}
                    </p>
                    <div className="group-action">
                      <div className="fade-item fade-item-3">
                        <Link
                          href="/collection"
                          className="tf-btn btn-white style-2"
                        >
                          {slide.ctaText}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="sld-image_right overflow-hidden">
                  <Image
                    src={`${slide.img}`}
                    alt={slide.alt ?? "Image"}
                    width={920}
                    height={730}
                    className="scale-item"
                    loading="lazy"
                  />
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
