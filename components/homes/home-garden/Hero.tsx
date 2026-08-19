import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { heroGardenSlides } from "@/data/heros";

function Hero() {
  return (
    <section className="tf-slideshow slideshow-3">
      <TfSwiper
        loop
        effect="fade"
        delay={3000}
        className="sw-slide-show slideshow-2 slider_effect_fade"
        footerSlot={
          <div className="wrap-sw-line">
            <div className="sw-line-default pst-2 tf-sw-pagination justify-content-center swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-horizontal"></div>
          </div>
        }
        paginationClassName=".sw-line-default.pst-2.tf-sw-pagination"
      >
        {heroGardenSlides.map((slide) => (
          <div key={slide.img} className="slider-wrap_4">
            <div className="sld-content">
              <div className="sld-image-abs">
                <Image
                  className="d-md-none scale-item"
                  src={`${slide.img}`}
                  alt={slide.alt ?? "Image"}
                  width={900}
                  height={600}
                  loading="lazy"
                />
                {slide.overlayImg != null && (
                  <Image
                    className="d-none d-md-block"
                    src={`${slide.overlayImg}`}
                    alt=""
                    width={900}
                    height={600}
                    loading="lazy"
                  />
                )}
              </div>
              <div className="content-sld_wrap text-center mx-auto">
                <h6 className="text-white mb-16 fade-item fade-item-1">
                  {slide.subtitle}
                </h6>
                <div className="title_sld text-display text-white fade-item fade-item-2">
                  {slide.title.split("\n").map((part, i) => (
                    <span key={i}>
                      {i > 0 && <br className="d-none d-xl-block" />}
                      {part}
                    </span>
                  ))}
                </div>
                {slide.desc != null && (
                  <p className="decs_sld text-body-1 text-white fade-item fade-item-3">
                    {slide.desc.split("\n").map((part, i) => (
                      <span key={i}>
                        {i > 0 && <br className="d-none d-xxl-block" />}
                        {part}
                      </span>
                    ))}
                  </p>
                )}
                <div className="fade-item fade-item-4">
                  <Link href="/shop-default" className="tf-btn btn-white">
                    {slide.ctaText}
                  </Link>
                </div>
              </div>
            </div>
            <div className="sld-image overflow-hidden">
              <Image
                className="scale-item"
                src={`${slide.img}`}
                alt={slide.alt ?? "Image"}
                width={900}
                height={600}
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </TfSwiper>
    </section>
  );
}

export default Hero;
