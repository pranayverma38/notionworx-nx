import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { heroCosmeticSlides } from "@/data/heros";

function Hero() {
  return (
    <div className="tf-slideshow tf-btn-swiper-main hover-sw-nav">
      <TfSwiper
        loop
        effect="fade"
        auto
        delay={3000}
        className="sw-slide-show slider_effect_fade"
        paginationClassName="sw-line-default style-2 tf-sw-pagination"
      >
        {heroCosmeticSlides.map((slide, index) => {
          const titleParts = slide.title.split("\n");
          const wrapClassName = index === 2 ? "" : "text-center";
          return (
            <div key={slide.img} className="slideshow-wrap">
              <div className="sld_image">
                <Image
                  src={`${slide.img}`}
                  alt={slide.alt ?? "Image"}
                  width={1920}
                  height={860}
                  loading="lazy"
                />
              </div>
              <div className="sld_content pst-2">
                <div className="container">
                  <div className={`content-sld_wrap ${wrapClassName}`.trim()}>
                    <div className="heading">
                      <p className="sub-text_sld text-body-1 cl-text-2 fade-item fade-item-1 mb-15">
                        {slide.subtitle}
                      </p>
                      <p className="title_sld text-display fw-medium fade-item fade-item-2">
                        {titleParts[0]}
                        {titleParts.slice(1).map((part, i) => (
                          <span key={i}>
                            <br className="d-none d-sm-block" />
                            {part}
                          </span>
                        ))}
                      </p>
                    </div>
                    <div className="fade-item fade-item-3">
                      <Link
                        href="/shop-default"
                        className="tf-btn btn-white"
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
  );
}

export default Hero;
