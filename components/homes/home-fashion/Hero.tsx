import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { heroFashionSlides } from "@/data/heros";

function Hero() {
  return (
    <div className="tf-slideshow style-2 tf-btn-swiper-main hover-sw-nav">
      <TfSwiper
        loop
        effect="fade"
        auto
        delay={3000}
        className="sw-slide-show slider_effect_fade"
        paginationClassName="sw-line-default tf-sw-pagination"
      >
        {heroFashionSlides.map((slide) => {
          const titleParts = slide.title.split("\n");
          return (
            <div key={slide.img} className="slideshow-wrap">
              <div className="sld_image">
                <Image
                  className="opacity-100"
                  src={`${slide.img}`}
                  alt={slide.alt ?? "Image"}
                  width={1920}
                  height={730}
                  loading="lazy"
                />
              </div>
              <div className="sld_content">
                <div className="container">
                  <div className="content-sld_wrap text-center">
                    <div className="heading">
                      <p className="sub-text_sld text-body-1 text-white fade-item fade-item-1 mb-12">
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
                    <div className="group-action">
                      <div className="fade-item fade-item-3">
                        <Link href="/shop-default" className="tf-btn btn-white">
                          {slide.ctaText}
                        </Link>
                      </div>
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
