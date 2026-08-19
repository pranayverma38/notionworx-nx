import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { heroSlidesAuto } from "@/data/heros";

function Hero() {
  return (
    <section className="tf-slideshow tf-btn-swiper-main hover-sw-nav flat-spacing-3 pb-0">
      <div className="container">
        <TfSwiper
          loop
          effect="fade"
          auto
          delay={3000}
          className="sw-slide-show slider_effect_fade radius-12"
          paginationClassName="sw-line-default style-2 pst-3 tf-sw-pagination"
        >
          {heroSlidesAuto.map((slide) => {
            const titleParts = slide.title.split("\n");
            const TitleTag = slide.titleTag === "p" ? "p" : "h1";
            const titleClassName =
              slide.titleTag === "p"
                ? "title_sld h1 fw-medium fade-item fade-item-2"
                : "title_sld fade-item fade-item-2";

            return (
              <div key={slide.img} className="slideshow-wrap sm-has-ov">
                <div className="sld_image">
                  <Image
                    src={`${slide.img}`}
                    alt={slide.alt ?? "Image"}
                    width={1620}
                    height={825}
                    loading="lazy"
                  />
                </div>
                <div className="sld_content type-2">
                  <div className="container">
                    <div className="content-sld_wrap">
                      <div className="heading mb-xl-32">
                        <p className="sub-text_sld fw-semibold fade-item fade-item-1 mb-8">
                          {slide.subtitle}
                        </p>
                        <TitleTag className={titleClassName}>
                          {titleParts[0]}
                          {titleParts.slice(1).map((part, i) => (
                            <span key={i}>
                              <br />
                              {part}
                            </span>
                          ))}
                        </TitleTag>
                      </div>
                      <div className="fade-item fade-item-3">
                        <Link
                          href="/shop-default"
                          className="tf-btn animate-btn"
                        >
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
      </div>
    </section>
  );
}

export default Hero;
