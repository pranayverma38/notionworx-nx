import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { heroSlidesBaby } from "@/data/heros";

const GRAPHIC_IMAGE = "/assets/images/item/graphic-item.png";

function Hero() {
  return (
    <section className="tf-slideshow slideshow-2 pt-30 p-xl-0">
      <div className="container">
        <TfSwiper
          loop
          effect="fade"
          auto
          delay={3000}
          className="sw-slide-show slideshow-2 slider_effect_fade"
          paginationClassName="sw-line-default pst-2 tf-sw-pagination"
        >
          {heroSlidesBaby.map((slide) => {
            const titleParts = slide.title.split("\n");
            return (
              <div key={slide.img} className="slider-wrap_2">
                <div className="sld-content">
                  <div className="sld-image-abs">
                    <Image
                      src={`${slide.img}`}
                      alt={slide.alt ?? "Image"}
                      width={900}
                      height={600}
                      className="d-md-none scale-item"
                      loading="lazy"
                    />
                    <Image
                      src={`${GRAPHIC_IMAGE}`}
                      alt=""
                      width={900}
                      height={600}
                      className="d-none d-md-block"
                      loading="lazy"
                    />
                  </div>
                  <div className="content-sld_wrap">
                    <div className="h6 text-white mb-16 fade-item fade-item-1">
                      {slide.subtitle}
                    </div>
                    <h1 className="title_sld text-white fade-item fade-item-2">
                      {titleParts[0]}
                      {titleParts.slice(1).map((part, i) => (
                        <span key={i}>
                          <br className="d-none d-xl-block" />
                          {part}
                        </span>
                      ))}
                    </h1>
                    <div className="fade-item fade-item-4">
                      <Link
                        href="/shop-default"
                        className="tf-btn btn-white"
                      >
                        {slide.ctaText}
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="sld-image overflow-hidden">
                  <Image
                    src={`${slide.img}`}
                    alt={slide.alt ?? "Image"}
                    width={900}
                    height={600}
                    className="scale-item"
                    loading="lazy"
                  />
                </div>
              </div>
            );
          })}
        </TfSwiper>
      </div>
    </section>
  );
}

export default Hero;
