import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { heroJewelrySlides } from "@/data/heros";

function Hero() {
  return (
    <section className="tf-slideshow sls-jewellry tf-btn-swiper-main hover-sw-nav">
      <TfSwiper
        loop
        effect="fade"
        delay={3000}
        className="sw-slide-show slider_effect_fade"
        paginationClassName="sw-line-default tf-sw-pagination"
      >
        {heroJewelrySlides.map((slide) => (
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
            <div className="sld_content pst-4">
              <div className="container">
                <div className="content-sld_wrap">
                  <div className="heading">
                    <p className="h6 fade-item fade-item-1 mb-12">
                      {slide.subtitle}
                    </p>
                    <h1 className="title_sld fade-item fade-item-2 mb-20">
                      {slide.title.split("\n").map((part, i) => (
                        <span key={i}>
                          {i > 0 && <br className="d-none d-sm-block" />}
                          {part}
                        </span>
                      ))}
                    </h1>
                    {slide.desc != null && (
                      <p className="sub-text_sld text-body-1 cl-text-2 fade-item fade-item-3">
                        {slide.desc.split("\n").map((part, i) => (
                          <span key={i}>
                            {i > 0 && <br className="d-none d-md-block" />}
                            {part}
                          </span>
                        ))}
                      </p>
                    )}
                  </div>
                  <div className="d-flex gap-12">
                    <div className="fade-item fade-item-4">
                      <Link href="/shop-default" className="tf-btn btn-white">
                        {slide.ctaText}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </TfSwiper>
    </section>
  );
}

export default Hero;
